import React, { useState, useEffect } from "react";
import { suppliedLiquidity, currentLiquidity } from "../utility/web3";
const Table = ({ tableName, tableHeaders, euroVolume, inrVolume,EuroUtilisation,InrUtilisation, fetchContractTxns }) => {
  const [CurrentLiquidity, setCurrentLiquidity] = useState({
    inrCurrentLiquidity: 0,
    euroCurrentLiquidity: 0,
  });
  const [SuppliedLiquidity, setSuppliedLiquidity] = useState({
    inrSuppliedLiquidity: 0,
    euroSuppliedLiquidity: 0,
  });
  const getLiquidity = async () => {
    const liquiditySupplied = await suppliedLiquidity();
    //console.log("suppledLiquidity:   ", liquiditySupplied);
    setSuppliedLiquidity(liquiditySupplied);

    const liquidityCurrent = await currentLiquidity();
    //console.log("currentLiquidity:   ", liquidityCurrent);
    setCurrentLiquidity(liquidityCurrent);
  };
  useEffect(() => {
    fetchContractTxns();
    getLiquidity();
  }, [suppliedLiquidity, currentLiquidity]);

  return (
    <div className="flex flex-col w-full md:w-[72%]">
      <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 ">
        <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
          <p className="px-4 py-4 font-bold text-2xl text-gray-200 border border-gray-800 mx-2 bg-gray-800">{tableName}</p>
          <div className="overflow-x-auto px-2">
            <table className="min-w-full table-auto">
              <thead className=" bg-gray-900 text-orange-500 font-bold text-lg">
                <tr>
                  {tableHeaders.map((column, index) => (
                    <th key={index} scope="col" className="px-6 py-2 pt-5 text-left">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-900">
                  <td className="px-6 py-4 text-white whitespace-nowrap">tINR</td>
                  <td className="px-6 py-4 text-white whitespace-nowrap">{SuppliedLiquidity.inrSuppliedLiquidity}</td>
                  <td className="px-6 py-4 text-white whitespace-nowrap">{CurrentLiquidity.inrCurrentLiquidity}</td>
                  <td className="px-6 py-4 text-white whitespace-nowrap">
                    {SuppliedLiquidity.inrSuppliedLiquidity > 0
                      ? (
                          0.002 * 365 * 100 * InrUtilisation  / SuppliedLiquidity.inrSuppliedLiquidity
                        ).toFixed(2) + "%"
                      : "0%"}
                  </td>
                  <td className="px-6 py-4 text-white whitespace-nowrap">{inrVolume}</td>
                  <td className="px-6 py-4 text-white whitespace-nowrap">
                    {SuppliedLiquidity.inrSuppliedLiquidity > 0
                      ? ((InrUtilisation * 100) / SuppliedLiquidity.inrSuppliedLiquidity).toFixed(2) + "%"
                      : "0%"}
                  </td>
                </tr>
                <tr className="bg-gray-900">
                  <td className="px-6 py-4 text-white whitespace-nowrap">tEuro</td>
                  <td className="px-6 py-4 text-white whitespace-nowrap">{SuppliedLiquidity.euroSuppliedLiquidity}</td>
                  <td className="px-6 py-4 text-white whitespace-nowrap">{CurrentLiquidity.euroCurrentLiquidity}</td>
                  <td className="px-6 py-4 text-white whitespace-nowrap">
                    {SuppliedLiquidity.euroSuppliedLiquidity > 0
                      ? (
                          0.002 * 365 * 100 * EuroUtilisation  / SuppliedLiquidity.euroSuppliedLiquidity
                        ).toFixed(2) + "%"
                      : "0%"}
                  </td>
                  <td className="px-6 py-4 text-white whitespace-nowrap">{euroVolume}</td>
                  <td className="px-6 py-4 text-white whitespace-nowrap">
                    {SuppliedLiquidity.euroSuppliedLiquidity > 0
                      ? ((EuroUtilisation * 100) / SuppliedLiquidity.euroSuppliedLiquidity).toFixed(2) + "%"
                      : "0%"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
