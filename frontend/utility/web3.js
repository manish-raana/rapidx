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
  return ethers.utils.formatEther(balance);
};
const EtherToWei = (balance) => {
  return ethers.utils.parseEther(balance);
};
const WeiToEther = (balance) => {
  return parseInt(ethers.utils.formatUnits(balance, 18));
};
/* const data = async () => {
  const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com/");
  balance = await provider.getBalance("0x38805F72EbcAfB924e8b5cED9F8D575Fe8039E0e");

  console.log(formatHexToEther(balance));
}; */

const initRapidContract = async () => {
  const contract = await new ethers.Contract(process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS, RapidAbi, provider);
  return contract;
};
const initInrContract = async () => {
  const contract = await new ethers.Contract(process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_ADDRESS, TokenisedAbi, provider);
  return contract;
};
const initEuroContract = async () => {
  const contract = await new ethers.Contract(process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_ADDRESS, TokenisedAbi, provider);
  return contract;
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
  const contract = await initRapidContract();
  const reward = await contract.getLiquidityFeeAccruced(address, symbol);
  return formatHexToEther(reward);
};

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
};
