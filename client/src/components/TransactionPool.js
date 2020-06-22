import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';
import history from '../history';
import Header from "./Header";
import Footer from "./Footer";

const POLL_INTERAL_MS = 5000;

class TransactionPool extends Component
{
    state = { transactionPoolMap: {} };

    fetchTransactionPoolMap = () => {
        fetch(`${document.location.origin}/api/transaction-pool-map`)
            .then(response => response.json())
            .then(json => this.setState({ transactionPoolMap: json }));
    }

    fetchMineTransactions = () => {
        fetch(`${document.location.origin}/api/mine-transactions`)
            .then(response => {
                if(response.status === 200)
                {
                    alert('success');
                    history.push('/blocks');
                }
                else
                {
                    alert('The mine transaction request did not complete.');
                }
            });
    }

    componentDidMount()
    {
        this.fetchTransactionPoolMap();
        this.fetchPoolMapInterval = setInterval(() => {
            this.fetchTransactionPoolMap();
        }, POLL_INTERAL_MS);
    }

    componentWillUnmount()
    {
        clearInterval(this.fetchPoolMapInterval);
    }

    render()
    {
        return (
          <div className="position animate-top">
            <Header />
            <div className="container align">
              <h1>Transaction Pool</h1>
              { (Object.keys(this.state.transactionPoolMap).length !== 0) ? (
                Object.values(this.state.transactionPoolMap).map(
                  (transaction) => (
                    <div key={transaction.id}>
                      <hr />
                      <Transaction transaction={transaction} />
                    </div>
                  )) 
                ) : (
                <div className="empty">No transaction to mine</div>
              ) }
              <Button
                variant="primary"
                size="lg"
                onClick={this.fetchMineTransactions}
                className = "MineTransaction"
              >
                Mine Transactions
              </Button>
            </div>
            <br />
            <br />
            <Footer />
          </div>
        );
    }
}

export default TransactionPool;