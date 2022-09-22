import React, { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import Table from "./Table";
import { ethers } from "ethers";
import { Circles } from "react-loading-icons";
import axios from "axios";
import {
  getLiquidity,
  EtherToWei,
  initInrContract,
  initEuroContract,
  initRapidContract,
  initEuroLPContract,
  initInrLPContract,
  getEuroTokenBalance,
  getInrTokenBalance,
  getFeeRewards,
  WeiToEther,
  formatHexToEther,
} from "../utility/web3";
import moment from "moment";
import { showSuccess, showError, showWarning } from "../utility/notification";
import { getContractTxns } from "../utility/txns";
import TxnDetail from "./TxnDetail";
import TxnHistory from "./TxnHistory";
import FundsModal from "./FundsModal";
const fiatCurrencyList = [
  { id: 1, name: "INR", symbol: process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_SYMBOL, lpSymbol: process.env.NEXT_PUBLIC_INR_LP_TOKEN_SYMBOL },
  { id: 2, name: "EURO", symbol: process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_SYMBOL, lpSymbol: process.env.NEXT_PUBLIC_EURO_LP_TOKEN_SYMBOL },
];
const liquidityCurrencyList = [
  {
    id: 1,
    name: "INR",
    symbol: process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_SYMBOL,
    lpSymbol: process.env.NEXT_PUBLIC_INR_LP_TOKEN_SYMBOL,
    contractAddress: process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_ADDRESS,
  },
  {
    id: 2,
    name: "EURO",
    symbol: process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_SYMBOL,
    lpSymbol: process.env.NEXT_PUBLIC_EURO_LP_TOKEN_SYMBOL,
    contractAddress: process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_ADDRESS,
  },
];

const liquidityTableRows = ["Token", "Supplied Liquidity", "Current Liquidity", "APR", "24H Trading Volume", "Utilisation"];

const Cards = ({ address, addLiquidityByAdmin, addFundsByAdmin }) => {
  const [selectedLiquidityCurrency, setSelectedLiquidityCurrency] = useState(liquidityCurrencyList[0]);
  const [selectedFiatCurrency, setSelectedFiatCurrency] = useState(fiatCurrencyList[0]);
  const [selectedRewardCurrency, setSelectedRewardCurrency] = useState(fiatCurrencyList[0]);
  const [fundAmount, setFundAmount] = useState(100);
  const [LiquidityAmount, setLiquidityAmount] = useState(100);
  const [InrLiquidity, setInrLiquidity] = useState(0);
  const [EuroLiquidity, setEuroLiquidity] = useState(0);
  const [EuroVolume, setEuroVolume] = useState(0);
  const [EuroUtilisation, setEuroUtilisation] = useState(0);
  const [InrUtilisation, setInrUtilisation] = useState(0);
  const [InrVolume, setInrVolume] = useState(0);
  const [InrTokenBalance, setInrTokenBalance] = useState(0);
  const [EuroTokenBalance, setEuroTokenBalance] = useState(0);
  const [InrFeeRewards, setInrFeeRewards] = useState({reward:0,share:0});
  const [EuroFeeRewards, setEuroFeeRewards] = useState({reward:0,share:0});
  const [LoadingState, setLoadingState] = useState(0);
  const [WithdrawLoadingState, setWithdrawLoadingState] = useState(false);
  const [FundWithdrawLoadingState, setFundWithdrawLoadingState] = useState(false);
  const [AddFundsLoadingState, setAddFundsLoadingState] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [TxnList, setTxnList] = useState([]);
  const [TxnData, setTxnData] = useState({});
  const [IsFundsModal, setIsFundsModal] = useState(false);

  const sortFunction = (a, b) => {
    var dateA = new Date(a.block_signed_at).getTime();
    var dateB = new Date(b.block_signed_at).getTime();
    return dateA > dateB ? 1 : -1;
  };

  const web3Data = async () => {
    const inrliq = await getLiquidity(address, process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_SYMBOL);
    setInrLiquidity(parseInt(inrliq));
    const euroliq = await getLiquidity(address, process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_SYMBOL);
    setEuroLiquidity(parseInt(euroliq));

    const inrBalance = await getInrTokenBalance(address);
    setInrTokenBalance(parseInt(inrBalance));

    const euroBalance = await getEuroTokenBalance(address);
    setEuroTokenBalance(parseInt(euroBalance));

    if (euroliq > 0) {
      const euroFeeRewards = await getFeeRewards(address, process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_SYMBOL);
      console.log('euroFeeRewards: ',euroFeeRewards);
      setEuroFeeRewards({
        reward:euroFeeRewards.reward,
        share:euroFeeRewards.share
      });
    }
    if (inrliq > 0) {
      const inrFeeRewards = await getFeeRewards(address, process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_SYMBOL);
      console.log('inrFeeRewards: ',inrFeeRewards);
      setInrFeeRewards({
        reward:inrFeeRewards.reward,
        share:inrFeeRewards.share
      });
    }
  };
  const getBalances = async (address) => {
    if (!address) {
      return;
    }
    const url = `https://api.covalenthq.com/v1/80001/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=true&key=ckey_df949d9e4c8243c1bc8af71a415`;
    const response = await axios.get(url);
    const balances = response && response.data && response.data.data && response.data.data.items;
    //console.log("balances: ", balances);
    const inrFiatData = balances.find((item) => item.contract_address.toLowerCase() === process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_ADDRESS.toLowerCase());
    inrFiatData && setInrTokenBalance(WeiToEther(inrFiatData.balance));
    const euroFiatData = balances.find(
      (item) => item.contract_address.toLowerCase() === process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_ADDRESS.toLowerCase()
    );
    euroFiatData && setEuroTokenBalance(WeiToEther(euroFiatData.balance));

    const inrLPData = balances.find((item) => item.contract_address.toLowerCase() === process.env.NEXT_PUBLIC_INR_LP_TOKEN_ADDRESS.toLowerCase());
    inrLPData && setInrLiquidity(WeiToEther(inrLPData.balance));
    const euroLPData = balances.find((item) => item.contract_address.toLowerCase() === process.env.NEXT_PUBLIC_EURO_LP_TOKEN_ADDRESS.toLowerCase());
    euroLPData && setEuroLiquidity(WeiToEther(euroLPData.balance));
  };

  useEffect(() => {
    if (address) {
      web3Data();

      //getBalances(address);
      fetchTransactionHistory(address);
    }
  }, [address]);

  const isAllowance = () => {
    
   }
  const addLiquidity = async () => {
    if (typeof window !== "undefined") {
      //here `window` is available
      try
      {
        /*  if (!InrIsApproved || !EuroIsApproved)
        { 
          showWarning(`Please aprrove to add liquidity`);
          setLoadingState(0);
          return;
        } */
        if (selectedLiquidityCurrency.name == "INR" && parseInt(InrTokenBalance) < LiquidityAmount) {
          showWarning(`Low balance, Please Buy Some t${selectedLiquidityCurrency.name} Tokens`);
          setLoadingState(0);
          return;
        }
        if (selectedLiquidityCurrency.name == "EURO" && parseInt(EuroTokenBalance) < LiquidityAmount) {
          showWarning(`Low balance, Please Buy Some t${selectedLiquidityCurrency.name} Tokens`);
          setLoadingState(0);
          return;
        }
        setLoadingState(1);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        //console.log(accounts[0]);
        const signer = await provider.getSigner();
        //console.log(signer);
        var contract;
        if (selectedLiquidityCurrency.name == "EURO") {
          contract = await initEuroContract();
        } else if (selectedLiquidityCurrency.name == "INR") {
          contract = await initInrContract();
        }
        const allowance = await contract.allowance(accounts[0], process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS);
        console.log("allowance:   ", formatHexToEther(allowance));

        /* if (parseInt(formatHexToEther(allowance)) < LiquidityAmount) {
          showWarning(`Your have allowance of ${formatHexToEther(allowance)} t${selectedLiquidityCurrency.name} Tokens. Please select a lower value`);
          setLoadingState(0);
          return;
        } */
        
        const contractWithSigner = await contract.connect(signer);
        console.log(contractWithSigner);
        const txApprove = await contractWithSigner.approve(process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS, EtherToWei(LiquidityAmount.toString()));
        //console.log("tx:   ", tx);
        const receiptApprove = txApprove && (await txApprove.wait());
        if (receiptApprove) {
          console.log("approve-receipt:  ", receiptApprove);
        }
         
        const rapidContract = await initRapidContract();
        const rapidContractWithSigner = await rapidContract.connect(signer);

        const tx = await rapidContractWithSigner.addLiquidity(
          EtherToWei(LiquidityAmount.toString()),
          address,
          selectedLiquidityCurrency.symbol,
          selectedLiquidityCurrency.lpSymbol,
          process.env.NEXT_PUBLIC_FEE_RATIO
        );
        console.log("tx:   ", tx);
        const receipt = tx && (await tx.wait());
        if (receipt) {
          console.log("receipt:  ", receipt);
          setLoadingState(0);
          web3Data();
           fetchTransactionHistory(accounts[0]);
        }
      } catch (error) {
        setLoadingState(0);
        showError("Transaction Failed! ");
        console.log(error);
      }
    }
  };
  const withdrawLiquidity = async () => {
    console.log(selectedLiquidityCurrency);
    console.log(LiquidityAmount);
    setWithdrawLoadingState(true);
    if (selectedLiquidityCurrency.name === "EURO" && LiquidityAmount > EuroLiquidity) {
      showWarning("Not enough liquidity available");
      setWithdrawLoadingState(false);
      return;
    }
    if (selectedLiquidityCurrency.name === "INR" && LiquidityAmount > InrLiquidity) {
      showWarning("Not enough liquidity available");
      setWithdrawLoadingState(false);
      return;
    }
    if (typeof window !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        //console.log(accounts[0]);
        const signer = await provider.getSigner();
        //console.log(signer);
        var contract;
        if (selectedLiquidityCurrency.name == "EURO") {
          contract = await initEuroLPContract();
        } else if (selectedLiquidityCurrency.name == "INR") {
          contract = await initInrLPContract();
        }
        /* const allowance = await contract.allowance(accounts[0], process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS);
        console.log("allowance:   ", formatHexToEther(allowance));
 */
        /* if (parseInt(formatHexToEther(allowance)) < LiquidityAmount) {
          showWarning(`Your have allowance of ${formatHexToEther(allowance)} t${selectedLiquidityCurrency.name} Tokens. Please select a lower value`);
          setLoadingState(0);
          return;
        } */

        const contractWithSigner = await contract.connect(signer);
        console.log(contractWithSigner);
        const txApprove = await contractWithSigner.approve(process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS, EtherToWei(LiquidityAmount.toString()));
        //console.log("tx:   ", tx);
        const receiptApprove = txApprove && (await txApprove.wait());
        if (receiptApprove) {
          console.log("approve-receipt:  ", receiptApprove);
        }

        const rapidContract = await initRapidContract();
        const rapidContractWithSigner = await rapidContract.connect(signer);
        const tx = await rapidContractWithSigner.withdrawLiquidity(
          EtherToWei(LiquidityAmount.toString()),
          accounts[0],
          selectedLiquidityCurrency.symbol,
          selectedLiquidityCurrency.lpSymbol,
        );
        console.log("tx:   ", tx);
        const receipt = tx && (await tx.wait());
        if (receipt) {
          console.log("receipt:  ", receipt);
          setWithdrawLoadingState(false);
          web3Data();
          fetchTransactionHistory(accounts[0]);
        }
      } catch (error) {
        console.log(error);
        setWithdrawLoadingState(false);
      }
    }
  };
  const addFunds = async () => {
    //console.log(selectedFiatCurrency);
    // console.log(fundAmount);
    setAddFundsLoadingState(true);
    const res = await addFundsByAdmin({
      currency: selectedFiatCurrency.name,
      toAddress: address,
      amount: EtherToWei(fundAmount.toString()),
    });
    //console.log("txn-response: ", res);
    if (res) {
      web3Data();
      showSuccess("Funds added successfully!");
      setAddFundsLoadingState(false);
    }
  };
  const withdrawFunds = async () => {
    // console.log(selectedFiatCurrency);
    // console.log(fundAmount);

    setFundWithdrawLoadingState(true);
    if (selectedFiatCurrency.name === "INR" && fundAmount > InrTokenBalance) {
      showWarning("Not enough funds available");
      setFundWithdrawLoadingState(false);
      return;
    }
    if (selectedFiatCurrency.name === "EURO" && fundAmount > EuroTokenBalance) {
      showWarning("Not enough funds available");
      setFundWithdrawLoadingState(false);
      return;
    }
    if (typeof window !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        //console.log(accounts[0]);
        const signer = await provider.getSigner();
        //console.log(signer);
        var contract;
        if (selectedFiatCurrency.name === "EURO") {
          contract = await initEuroContract();
        }
        if (selectedFiatCurrency.name === "INR") {
          contract = await initInrContract();
        }

        const contractWithSigner = await contract.connect(signer);
        //console.log(contractWithSigner);
        const tx = await contractWithSigner.transfer(process.env.NEXT_PUBLIC_ADMIN_ADDRESS, EtherToWei(fundAmount.toString()));
        //console.log("tx:   ", tx);
        const receipt = tx && (await tx.wait());
        //console.log(receipt);
        if (receipt) {
          web3Data();
          showSuccess("Funds Withdrawn Successfully!");
          setFundWithdrawLoadingState(false);
        }
      } catch (error) {
        console.log(error);
        setFundWithdrawLoadingState(false);
      }
    }
  };
  const fetchTransactionHistory = async (address) => {
    if (!address) {
      return;
    }
    try {
      let inrFiat = `https://api.covalenthq.com/v1/80001/address/${address}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_ADDRESS}&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
      let euroFiat = `https://api.covalenthq.com/v1/80001/address/${address}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_ADDRESS}&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
      let inrLP = `https://api.covalenthq.com/v1/80001/address/${address}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${process.env.NEXT_PUBLIC_INR_LP_TOKEN_ADDRESS}&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
      let euroLP = `https://api.covalenthq.com/v1/80001/address/${address}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${process.env.NEXT_PUBLIC_EURO_LP_TOKEN_ADDRESS}&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
      let rapidContract = `https://api.covalenthq.com/v1/80001/address/${address}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS}&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;

      const requestOne = axios.get(inrFiat);
      const requestTwo = axios.get(euroFiat);
      const requestThree = axios.get(inrLP);
      const requestFour = axios.get(euroLP);
      const requestFive = axios.get(rapidContract);
      await axios
        .all([requestOne, requestTwo, requestThree, requestFour, requestFive])
        .then(
          axios.spread(async (...responses) => {
            const responseOne = responses[0];
            const responseTwo = responses[1];
            const responseThree = responses[2];
            const responseFour = responses[3];
            const responseFive = responses[4];
            //console.log('rapid:  ',responseFive)
            const data = [
              ...responseOne.data.data.items,
              ...responseTwo.data.data.items,
              ...responseThree.data.data.items,
              ...responseFour.data.data.items,
              ...responseFive.data.data.items,
            ];
            //console.log("data:  ", data);
            const transfers = await data.map((item) => item.transfers[0]);

            transfers = transfers.filter((item) => parseInt(item.delta) > 0);
            transfers.sort(sortFunction);
            //console.log("transfers: ", transfers);
            setTxnList(transfers.reverse());
          })
        )
        .catch((errors) => {
          // react on errors.
        });

      //console.log(transfers);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchContractTxns = async () => {
    const inrTransfers = [];
    const euroTransfers = [];
    const inrtxns = await getContractTxns(
      process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS,
      process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_ADDRESS,
      process.env.NEXT_PUBLIC_COVALENT_API_KEY
    );
    const inrLPtxns = await getContractTxns(
      process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS,
      process.env.NEXT_PUBLIC_INR_LP_TOKEN_ADDRESS,
      process.env.NEXT_PUBLIC_COVALENT_API_KEY
    );
    const eurotxns = await getContractTxns(
      process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS,
      process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_ADDRESS,
      process.env.NEXT_PUBLIC_COVALENT_API_KEY
    );
    const euroLPtxns = await getContractTxns(
      process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS,
      process.env.NEXT_PUBLIC_EURO_LP_TOKEN_ADDRESS,
      process.env.NEXT_PUBLIC_COVALENT_API_KEY
    );

    //console.log('inr-txns:  ', inrtxns);
   //console.log('inr-LP-txns:  ', inrLPtxns);
    
    inrtxns.forEach((item) => { 
      const data = inrLPtxns.find((itemlp) => itemlp.tx_hash == item.tx_hash);
      if(!data){
        //console.log(item)
        inrTransfers.push(...item.transfers);
      }
    })
    //console.log("inrTransfers:  ", inrTransfers);
    if(inrTransfers.length > 0){
      inrTransfers = await inrTransfers.filter(
        (item) =>
          item["to_address"].toLowerCase() != process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS.toLowerCase() ||
          item["from_address"].toLowerCase() != process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS.toLowerCase()
      );
      const inrVolume = inrTransfers.map((item) => parseFloat(WeiToEther(item.delta))).reduce((prev, next) => prev + next, 0);
      //console.log('inr-volume: ', inrVolume)
      setInrVolume(inrVolume)

      const inrUtilisationArray = inrTransfers.filter((item) => item.transfer_type === 'OUT');
      if (inrUtilisationArray && inrUtilisationArray.length > 0)
      { 
       
        const inrUtilisation = inrUtilisationArray.map((item) => parseFloat(WeiToEther(item.delta))).reduce((prev, next) => prev + next, 0);
        setInrUtilisation(inrUtilisation);
      }
    }

    // euro Transaction only 
    eurotxns.forEach((item) => { 
      const data = euroLPtxns.find((itemlp) => itemlp.tx_hash == item.tx_hash);
      if(!data){
        //console.log(item)
        euroTransfers.push(...item.transfers);
      }
    })
    //console.log("inrTransfers:  ", inrTransfers);
    if (euroTransfers.length > 0)
    {
     
       /* euroTransfers = await euroTransfers.filter(
         (item) =>
           item["to_address"] != process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS.toLowerCase()
       ); */
       
      const euroVolume = euroTransfers.map((item) => parseFloat(WeiToEther(item.delta))).reduce((prev, next) => prev + next, 0);
      console.log("euroTransfers: ", euroTransfers);
      setEuroVolume(euroVolume)

      const euroUtilisationArray = euroTransfers.filter((item) => item.transfer_type === 'OUT');
      if (euroUtilisationArray && euroUtilisationArray.length > 0)
      {  console.log("euroUtilisationArray: ", euroUtilisationArray);
        const euroUtilisation = euroUtilisationArray.map((item) => parseFloat(WeiToEther(item.delta))).reduce((prev, next) => prev + next, 0);
        setEuroUtilisation(euroUtilisation);
        console.log("EuroUtilisation:  ", euroUtilisation);
      }
    }
  
  };
  return (
    <section className="text-white mt-10 font-mono">
      <FundsModal
        IsFundsModal={IsFundsModal}
        setIsFundsModal={setIsFundsModal}
        fundAmount={fundAmount}
        fundCurrency={selectedFiatCurrency}
        addFunds={addFunds}
        AddFundsLoadingState={AddFundsLoadingState}
      />
      <TxnDetail showModal={showModal} setShowModal={setShowModal} txnData={TxnData} />
      <p className="text-4xl font-bold text-center mt-10">Liquidity Dashboard</p>
      <div className="flex justify-center my-10 md:my-10 ">
        <Table
          tableName={"Pool Stats"}
          tableHeaders={liquidityTableRows}
          euroVolume={EuroVolume}
          inrVolume={InrVolume}
          EuroUtilisation={EuroUtilisation}
          InrUtilisation={InrUtilisation}
          fetchContractTxns={fetchContractTxns}
        />
      </div>
      {address && (
        <div className="text-center text-xs md:text-lg">
          <p>Wallet Address</p> <p>{address}</p>
        </div>
      )}
      <div className="flex flex-wrap justify-center items-center">
        {/* token fiat stats */}
        <div className="card border-2 border-gray-700 bg-gray-900 rounded-lg h-full w-full md:w-[45%] lg:w-[35%] m-2">
          <div className="card-header border-b-2 border-gray-700 flex justify-center items-center py-5 font-bold">WALLET STATS</div>
          <div className="card-body flex flex-col justify-center items-center h-5/6 px-5">
            <div className="flex justify-between items-center w-full py-2 mt-2">
              <p>INR Balance</p>
              <p>{InrTokenBalance} tINR</p>
            </div>
            <div className="flex justify-between items-center w-full py-2 mt-2">
              <p>EURO Balance</p>
              <p>{EuroTokenBalance} tEURO</p>
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <p>Select Currency</p>
              <Listbox value={selectedFiatCurrency} onChange={setSelectedFiatCurrency}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative  cursor-pointer rounded-lg bg-gray-800 py-2 pl-3 pr-9 text-left shadow-lg  sm:text-sm">
                    <span className="block text-white font-bold text-center w-24">{selectedFiatCurrency.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {fiatCurrencyList.map((currency, currencyIdx) => (
                        <Listbox.Option
                          key={currencyIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-amber-100 text-amber-900" : "text-gray-900"}`
                          }
                          value={currency}
                        >
                          {({ selectedFiatCurrency }) => (
                            <>
                              <span className={`block truncate ${selectedFiatCurrency ? "font-medium" : "font-normal"}`}>{currency.name}</span>
                              {selectedFiatCurrency ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            <div className="flex justify-between w-full py-2">
              <p>Enter Amount</p>
              <input
                onChange={(e) => setFundAmount(e.target.value)}
                min={0}
                type="number"
                defaultValue={fundAmount}
                className="bg-gray-800 text-center rounded-lg px-2 py-2 w-36"
              />
            </div>
            <div className="flex justify-between items-center w-full py-2 mb-2">
              <button
                onClick={() => setIsFundsModal(true)}
                type="button"
                className="px-5 mr-2 lg:px-12 py-2 font-bold rounded-lg bg-green-500 hover:bg-green-600 text-white"
              >
                Add Funds
              </button>
              <button onClick={withdrawFunds} type="button" className="px-5 py-2 font-bold rounded-lg bg-rose-500 hover:bg-rose-600 text-white">
                {!FundWithdrawLoadingState ? (
                  "  Withdraw Funds"
                ) : (
                  <span className="flex text-white items-center justify-center">
                    Withdrawing Funds <Circles className="w-8 h-8 p-0 m-0 mx-5" />
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Liquidity stats */}
        <div className="card border-2 border-gray-700 bg-gray-900 rounded-lg h-full w-full md:w-[45%] lg:w-[35%] m-2">
          <div className="card-header border-b-2 border-gray-700 flex justify-center items-center py-5 font-bold">LIQUIDITY STATS</div>
          <div className="card-body flex flex-col justify-center items-center h-5/6 px-5">
            <div className="flex justify-between items-center w-full py-2 mt-2">
              <p>INR Liquidity</p>
              <p>{InrLiquidity} tINRLP</p>
            </div>
            <div className="flex justify-between items-center w-full py-2 mt-2">
              <p>EURO Liquidity</p>
              <p>{EuroLiquidity} tEUROLP</p>
            </div>
            <div className="flex justify-between items-center w-full py-2">
              <p>Select Currency</p>
              <Listbox value={selectedLiquidityCurrency} onChange={setSelectedLiquidityCurrency}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative  cursor-pointer rounded-lg bg-gray-800 py-2 pl-3 pr-9 text-left shadow-lg  sm:text-sm">
                    <span className="block text-white font-bold text-center w-24">{selectedLiquidityCurrency.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {liquidityCurrencyList.map((currency, currencyIdx) => (
                        <Listbox.Option
                          key={currencyIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-amber-100 text-amber-900" : "text-gray-900"}`
                          }
                          value={currency}
                        >
                          {({ selectedLiquidityCurrency }) => (
                            <>
                              <span className={`block truncate ${selectedLiquidityCurrency ? "font-medium" : "font-normal"}`}>{currency.name}</span>
                              {selectedLiquidityCurrency ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
            <div className="flex justify-between w-full py-2">
              <p>Enter Amount</p>
              <input
                onChange={(e) => setLiquidityAmount(e.target.value)}
                min={0}
                type="number"
                defaultValue={LiquidityAmount}
                className="bg-gray-800 text-center rounded-lg px-2 py-2 w-36"
              />
            </div>
            <div className="flex justify-between items-center w-full py-2 mb-2">
              <button
                onClick={addLiquidity}
                type="button"
                className="px-5 mr-2 lg:px-12 py-2 font-bold rounded-lg bg-green-500 hover:bg-green-600 text-white"
              >
                {LoadingState == 0
                  ? "Add Liquidity"
                  : LoadingState == 1 && (
                      <span className="flex text-white items-center justify-center">
                        Adding Liquidity <Circles className="w-8 h-8 p-0 m-0 mx-5" />
                      </span>
                    )}
              </button>
              <button
                onClick={() => withdrawLiquidity()}
                type="button"
                className="px-5 py-2 font-bold rounded-lg bg-rose-500 hover:bg-rose-600 text-white"
              >
                {WithdrawLoadingState ? (
                  <span className="flex text-white items-center justify-center">
                    Withdrawing Liquidity <Circles className="w-8 h-8 p-0 m-0 mx-5" />
                  </span>
                ) : (
                  " Withdraw Liquidity"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* reward stats */}
        <div className="card border-2 border-gray-700 bg-gray-900 rounded-lg h-full w-full md:w-[71%] mt-10 mx-2">
          <div className="card-header border-b-2 border-gray-700 flex justify-center items-center py-5 font-bold">REWARD STATS</div>
          <div className="card-body flex flex-col justify-center items-center h-5/6 px-5">
            <div className="text-orange-500 font-bold flex w-full justify-between mt-5">
              <p></p>
              <p className="ml-12">Fee Rewards</p>
              <p className="mr-2">Share</p>
            </div>
            <div className="flex justify-between items-center w-full py-2 mt-2">
              <p>INRLP Rewards</p>
              <p>{ (InrFeeRewards.reward * 1).toPrecision(3)}  tINR</p>
              <p>{(InrFeeRewards.share * 100).toPrecision(3)}  %</p>
            </div>
            <div className="flex justify-between items-center w-full py-2 mt-2">
              <p>EUROLP Rewards</p>
              <p>{ (EuroFeeRewards.reward * 1).toPrecision(3)}  tEURO</p>
              <p>{(EuroFeeRewards.share * 100).toPrecision(3)}  %</p>
            </div>
            {/* <div className="flex justify-between items-center w-full py-2">
              <p>Select Currency</p>
              <Listbox value={selectedRewardCurrency} onChange={setSelectedRewardCurrency}>
                <div className="relative mt-1">
                  <Listbox.Button className="relative  cursor-pointer rounded-lg bg-gray-800 py-2 pl-3 pr-9 text-left shadow-lg  sm:text-sm">
                    <span className="block text-white font-bold text-center w-24">{selectedRewardCurrency.name}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {fiatCurrencyList.map((currency, currencyIdx) => (
                        <Listbox.Option
                          key={currencyIdx}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? "bg-amber-100 text-amber-900" : "text-gray-900"}`
                          }
                          value={currency}
                        >
                          {({ selectedRewardCurrency }) => (
                            <>
                              <span className={`block truncate ${selectedRewardCurrency ? "font-medium" : "font-normal"}`}>{currency.name}</span>
                              {selectedRewardCurrency ? (
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div> */}

            {/* <div className="flex justify-center items-center w-full py-2 mb-2">
              <button type="button" className="px-5 py-2 font-bold rounded-lg bg-rose-500 hover:bg-rose-600 text-white">
                Withdraw REWARDS
              </button>
            </div> */}
          </div>
        </div>
      </div>
      <TxnHistory address={address} txnList={TxnList} />
    </section>
  );
};

export default Cards;
