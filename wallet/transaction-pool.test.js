const TransactionPool = require('./transaction-pool');
const Transaction =require('./transaction');
const Wallet = require('./index');
const Blockchain = require('../blockchain');

describe('TransactionPool', () => {
    let transactionPool, transaction, senderWallet = new Wallet();

    beforeEach(() => {
        transactionPool = new TransactionPool();
        transaction = new Transaction({
            senderWallet,
            recipient: 'new-reipient',
            amount: 50
        });
    });

    describe('setTransaction()', () => {
        it('adds the transaction to the transaction pool', () => {
            transactionPool.setTransaction(transaction);
            expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
        });
    });

    describe('existingTransaction()', () => {
        it('returns an existing transaction given an input address if present', () => {
            transactionPool.setTransaction(transaction);
            expect(transactionPool.existingTransaction({ inputAddress: senderWallet.publicKey })).toBe(transaction);
        });
    });

    describe('validTransactions()', () => {
        let validTransactions, errorMock;

        beforeEach(() => {
            validTransactions = [];
            errorMock = jest.fn();
            global.console.error = errorMock;

            for(let i = 0; i < 10; i++)
            {
                transaction = new Transaction({ 
                    senderWallet,
                    recipient: 'any-recipient',
                    amount: 50
                 });

                if(i%3 === 0)
                {
                    transaction.input.amount = 999999;
                }
                else if(i%3 === 1)
                {
                    transaction.input.signature = new Wallet().sign('any');
                }
                else
                {
                    validTransactions.push(transaction);
                }

                 transactionPool.setTransaction(transaction);
            }
        });

        it('returns valid transactions', () => {
            expect(transactionPool.validTransactions()).toEqual(validTransactions);
        });

        it('logs the error for invalid transactions', () => {
            transactionPool.validTransactions();
            expect(errorMock).toHaveBeenCalled();
        });
    });

    describe('clears()', () => {
        it('clears the transaction pool', () => {
            transactionPool.clear();
            expect(transactionPool.transactionMap).toEqual({});
        });
    });

    describe('clearBlockchainTransactions()', () => {
        it('clears the pool of any existing blockchain transactions', () => {
            const blockchain = new Blockchain();
            const expectedTransactionMap = {};
            for(let i = 0; i < 6; i++)
            {
                // senderWallet = new Wallet();
                transaction = new Transaction({
                    senderWallet,
                    recipient: 'new-reipient',
                    amount: 50
                });
                // const transaction = new Wallet().createTransaction({ amount: 20, recipient: 'foo-recipient' });

                transactionPool.setTransaction(transaction);

                if(i%2 === 0)
                {
                    blockchain.addBlock({ data: [transaction] });
                }
                else
                {
                    expectedTransactionMap[transaction.id] = transaction;
                }
            }

            transactionPool.clearBlockchainTransactions({ chain: blockchain.chain });
            expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
        });
    });
});