const Transaction = require('../wallet/transaction');

class TransactionMiner
{
    constructor({ blockchain, transactionPool, wallet, pubsub })
    {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }

    mineTransactions()
    {
        // get all valid transactions from transaction pool
        const validTransactions = this.transactionPool.validTransactions();

        // generate miner's reward
        validTransactions.push(
            Transaction.rewardTransaction({ minerWallet: this.wallet })
        );

        // mine the block and add it to the blockchain
        this.blockchain.addBlock({ data: validTransactions });

        // broadcast the updated blockchain
        this.pubsub.broadcastChain();

        // remove the transactions from the transaction pool
        this.transactionPool.clear();
        
    }
}

module.exports = TransactionMiner;