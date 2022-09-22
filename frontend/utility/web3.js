const LPTokensContract = require("../artifacts/LPTokens.json");
const RapidContract = require("../artifacts/RapidProtocol.json");
const TokenisedFiatContract = require("../artifacts/TokenisedFiat.json");
const { ethers } = require("ethers");
const RapidAbi = RapidContract.abi;
const TokenisedAbi = TokenisedFiatContract.abi;
const LPTokensAbi = LPTokensContract.abi;

const provider = new ethers.providers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);

//console.log(LPTokens.abi);
const formatHexToEther = (balance) => {
  try {
     return ethers.utils.formatEther(balance);
  } catch (error) {
    console.log(error)
  }
 
};
const EtherToWei = (balance) => {
  try {
    return ethers.utils.parseEther(balance);
  } catch (error) {
    console.log(error)
  }
};
const WeiToEther = (balance) => {
  try {
    return parseFloat(ethers.utils.formatUnits(balance, 18));
  } catch (error) {
    console.log(error);
  }
};
/* const data = async () => {
  const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");
  balance = await provider.getBalance("0x38805F72EbcAfB924e8b5cED9F8D575Fe8039E0e");

  console.log(formatHexToEther(balance));
}; */

const initRapidContract = async () => {
 try {
   const contract = await new ethers.Contract(process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS, RapidAbi, provider);
   return contract;
 } catch (error) {
  console.log(error)
 }
};
const initInrContract = async () => {
  try {
    const contract = await new ethers.Contract(process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_ADDRESS, TokenisedAbi, provider);
    return contract;
  } catch (error) {
    console.log(error);
  }
};
const initEuroContract = async () => {
  try {
    const contract = await new ethers.Contract(process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_ADDRESS, TokenisedAbi, provider);
    return contract;
  } catch (error) {
    console.log(error);
  }
};
const initInrLPContract = async () => {
  try {
    const contract = await new ethers.Contract(process.env.NEXT_PUBLIC_INR_LP_TOKEN_ADDRESS, TokenisedAbi, provider);
    return contract;
  } catch (error) {
    console.log(error);
  }
};
const initEuroLPContract = async () => {
  try {
    const contract = await new ethers.Contract(process.env.NEXT_PUBLIC_EURO_LP_TOKEN_ADDRESS, TokenisedAbi, provider);
    return contract;
  } catch (error) {
    console.log(error);
  }
};
const getLiquidity = async (address, symbol) => {
  const contract = await initRapidContract();
  const liq = await contract.getLiquidity(address, symbol);
  return formatHexToEther(liq);
};
const getInrTokenBalance = async (address) => {
  const contract = await initInrContract();
  const balance = await contract.balanceOf(address);
  return formatHexToEther(balance);
};
const getEuroTokenBalance = async (address) => {
  const contract = await initEuroContract();
  const balance = await contract.balanceOf(address);
  return formatHexToEther(balance);
};
const getFeeRewards = async (address, symbol) => {
  try{
    const contract = await initRapidContract();
  const reward = await contract.getLiquidityFeeAccruced(address, symbol);
  console.log("reward: ", reward);
  return formatHexToEther(reward.shareEarned);
  }catch(error){
    console.log(error)
  }
};
const suppliedLiquidity = async () => {
  const contract = await initRapidContract();
  const inrLiqAmount = await contract.getSuppliedLiquidity(process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_SYMBOL);
  const euroLiqAmount = await contract.getSuppliedLiquidity(process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_SYMBOL);
  return {
    inrSuppliedLiquidity: parseFloat(formatHexToEther(inrLiqAmount)).toFixed(2),
    euroSuppliedLiquidity: parseFloat(formatHexToEther(euroLiqAmount)).toFixed(2),
  };
};
const currentLiquidity = async () => {
  const inrContract = await initInrContract();
  const euroContract = await initEuroContract();

  const inrCurrentLiquidity = await inrContract.balanceOf(process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS);
  const euroCurrentLiquidity = await euroContract.balanceOf(process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS);

  return {
    inrCurrentLiquidity: parseFloat(formatHexToEther(inrCurrentLiquidity)).toFixed(2),
    euroCurrentLiquidity: parseFloat(formatHexToEther(euroCurrentLiquidity)).toFixed(2),
  };
};
const calculateFeeAndCashback = async (sourceAmount, sourceSymbol, destinationAmount, destinationSymbol) => {
  try {
    const rapidContract = await initRapidContract();
    const cashback = await rapidContract.calculateFeeAndCashback(sourceAmount, sourceSymbol, destinationAmount, destinationSymbol);
    return cashback
  } catch (error)
  {
    return error;
  }
}
module.exports = {
  initRapidContract: initRapidContract,
  getLiquidity: getLiquidity,
  getInrTokenBalance: getInrTokenBalance,
  getEuroTokenBalance: getEuroTokenBalance,
  getFeeRewards: getFeeRewards,
  EtherToWei: EtherToWei,
  WeiToEther: WeiToEther,
  formatHexToEther: formatHexToEther,
  initRapidContract: initRapidContract,
  initInrContract: initInrContract,
  initEuroContract: initEuroContract,
  initInrLPContract: initInrLPContract,
  initEuroLPContract: initEuroLPContract,
  suppliedLiquidity: suppliedLiquidity,
  currentLiquidity: currentLiquidity,
  calculateFeeAndCashback: calculateFeeAndCashback,
};
