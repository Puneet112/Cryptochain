import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import Transaction from './Transaction';
import '../index.css';

class Block extends Component
{
    state = { displayTransaction: false };

    toggleTransaction = () => {
        this.setState({ displayTransaction: !this.state.displayTransaction });
    }

    get displayTransaction()
    {
        const { data, timestamp } = this.props.block;
        let modifiedData = 0;
        if(timestamp === "1") {
          modifiedData = data;
        } else {
          modifiedData = data[0].id;
        }
        const dataDisplay =
          modifiedData.length > 25
            ? `${modifiedData.substring(0, 25)}...`
            : modifiedData;
        
        if(this.state.displayTransaction)
        {
            return (
              <div>
                {data[0] !== "GENESIS_BLOCK" ? (
                  data.map((transaction) => (
                    <div key={transaction.id}>
                      <hr />
                      <Transaction transaction={transaction}></Transaction>
                    </div>
                  ))
                ) : (
                  <div>
                    <strong>Data: </strong>
                    {dataDisplay}
                  </div>
                )}
                <br />
                <Button
                  variant="info"
                  size="small"
                  onClick={this.toggleTransaction}
                  className = "ShowLess"
                >
                  Show Less
                </Button>
              </div>
            );
        }

        return (
          <div>
            <div>
              <strong>Data: </strong>
              {dataDisplay}
            </div>
            <br />
            <Button
              variant="info"
              size="small"
              onClick={this.toggleTransaction}
              className = "ShowMore"
            >
              Show More
            </Button>
          </div>
        );
    }

    render()
    {
        const { timestamp, hash } = this.props.block;
        const hashDisplay = `${hash.substring(0, 15)}...`; 

        return (
          <div className="Block">
            <div>
              <strong>Hash: </strong>
              {hashDisplay}
            </div>
            <div>
              <strong>Timestamp: </strong>
              {new Date(timestamp).toLocaleString()}
            </div>
            {this.displayTransaction}
          </div>
        );                  
    }
}

export default Block;