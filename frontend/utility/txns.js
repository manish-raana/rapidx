import axios from "axios";

const getContractTxns = async (rapidContract,fiatContract,apiKey) => {
  
  const url = `https://api.covalenthq.com/v1/80001/address/${rapidContract}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${fiatContract}&key=${apiKey}`;
  try {
    const response = await axios.get(url);

    return response.data.data.items;
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  getContractTxns: getContractTxns,
};
