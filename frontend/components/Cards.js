import React, { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import Table from "./Table";
import { ethers } from "ethers";
import axios from "axios";
import {
  getLiquidity,
  EtherToWei,
  initInrContract,
  initEuroContract,
  initRapidContract,
  getEuroTokenBalance,
  getInrTokenBalance,
  getFeeRewards,
  WeiToEther,
} from "../utility/web3";

import { showSuccess, showError, showWarning } from "../utility/notification";
import TxnDetail from "./TxnDetail";
import TxnHistory from "./TxnHistory";
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
const txnTableRows = ["Date", "Time", "Txn (IN/OUT)", "Amount", "Txn Hash"];
const liquidityTableRows = ["Token", "Supplied Liquidity", "Current Liquidity", "APR", "24H Trading Volume", "Utilisation"];
const txnList = [
  ["20, sept 2022", "10:30 AM", "Withdraw", "3000", "0xasjnjnd"],
  ["20, sept 2022", "10:30 AM", "Withdraw", "3000", "0xasjnjnd"],
];
const liquidityData = [
  ["INR_LP", "1000000", "100000", "0", "0", "10%"],
  ["INR_LP", "1000000", "100000", "0", "0", "10%"],
];
const Cards = ({ address, addLiquidityByAdmin }) => {
  const [selectedLiquidityCurrency, setSelectedLiquidityCurrency] = useState(liquidityCurrencyList[0]);
  const [selectedFiatCurrency, setSelectedFiatCurrency] = useState(fiatCurrencyList[0]);
  const [selectedRewardCurrency, setSelectedRewardCurrency] = useState(fiatCurrencyList[0]);
  const [fundAmount, setFundAmount] = useState(100);
  const [LiquidityAmount, setLiquidityAmount] = useState(100);
  const [InrLiquidity, setInrLiquidity] = useState(0);
  const [EuroLiquidity, setEuroLiquidity] = useState(0);
  const [InrTokenBalance, setInrTokenBalance] = useState(0);
  const [EuroTokenBalance, setEuroTokenBalance] = useState(0);
  const [InrFeeRewards, setInrFeeRewards] = useState(0);
  const [EuroFeeRewards, setEuroFeeRewards] = useState(0);
  const [LoadingState, setLoadingState] = useState(0);
  const [WithdrawLoadingState, setWithdrawLoadingState] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [TxnData, setTxnData] = useState({});

  const initEthers = async () => {
    if (typeof window !== "undefined") {
      //here `window` is available
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const accounts = await provider.send("eth_requestAccounts", []);
      console.log(accounts[0]);
      const signer = await provider.getSigner();
      console.log(signer);
    }
  };

  const web3Data = async () => {
    const inrliq = await getLiquidity(address, process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_SYMBOL);
    setInrLiquidity(inrliq);
    const euroliq = await getLiquidity(address, process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_SYMBOL);
    setEuroLiquidity(euroliq);

    const inrBalance = await getInrTokenBalance(address);
    setInrTokenBalance(inrBalance);

    const euroBalance = await getEuroTokenBalance(address);
    setEuroTokenBalance(euroBalance);

    if (euroliq > 0) {
      const euroFeeRewards = await getFeeRewards(address, process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_SYMBOL);
      setEuroFeeRewards(euroFeeRewards);
    }
    if (inrliq > 0) {
      const inrFeeRewards = await getFeeRewards(address, process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_SYMBOL);
      setInrFeeRewards(inrFeeRewards);
    }
  };
  const getBalances = async (address) => {
    if (!address) {
      return;
    }
    const url = `https://api.covalenthq.com/v1/80001/address/${address}/balances_v2/?quote-currency=USD&format=JSON&nft=false&no-nft-fetch=true&key=ckey_df949d9e4c8243c1bc8af71a415`;
    const response = await axios.get(url);
    const balances = response && response.data && response.data.data && response.data.data.items;
    console.log("balances: ", balances);
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
      getBalances(address);
      initEthers();
    }
  }, [address]);

  const addLiquidity = async () => {
    if (typeof window !== "undefined") {
      //here `window` is available
      try {
        if (selectedLiquidityCurrency.name == "INR" && parseInt(InrTokenBalance) < LiquidityAmount) {
          showWarning(`Low balance, Please Buy Some t${selectedLiquidityCurrency.name} Tokens`);
          return;
        }
        if (selectedLiquidityCurrency.name == "EURO" && parseInt(EuroTokenBalance) < LiquidityAmount) {
          showWarning(`Low balance, Please Buy Some t${selectedLiquidityCurrency.name} Tokens`);
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
        const contractWithSigner = await contract.connect(signer);
        console.log(contractWithSigner);

        const tx = await contractWithSigner.transfer(process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS, EtherToWei(LiquidityAmount.toString()));
        //console.log("tx:   ", tx);
        const receipt = tx && (await tx.wait());
        if (receipt) {
          console.log("receipt:  ", receipt);
          setLoadingState(2);
          const txdata = {
            amount: EtherToWei(LiquidityAmount.toString()),
            to: address,
            fiatSymbol: selectedLiquidityCurrency.symbol,
            lpSymbol: selectedLiquidityCurrency.lpSymbol,
            ratio: 1,
          };

          const res = await addLiquidityByAdmin(txdata);
          if (res) {
            console.log("response:  ", res);
            setTxnData({
              address: address,
              tokenSent: LiquidityAmount,
              sentHash: receipt.transactionHash,
              sendTokenSymbol: selectedLiquidityCurrency.name == "EURO" ? "tEuro" : "tInr",
              tokenReceived: LiquidityAmount,
              receivedTokenSymbol: selectedLiquidityCurrency.name == "EURO" ? "tEuroLP" : "tInrLP",
              receivedHash: res.data && res.data.transactionHash,
            });
            setShowModal(true);
            setLoadingState(0);
            showSuccess("Liquidity added successfully!");
            getBalances(address);
          }
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
      return;
    }
    if (selectedLiquidityCurrency.name === "INR" && LiquidityAmount > InrLiquidity) {
      showWarning("Not enough liquidity available");
      return;
    }
    if (typeof window !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        //console.log(accounts[0]);
        const signer = await provider.getSigner();
        //console.log(signer);
        var contract = await initRapidContract();

        const contractWithSigner = await contract.connect(signer);
        //console.log(contractWithSigner);
        const tx = await contractWithSigner.withdrawLiquidity(EtherToWei(LiquidityAmount.toString()), address, selectedLiquidityCurrency.symbol);
        //console.log("tx:   ", tx);
        const receipt = tx && (await tx.wait());
        console.log(receipt);
        if (receipt) {
          getBalances(address);
          showSuccess("Liquidity Withdraw Successfull!");
          setWithdrawLoadingState(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const addFunds = () => {
    console.log(selectedFiatCurrency);
    console.log(fundAmount);
  };
  const withdrawFunds = () => {
    console.log(selectedFiatCurrency);
    console.log(fundAmount);
  };

  return (
    <section className="text-white mt-10 font-mono">
      <TxnDetail showModal={showModal} setShowModal={setShowModal} txnData={TxnData} />
      <p className="text-4xl font-bold text-center mt-10">Liquidity Dashboard</p>
      <div className="flex justify-center my-10 md:my-10 ">
        <Table tableName={"Pool Stats"} tableHeaders={liquidityTableRows} tableData={liquidityData} />
      </div>
      {address && <p className="text-center">Wallet Address: {address}</p>}
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
                onClick={addFunds}
                type="button"
                className="px-5 mr-2 lg:px-12 py-2 font-bold rounded-lg bg-green-500 hover:bg-green-600 text-white"
              >
                Add Funds
              </button>
              <button onClick={withdrawFunds} type="button" className="px-5 py-2 font-bold rounded-lg bg-rose-500 hover:bg-rose-600 text-white">
                Withdraw Funds
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
                {LoadingState == 0 ? "Add Liquidity" : LoadingState == 1 ? "Sending Txn..." : LoadingState == 2 && "Sending LP Tokens..."}
              </button>
              <button
                onClick={() => withdrawLiquidity()}
                type="button"
                className="px-5 py-2 font-bold rounded-lg bg-rose-500 hover:bg-rose-600 text-white"
              >
                {WithdrawLoadingState ? "Withdrawing ...." : " Withdraw Liquidity"}
              </button>
            </div>
          </div>
        </div>

        {/* reward stats */}
        <div className="card border-2 border-gray-700 bg-gray-900 rounded-lg h-full w-full md:w-[71%] mt-10 mx-2">
          <div className="card-header border-b-2 border-gray-700 flex justify-center items-center py-5 font-bold">REWARD STATS</div>
          <div className="card-body flex flex-col justify-center items-center h-5/6 px-5">
            <div className="flex justify-between items-center w-full py-2 mt-2">
              <p>INRLP Rewards</p>
              <p>{InrFeeRewards} INRLP</p>
            </div>
            <div className="flex justify-between items-center w-full py-2 mt-2">
              <p>EUROLP Rewards</p>
              <p>{EuroFeeRewards} EUROLP</p>
            </div>
            <div className="flex justify-between items-center w-full py-2">
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
            </div>

            <div className="flex justify-center items-center w-full py-2 mb-2">
              <button type="button" className="px-5 py-2 font-bold rounded-lg bg-rose-500 hover:bg-rose-600 text-white">
                Withdraw REWARDS
              </button>
            </div>
          </div>
        </div>
      </div>
      <TxnHistory address={address} txnList={txnList} />
    </section>
  );
};

export default Cards;
