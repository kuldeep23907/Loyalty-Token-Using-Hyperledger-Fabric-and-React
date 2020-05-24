package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"time"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

type loyalty_platform struct {
}

type CounterNO struct {
	Counter int `json:"counter"`
}

type Entity struct {
	ID          string  `json:"ID"`
	External_ID string  `json:"ExternalID"`
	Type        string  `json:"Type"` // wholesaler, distributor, retailer
	Earn_Rate   float64 `json:"EarnRate"`
	Token_Data  Token   `json:"TokenData"`
	Created_At  string  `json:"CreatedAt"`
	Updated_At  string  `json:"UpdatedAt"`
}

type Entity_User struct {
	ID         string `json:"ID"`
	Entity_ID  string `json:"EntityID"`
	Role       string `json:"Role"`
	Name       string `json:"Name"`
	Email      string `json:"Email"`
	Phone      string `json:"Phone"`
	Hashed_PWD string `json:"HashedPWD"`
	Created_At string `json:"CreatedAt"`
	Updated_At string `json:"UpdatedAt"`
}

type Consumer struct {
	ID             string `json:"ID"`
	Entity_ID      string `json:"EntityID"`
	Entity_User_ID string `json:"EntityUserID"`
	Name           string `json:"Name"`
	Email          string `json:"Email"`
	Phone          string `json:"Phone"`
	Address        string `json:"Address"`
	Hashed_PWD     string `json:"HashedPWD"`
	Token_Data     Token  `json:"TokenData"`
	Created_At     string `json:"CreatedAt"`
	Updated_At     string `json:"UpdatedAt"`
}

type Token struct {
	Total           float64  `json:"Total"`
	Redeemed        float64  `json:"Redeemed"`
	Available       float64  `json:"Available"`
	Transaction_IDs []string `json:"TransactionIDs"`
	Created_At      string   `json:"CreatedAt"`
	Updated_At      string   `json:"UpdatedAt"`
}

type Transaction struct {
	ID                     string  `json:"ID"`
	Payment_ID             string  `json:"PaymentID"`
	Amount                 float64 `json:"Amount"`
	Type                   string  `json:"Type"`                // grant,reedem
	Token_Count            float64 `json:"TokenCount"`          // if grant, count = amount * earn_rate else if reedem, count = no of token used
	Token_Grant_Entity_ID  string  `json:"TokenGrantEntityID"`  // if reedem, only customer
	Token_Taking_Entity_ID string  `json:"TokenTakingEntityID"` // if reedem, only retailer
	Timestamp              string  `json:"Timestamp"`
}

// // Main // =================================

func main() {
	err := shim.Start(new(loyalty_platform))
	if err != nil {
		fmt.Printf("Error starting Simple chaincode: %s", err)
	}
}

// Private function
//getCounter to the latest value of the counter based on the Asset Type provided as input parameter
func getCounter(APIstub shim.ChaincodeStubInterface, AssetType string) int {
	counterAsBytes, _ := APIstub.GetState(AssetType)
	counterAsset := CounterNO{}

	json.Unmarshal(counterAsBytes, &counterAsset)
	fmt.Sprintf("Counter Current Value %d of Asset Type %s", counterAsset.Counter, AssetType)

	return counterAsset.Counter
}

//incrementCounter to the increase value of the counter based on the Asset Type provided as input parameter by 1
func incrementCounter(APIstub shim.ChaincodeStubInterface, AssetType string) int {
	counterAsBytes, _ := APIstub.GetState(AssetType)
	counterAsset := CounterNO{}

	json.Unmarshal(counterAsBytes, &counterAsset)
	counterAsset.Counter++
	counterAsBytes, _ = json.Marshal(counterAsset)

	err := APIstub.PutState(AssetType, counterAsBytes)
	if err != nil {

		fmt.Sprintf("Failed to Increment Counter")

	}

	fmt.Println("Success in incrementing counter  %v", counterAsset)

	return counterAsset.Counter
}

// GetTxTimestampChannel Function gets the Transaction time when the chain code was executed it remains same on all the peers where chaincode executes
func (t *loyalty_platform) GetTxTimestampChannel(APIstub shim.ChaincodeStubInterface) (string, error) {
	txTimeAsPtr, err := APIstub.GetTxTimestamp()
	if err != nil {
		fmt.Printf("Returning error in TimeStamp \n")
		return "Error", err
	}
	fmt.Printf("\t returned value from APIstub: %v\n", txTimeAsPtr)
	timeStr := time.Unix(txTimeAsPtr.Seconds, int64(txTimeAsPtr.Nanos)).String()

	return timeStr, nil
}

// Init initializes chaincode // ===========================

