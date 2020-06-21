import React, { Component } from 'react';
import Header from "./Header";
import Footer from "./Footer";

class App extends Component
{
    render()
    {
        return (
          <div className="position">
            <Header />
            <img className="img-front" src={require("../images/network.jpg")} />
            <div className="container">
              <h1>
                <span>Welcome to Cryptocurrency</span>
              </h1>
              <h4>An innovative payment network and a new kind of money</h4>
              <div>
                A cryptocurrency (or crypto currency) is a digital asset
                designed to work as a medium of exchange wherein individual coin
                ownership records are stored in a digital ledger or computerized
                database using strong cryptography to secure transaction record
                entries, to control the creation of additional digital coin
                records, and to verify the transfer of coin ownership. It
                typically does not exist in physical form (like paper money) and
                is typically not issued by a central authority. <br />
                <br />
                Some cryptocurrencies use decentralized control as opposed to
                centralized digital currency and central banking systems. When a
                cryptocurrency is minted or created prior to issuance or held on
                a centralized exchange, it is generally considered centralized.
                When implemented with decentralized control, each cryptocurrency
                works through distributed ledger technology, typically a
                blockchain, that serves as a public financial transaction
                database. <br />
                <br />
              </div>
              <div>
                <div className="side-content">
                  It uses peer-to-peer technology to operate with no central
                  authority or banks; managing transactions and the issuing of
                  currency is carried out collectively by the network. It is
                  open-source; its design is public, nobody owns or controls it
                  and everyone can take part. Through many of its unique
                  properties, it allows exciting uses that could not be covered
                  by any previous payment system.
                  <ul>
                    <li>Fast peer-to-peer transactions</li>
                    <li>Worldwide payments</li>
                    <li>Low processing fees</li>
                  </ul>
                </div>
                <img
                  className="side-img"
                  src={require("../images/cryptocurrency.jpg")}
                />
              </div>
              <br />
            </div>
            <br />
            <br />
            <Footer />
          </div>
        );
    }
}

export default App;

