import React, { useState, useEffect } from "react";
import Table from "./Table";

import TxnTable from "./TxnTable";
const TxnHistory = ({ address, txnTableRows, txnList }) => {
  return (
    <div className="flex justify-center items-center w-full my-10">
      <TxnTable tableName={"Transaction History"} tableHeaders={txnTableRows} tableData={txnList} />
    </div>
  );
};

export default TxnHistory;