func (t *loyalty_platform) Init(APIstub shim.ChaincodeStubInterface) pb.Response {
	// Initializing Entity Counter
	EntityCounterBytes, _ := APIstub.GetState("EntityCounterNO")
	if EntityCounterBytes == nil {
		var EntityCounter = CounterNO{Counter: 1}
		EntityCounterBytes, _ := json.Marshal(EntityCounter)
		err := APIstub.PutState("EntityCounterNO", EntityCounterBytes)
		if err != nil {
			return shim.Error(fmt.Sprintf("Failed to Intitate Entity Counter"))
		}
	}

	// Initializing EntityUser Counter
	EntityUserCounterBytes, _ := APIstub.GetState("EntityUserCounterNO")
	if EntityUserCounterBytes == nil {
		var EntityUserCounter = CounterNO{Counter: 0}
		EntityUserCounterBytes, _ := json.Marshal(EntityUserCounter)
		err := APIstub.PutState("EntityUserCounterNO", EntityUserCounterBytes)
		if err != nil {
			return shim.Error(fmt.Sprintf("Failed to Intitate EntityUser Counter"))
		}
	}

	// Initializing Consumer Counter
	ConsumerCounterBytes, _ := APIstub.GetState("ConsumerCounterNO")
	if ConsumerCounterBytes == nil {
		var ConsumerCounter = CounterNO{Counter: 0}
		ConsumerCounterBytes, _ := json.Marshal(ConsumerCounter)
		err := APIstub.PutState("ConsumerCounterNO", ConsumerCounterBytes)
		if err != nil {
			return shim.Error(fmt.Sprintf("Failed to Intitate Consumer Counter"))
		}
	}

	// Initializing Transaction Counter
	TransactionCounterBytes, _ := APIstub.GetState("TransactionCounterNO")
	if TransactionCounterBytes == nil {
		var TransactionCounter = CounterNO{Counter: 0}
		TransactionCounterBytes, _ := json.Marshal(TransactionCounter)
		err := APIstub.PutState("TransactionCounterNO", TransactionCounterBytes)
		if err != nil {
			return shim.Error(fmt.Sprintf("Failed to Intitate Transaction Counter"))
		}
	}
	return shim.Success(nil)
}

// Invoke - Our entry point for Invocations // ========================================

func (t *loyalty_platform) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	fmt.Println("invoke is running " + function)

	// Handle different functions
	if function == "initLedger" {
		return t.initLedger(stub, args)
	} else if function == "signIn" {
		return t.signIn(stub, args)
	} else if function == "createEntity" {
		return t.createEntity(stub, args)
	} else if function == "updateEntity" {
		return t.updateEntity(stub, args)
	} else if function == "createEntityUser" {
		return t.createEntityUser(stub, args)
	} else if function == "updateEntityUser" {
		return t.updateEntityUser(stub, args)
	} else if function == "createConsumer" {
		return t.createConsumer(stub, args)
	} else if function == "updateConsumer" {
		return t.updateConsumer(stub, args)
	} else if function == "grantTokensToEntityTransaction" {
		return t.grantTokensToEntityTransaction(stub, args)
	} else if function == "grantTokensToConsumerTransaction" {
		return t.grantTokensToConsumerTransaction(stub, args)
	} else if function == "reedemTokensTransaction" {
		return t.reedemTokensTransaction(stub, args)
	} else if function == "queryAsset" {
		return t.queryAsset(stub, args)
	} else if function == "queryAll" {
		return t.queryAll(stub, args)
	}
	fmt.Println("invoke did not find func: " + function)
	//error
	return shim.Error("Received unknown function invocation")
}

// End of Private function

func (t *loyalty_platform) initLedger(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {
	//To Get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in Transaction TimeStamp")
	}

	var transactionIds []string
	// seed P&G as manufacturer in Ledger
	tokenData := Token{Total: 10000, Redeemed: 0, Available: 10000, Transaction_IDs: transactionIds, Created_At: txTimeAsPtr, Updated_At: txTimeAsPtr}
	pg := Entity{ID: "Entity1", External_ID: "ExternalID1", Type: "manufacturer", Earn_Rate: 0.15, Token_Data: tokenData, Created_At: txTimeAsPtr, Updated_At: txTimeAsPtr}
	pgAsBytes, _ := json.Marshal(pg)
	APIstub.PutState(pg.ID, pgAsBytes)
	fmt.Println("Added", pg)

	// seed P&G admin
	entityUser := Entity_User{ID: "admin", Entity_ID: "Entity1", Role: "admin", Name: "P&G", Email: "admin@pg.com", Phone: "1231231231", Hashed_PWD: "adminpw", Created_At: txTimeAsPtr, Updated_At: txTimeAsPtr}
	entityUserAsBytes, errMarshal := json.Marshal(entityUser)

	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error in Product: %s", errMarshal))
	}

	errPut := APIstub.PutState(entityUser.ID, entityUserAsBytes)

	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to create Entity Asset: %s", entityUser.ID))
	}

	fmt.Println("Added", entityUser)

	return shim.Success(nil)
}

