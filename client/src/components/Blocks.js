import React, { Component } from 'react';
import { Button } from "react-bootstrap";
import Block from './Block';
import Header from "./Header";
import Footer from "./Footer";

class Blocks extends Component
{
    state = { blocks: [], paginatedId: 1, blockchainLength: 0 };

    componentDidMount()
    {
        fetch(`${document.location.origin}/api/blocks/length`)
            .then(response => response.json())
            .then(json => this.setState({ blockchainLength: json }));
            
        this.fetchPaginatedBlocks(this.state.paginatedId)();
    }

    fetchPaginatedBlocks = paginatedId => () => {
        fetch(`${document.location.origin}/api/blocks/${paginatedId}`)
            .then(response => response.json())
            .then(json => this.setState({ blocks: json }));
    }

    render()
    {
        return (
          <div className="position animate-top">
            <Header />
            <div className="container">
              <h1>Blocks</h1>
              <div className="pages">
                {[
                  ...Array(Math.ceil(this.state.blockchainLength / 5)).keys(),
                ].map((key) => {
                  const paginatedId = key + 1;
                  return (
                    <span
                      key={key}
                      onClick={this.fetchPaginatedBlocks(paginatedId)}
                    >
                      <Button variant="outline-info" size="sm">
                        {paginatedId}
                      </Button>{" "}
                    </span>
                  );
                })}
              </div>
              {this.state.blocks.map((block) => {
                return <Block key={block.hash} block={block} />;
              })}
            </div>
            <br />
            <br />
            <Footer />
          </div>
        );
    }
}

export default Blocks;