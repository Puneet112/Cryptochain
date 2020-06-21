import React from "react";
import { Link } from "react-router-dom";
import '../index.css'
function Header() {
    return (
      <header>
        <Link to="/">
          <h1>Blockchain</h1>
        </Link>
        <ul>
          <li>
            <Link to="/blocks">Blocks</Link>
          </li>
          <li>
            <Link to="/wallet">Wallet</Link>
          </li>
          <li>
            <Link to="/conduct-transaction">Conduct Transaction</Link>
          </li>
          <li>
            <Link to="/transaction-pool">Transaction Pool</Link>
          </li>
        </ul>
      </header>
    );
}

export default Header;