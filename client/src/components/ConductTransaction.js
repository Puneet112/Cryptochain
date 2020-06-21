import React, { Component } from 'react';
import { FormGroup, FormControl, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import history from '../history';
import Header from "./Header";
import Footer from "./Footer";
import '../index.css';

class ConductTransaction extends Component
{
    state = { recipient: '', amount: 0, knownAddresses: [], error: '' };

    componentDidMount()
    {
        fetch(`${document.location.origin}/api/known-addresses`)
            .then(response => response.json())
            .then(json => this.setState({ knownAddresses: json }));
    }

    updateRecipient = event => {
        this.setState({ recipient: event.target.value });
    }

    updateAmount = event => {
        this.setState({ amount: Number(event.target.value) });
    }

    conductTransaction = () => {
        const { recipient, amount } = this.state;
        if(recipient !== "" && amount >= 0) {
          fetch(`${document.location.origin}/api/transact`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipient, amount }),
          })
            .then((response) => response.json())
            .then((json) => {
              if(json.type === "success") {
                alert(json.type);
                history.push("/transaction-pool");
              } else {
                this.setState({ error: json.message });
              }
            });
        } else if(recipient === "") {
          this.setState({ error: "* Recipient cannot be empty" });
        } else if(amount < 0) {
          this.setState({ error: "* Amount cannot be less than 0" });
        } else {
          this.setState({ error: "* Input Error" })
        }
    }

    render()
    {
        return (
          <div className="position">
            <Header />
            <div className="container align">
              <h1>Conduct a Transaction</h1>
              <h4>Known Addresses</h4>
              {this.state.knownAddresses.map((knownAddress) => {
                return (
                  <div key={knownAddress} className="WalletInfo">
                    <div>{knownAddress}</div>
                    <br />
                  </div>
                );
              })}
              <br />
              <div style={{"color": "red", "textAlign": "left", "marginBottom": "8px"}}>{this.state.error}</div>
              <FormGroup>
                <FormControl
                  input="text"
                  placeholder="recipient"
                  value={this.state.recipient}
                  onChange={this.updateRecipient}
                />
              </FormGroup>
              <FormGroup>
                <FormControl
                  input="number"
                  placeholder="amount"
                  value={this.state.amount}
                  onChange={this.updateAmount}
                />
              </FormGroup>
              <div>
                <Button
                  variant="primary"
                  size="lg"
                  type="submit"
                  onClick={this.conductTransaction}
                  className = "Submit"
                >
                  Submit
                </Button>
              </div>
            </div>
            <br />
            <br />
            <br />
            <Footer />
          </div>
        );
    }
}

export default ConductTransaction;