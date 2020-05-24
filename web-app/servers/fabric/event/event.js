const fs = require('fs');
const path = require('path');
const { FileSystemWallet, Gateway } = require('fabric-network');
const schedule = require('./schedule.js');

const ccpPath = path.join(process.cwd(), process.env.MANAGER_CONN);
const ccpFile = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpFile);

const walletPath = path.join(process.cwd(), process.env.MANAGER_WALLET);
const wallet = new FileSystemWallet(walletPath);
const ccpOptions = {
    wallet,
    identity: process.env.ADMIN,
    discovery: { enabled: true, asLocalhost: Boolean(process.env.AS_LOCALHOST) },
};

exports.handlingPastEvents = () => {
    schedule.initSurveySchedule();
};

exports.activateContractEvent = async () => {
    try {
        const gateway = new Gateway();
        await gateway.connect(ccp, ccpOptions);
        const network = await gateway.getNetwork(process.env.CHANNEL);
        const contract = await network.getContract(process.env.CONTRACT);

        const registerListener = await contract.addContractListener(
            'registerEventListener',
            'surveyRegisterEvent',
            (err, event, blockNumber, transactionID, status) => {
                if (err) {
                    console.error(`Failed to listen register event: ${err}`);
                    return;
                }
                console.log(`Block Number: ${blockNumber}`);
                console.log(`Transaction ID: ${transactionID}`);
                console.log(`Status: ${status}`);

                schedule.addSurveySchedule(event.payload);
            },
        );

        const updateListener = await contract.addContractListener(
            'updateEventListener',
            'surveyUpdateEvent',
            (err, event, blockNumber, transactionID, status) => {
                if (err) {
                    console.error(`Failed to listen update event: ${err}`);
                    return;
                }
                console.log(`Block Number: ${blockNumber}`);
                console.log(`Transaction ID: ${transactionID}`);
                console.log(`Status: ${status}`);

                schedule.updateSurveySchedule(event.payload);
            },
        );

        const removeListener = await contract.addContractListener(
            'removeEventListener',
            'surveyRemoveEvent',
            (err, event, blockNumber, transactionID, status) => {
                if (err) {
                    console.error(`Failed to listen remove event: ${err}`);
                    return;
                }
                console.log(`Block Number: ${blockNumber}`);
                console.log(`Transaction ID: ${transactionID}`);
                console.log(`Status: ${status}`);

                schedule.removeSurveySchedule(event.payload);
            },
        );

        console.log('Activated contract event listener successly.');
        return { registerListener, updateListener, removeListener };
    } catch (err) {
        console.error(`Error activate contract event listener: ${err}`);
        return { error: err.toString() };
    }
};

exports.activateBlockEvent = async () => {
    try {
        const gateway = new Gateway();
        await gateway.connect(ccp, ccpOptions);
        const network = await gateway.getNetwork(process.env.CHANNEL);

        const listener = await network.addBlockListener('surveynetBlockListener', (err, block) => {
            if (err) {
                console.error(`Failed to listen block event: ${err}`);
                return;
            }
            console.log(`Block: ${block}`);
        });

        console.log('Activated block event listener successly.');
        return listener;
    } catch (err) {
        console.error(`Error activate block event listener: ${err}`);
        return { error: err.toString() };
    }
};

exports.activateCommitEvent = async transactionName => {
    try {
        const gateway = new Gateway();
        await gateway.connect(ccp, ccpOptions);
        const network = await gateway.getNetwork(process.env.CHANNEL);
        const contract = await network.getContract(process.env.CONTRACT);

        const transaction = contract.createTransaction(transactionName);
        const listener = await transaction.addCommitListener((err, transactionID, status, blockHeight) => {
            if (err) {
                console.error(`Failed to listen commit event: ${err}`);
                return;
            }
            if (status === 'VALID') {
                console.log('transaction committed');
                console.log(transactionID);
                console.log(status);
                console.log(blockHeight);
                console.log('transaction committed end');
            } else {
                console.log(`err transaction failed: ${status}`);
            }
        });

        console.log('Activated commit event listener successly.');
        return listener;
    } catch (err) {
        console.error(`Error activate commit event listener: ${err}`);
        return { error: err.toString() };
    }
};