// To create Entity by Manufacturer Admin
func (t *loyalty_platform) createEntity(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	//To check number of arguments are 3
	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments, Required 3 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("External ID must be provided to create a product")
	}

	if len(args[1]) == 0 {
		return shim.Error("Type must be provided")
	}

	if len(args[2]) == 0 {
		return shim.Error("Earn rate must be non-empty ")
	}

	//Earn Rate conversion - Error handeling
	i1, errPrice := strconv.ParseFloat(args[2], 64)
	if errPrice != nil {
		return shim.Error(fmt.Sprintf("Failed to Convert Earn rate: %s", errPrice))
	}

	entityCounter := getCounter(APIstub, "EntityCounterNO")
	entityCounter++

	//To Get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in Transaction TimeStamp")
	}

	// TOKEN
	var transactionIds []string

	tokenData := Token{Total: 0, Redeemed: 0, Available: 0, Transaction_IDs: transactionIds, Created_At: txTimeAsPtr, Updated_At: txTimeAsPtr}

	var entity = Entity{ID: "Entity" + strconv.Itoa(entityCounter), External_ID: args[0], Type: args[1], Earn_Rate: i1, Token_Data: tokenData, Created_At: txTimeAsPtr, Updated_At: txTimeAsPtr}

	entityAssetAsBytes, errMarshal := json.Marshal(entity)

	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error in Product: %s", errMarshal))
	}

	errPut := APIstub.PutState(entity.ID, entityAssetAsBytes)

	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to create Entity Asset: %s", entity.ID))
	}

	//TO Increment the Product Counter
	incrementCounter(APIstub, "EntityCounterNO")

	fmt.Println("Success in creating Entity Asset %v", entity)

	return shim.Success(entityAssetAsBytes)
}

// Update Entity
func (t *loyalty_platform) updateEntity(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	//To check number of arguments are 1
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments, Required 1 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("Entity Id must be provided")
	}

	if len(args[1]) == 0 {
		return shim.Error("Earn Rate must be provided")
	}

	// get entity from the stub ie. Chaincode stub in network using the product id passed
	entityBytes, _ := APIstub.GetState(args[0])
	if entityBytes == nil {
		return shim.Error("Cannot Find Entity")
	}
	entity := Entity{}
	// unmarsahlling the entity data
	json.Unmarshal(entityBytes, &entity)

	//Earn Rate conversion - Error handeling
	i1, errPrice := strconv.ParseFloat(args[1], 64)
	if errPrice != nil {
		return shim.Error(fmt.Sprintf("Failed to Convert Earn rate: %s", errPrice))
	}

	//To Get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in Transaction TimeStamp")
	}

	// Updating entiry values
	entity.Earn_Rate = i1
	entity.Updated_At = txTimeAsPtr

	entityAssetAsBytes, errMarshal := json.Marshal(entity)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	errPut := APIstub.PutState(entity.ID, entityAssetAsBytes)
	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to create Entity Asset: %s", entity.ID))
	}

	fmt.Println("Success in updating Entity Asset %v", entity)

	return shim.Success(entityAssetAsBytes)
}

// To create Entity User by Manufacturer Admin
func (t *loyalty_platform) createEntityUser(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	//To check number of arguments are 3
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments, Required 5 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("Entity ID must be provided to create a product")
	}

	if len(args[1]) == 0 {
		return shim.Error("Name must be provided")
	}

	if len(args[2]) == 0 {
		return shim.Error("Email rate must be non-empty ")
	}

	if len(args[3]) == 0 {
		return shim.Error("Phone rate must be non-empty ")
	}

	if len(args[4]) == 0 {
		return shim.Error("Password rate must be non-empty ")
	}

	// get entity details from the stub ie. Chaincode stub in network using the product id passed
	entityBytes, _ := APIstub.GetState(args[0])
	if entityBytes == nil {
		return shim.Error("Cannot Find Entity")
	}

	entityUserCounter := getCounter(APIstub, "EntityUserCounterNO")
	entityUserCounter++

	//To Get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in Transaction TimeStamp")
	}

	var entityUser = Entity_User{ID: "EntityUser" + strconv.Itoa(entityUserCounter), Entity_ID: args[0], Role: "worker", Name: args[1], Email: args[2], Phone: args[3], Hashed_PWD: args[4], Created_At: txTimeAsPtr, Updated_At: txTimeAsPtr}

	entityUserAssetAsBytes, errMarshal := json.Marshal(entityUser)

	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error in Entity User: %s", errMarshal))
	}

	errPut := APIstub.PutState(entityUser.ID, entityUserAssetAsBytes)

	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to create Entity Asset: %s", entityUser.ID))
	}

	//TO Increment the Product Counter
	incrementCounter(APIstub, "EntityUserCounterNO")

	fmt.Println("Success in creating Entity Asset %v", entityUser)

	return shim.Success(entityUserAssetAsBytes)
}

