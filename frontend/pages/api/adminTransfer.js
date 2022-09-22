import { formatHexToEther, initRapidContract, EtherToWei } from "../../utility/web3";
const { ethers } = require("ethers");
const RapidContract = require("../../artifacts/RapidProtocol.json");
const RapidAbi = RapidContract.abi;
const TokenisedContract = require("../../artifacts/TokenisedFiat.json");
const TokenisedAbi = TokenisedContract.abi;

const transferFiatFunds = async (txnData) => {
    try
    {
     // console.log("txn-funds:  ", txnData);
      const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    
      var wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
      //const signer = provider.getSigner();
      const rapidContract = await new ethers.Contract(process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS, RapidAbi, wallet);
       const txnResponse = await rapidContract.transferFiat(
         txnData.sellerAddress,
         txnData.destinationAmount,
         txnData.destinationFiatSymbol,
         txnData.sourceAmount,
         txnData.sourceFiatSymbol
       );
      //console.log(txnResponse);
      await txnResponse.wait();
    return txnResponse;  
      
    } catch (error)
    {
       console.log(error);
      return error;
   
  }
};
const transferFunds = async (txnData) => {
    try
    {
      //console.log('txn-tokens:  ',txnData)
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    var wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
    //const signer = provider.getSigner();
    const tokenisedContract = await new ethers.Contract(process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_ADDRESS, TokenisedAbi, wallet);
    const txnResponse = await tokenisedContract.transfer(
      txnData.toAddress,
      txnData.destinationAmount,
    );
      //console.log(txnResponse);
        await txnResponse.wait();
        
    return txnResponse; 
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  transferFiatFunds: transferFiatFunds,
  transferFunds: transferFunds,
};