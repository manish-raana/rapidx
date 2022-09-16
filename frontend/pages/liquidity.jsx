import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { signIn, getSession, signOut } from "next-auth/react";
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from "wagmi";
import { EtherToWei } from "../utility/web3";
import { useRouter } from "next/router";
import toastr from "toastr";
import axios from "axios";
import Image from "next/image";
import "toastr/build/toastr.min.css";
import Header from "../components/Header";
import Cards from "../components/Cards";
import { showSuccess, showError, showWarning } from "../utility/notification";

const Home = ({ user }) => {
  const [LoggedIn, setLoggedIn] = useState(user ? true : false);
  const [IsLoading, setIsLoading] = useState(false);
  const [Address, setAddress] = useState("");

  useEffect(() => {
    if (user) {
      //console.log(user);
      setAddress(user.user.address);

      setLoggedIn(true);
    }
  }, [user]);

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
  const addLiquidity = async (data) => {
    //console.log(data);

    const response = await axios.post("/api/web3", data, {
      headers: {
        "content-type": "application/json",
      },
    });
    console.log("res: ", response);
    return response;
  };
  return (
    <div className="w-full">
      <Header isLoading={IsLoading} LoggedIn={LoggedIn} handleAuth={handleAuth} handleSignOut={handleSignOut} />

      <Cards address={Address} addLiquidityByAdmin={addLiquidity} />
    </div>
  );
};
export async function getServerSideProps(context) {
  const session = await getSession(context);
  //console.log(session);
  return {
    props: { user: session },
  };
}
export default Home;