// Update Entity User
func (t *loyalty_platform) updateEntityUser(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	//To check number of arguments are 3
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments, Required 4 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("Entity User ID must be provided to create a product")
	}

	// get entity user details from the stub ie. Chaincode stub in network using the product id passed
	entityUserBytes, _ := APIstub.GetState(args[0])
	if entityUserBytes == nil {
		return shim.Error("Cannot Find Entity")
	}
	entityUser := Entity_User{}
	// unmarsahlling the entity data
	json.Unmarshal(entityUserBytes, &entityUser)

	var name string
	var email string
	var phone string
	var pwd string

	if len(args[1]) != 0 {
		name = args[1]
	} else {
		name = entityUser.Name
	}

	if len(args[2]) != 0 {
		email = args[2]
	} else {
		email = entityUser.Email
	}

	if len(args[3]) != 0 {
		phone = args[3]
	} else {
		phone = entityUser.Phone
	}

	if len(args[4]) != 0 {
		pwd = args[4]
	} else {
		pwd = entityUser.Hashed_PWD
	}

	//To Get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in Transaction TimeStamp")
	}

	// Updating entiry user values
	entityUser.Name = name
	entityUser.Email = email
	entityUser.Phone = phone
	entityUser.Hashed_PWD = pwd
	entityUser.Updated_At = txTimeAsPtr

	entityAssetAsBytes, errMarshal := json.Marshal(entityUser)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	errPut := APIstub.PutState(entityUser.ID, entityAssetAsBytes)
	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to create Entity Asset: %s", entityUser.ID))
	}

	fmt.Println("Success in updating Entity Asset %v", entityUser)

	return shim.Success(entityAssetAsBytes)
}

// To create consumer  by retailer user
func (t *loyalty_platform) createConsumer(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	//To check number of arguments are 3
	if len(args) != 7 {
		return shim.Error("Incorrect number of arguments, Required 5 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("Entity ID must be provided to create a product")
	}

	if len(args[1]) == 0 {
		return shim.Error("Entity User ID must be provided to create a product")
	}

	if len(args[2]) == 0 {
		return shim.Error("Name must be provided")
	}

	if len(args[3]) == 0 {
		return shim.Error("Email rate must be non-empty ")
	}

	if len(args[4]) == 0 {
		return shim.Error("Phone rate must be non-empty ")
	}

	if len(args[5]) == 0 {
		return shim.Error("Address must be non-empty ")
	}

	if len(args[6]) == 0 {
		return shim.Error("Password rate must be non-empty ")
	}

	// get entity details from the stub ie. Chaincode stub in network using the product id passed
	entityBytes, _ := APIstub.GetState(args[0])
	if entityBytes == nil {
		return shim.Error("Cannot Find Entity")
	}

	// get entity user details from the stub ie. Chaincode stub in network using the product id passed
	entityUserBytes, _ := APIstub.GetState(args[1])
	if entityUserBytes == nil {
		return shim.Error("Cannot Find Entity User")
	}

	consumerCounter := getCounter(APIstub, "ConsumerCounterNO")
	consumerCounter++

	//To Get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in Transaction TimeStamp")
	}

	var transactionIds []string
	tokenData := Token{Total: 0, Redeemed: 0, Available: 0, Transaction_IDs: transactionIds, Created_At: txTimeAsPtr, Updated_At: txTimeAsPtr}

	var consumer = Consumer{ID: "Consumer" + strconv.Itoa(consumerCounter), Entity_ID: args[0], Entity_User_ID: args[1], Name: args[2], Email: args[3], Phone: args[4], Address: args[5], Hashed_PWD: args[6], Token_Data: tokenData, Created_At: txTimeAsPtr, Updated_At: txTimeAsPtr}

	consumerAssetAsBytes, errMarshal := json.Marshal(consumer)

	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error in Consumer: %s", errMarshal))
	}

	errPut := APIstub.PutState(consumer.ID, consumerAssetAsBytes)

	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to create Consumer Asset: %s", consumer.ID))
	}

	//TO Increment the Consumer Counter
	incrementCounter(APIstub, "ConsumerCounterNO")

	fmt.Println("Success in creating Consumer Asset %v", consumer)

	return shim.Success(consumerAssetAsBytes)
}

