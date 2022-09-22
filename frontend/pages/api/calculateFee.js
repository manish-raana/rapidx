import { formatHexToEther, initRapidContract, EtherToWei } from "../../utility/web3";
const { ethers } = require("ethers");
const RapidContract = require("../../artifacts/RapidProtocol.json");
const RapidAbi = RapidContract.abi;

const calculateFee = async (txnData) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    var wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
    //const signer = provider.getSigner();
    const rapidContract = await new ethers.Contract(process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS, RapidAbi, wallet);
    const fees = await rapidContract.calculateFeeAndCashback(txnData.sourceAmount, txnData.sourceSymbol, txnData.destinationAmount, txnData.destinationSymbol);
    //console.log(fees)
    const totalFees = await ethers.utils.formatUnits(fees[0], 4);
   const cashback = await ethers.utils.formatUnits(fees[1], 0);
   const feeObj = {
      totalFees: totalFees,
      cashback: cashback,
    }; 
    return feeObj;
  } catch (error) {
    console.log(error);
  }
};

const handler = async (req, res) => {
  if (req.method == "POST") {
    //console.log(req.body);
    const response = await calculateFee(req.body);
    res.status(200).json(response);
  } else {
    // res.redirect(307, "/");
    const query = req.query;

    console.log(req.query);
    //Wallet(query.amount, query.to, query.fiatSymbol, query.lpSymbol, query.ratio);
    res.status(200).json(req.query);
  }
};
export default handler;
