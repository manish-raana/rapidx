import React from 'react'
import { getEuroTokenBalance,WeiToEther } from "../utility/web3";
import { useEffect,useState } from 'react';
import axios from 'axios';
import Moment from "moment";
const Merchant = () => {
    const [Balance, setBalance] = useState(0);
    const [TxnList, setTxnList] = useState([])
    const getTransactions = async () => { 
       const url = `https://api.covalenthq.com/v1/80001/address/0x52de076F23D29A7eA99D30AB8E99Af12A067feDC/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_ADDRESS}&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
        const response = await axios.get(url);
        if (response && response.data && response.data.data)
        { 
            const txnObject = response.data.data.items;
            const txnList = [];
            await txnObject.forEach(item => { 
                txnList.push(...item.transfers);
            });
            if (txnList.length > TxnList.length)
            {
                setTxnList(txnList);
            }
        }
        console.log(response)
    }

    const fetchBalance = async() => { 
        const balance = await getEuroTokenBalance("0x52de076F23D29A7eA99D30AB8E99Af12A067feDC");
        //console.log(balance)
        if(balance !== Balance){
            setBalance(balance)
        }
    }
    const formatDate = (date) => {
      return Moment(date).format("DD-MM-YYYY");
    };
    const formatTime = (date) => {
      return Moment(date).format("hh:mm:ss A");
    };

    useEffect(() => {
        setInterval(() => {
            fetchBalance();
            getTransactions();
        }, 3000);
        
    }, []);
  return (
    <div className="w-full h-screen flex items-center flex-col text-white mt-20 bg-center">
      <div className="flex justify-center items-center">
        <div className="text-2xl font-bold">
          <p>Wallet Address: 0x52de076F23D29A7eA99D30AB8E99Af12A067feDC</p>
          <p>Balance: {Balance} tEURO</p>
        </div>
      </div>
      <div className="flex flex-col w-full md:w-[72%] mt-10">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 ">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <p className="px-4 py-4 font-bold text-2xl text-gray-200 border border-gray-800 mx-2 bg-gray-800">Transactions</p>
            <div className="overflow-x-auto px-2">
              <table className="min-w-full table-auto">
                <thead className=" bg-gray-900 text-orange-500 font-bold text-lg">
                  <tr>
                    <th key="1" scope="col" className="px-6 py-2 pt-5 text-left">
                      Date
                    </th>
                    <th key="2" scope="col" className="px-6 py-2 pt-5 text-left">
                      Time
                    </th>
                    <th key="3" scope="col" className="px-6 py-2 pt-5 text-left">
                      Txn Type (In/OUT)
                    </th>
                    <th key="4" scope="col" className="px-6 py-2 pt-5 text-left">
                      Amount
                    </th>
                    <th key="5" scope="col" className="px-6 py-2 pt-5 text-left">
                      Txn Hash
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TxnList.length > 0 &&
                    TxnList.map((item, index) => (
                      <tr key={index} className="bg-gray-900">
                        <td className="px-6 py-4 text-white whitespace-nowrap">{formatDate(item.block_signed_at)}</td>
                        <td className="px-6 py-4 text-white whitespace-nowrap">{formatTime(item.block_signed_at)}</td>
                        <td className="px-6 py-4 text-white whitespace-nowrap">
                          {WeiToEther(item.delta)} {item.contract_ticker_symbol}
                        </td>
                        <td className="px-6 py-4 text-white whitespace-nowrap">{item.transfer_type}</td>
                        <td className="px-6 py-4 text-white whitespace-nowrap">
                          <a
                            className="bg-slate-700 px-5 py-2 rounde-xl text-white hover:bg-slate-800"
                            target="_blank"
                            href={`${process.env.NEXT_PUBLIC_MATIC_EXPLORER_TXN}${item.tx_hash}`}
                          >
                            Check Txn
                          </a>
                        </td>
                      </tr>
                    ))}
                  {TxnList.length == 0 && (
                    <>
                      <tr key="1">
                        <td></td>
                        <td></td>
                        <td>
                          <p className="text-white py-10 text-center">No Transactions Available Yet!</p>
                        </td>
                        <td></td>
                        <td></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Merchant