// Update Consumer
func (t *loyalty_platform) updateConsumer(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	//To check number of arguments are 6
	if len(args) != 6 {
		return shim.Error("Incorrect number of arguments, Required 6 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("Consumer ID must be provided to create a product")
	}

	// get consumer details from the stub ie. Chaincode stub in network using the product id passed
	consumerBytes, _ := APIstub.GetState(args[0])
	if consumerBytes == nil {
		return shim.Error("Cannot Find Entity")
	}
	consumer := Consumer{}
	// unmarsahlling the entity data
	json.Unmarshal(consumerBytes, &consumer)

	var name string
	var email string
	var phone string
	var pwd string
	var address string

	if len(args[1]) != 0 {
		name = args[1]
	} else {
		name = consumer.Name
	}

	if len(args[2]) != 0 {
		email = args[2]
	} else {
		email = consumer.Email
	}

	if len(args[3]) != 0 {
		phone = args[3]
	} else {
		phone = consumer.Phone
	}

	if len(args[4]) != 0 {
		address = args[4]
	} else {
		address = consumer.Address
	}

	if len(args[5]) != 0 {
		pwd = args[5]
	} else {
		pwd = consumer.Hashed_PWD
	}

	//To Get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in Transaction TimeStamp")
	}

	// Updating entiry user values
	consumer.Name = name
	consumer.Email = email
	consumer.Phone = phone
	consumer.Address = address
	consumer.Hashed_PWD = pwd
	consumer.Updated_At = txTimeAsPtr

	entityAssetAsBytes, errMarshal := json.Marshal(consumer)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	errPut := APIstub.PutState(consumer.ID, entityAssetAsBytes)
	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to update Consumer Asset: %s", consumer.ID))
	}

	fmt.Println("Success in updating Consumer Asset %v", consumer)

	return shim.Success(entityAssetAsBytes)
}

// To grant tokens transaction method
func (t *loyalty_platform) grantTokensToEntityTransaction(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	//To check number of arguments are 5
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments, Required 5 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("Payment ID must be provided to create a transaction")
	}

	if len(args[1]) == 0 {
		return shim.Error("Amount must be provided to create a transaction")
	}

	if len(args[2]) == 0 {
		return shim.Error(" Type must be provided to create a transaction")
	}

	if len(args[3]) == 0 {
		return shim.Error(" Token granting entity ID must be provided to create a transaction")
	}

	if len(args[4]) == 0 {
		return shim.Error("Token taking entity ID must be provided to create a transaction")
	}

	if args[2] != "grant" {
		return shim.Error("Service not allowed")
	}

	fmt.Println(" passed all checks ")
	// get entity from the stub ie. Chaincode stub in network using the product id passed
	grantEntityBytes, _ := APIstub.GetState(args[3])
	if grantEntityBytes == nil {
		return shim.Error("Cannot Find Token grant Entity")
	}
	grantEntity := Entity{}
	// unmarsahlling the entity data
	json.Unmarshal(grantEntityBytes, &grantEntity)

	// get entity from the stub ie. Chaincode stub in network using the product id passed
	takeEntityBytes, _ := APIstub.GetState(args[4])
	if takeEntityBytes == nil {
		return shim.Error("Cannot Find Token take Entity")
	}
	takeEntity := Entity{}
	// unmarsahlling the entity data
	json.Unmarshal(takeEntityBytes, &takeEntity)

	fmt.Println(" got all entities ")

	if grantEntity.Type == "manufacturer" && takeEntity.Type != "wholesaler" {
		return shim.Error("Manufacturer can only grant tokens to wholesaler")
	}

	if grantEntity.Type == "wholesaler" && takeEntity.Type != "distributor" {
		return shim.Error("wholesaler can only grant tokens to distributor")
	}

	if grantEntity.Type == "distributor" && takeEntity.Type != "retailer" {
		return shim.Error("distributor can only grant tokens to retailer")
	}

	if grantEntity.Type == "retailer" {
		return shim.Error("Retailer can not  grant tokens to any entity but to customer only")
	}

	fmt.Println(" passed all entity checks ")

	//Amount conversion - Error handeling
	i1, errPrice := strconv.ParseFloat(args[1], 64)
	if errPrice != nil {
		return shim.Error(fmt.Sprintf("Failed to Convert Amount: %s", errPrice))
	}

	tokenCount := i1 * grantEntity.Earn_Rate
	if tokenCount > grantEntity.Token_Data.Available {
		return shim.Error(fmt.Sprintf("Can not grant tokens as grant entity do not have enough token"))
	}

	fmt.Println(" got token count ")

	transactionCounter := getCounter(APIstub, "TransactionCounterNO")
	transactionCounter++

	fmt.Println(" got tokencounter ")

	//To Get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in Transaction TimeStamp")
	}

	fmt.Println(" got timestamp ")

	var transaction = Transaction{ID: "Transaction" + strconv.Itoa(transactionCounter), Payment_ID: args[0], Amount: i1, Type: args[2], Token_Count: tokenCount, Token_Grant_Entity_ID: args[3], Token_Taking_Entity_ID: args[4], Timestamp: txTimeAsPtr}

	fmt.Println(" created transaction %v ", transaction)

	transactionAssetAsBytes, errMarshal := json.Marshal(transaction)

	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error in Product: %s", errMarshal))
	}

	fmt.Println(" marshal txn")

	errPut := APIstub.PutState(transaction.ID, transactionAssetAsBytes)

	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to create Transaction Asset: %s", transaction.ID))
	}

	fmt.Println(" put on state txn")

	grantEntity.Token_Data.Available = grantEntity.Token_Data.Available - tokenCount
	grantEntity.Token_Data.Redeemed = grantEntity.Token_Data.Redeemed + tokenCount
	// grantTransactionIds := make([]string, len(grantEntity.Token_Data.Transaction_IDs))
	// grantTransactionIds.append("Transaction" + strconv.Itoa(transactionCounter))
	grantEntity.Token_Data.Transaction_IDs = append(grantEntity.Token_Data.Transaction_IDs, "Transaction"+strconv.Itoa(transactionCounter))
	// grantEntity.Token_Data.Transaction_IDs = grantTransactionIds
	fmt.Println(" update grant entity ", grantEntity)

	grantEntityAssetAsBytes, errMarshal := json.Marshal(grantEntity)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	errPut1 := APIstub.PutState(grantEntity.ID, grantEntityAssetAsBytes)
	if errPut1 != nil {
		return shim.Error(fmt.Sprintf("Failed to create Entity Asset: %s", grantEntity.ID))
	}

	takeEntity.Token_Data.Available = takeEntity.Token_Data.Available + tokenCount
	takeEntity.Token_Data.Total = takeEntity.Token_Data.Total + tokenCount

	// takeTransactionIds := make([]string, len(takeEntity.Token_Data.Transaction_IDs))
	// takeTransactionIds.append("Transaction" + strconv.Itoa(transactionCounter))
	// grantEntity.Token_Data.Transaction_IDs = grantTransactionIds
	takeEntity.Token_Data.Transaction_IDs = append(takeEntity.Token_Data.Transaction_IDs, "Transaction"+strconv.Itoa(transactionCounter))
	//TO Increment the Transaction Counter

	fmt.Println(" update take entity ", takeEntity)
	takeEntityAssetAsBytes, errMarshal := json.Marshal(takeEntity)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	errPut2 := APIstub.PutState(takeEntity.ID, takeEntityAssetAsBytes)
	if errPut2 != nil {
		return shim.Error(fmt.Sprintf("Failed to create Entity Asset: %s", takeEntity.ID))
	}

	incrementCounter(APIstub, "TransactionCounterNO")

	fmt.Println("Success in creating Transaction Asset %v", transaction)

	return shim.Success(transactionAssetAsBytes)
}

