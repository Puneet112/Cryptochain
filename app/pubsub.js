const redis = require('redis');

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};

class PubSub
{
    constructor({ blockchain, transactionPool })
    {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;

        this.subscriber = redis.createClient();
        this.publisher = redis.createClient();

        this.subscribeToChannels();

        this.subscriber.on('message', (channel, message) => {this.handleMessage(channel, message)});
    }
    
    handleMessage(channel, message)
    {
        console.log(`Message received. Channel: ${channel}. Message: ${message}.`);

        const parsedMsg = JSON.parse(message);
        
        switch(channel)
        {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMsg, true, () => {
                    this.transactionPool.clearBlockchainTransactions({
                        chain: parsedMsg
                    });
                });
                break;
            case CHANNELS.TRANSACTION:
                this.transactionPool.setTransaction(parsedMsg);
                break;
            default:
                return;
        }
    }

    subscribeToChannels()
    {
        Object.values(CHANNELS).forEach(channel => {
            this.subscriber.subscribe(channel);
        });
    }

    publish({channel, message})
    {
        this.subscriber.unsubscribe(channel, () => {
            this.publisher.publish(channel, message, () => {
                this.subscriber.subscribe(channel);
            });
        });
    }

    broadcastChain()
    {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain)
        })
    }

    broadcastTransaction(transaction)
    {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction)
        });
    }
}

module.exports = PubSub;