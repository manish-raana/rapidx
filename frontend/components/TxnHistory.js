import React, { useState, useEffect } from "react";
import Table from "./Table";
import axios from "axios";

import TxnTable from "./TxnTable";
const TxnHistory = ({ address, txnTableRows, txnList }) => {
  const [TxnList, setTxnList] = useState([]);
  const sortFunction = (a, b) => {
    var dateA = new Date(a.block_signed_at).getTime();
    var dateB = new Date(b.block_signed_at).getTime();
    return dateA > dateB ? 1 : -1;
  };
  const getTransactionHistory = async () => {
    if (!address) {
      return;
    }
    try {
      /* const url = `https://api.covalenthq.com/v1/80001/address/${address}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=0xC675D35cE7fd53171ab293181f46F3Dce67Cc2Cc&key=ckey_df949d9e4c8243c1bc8af71a415`;
      //const url = `https://api.covalenthq.com/v1/80001/address/${address}/transactions_v2/?key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
      const response = await axios.get(url);
      const data = response && response.data && response.data.data && response.data.data.items && response.data.data.items;
      const transfers = data.map((item) => item.transfers[0]);
 */
      let inrFiat = `https://api.covalenthq.com/v1/80001/address/${address}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_ADDRESS}&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
      let euroFiat = `https://api.covalenthq.com/v1/80001/address/${address}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_ADDRESS}&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
      let inrLP = `https://api.covalenthq.com/v1/80001/address/${address}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${process.env.NEXT_PUBLIC_INR_LP_TOKEN_ADDRESS}&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
      let euroLP = `https://api.covalenthq.com/v1/80001/address/${address}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${process.env.NEXT_PUBLIC_EURO_LP_TOKEN_ADDRESS}&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;

      const requestOne = axios.get(inrFiat);
      const requestTwo = axios.get(euroFiat);
      const requestThree = axios.get(inrLP);
      const requestFour = axios.get(euroLP);

      axios
        .all([requestOne, requestTwo, requestThree, requestFour])
        .then(
          axios.spread(async (...responses) => {
            const responseOne = responses[0];
            const responseTwo = responses[1];
            const responeThree = responses[2];
            const responeFour = responses[3];

            const data = [
              ...responseOne.data.data.items,
              ...responseTwo.data.data.items,
              ...responeThree.data.data.items,
              ...responeFour.data.data.items,
            ];
            console.log("data:  ", data);
            const transfers = await data.map((item) => item.transfers[0]);
            transfers.sort(sortFunction);
            //console.log("transfers:  ", transfers);
            setTxnList(transfers.reverse());
          })
        )
        .catch((errors) => {
          // react on errors.
        });
      //setTxnList(transfers);
      //console.log(transfers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getTransactionHistory();
  }, [address]);
  return (
    <div className="flex justify-center items-center w-full my-10">
      <TxnTable tableName={"Transaction History"} tableHeaders={txnTableRows} tableData={TxnList} />
    </div>
  );
};

export default TxnHistory;