// To grant tokens transaction method
func (t *loyalty_platform) grantTokensToConsumerTransaction(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	//To check number of arguments are 5
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments, Required 5 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("Payment ID must be provided to create a transaction")
	}

	if len(args[1]) == 0 {
		return shim.Error("Amount must be provided to create a transaction")
	}

	if len(args[2]) == 0 {
		return shim.Error(" Type must be provided to create a transaction")
	}

	if len(args[3]) == 0 {
		return shim.Error(" Token granting entity ID must be provided to create a transaction")
	}

	if len(args[4]) == 0 {
		return shim.Error("Consumer ID must be provided to create a transaction")
	}

	if args[2] != "grant" {
		return shim.Error("Service not allowed")
	}

	// get entity from the stub ie. Chaincode stub in network using the product id passed
	grantEntityBytes, _ := APIstub.GetState(args[3])
	if grantEntityBytes == nil {
		return shim.Error("Cannot Find Token grant Entity")
	}
	grantEntity := Entity{}
	// unmarsahlling the entity data
	json.Unmarshal(grantEntityBytes, &grantEntity)

	// get entity from the stub ie. Chaincode stub in network using the product id passed
	takeEntityBytes, _ := APIstub.GetState(args[4])
	if takeEntityBytes == nil {
		return shim.Error("Cannot Find Consumer")
	}
	takeEntity := Consumer{}
	// unmarsahlling the entity data
	json.Unmarshal(takeEntityBytes, &takeEntity)

	if grantEntity.Type != "retailer" {
		return shim.Error("This txn can only happen between retailer and consumer")
	}

	//Amount conversion - Error handeling
	i1, errPrice := strconv.ParseFloat(args[1], 64)
	if errPrice != nil {
		return shim.Error(fmt.Sprintf("Failed to Convert Amount: %s", errPrice))
	}

	tokenCount := i1 * grantEntity.Earn_Rate
	if tokenCount > grantEntity.Token_Data.Available {
		return shim.Error(fmt.Sprintf("Can not grant tokens as grant entity do not have enough token"))
	}

	transactionCounter := getCounter(APIstub, "TransactionCounterNO")
	transactionCounter++

	//To Get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in Transaction TimeStamp")
	}

	var transaction = Transaction{ID: "Transaction" + strconv.Itoa(transactionCounter), Payment_ID: args[0], Amount: i1, Type: args[2], Token_Count: tokenCount, Token_Grant_Entity_ID: args[3], Token_Taking_Entity_ID: args[4], Timestamp: txTimeAsPtr}

	transactionAssetAsBytes, errMarshal := json.Marshal(transaction)

	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error in Product: %s", errMarshal))
	}

	errPut := APIstub.PutState(transaction.ID, transactionAssetAsBytes)

	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to create Transaction Asset: %s", transaction.ID))
	}

	grantEntity.Token_Data.Available = grantEntity.Token_Data.Available - tokenCount
	grantEntity.Token_Data.Redeemed = grantEntity.Token_Data.Redeemed + tokenCount
	grantEntity.Token_Data.Transaction_IDs = append(grantEntity.Token_Data.Transaction_IDs, "Transaction"+strconv.Itoa(transactionCounter))

	grantEntityAssetAsBytes, errMarshal := json.Marshal(grantEntity)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	errPut1 := APIstub.PutState(grantEntity.ID, grantEntityAssetAsBytes)
	if errPut1 != nil {
		return shim.Error(fmt.Sprintf("Failed to create Entity Asset: %s", grantEntity.ID))
	}

	takeEntity.Token_Data.Available = takeEntity.Token_Data.Available + tokenCount
	takeEntity.Token_Data.Total = takeEntity.Token_Data.Total + tokenCount
	takeEntity.Token_Data.Transaction_IDs = append(takeEntity.Token_Data.Transaction_IDs, "Transaction"+strconv.Itoa(transactionCounter))
	//TO Increment the Transaction Counter

	takeEntityAssetAsBytes, errMarshal := json.Marshal(takeEntity)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	errPut2 := APIstub.PutState(takeEntity.ID, takeEntityAssetAsBytes)
	if errPut2 != nil {
		return shim.Error(fmt.Sprintf("Failed to create Entity Asset: %s", takeEntity.ID))
	}

	incrementCounter(APIstub, "TransactionCounterNO")

	fmt.Println("Success in creating Transaction Asset %v", transaction)

	return shim.Success(transactionAssetAsBytes)
}

