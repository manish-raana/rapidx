import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { Circles } from "react-loading-icons";
import axios from "axios";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { signIn, getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Link from 'next/link';
import PayModal from '../components/PayModal';
import { subscribe, unSubscribe, fetchNotifs, sendNotifs, checkSubscription } from "../utility/epns";
import { getInrTokenBalance } from '../utility/web3';
import { Switch } from "@headlessui/react";
import { ethers } from 'ethers'
import { showError,showSuccess, showWarning } from '../utility/notification'

let notifcationCount = 0;
const Shop = ({ user }) => {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();

 const [LoggedIn, setLoggedIn] = useState(user ? true : false);
  const [IsLoading, setIsLoading] = useState(false);
  const [ShowModal, setShowModal] = useState(false);
  const [WalletAddress, setWalletAddress] = useState('');
  const [WalletBalance, setWalletBalance] = useState(0);
  const [Wallet, setWallet] = useState(null);
  const [notifications, setnotifications] = useState([]);
  const [enabled, setEnabled] = useState(false)

  const router = useRouter();

  const checkSubscriptionStatus = async (address) => {
    try {
      const status = await checkSubscription(process.env.NEXT_PUBLIC_EPNS_OFFERS_CHANNEL_ADDRESS, address);
      
      console.log('status:  ',status)
      setEnabled(status)
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubscribe = async () => {
    if (typeof window !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Prompt user for account connections
        await provider.send("eth_requestAccounts", []);
        const _signer = provider.getSigner();
        
        //console.log("Account:", await signer.getAddress());
        const address = await _signer.getAddress();
        
        const status = await subscribe(process.env.NEXT_PUBLIC_EPNS_OFFERS_CHANNEL_ADDRESS, address, _signer);
        if (status === true)
        {
          setEnabled(!enabled);
        } else
        { 
          setEnabled(false);
        }
      } catch (error)
      {
        console.log('shop-error: ',error)
        setEnabled(false);
      }
    }
  };
  const handleUnsubscribe = async () => {
    if (typeof window !== "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Prompt user for account connections
        await provider.send("eth_requestAccounts", []);
        const _signer = provider.getSigner();
        //console.log("Account:", await signer.getAddress());
        const address = await _signer.getAddress();
        const status = await unSubscribe(process.env.NEXT_PUBLIC_EPNS_OFFERS_CHANNEL_ADDRESS, address, _signer);
        if (status === true) {
          setEnabled(!enabled);
        } else {
          setEnabled(false);
        }
      } catch (error) {
        console.log(error);
        setEnabled(false);
      }
    }
  };
  const getNotifications = async (address) => {
    try {
      const notifs = await fetchNotifs(address);
      if (notifs) {
        setnotifications(notifs);
      }
    } catch (error) {
      console.log("error:  ", error);
    }
  };
   
  const handleLogin = async () => {
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
        
        setWalletAddress(userData.address);
        getTokenBalance(userData.address);
        getNotifications(userData.address);
        checkSubscriptionStatus(userData.address);
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
    signOut({ redirect: "/shop" });
  };

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
  
const handleNotificationChange = (event) => {
  console.log(event)
  
  if(event){
    handleSubscribe();
  }else{
      handleUnsubscribe();
  }
 
}
  useEffect(() => {
   //console.log('init shop comp')
    console.log('user:   ',user)
    if (user)
    { 
      const address = user.user.address;
      setWalletAddress(address);
      checkSubscriptionStatus(address);
      setLoggedIn(true);
      getTokenBalance(address);
      getNotifications(address);

      setInterval(() => {
        getTokenBalance(address);
        getNotifications(address);
       }, 5000);
    }
  }, [user]);
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
              {!IsLoading ? (
                "LOGIN"
              ) : (
                <span className="flex text-white items-center justify-center">
                  Connecting <Circles className="w-8 h-8 p-0 m-0 mx-5" />
                </span>
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <div className="flex items-center mr-5">
              <label htmlFor="" className="text-white font-bold mr-2">
                Alerts
              </label>
              <Switch
                checked={enabled}
                onChange={handleNotificationChange}
                className={`${!enabled ? "bg-gray-800" : "bg-green-500"}
          relative items-center inline-flex pl-1 h-[28px] w-[56px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
              >
                <span className="sr-only">Use setting</span>
                <span
                  aria-hidden="true"
                  className={`${enabled ? "translate-x-6" : "translate-x-0"}
                    pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
                />
              </Switch>
            </div>

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
        <div className="w-full px-10">
          <p className="text-center text-white font-bold text-3xl">Best Deals</p>
          <div className="mt-5 flex flex-wrap">
            {notifications &&
              notifications.map((oneNotification, i) => {
                const { cta,sid, title, message, app, icon, image, url, blockchain, notification } = oneNotification;
                
                return (
                  <div key={sid} className="flex w-[30%] mb-2 mx-2 boder-2 bg-violet-500 px-2 py-4 border-rose-500 rounded-lg">
                    <img src={image} className="h-20" alt="image" />
                    <div className="mx-5">
                      <p className="text-white font-bold text-2xl">{title}</p>
                      <p className="text-white">{message}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
    const session = await getSession(context);
    //console.log(session);
    return {
      props: { user: session },
    };
}
export default Shop