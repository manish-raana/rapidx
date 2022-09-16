import React from "react";
import { EtherToWei, WeiToEther, formatHexToEther } from "../utility/web3";
import Moment from "moment";

const TxnTable = ({ tableName, tableData }) => {
  //console.log(tableData);
  const formatDate = (date) => {
    return Moment(date).format("DD-MM-YYYY");
  };
  const formatTime = (date) => {
    return Moment(date).format("hh:mm:ss A");
  };

  return (
    <div className="flex flex-col w-full md:w-[72%]">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 ">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <p className="px-4 py-4 font-bold text-2xl text-gray-200 border border-gray-800 mx-2 bg-gray-800">{tableName}</p>
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
                {tableData.map((item) => (
                  <tr key={item.block_signed_at} className="bg-gray-900">
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

                {/* <tr className="bg-gray-900">
                  <td className="px-6 py-4 text-white whitespace-nowrap">06 sept 2022</td>
                  <td className="px-6 py-4 text-white whitespace-nowrap">10:30 AM</td>
                  <td className="px-6 py-4 text-white whitespace-nowrap">Withdraw</td>
                  <td className="px-6 py-4 text-white whitespace-nowrap">2000</td>
                  <td className="px-6 py-4 text-white whitespace-nowrap">0xjkjbjkajshqkjekjjnk</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TxnTable;
