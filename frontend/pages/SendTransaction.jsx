import * as React from "react";

import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";

const SendTransaction = () => {
  const [to, setTo] = React.useState("");

  const [amount, setAmount] = React.useState("");

  const { config } = usePrepareSendTransaction({
    request: {
      to: to,
      value: amount ? amount : undefined,
    },
  });
  const { data, sendTransaction } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendTransaction?.();
      }}
    >
      <input aria-label="Recipient" onChange={(e) => setTo(e.target.value)} placeholder="0xA0Cf…251e" value={to} />
      <input aria-label="Amount (ether)" onChange={(e) => setAmount(e.target.value)} placeholder="0.05" value={amount} />
      <button disabled={isLoading || !sendTransaction || !to || !amount}>{isLoading ? "Sending..." : "Send"}</button>
      {isSuccess && (
        <div>
          Successfully sent {amount} ether to {to}
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`}>Etherscan</a>
          </div>
        </div>
      )}
    </form>
  );
};

export default SendTransaction;