// To grant tokens transaction method
func (t *loyalty_platform) reedemTokensTransaction(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	//To check number of arguments are 5
	if len(args) != 5 {
		return shim.Error("Incorrect number of arguments, Required 5 arguments")
	}

	if len(args[0]) == 0 {
		return shim.Error("Payment ID must be provided to create a transaction")
	}

	if len(args[1]) == 0 {
		return shim.Error("Amount must be provided to create a transaction")
	}

	if len(args[2]) == 0 {
		return shim.Error(" Type must be provided to create a transaction")
	}

	if len(args[3]) == 0 {
		return shim.Error(" Token granting entity ID must be provided to create a transaction")
	}

	if len(args[4]) == 0 {
		return shim.Error("Token taking entity ID must be provided to create a transaction")
	}

	if args[2] != "reedem" {
		return shim.Error("Service not allowed")
	}

	// get Transaction from the stub ie. Chaincode stub in network using the product id passed
	grantEntityBytes, _ := APIstub.GetState(args[3])
	if grantEntityBytes == nil {
		return shim.Error("Cannot Find Token grant Entity")
	}
	grantEntity := Consumer{}
	// unmarsahlling the entity data
	json.Unmarshal(grantEntityBytes, &grantEntity)

	// get entity from the stub ie. Chaincode stub in network using the product id passed
	takeEntityBytes, _ := APIstub.GetState(args[4])
	if takeEntityBytes == nil {
		return shim.Error("Cannot Find Token take Entity")
	}
	takeEntity := Entity{}
	// unmarsahlling the entity data
	json.Unmarshal(takeEntityBytes, &takeEntity)

	if takeEntity.Type != "retailer" {
		return shim.Error("Reedem can only happen if grant is consumer and take is retailer")
	}

	//Amount conversion - Error handeling
	i1, errPrice := strconv.ParseFloat(args[1], 64)
	if errPrice != nil {
		return shim.Error(fmt.Sprintf("Failed to Convert Amount: %s", errPrice))
	}

	tokenCount := i1 / 1 // 1 is burn rate by default set to 1

	var tokenReedemed float64
	var amountYetToBePaid float64

	if tokenCount > grantEntity.Token_Data.Available {
		tokenReedemed = grantEntity.Token_Data.Available
	} else if tokenCount <= grantEntity.Token_Data.Available {
		tokenReedemed = tokenCount
	}

	amountYetToBePaid = i1 - (tokenReedemed * 1) // 1 is burn rate here
	transactionCounter := getCounter(APIstub, "TransactionCounterNO")
	transactionCounter++

	//To Get the transaction TimeStamp from the Channel Header
	txTimeAsPtr, errTx := t.GetTxTimestampChannel(APIstub)
	if errTx != nil {
		return shim.Error("Returning error in Transaction TimeStamp")
	}

	var transaction = Transaction{ID: "Transaction" + strconv.Itoa(transactionCounter), Payment_ID: args[0], Amount: amountYetToBePaid, Type: args[2], Token_Count: tokenReedemed, Token_Grant_Entity_ID: args[3], Token_Taking_Entity_ID: args[4], Timestamp: txTimeAsPtr}

	transactionAssetAsBytes, errMarshal := json.Marshal(transaction)

	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error in Product: %s", errMarshal))
	}

	errPut := APIstub.PutState(transaction.ID, transactionAssetAsBytes)

	if errPut != nil {
		return shim.Error(fmt.Sprintf("Failed to create Transaction Asset: %s", transaction.ID))
	}

	grantEntity.Token_Data.Available = grantEntity.Token_Data.Available - tokenReedemed
	grantEntity.Token_Data.Redeemed = grantEntity.Token_Data.Redeemed + tokenReedemed
	grantEntity.Token_Data.Transaction_IDs = append(grantEntity.Token_Data.Transaction_IDs, "Transaction"+strconv.Itoa(transactionCounter))

	grantEntityAssetAsBytes, errMarshal := json.Marshal(grantEntity)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	errPut1 := APIstub.PutState(grantEntity.ID, grantEntityAssetAsBytes)
	if errPut1 != nil {
		return shim.Error(fmt.Sprintf("Failed to create Entity Asset: %s", grantEntity.ID))
	}
	// takeEntity.Token_Data.Available += tokenCount
	// takeEntity.Token_Data.Total += tokenCount
	takeEntity.Token_Data.Transaction_IDs = append(takeEntity.Token_Data.Transaction_IDs, "Transaction"+strconv.Itoa(transactionCounter))
	takeEntityAssetAsBytes, errMarshal := json.Marshal(takeEntity)
	if errMarshal != nil {
		return shim.Error(fmt.Sprintf("Marshal Error: %s", errMarshal))
	}

	errPut2 := APIstub.PutState(takeEntity.ID, takeEntityAssetAsBytes)
	if errPut2 != nil {
		return shim.Error(fmt.Sprintf("Failed to create Entity Asset: %s", takeEntity.ID))
	}
	//TO Increment the Transaction Counter
	incrementCounter(APIstub, "TransactionCounterNO")

	fmt.Println("Success in creating Transaction Asset %v", transaction)

	return shim.Success(transactionAssetAsBytes)
}

