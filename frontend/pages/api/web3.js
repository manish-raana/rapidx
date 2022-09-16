import { formatHexToEther, initRapidContract, EtherToWei } from "../../utility/web3";
const { ethers } = require("ethers");
const RapidContract = require("../../artifacts/RapidProtocol.json");
const RapidAbi = RapidContract.abi;

const Wallet = async () => {
  const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
  var wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
  const signer = provider.getSigner();
  console.log(signer);
  //console.log(await wallet.getTransactionCount());
};
const addLiquidity = async (txnData) => {
  try {
    const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
    var wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
    //const signer = provider.getSigner();
    const rapidContract = await new ethers.Contract(process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS, RapidAbi, wallet);
    const tx = await rapidContract.addLiquidity(txnData.amount, txnData.to, txnData.fiatSymbol, txnData.lpSymbol, txnData.ratio);
    //console.log(tx);
    const response = await tx.wait();
    //console.log(response);
    return response;
  } catch (error) {
    console.log(error);
  }
};

const handler = async (req, res) => {
  if (req.method == "POST") {
    //console.log(req.body);
    const response = await addLiquidity(req.body);
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
