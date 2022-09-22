import React from 'react'
import { getEuroTokenBalance,WeiToEther,initEuroContract,EtherToWei } from "../utility/web3";
import { useEffect,useState } from 'react';
import axios from 'axios';
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { signIn, getSession, signOut } from "next-auth/react";
import Moment from "moment";
import { ethers } from "ethers";
import Link from 'next/link';
import { Circles } from "react-loading-icons";
import ProfileModal from '../components/ProfileModal'
import BankModal from '../components/BankModal'
import { showError, showSuccess, showWarning } from '../utility/notification'

const Merchant = ({user}) => {

    const [Balance, setBalance] = useState(0);
  const [TxnList, setTxnList] = useState([])
  const [Address, setAddress] = useState("");
    const [IsProfileModal, setIsProfileModal] = useState(false);
    const [IsBankModal, setIsBankModal] = useState(false);
    const [FundWithdrawLoadingState, setFundWithdrawLoadingState] = useState(false);
  const [TransactionHash, setTransactionHash] = useState(undefined);
 
   
    const [LoggedIn, setLoggedIn] = useState(user ? true : false);
    const [IsLoading, setIsLoading] = useState(false);
    const getTransactions = async (address) => { 
       const url = `${process.env.NEXT_PUBLIC_COVALENT_BASE_URL}/address/${address}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_ADDRESS}&key=${process.env.NEXT_PUBLIC_COVALENT_API_KEY}`;
        const response = await axios.get(url);
        if (response && response.data && response.data.data)
        { 
            const txnObject = response.data.data.items;
            const txnList = [];
            await txnObject.forEach(item => { 
                txnList.push(...item.transfers);
            });
            if (txnList.length > TxnList.length)
            {
                setTxnList(txnList);
            }
        }
        console.log(response)
    }
    const fetchBalance = async(address) => { 
        const balance = await getEuroTokenBalance(address);
        //console.log(balance)
        if(balance !== Balance){
            setBalance(balance)
        }
    }
    const formatDate = (date) => {
      return Moment(date).format("DD-MM-YYYY");
    };
    const formatTime = (date) => {
      return Moment(date).format("hh:mm:ss A");
    };
  
  const handleWithdraw = async (amount) => {
    //console.log(amount)
    //console.log(Balance)
    if (parseFloat(amount) > parseFloat(Balance))
    { 
      showWarning('Low Balance, Please select a lower amount!')
      return;
    }
    if (typeof window !== "undefined") {
      try
      {
        setFundWithdrawLoadingState(true);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        console.log('accounts: ',accounts[0]);
        //setAddress(accounts[0]);
        const signer = await provider.getSigner();
        console.log('signer: ',signer);
        var contract = await initEuroContract();
      
        const contractWithSigner = await contract.connect(signer);
        console.log('contractWithSigner:  ',contractWithSigner);
        const tx = await contractWithSigner.transfer(process.env.NEXT_PUBLIC_ADMIN_ADDRESS, EtherToWei(amount));
        console.log("tx:   ", tx);
        const receipt = tx && (await tx.wait());
        console.log(receipt);
        if (receipt) {
          setTransactionHash(receipt.transactionHash)
          showSuccess("Transaction Successfull!");
          setFundWithdrawLoadingState(false);
        }
      } catch (error) {
        console.log(error);
        showError('Error Occured!');
        setFundWithdrawLoadingState(false);
      }
    }
  };
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
const handleAuth = async () => {
  setIsLoading(true);
  try {
    if (isConnected) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({ connector: new MetaMaskConnector() });

    const userData = { address: account, chain: chain.id, network: "evm" };

    const { data } = await axios.post("/api/auth/request-message", userData, {
      headers: {
        "content-type": "application/json",
      },
    });

    const message = data.message;

    const signature = await signMessageAsync({ message });

    // redirect user after success authentication to '/user' page
    const { url } = await signIn("credentials", { message, signature, redirect: false, callbackUrl: "/user" });
    if (url) {
      setAddress(userData.address);
      fetchBalance(userData.address);
      getTransactions(userData.address);
      showSuccess("Authentication Successfull");
      setLoggedIn(true);
    }
    //console.log(url);

    /**
     * instead of using signIn(..., redirect: "/user")
     * we get the url from callback and push it to the router to avoid page refreshing
     */
    //push(url);
    setIsLoading(false);
  } catch (error) {
    //console.log("error: ", error);
    showError(`Authentication Failed!`);
    setIsLoading(false);
  }
};
const handleSignOut = () => {
  setLoggedIn(false);
  signOut({ redirect: "/liquidity" });
};
  useEffect(() => {
    if (user) {
      //console.log(user);
      setInterval(() => {
         fetchBalance(user.user.address);
         getTransactions(user.user.address);
         setLoggedIn(true);
        setAddress(user.user.address);
       
      }, 3000);
    }
  }, [user]);

  return (
    <>
      <ProfileModal IsProfileModal={IsProfileModal} setIsProfileModal={setIsProfileModal} handleSignOut={handleSignOut} />
      <BankModal
        IsBankModal={IsBankModal}
        setIsBankModal={setIsBankModal}
        handleWithdraw={handleWithdraw}
        FundWithdrawLoadingState={FundWithdrawLoadingState}
        TransactionHash={TransactionHash}
      />
      <header className="flex justify-between border-gray-700 backdrop-blur-0 items-center border-b px-10 py-2">
        <div className="text-center cursor-pointer">
          <span className="text-5xl font-bold pt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            <Link href="/">RapidX</Link>
          </span>
          <p className="text-gray-400 text-sm ">Payments Made Easy</p>
        </div>

        <div className="text-white flex cursor-pointer">
          {!LoggedIn ? (
            <button
              className="flex px-5 py-2 rounded md:rounded-lg bg-green-500 hover:bg-green-600 font-bold text-slate-900"
              onClick={() => handleAuth()}
            >
              {!IsLoading ? (
                "LOGIN"
              ) : (
                <span className="flex text-white items-center justify-center">
                  Connecting <Circles className="w-8 h-8 p-0 m-0 mx-5" />
                </span>
              )}
            </button>
          ) : (
            <div className="flex items-center">
              <svg
                onClick={() => setIsProfileModal(true)}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <button className="ml-5 px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 font-bold text-slate-900" onClick={() => handleSignOut()}>
                LOGOUT
              </button>
            </div>
          )}
        </div>
      </header>
      {Address ? (
        <div className="w-full h-screen flex items-center flex-col text-white mt-20 bg-center">
          <div>
            <div className="flex justify-center items-center">
              <div className="text-2xl font-bold">
                <p>Wallet Address: {Address}</p>
                <p>Balance: {Balance} tEURO</p>
              </div>
            </div>
            <div className="mt-5">
              <button onClick={() => setIsBankModal(true)} className="bg-orange-500 text-white rounded-lg px-10 py-2">
                Withdraw Funds
              </button>
            </div>
          </div>

          <div className="flex flex-col w-full md:w-[72%] mt-10">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8 ">
              <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
                <p className="px-4 py-4 font-bold text-2xl text-gray-200 border border-gray-800 mx-2 bg-gray-800">Transactions</p>
                <div className="overflow-x-auto px-2">
                  <table className="min-w-full table-auto">
                    <thead className=" bg-gray-900 text-orange-500 font-bold text-lg">
                      <tr>
                        <th key="1" scope="col" className="px-6 py-2 pt-5 text-left">
                          Date
                        </th>
                        <th key="2" scope="col" className="px-6 py-2 pt-5 text-left">
                          Time
                        </th>
                        <th key="3" scope="col" className="px-6 py-2 pt-5 text-left">
                          Amount
                        </th>
                        <th key="4" scope="col" className="px-6 py-2 pt-5 text-left">
                          Txn Type (In/OUT)
                        </th>
                        <th key="5" scope="col" className="px-6 py-2 pt-5 text-left">
                          Txn Hash
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {TxnList.length > 0 &&
                        TxnList.map((item, index) => (
                          <tr key={index} className="bg-gray-900">
                            <td className="px-6 py-4 text-white whitespace-nowrap">{formatDate(item.block_signed_at)}</td>
                            <td className="px-6 py-4 text-white whitespace-nowrap">{formatTime(item.block_signed_at)}</td>
                            <td className="px-6 py-4 text-white whitespace-nowrap">
                              {WeiToEther(item.delta)} {item.contract_ticker_symbol}
                            </td>
                            <td className="px-6 py-4 text-white whitespace-nowrap">{item.transfer_type}</td>
                            <td className="px-6 py-4 text-white whitespace-nowrap">
                              <a
                                className="bg-slate-700 px-5 py-2 rounde-xl text-white hover:bg-slate-800"
                                target="_blank"
                                href={`${process.env.NEXT_PUBLIC_MATIC_EXPLORER_TXN}${item.tx_hash}`}
                              >
                                Check Txn
                              </a>
                            </td>
                          </tr>
                        ))}
                      {TxnList.length == 0 && (
                        <>
                          <tr key="1">
                            <td></td>
                            <td></td>
                            <td>
                              <p className="text-white py-10 text-center">No Transactions Available Yet!</p>
                            </td>
                            <td></td>
                            <td></td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-screen flex items-center justify-center">
          <p className="text-white text-2xl font-bold">Please Login using a wallet</p>
        </div>
      )}
    </>
  );
};
export async function getServerSideProps(context) {
  const session = await getSession(context);
  //console.log(session);
  return {
    props: { user: session },
  };
}
export default Merchant