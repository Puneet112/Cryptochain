import React, {Component} from "react"; 
import Header from "./Header";
import Footer from "./Footer";

class Wallet extends Component {
  state = { walletInfo: {} };

  componentDidMount() {
    fetch(`${document.location.origin}/api/wallet-info`)
      .then((response) => response.json())
      .then((json) => this.setState({ walletInfo: json }));
  }

  render() {
    const { address, balance } = this.state.walletInfo;
    return (
      <div className="position animate-top">
        <Header />
        <div className="container">
          <h1>Wallet info</h1>
          <div className="align">
            <div>
              <strong>Address: </strong>
              <br />
              {address}
            </div>
            <div>
              <strong>Balance: </strong>
              <br />
              {balance}
            </div>
            <br />
          </div>
        </div>
        <br />
        <br />
        <Footer />
      </div>
    );
  }
}

export default Wallet;