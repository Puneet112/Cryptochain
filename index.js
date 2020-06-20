const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const path = require("path");
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const Wallet = require('./wallet');
const TransactionPool = require('./wallet/transaction-pool');
const TransactionMiner = require('./app/transaction-miner');

const app = express();

const blockchain = new Blockchain();
const wallet = new Wallet();
const transactionPool = new TransactionPool();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({ blockchain, transactionPool, wallet, pubsub });


const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/dist')));

app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.get('/api/blocks/length', (req,res) => {
  res.json(blockchain.chain.length);
});

app.get('/api/blocks/:id', (req,res) => {
  const { id } = req.params;
  const { length } = blockchain.chain;

  const blockchainReversed = blockchain.chain.slice().reverse();

  let startIndex = (id - 1) * 5;
  let endIndex = id * 5;
  
  startIndex = startIndex < length ? startIndex : length;
  endIndex = endIndex < length ? endIndex : length;

  res.json(blockchainReversed.slice(startIndex, endIndex));
});

app.post("/api/mine", (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  pubsub.broadcastChain();

  res.redirect("/api/blocks");
});

app.post('/api/transact', (req,res) => {
  const { amount, recipient } = req.body;

  const required = /^[0-9a-f]+$/;
  if(recipient.match(required) && recipient.length === 130) {
    if(recipient !== wallet.publicKey) {
      let transaction = transactionPool.existingTransaction({
        inputAddress: wallet.publicKey,
      });
      try {
        if (transaction) {
          transaction.update({ senderWallet: wallet, recipient, amount });
        } else {
          transaction = wallet.createTransaction({
            amount,
            recipient,
            chain: blockchain.chain,
          });
        }
      } catch (error) {
        return res.status(400).json({ type: "error", message: error.message });
      }

      transactionPool.setTransaction(transaction);
      pubsub.broadcastTransaction(transaction);
      res.json({ type: "success", transaction });
    } else {
      res.status(400).json({ type: "error", message: "Recipient address cannot be same as receiver address" });
    }
  } else {
    res.status(400).json({ type: "error", message: "Recipient address is not valid" });
  }
});

app.get('/api/transaction-pool-map', (req,res) => {
  res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req,res) => {
  transactionMiner.mineTransactions();
  res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req,res) => {
  const address = wallet.publicKey;
  res.json({
    address,
    balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
  });
});

app.get('/api/known-addresses', (req,res) => {
  const addressMap = {};
  for(let block of blockchain.chain)
  {
    for(let transaction of block.data)
    {
      if (transaction === "GENESIS_BLOCK") {
        continue;
      }
      const recipients = Object.keys(transaction.outputMap);
      const sender = transaction.input.address;
      recipients.forEach(recipient => addressMap[recipient] = recipient);
      if (sender !== "*authorized-reward*")
      {
        addressMap[sender] = sender;
      }
    }
  }
  res.json(Object.keys(addressMap));
});

app.get('*', (req,res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});


const syncWithRootState = () => {
  request({ url: `${ROOT_NODE_ADDRESS}/api/blocks` }, (error, response, body) => {
    if(!error && response.statusCode === 200)
    {
      const rootChain = JSON.parse(body);
      console.log('Replace chain on a sync with: ', rootChain);
      blockchain.replaceChain(rootChain);
    }
  });

  request({ url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const rootTransactionPoolMap = JSON.parse(body);
      console.log('Replace transaction pool on a sync with: ', rootTransactionPoolMap);
      transactionPool.setMap(rootTransactionPoolMap);
    }
  });
};

// Seeding data
// const walletNew = new Wallet();
// const walletFoo = new Wallet();

// const generateWalletTransaction = ({ wallet, recipient, amount }) => {
//   const transaction = wallet.createTransaction({ amount, recipient, chain: blockchain.chain });
//   transactionPool.setTransaction(transaction);
// };

// const walletAction = () => {
//   generateWalletTransaction({ wallet, recipient: walletNew.publicKey, amount: 5 });
// }

// const walletNewAction = () => {
//   generateWalletTransaction({ wallet: walletNew, recipient: walletFoo.publicKey, amount: 10 });
// };

// const walletFooAction = () => {
//   generateWalletTransaction({ wallet: walletFoo, recipient: wallet.publicKey, amount: 15 });
// };

// for(let i = 0; i < 20; i++)
// {
//   if(i%3 === 0)
//   {
//     walletAction();
//     walletNewAction();
//   }
//   else if (i%3 === 1) 
//   {
//     walletNewAction();
//     walletFooAction();
//   }
//   else
//   {
//     walletFooAction();
//     walletAction();
//   }
//   transactionMiner.mineTransactions();
// }
// Seeding data ends

let PEER_PORT;

if(process.env.GENERATE_PEER_PORT === 'true')
{
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
  if(PORT != DEFAULT_PORT)
  {
    syncWithRootState();
  }
});