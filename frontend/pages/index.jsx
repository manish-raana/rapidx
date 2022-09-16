import React from "react";
import Image from "next/image";
import Link from "next/link";

const Home = () => {
  return (
    <div className="h-screen w-full bg-black p-10 md:flex justify-between">
      <div className="p-10 w-full md:flex flex-col justify-center items-center">
        <h1 className="mt-5 text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          Welcome to <br className="block md:hidden" />
          <span className="relative">
            <span className="h-15 pt-2 overflow-x-hidden whitespace-nowrap  bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
              RapidX
            </span>
            <span className=" {`${styles.cursor} absolute -bottom-0 left-0 -top-1 inline-block bg-black w-full animate-type will-change-transform`}"></span>
          </span>
        </h1>
        {/*  <p className="text-gray-400">Cross border payment solution, powered by Blockchain</p> */}
        <span className="text-purple-500  text-center text-3xl font-bold mt-5">
          Send and Receive cross border <br /> payments fast & securely
        </span>
        <div className="mt-10">
          <button className="px-10 py-2 rounded-lg border border-gray-700 bg-orange-500 m-3 hover:cursor-pointer hover:bg-purple-600 hover:text-white font-bold">
            <Link href="/shop">Shop</Link>
          </button>
          <button className="px-5 py-2 rounded-lg border border-gray-700 bg-sky-500 m-3 hover:cursor-pointer hover:bg-purple-600 hover:text-white font-bold">
            <Link href="/liquidity">Liquidity Dashboard</Link>
          </button>
        </div>
      </div>
      <div className="p-20 items-center w-full">
        <Image priority src="/hero.svg" layout="responsive" width={600} height={600} alt="hero" />
      </div>
    </div>
  );
};

export default Home;
