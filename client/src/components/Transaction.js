import React from 'react';

const Transaction = (props) => {
    const { input, outputMap } = props.transaction;
    const recipients = Object.keys(outputMap);

    return (
      <div className="Transaction">
        {input.address !== "*authorized-reward*" ? (
          <div>
            From: {`${input.address.substring(0, 20)}...`} | Balance: {input.amount}
          </div>
        ) : (
          <div>From: {input.address}</div>
        )}

        {recipients.map((recipient) => (
          <div key={recipient}>
            To: {`${recipient.substring(0, 20)}...`} | Sent:{" "}
            {outputMap[recipient]}
          </div>
        ))}
      </div>
    ); 
};

export default Transaction;