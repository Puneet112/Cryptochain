const { STARTING_BALANCE } = require('../config');
const { ec, cryptoHash } = require("../util");
const Transaction = require('./transaction');

class Wallet {
  constructor() {
    this.balance = STARTING_BALANCE;
    this.keyPair = ec.genKeyPair();
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }

  createTransaction({ amount, recipient, chain }) {
      if(chain)
      {
          this.balance = Wallet.calculateBalance({
              chain,
              address: this.publicKey   
          })
      }
    if (amount > this.balance) {
      throw new Error("Amount exceeds balance");
    }
    return new Transaction({ senderWallet: this, recipient, amount });
  }

  static calculateBalance({ chain, address }) {
    let outputsTotal = 0;
    let hasConductedTransactions = false;
    for (let i = chain.length - 1; i > 0 ; i--) {
        let block = chain[i];
        for (let transaction of block.data) {
            if (transaction.input.address === address) 
            {
                hasConductedTransactions = true;
            }
            let addressOutput = transaction.outputMap[address];
            if (addressOutput) {
                outputsTotal = outputsTotal + addressOutput;
            }
        }
        if(hasConductedTransactions)
        {
            break;
        }
    }
    return hasConductedTransactions ? outputsTotal : STARTING_BALANCE + outputsTotal;
  }
}

module.exports = Wallet;