import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { Circles } from "react-loading-icons";
import { sequence } from "0xsequence";
import { useRouter } from "next/router";
import Link from 'next/link';
import PayModal from '../components/PayModal';

import { getInrTokenBalance } from '../utility/web3';



const Shop = () => {
  const [LoggedIn, setLoggedIn] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [ShowModal, setShowModal] = useState(false);
  const [WalletAddress, setWalletAddress] = useState('');
  const [WalletBalance, setWalletBalance] = useState(0);
  const [Wallet, setWallet] = useState(null);
 
  const router = useRouter();

  
   
  const handleLogin = async () => { 
    setisLoading(true);
    try {
      const wallet = await sequence.initWallet("mumbai");
      const connectDetails = await wallet.connect({
        app: "RapidX",
        authorize: true,
       
      });

      if (connectDetails.connected) {
        setLoggedIn(true);
      }
      setisLoading(false);
    } catch (error)
    {
      setisLoading(true);
      console.log(error)
    }
  } 
  const handleSignOut = async() => {
    try
    {
      const wallet = sequence.getWallet();
      await wallet.disconnect()
      setLoggedIn(false);
    } catch (error)
    { 
      console.log(error)
    }
   }
  const handleSuccess = async (hash) => { 
    router.push({
      pathname: "/payment",
      query: { hash: hash },
    });
  }
  const getTokenBalance = async (walletAddress) => {
    try {
      const inrTokenBalance = await getInrTokenBalance(walletAddress);
      setWalletBalance(inrTokenBalance);
    } catch (error) {
      console.log(error);
    }
  };
  const getWallet = async () => {
    try
    {
      await sequence.initWallet("mumbai");
      const wallet = sequence.getWallet();
      setWallet(wallet)
      const walletAddress = await wallet.getAddress();
      //console.log('address: ', walletAddress);
      if (walletAddress)
      {
      
        setLoggedIn(true);
        setWalletAddress(walletAddress);
        getTokenBalance(walletAddress);
      }
    } catch (error)
    {
      console.log(error);
    }
  }
  const openWallet = () => { 
    if (Wallet)
    { 
     try {
       Wallet.openWallet();
     } catch (error) {
      console.log(error)
     }
    }
  }
  useEffect(() => {
   console.log('init shop comp')
   getWallet()
  }, []);
  return (
    <div className="h-full w-full py-5">
      <PayModal
        showModal={ShowModal}
        setShowModal={setShowModal}
        Wallet={Wallet}
        WalletAddress={WalletAddress}
        WalletBalance={WalletBalance}
        getTokenBalance={getTokenBalance}
      />

      <header className="flex justify-between border-gray-700 backdrop-blur-0 items-center border-b px-10 py-2">
        <div className="text-center cursor-pointer">
          <span className="text-5xl font-bold pt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            <Link href="/">Let's Shop</Link>
          </span>
        </div>
        {!LoggedIn ? (
          <div>
            <button
              className="flex px-5 py-2 rounded md:rounded-lg bg-green-500 hover:bg-green-600 font-bold text-slate-900"
              onClick={() => handleLogin()}
            >
              {!isLoading ? (
                "LOGIN"
              ) : (
                <span className="flex text-white items-center justify-center">
                  Connecting <Circles className="w-8 h-8 p-0 m-0 mx-5" />
                </span>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-end">
            <button
              onClick={() => openWallet()}
              className="mx-5 px-5 py-2 bg-orange-500 rounded-lg text-black hover:bg-orange-700 hover:text-white font-bold"
            >
              Open Wallet
            </button>
            <button
              className="px-5 py-2 rounded-lg bg-rose-500 hover:text-white hover:bg-rose-600 font-bold text-slate-900"
              onClick={() => handleSignOut()}
            >
              LOGOUT
            </button>
          </div>
        )}
      </header>
      <div className="h-[25%] py-10 rounded-lg px-20">
        {LoggedIn && (
          <div className="text-white text-center font-bold">
            <p>Wallet Address : {WalletAddress}</p>
            <p>Balance: {WalletBalance} tINR</p>
          </div>
        )}

        <div className="w-full md:flex justify-evenly">
          <div className="w-full py-20 ">
            <div className="flex items-center">
              <Image src="/camera.png" width={96} height={96} alt="camera" />
              <p className="text-white mx-8">
                Sony a7, Interchangeable-Lens Camera <br /> (with 28-70mm F3.5-5.6 OSS Lens)
              </p>
            </div>
            <div className="mt-5 w-1/2">
              <div className=" flex items-center justify-between">
                <p className="font-bold text-gray-400">Quantity</p>
                <button className="px-1 py-1 text-white bg-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                  </svg>
                </button>
                <input
                  type="text"
                  readOnly
                  value={1}
                  className="w-[20%] text-center font-bold bg-gray-900 text-white p-1 focus-visible:none outline-none"
                />
                <button className="px-1 py-1 text-white bg-gray-900">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </button>
                <button className="text-gray-400 mx-5">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="w-full py-20 px-10 flex items-start justify-around text-white">
            <div>
              <p className="text-white font-bold text-xl text-center mb-5">Price Details</p>
              <div className="flex justify-between">
                <p>Products ( 1 item )</p>
                <p className="mx-10">9 Euros</p>
              </div>
              <div className="flex justify-between">
                <p>Delivery Charge</p>
                <p className="mx-10">1 Euros</p>
              </div>
              <div className="flex justify-between">
                <p>Amount Payable</p>
                <p className="mx-10">10 Euros</p>
              </div>
              <div className="flex items-center justify-start">
                <button className="px-5 py-2 rounded-lg font-bold bg-green-500 border-2 border-green-500 mx-2 mt-5 text-white hover:text-green-500 hover:bg-black">
                  Pay with Paypal
                </button>
                <button
                  onClick={() => setShowModal(true)}
                  className="px-5 py-2 rounded-lg font-bold bg-blue-500 border-2 border-blue-500 mx-2 mt-5 text-white hover:text-blue-500 hover:bg-black"
                >
                  Pay with RapidX
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shop