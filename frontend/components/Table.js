import React from "react";

const Table = ({ tableName, tableHeaders, tableData }) => {
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
                {tableData.map((tr, tr_index) => (
                  <tr key={tr_index} className="bg-gray-900">
                    {tr.map((td, td_index) => (
                      <td key={td_index} className="px-6 py-4 text-white whitespace-nowrap">
                        {td}
                      </td>
                    ))}
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

export default Table;
