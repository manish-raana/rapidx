import { formatHexToEther, initRapidContract, EtherToWei } from "../../utility/web3";
const { ethers } = require("ethers");
const TokenisedContract = require("../../artifacts/TokenisedFiat.json");
const TokenisedAbi = TokenisedContract.abi;

const addFunds = async (txnData) => {
  //console.log(txnData);
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    var wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
    var tokenisedFiatContract;
    //const signer = provider.getSigner();
    if (txnData.currency == "INR") {
      tokenisedFiatContract = await new ethers.Contract(process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_ADDRESS, TokenisedAbi, wallet);
    }
    if (txnData.currency == "EURO") {
      tokenisedFiatContract = await new ethers.Contract(process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_ADDRESS, TokenisedAbi, wallet);
    }

    // console.log(tokenisedFiatContract);
    const tx = await tokenisedFiatContract.transfer(txnData.toAddress, txnData.amount);
    //console.log(tx);
    const receipt = tx && (await tx.wait());
    if (receipt)
      //console.log(response);
      return receipt;
    //return tokenisedFiatContract;
  } catch (error) {
    console.log(error);
  }
};
const handler = async (req, res) => {
  if (req.method == "POST") {
    //console.log(req.body);
    const response = await addFunds(req.body);
    res.status(200).json(response);
  } else {
    res.status(200).json("add funds");
  }
};
export default handler;
