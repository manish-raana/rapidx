import axios from "axios";

const getContractTxns = async (rapidContract,fiatContract,apiKey) => {
  
  const url = `${process.env.NEXT_PUBLIC_COVALENT_BASE_URL}/address/${rapidContract}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${fiatContract}&key=${apiKey}`;
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