//queryAsset
func (t *loyalty_platform) signIn(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expected 2 argument")
	}

	if len(args[0]) == 0 {
		return shim.Error("Entity User ID must be provided")
	}

	if len(args[1]) == 0 {
		return shim.Error("Password must be provided")
	}

	entityUserBytes, _ := APIstub.GetState(args[0])
	if entityUserBytes == nil {
		return shim.Error("Cannot Find Entity")
	}
	entityUser := Entity_User{}
	// unmarsahlling the entity data
	json.Unmarshal(entityUserBytes, &entityUser)

	// check if password matched
	if entityUser.Hashed_PWD != args[1] {
		return shim.Error("Either id or password is wrong")
	}

	return shim.Success(entityUserBytes)
}

//queryAsset
func (t *loyalty_platform) queryAsset(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expected 1 argument")
	}

	productAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(productAsBytes)
}

// query all asset of a type
func (t *loyalty_platform) queryAll(APIstub shim.ChaincodeStubInterface, args []string) pb.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments, Required 1")
	}

	// parameter null check
	if len(args[0]) == 0 {
		return shim.Error("Asset Type must be provided")
	}

	assetType := args[0]
	assetCounter := getCounter(APIstub, assetType+"CounterNO")

	startKey := assetType + "1"
	endKey := assetType + strconv.Itoa(assetCounter+1)

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)

	if err != nil {

		return shim.Error(err.Error())

	}

	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults

	var buffer bytes.Buffer

	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false

	for resultsIterator.HasNext() {

		queryResponse, err := resultsIterator.Next()
		// respValue := string(queryResponse.Value)
		if err != nil {

			return shim.Error(err.Error())

		}

		// Add a comma before array members, suppress it for the first array member

		if bArrayMemberAlreadyWritten == true {

			buffer.WriteString(",")

		}

		buffer.WriteString("{\"Key\":")

		buffer.WriteString("\"")

		buffer.WriteString(queryResponse.Key)

		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")

		// Record is a JSON object, so we write as-is

		buffer.WriteString(string(queryResponse.Value))

		buffer.WriteString("}")

		bArrayMemberAlreadyWritten = true

	}

	buffer.WriteString("]")

	fmt.Printf("- queryAllAssets:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}
