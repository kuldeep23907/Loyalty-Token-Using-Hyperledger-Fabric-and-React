# A LOYALTY PLATFORM APPLICATION USING HYPERLEDGER FABRIC

This platform is to allow manufacturer(P&G here) directly award their customer for being a loyal customers and customers can redeem those tokens at any of the retailer's store associated with the manufacturer.

## Use Case digram

![Use  case diagram](https://user-images.githubusercontent.com/24249646/82753965-8570f480-9de7-11ea-9e11-e1f6b3ed5dd3.jpg)

## Flow diagram

![FLOW DIAGRAM COMPONENTS](https://user-images.githubusercontent.com/24249646/82753974-91f54d00-9de7-11ea-90d5-8547da772015.jpg)

1. Blockchain operator setup the private blockchain network having 3 organizations, 3 certificate authorities and 1 channel.
2. The end user ( admin, user, consumer ) interacts with ReactJS UI for register, update , grant tokens and reedem tokens.
3. The ReactJS platforms uses API gateway to interact with the blockchain network.
4. The ExpressJS API application uses fabric SDK to interact with the nwtwork.

## Technologies used

1. Hyperledger Fabric 1.4.6
2. Node.js
3. React.js

## Software versions


| System | Driver | Version
| --- | --- | --- |
| Platform 						 | Hyperledger Fabric | 1.4.6
| Docker | Docker	| 18.09.09
| Language				 | Go		| 1.11
| Node 					 | node		| 10.20
| UI 					 | React			| latest

_____________________________________________________________________________________________________________________________
## Steps to replicate locally

1. Clone this repository
2. Install required softwares for this app
3. Start the fabric network using shell script
4. Start the API server
5. Start the Client APP

### Step 1. Clone the repository

`git clone git@github.com:kuldeep23907/loyalty-token-using-hlf.git`

`cd loyalty-token-using-hlf`

### Step 2. Install required softwares (if you already have all this with proper versions, please skip). Also this will take few minutes.

They are hyperledger fabric 1.4.6, golang, docker, docker-composer, node,  python3

`chmod 777 prepare.sh`

`sudo ./prepare.sh light`

`source environment`

If it fails, please install all the above mentioned software by refrerring to file prepare.sh one by one. Without this, we will not be able to test the application.

### Step 3. Start the fabric network using shell script

`chmod 777 operate.sh`

`sudo ./operate.sh up`

When you run a script, the following things happen in order:

    Generate certificates through the "artifacts/crypto-config.yaml" file.
    
    Generate channel artifacts through the "artifacts/configtx.yaml" file.
    
    Deploy the required containers on the Fabric network through the docker-compose command and the "arifacts/docker-compose.yaml" file.
    
    Run the "scripts/script.sh" file using the cli docker container.

When you run a script in the cli docker container, the following things happen in order:

    Create a loyaltyplatformchannel channel.'
    
    All peers join the loyaltyplatformchannel channel.
    
    Update anchor peers for each organization.
    
    Install chaincode on all peers.
    
    Instantiate chaincode in manufacturer peer0.
    
    Invoke the initLedger method to seed P&G as manufacturer and an admin in the ledger.

For more details, see the contents of the operate.sh file.

### Step 4. Start the web server

`cd web-app/servers/`

`npm install`

`nodemon app.js`

### Step 5. Start the client app

`cd ../../client/`

`npm install`

`npm start run`

Now everything is setup and testing could be started. Go to `http://localhost:3000` to see the client app running. Use `id: admin and password: adminpw` for admin login to start the flow. Please refer to demo video link here to proceed: https://www.youtube.com/watch?v=olDkOoSwx44&t=386s

## Stop the network 

After testing is done or an error occurs or to stop the network, go to `loyalty-token-using-hlf` and run the following scripts

`chmod 777 stopNetwork.sh`

`chmod 777 teardown.sh`

`sudo ./stopNetwork.sh`

`sudo teardown.sh`

____________________________________________________________________________________________________________________________
## About the fabric private blockchain network

### Network and channel architecture

![Network    Channel Architecture(1)](https://user-images.githubusercontent.com/24249646/82753981-9cafe200-9de7-11ea-835c-3e78b3dd8c2c.jpg)

### Ledger Structs Relationship

![Blockchain  Components Structure(1)](https://user-images.githubusercontent.com/24249646/82754010-c10bbe80-9de7-11ea-9b85-9864315eb395.jpg)
