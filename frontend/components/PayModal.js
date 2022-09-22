import React, { useState, useEffect } from 'react'
import axios from 'axios';
import io from "socket.io-client";
import QrModal from './QrModal';
import { calculateFeeAndCashback, EtherToWei, formatHexToEther, WeiToEther } from '../utility/web3';
import { ethers } from 'ethers';
import { Circles } from "react-loading-icons";
import { showWarning } from '../utility/notification'
import { useRouter } from "next/router";

let socket = null;
let contractFees = 0;
let euroToInrRate = 0;
let cashbackReward = 0;

const PayModal = ({ showModal, setShowModal, Wallet, WalletAddress, WalletBalance, getTokenBalance }) => {
  const router = useRouter(); 
  const [PaymentMethod, setPaymentMethod] = useState('wallet');
  const [UpiUrl, setUpiUrl] = useState("");
  const [ShowQrModal, setShowQrModal] = useState(false);
  const [EuroRate, setEuroRate] = useState(0);
  const [ProductPrice, setProductPrice] = useState(10);
  const [IsLoadingState, setIsLoadingState] = useState(1);

  const [TotalFees, setTotalFees] = useState(0);
  const [Cashback, setCashback] = useState(0);

  const handleModalState = () => {
    setIsLoadingState(1);
    setShowModal(false);
    setShowQrModal(false);
   }
  const openInNewTab = (url) => {
    var win = window.open(url, "_blank");
    win.focus();
  }
  const handleSuccess = async (isWalletPayment, fiatHash, rapidHash) => {
    console.log("fiatHash: ", fiatHash);
    console.log("rapidHash: ", rapidHash);
    router.push({
      pathname: "/paymentSuccess",
      query: { isWalletPayment: isWalletPayment, fiatHash: fiatHash, rapidHash: rapidHash },
    });
  };
  const handleUpiPayment = async () => {
    setIsLoadingState(4);
    console.log('Paying with upi....');
    const data = {
      address: "0x67F4d010f05311B690074A55BCc2F1820D27e691",
      amount: "1",
    };
    const response = await axios.post("/api/payment", data, {
      headers: {
        "content-type": "application/json",
      },
    });

    //console.log("res: ", response.data.data.payment_url);
    if (response && response.data && response.data.data)
    {
      //openInNewTab(response.data.data.payment_url);
      setUpiUrl(response.data.data.payment_url);
      setShowQrModal(true);
    }
    //setShowQrModal(true);
  }
  
  const handleAdminTransfer = async (isWalletPayment,fiatTxHash) => {
    try
    {
      console.log('sending admin transaction...')
      setIsLoadingState(3);
      const amount = ProductPrice * EuroRate + TotalFees * ProductPrice * EuroRate;
      //const amount = 100;
      const txnData = {
        sellerAddress: "0x52de076F23D29A7eA99D30AB8E99Af12A067feDC",
        destinationAmount: EtherToWei(ProductPrice.toString()),
        destinationFiatSymbol: process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_SYMBOL,
        sourceAmount: EtherToWei(amount.toString()),
        sourceFiatSymbol: process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_SYMBOL,
      };
      const txnResponse = await axios.post("/api/transferFiat", txnData);
      console.log("txnResponse:  ", txnResponse);
      //console.log("hash:  ", txnResponse.data.hash);
      setIsLoadingState(1);
      if (txnResponse && txnResponse.data && txnResponse.data.hash) {
        handleSuccess(isWalletPayment, fiatTxHash, txnResponse.data.hash);
      }
    } catch (error) {
      setIsLoadingState(1);
      console.log(error);
    }
  };
  const handleTokenTransfer = async() => { 
     try
    {
      console.log('sending token transactions...')
      setIsLoadingState(2);
       //const amount = ProductPrice * EuroRate + TotalFees * ProductPrice * EuroRate;
       const amount = ProductPrice * euroToInrRate + contractFees * ProductPrice * euroToInrRate; ;
       //const amount = ProductPrice * EuroRate + TotalFees * ProductPrice * EuroRate;
      //const amount = 100;
        //console.log("ProductPrice:  ", ProductPrice);
        //console.log("EuroRate:  ", EuroRate);
        //console.log("TotalFees:  ", TotalFees);
        //console.log("amount:  ", amount);
        //console.log("euroToInrRate:  ", euroToInrRate);
        //console.log("contractFees:  ", contractFees);
        //console.log("cashback:  ", cashbackReward);
     
      const txnData = {
        toAddress: process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS,
        destinationAmount: EtherToWei(amount.toString()),
      };
        console.log("token-txn-Response:  ", txnData);
      const txnResponse = await axios.post("/api/transferTokens", txnData);
     
      //console.log("hash:  ", txnResponse.data.hash);
      setIsLoadingState(3);
      if (txnResponse && txnResponse.data && txnResponse.data.hash) {
       handleAdminTransfer(true, txnResponse.data.hash);
      }
    } catch (error) {
      setIsLoadingState(1);
      console.log(error);
    }
  }
   const handleWalletPayment = async () => {
      try
      {
      
        console.log("Paying with wallet.....");
        setIsLoadingState(2);
        const amount = ProductPrice * euroToInrRate + contractFees * ProductPrice * euroToInrRate - cashbackReward;
        //const amount = 200;
        if (WalletBalance < amount)
        { 
          showWarning('Low Balance, Please Buy Some tINR tokens')
          setIsLoadingState(1);
          return;
        }

        const erc20Interface = new ethers.utils.Interface(["function transfer(address _to, uint256 _value)"]);
        //Encode an ERC-20 token transfer to recipient of the specified amount
        const data = erc20Interface.encodeFunctionData("transfer", [process.env.NEXT_PUBLIC_RAPID_CONTRACT_ADDRESS, EtherToWei(amount.toString())]);
        const transaction = {
          to: process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_ADDRESS,
          data,
        };
        const signer = Wallet.getSigner();
        const txnResponse = await signer.sendTransaction(transaction);
        console.log(txnResponse);
     
        console.log('hash:  ',txnResponse.hash);

        if (txnResponse && txnResponse.hash)
        {
          handleAdminTransfer(true, txnResponse.hash);
          getTokenBalance(WalletAddress);
        }
        // wait for the transaction to be mined
        await txnResponse.wait();
      } catch (error)
      {
        console.log(error)
        setIsLoadingState(1);
      }
    } 
     const handlePayment = () => {
      if (PaymentMethod === "upi")
      {
        handleUpiPayment();
      } else
      {
        handleWalletPayment();
      }
    } 
    const onValueChange = (event) => {
      setPaymentMethod(event.target.value)
    }
    const calculateFee = async (sourceAmount, destinationAmount) => {
      //console.log(EtherToWei(sourceAmount.toString()), EtherToWei(destinationAmount.toString()));
    
      const txnData = {
        sourceAmount: EtherToWei(sourceAmount.toString()),
        sourceSymbol: process.env.NEXT_PUBLIC_INR_FIAT_TOKEN_SYMBOL,
        destinationAmount: EtherToWei(destinationAmount.toString()),
        destinationSymbol: process.env.NEXT_PUBLIC_EURO_FIAT_TOKEN_SYMBOL,
      };
      const fees = await axios.post('/api/calculateFee', txnData);
      console.log('fees: ',fees)
      if (fees && fees.data)
      {  contractFees = fees.data.totalFees;
        cashbackReward = fees.data.cashback;
        setTimeout(() => {
          setTotalFees(fees.data.totalFees)
          
         setCashback(fees.data.cashback)
        }, 2000);
      }
   
    };
    const fetchCurrencyRate = async () => {
      try
      {
        const rates = await axios.get("https://api.exchangerate.host/latest");
        if (rates && rates.data && rates.data.rates)
        {
          euroToInrRate = rates.data.rates["INR"];
          await setEuroRate(rates.data.rates["INR"]);
          console.log("sourceAmount: ", ProductPrice * rates.data.rates["INR"]);
          console.log("destinationAmount: ", ProductPrice );
          calculateFee(ProductPrice, ProductPrice * rates.data.rates["INR"]);
        }
      } catch (error)
      {
        console.log(error)
      }
    } 
  const socketInitializer = async () => {
  await fetch("/api/socket");
  socket = io({ transports: ["websocket"] });
  socket.on("connect", () => {
    console.log("connected");
    socket.emit("ping", "ping...");
  });

  socket.off("alert").on("alert", (msg) => {
    
    if (msg)
    {
      console.log("alert:  ", msg);
      if (msg.status === 'success')
      { 
        
        handleTokenTransfer();
      }
      setShowQrModal(false);
      
    }
    //
  });
  socket.off("pong").on("pong", (msg) => {
    console.log(msg);
  });
  socket.on("disconnect", (msg) => {
    console.log(msg);
  });
  socket.on("connect_error", (err) => {
    console.log(`connect_error due to ${err.message}`);
  });
  /* return () => {
    socket.off("connect");
    socket.off("pong");
    socket.off("alert");
    socket.off("connect_error");
  };  */
};
const initSocket = async () => {
  const data = {
    isSocketConn: true,
  };
  const response = await axios.post("/api/socket", data);
  console.log(response);
};
  useEffect(() => {
      console.log('init comp')
      fetchCurrencyRate();
      initSocket();
    }, []);
    useEffect(() => {
     
      if (!socket)
      { 
        socketInitializer();
      }
    }, [socket]);
  
  
    return (
      <>
        {showModal ? (
          <>
            <QrModal showQrModal={ShowQrModal} setShowQrModal={setShowQrModal} upiUrl={UpiUrl} />
            <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-[22%] mx-auto">
                {/*content*/}
                {IsLoadingState == 1 ? (
                  <>
                    <div className=" rounded-lg shadow-lg relative flex flex-col w-full bg-slate-900 outline-none focus:outline-none">
                      {/*header*/}
                      <div className="text-white flex items-end pb-1 px-2 justify-between rounded-t bg-gray-800">
                        <span className="text-xl font-bold pt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                          RapidX
                        </span>
                        <button
                          className="p-1 ml-auto bg-transparent border-0 text-white  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => handleModalState()}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </div>
                      {/*body*/}
                      <div className="relative p-2 flex-auto text-gray-400 font-semibold text-lg">
                        <div className="flex justify-between">
                          <p>Product Price: </p>
                          <p>9 Euros</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Delivery Charges: </p>
                          <p>1 Euros </p>
                        </div>
                        <div className="border-b mb-5 text-orange-500 flex justify-between">
                          <p> </p>
                          <p>Total: 10 Euros </p>
                        </div>
                        <div className="flex justify-between">
                          <p>Amount in Inr </p>
                          <p>{(ProductPrice * EuroRate).toFixed(2)} INR</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Contract Fee</p>
                          <p>{(TotalFees * ProductPrice * EuroRate).toFixed(2)} INR</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Cashback</p>
                          <p>{Cashback} INR</p>
                        </div>
                        <div className="flex justify-between">
                          <p>Total Payable Amount</p>
                          <p>{(ProductPrice * EuroRate + TotalFees * ProductPrice * EuroRate - Cashback).toFixed(2)} INR</p>
                        </div>
                        <div className="flex justify-between text-sm mt-10">
                          <p>Current Rate</p>
                          <p>1 Euro ≈ {EuroRate.toFixed(2)} INR</p>
                        </div>
                        <div>
                          <p>
                            Wallet Balance: <span className="text-orange-500">{parseFloat(WalletBalance).toFixed(2)} tINR</span>
                          </p>
                        </div>
                        <div className="mt-5">
                          <div className="mt-4">
                            <span className="text-blue-500"> Pay With</span>
                            <div className="mt-2 flex flex-col items-start justify-start">
                              <label className="inline-flex items-center">
                                <input
                                  type="radio"
                                  checked={PaymentMethod === "wallet"}
                                  onChange={onValueChange}
                                  className="form-radio accent-pink-500 h-7 w-7 cursor-pointer"
                                  name="accountType"
                                  value="wallet"
                                />
                                <div className="ml-2 flex justify-between w-full">
                                  <p>Wallet </p>
                                </div>
                              </label>
                              <label className="inline-flex items-center ">
                                <input
                                  type="radio"
                                  checked={PaymentMethod === "upi"}
                                  onChange={onValueChange}
                                  className="form-radio accent-pink-500 h-5 w-5 cursor-pointer"
                                  name="accountType"
                                  value="upi"
                                />
                                <span className="ml-2">Pay with UPI</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/*footer*/}
                      <div className="flex items-center justify-center rounded-b my-5">
                        <button
                          className="text-white mx-3 bg-green-500 border-2 border-green-500 rounded-lg hover:text-green-500 hover:bg-slate-900 font-bold uppercase px-10 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => handlePayment()}
                        >
                          Pay
                        </button>
                        <button
                          className="text-white mx-3 bg-red-500 border-2 border-red-500 rounded-lg hover:text-red-500 hover:bg-slate-900 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => handleModalState()}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </>
                ) : IsLoadingState == 2 ? (
                  <>
                    <div className="rounded-lg shadow-lg relative flex flex-col w-full bg-slate-900 outline-none focus:outline-none">
                      {/*header*/}
                      <div className="text-white flex items-end pb-1 px-2 justify-between rounded-t bg-gray-800">
                        <span className="text-xl font-bold pt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                          RapidX
                        </span>
                        <button
                          className="p-1 ml-auto bg-transparent border-0 text-white  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => setShowModal(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </div>
                      {/*body*/}
                      <div className="relative p-2 py-32 flex flex-col justify-center items-center flex-auto text-gray-400 font-semibold text-lg">
                        <Circles></Circles>
                        <p className="mt-5">Sending Transaction to RapidX</p>
                      </div>
                      {/*footer*/}
                      <div className="flex items-center justify-center rounded-b my-5"></div>
                    </div>
                  </>
                ) : IsLoadingState == 3 ? (
                  <>
                    <div className="rounded-lg shadow-lg relative flex flex-col w-full bg-slate-900 outline-none focus:outline-none">
                      {/*header*/}
                      <div className="text-white flex items-end pb-1 px-2 justify-between rounded-t bg-gray-800">
                        <span className="text-xl font-bold pt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                          RapidX
                        </span>
                        <button
                          className="p-1 ml-auto bg-transparent border-0 text-white  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => setShowModal(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </div>
                      {/*body*/}
                      <div className="relative p-2 py-32 flex flex-col justify-center items-center flex-auto text-gray-400 font-semibold text-lg">
                        <Circles></Circles>
                        <p className="mt-5">Sending Transaction to Seller</p>
                      </div>
                      {/*footer*/}
                      <div className="flex items-center justify-center rounded-b my-5"></div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-lg shadow-lg relative flex flex-col w-full bg-slate-900 outline-none focus:outline-none">
                      {/*header*/}
                      <div className="text-white flex items-end pb-1 px-2 justify-between rounded-t bg-gray-800">
                        <span className="text-xl font-bold pt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
                          RapidX
                        </span>
                        <button
                          className="p-1 ml-auto bg-transparent border-0 text-white  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                          onClick={() => setShowModal(false)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </div>
                      {/*body*/}
                      <div className="relative p-2 py-32 flex flex-col justify-center items-center flex-auto text-gray-400 font-semibold text-lg">
                        <Circles></Circles>
                        <p className="mt-5">Sending UPI Transaction</p>
                      </div>
                      {/*footer*/}
                      <div className="flex items-center justify-center rounded-b my-5"></div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="opacity-90 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : null}
      </>
    );
}
  export default PayModal;