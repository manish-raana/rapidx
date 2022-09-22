import React from "react";
import { Circles } from "react-loading-icons";
import Link  from 'next/link';
const Header = ({ isLoading, LoggedIn, handleAuth, handleSignOut }) => {
  return (
    <header className="flex justify-between border-gray-700 backdrop-blur-0 items-center border-b px-10 py-2">
      <div className="text-center cursor-pointer">
        <span className="text-5xl font-bold pt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
          <Link href="/">RapidX</Link>
        </span>
        <p className="text-gray-400 text-sm ">Payments Made Easy</p>
      </div>
      {!LoggedIn ? (
        <button
          className="flex px-5 py-2 rounded md:rounded-lg bg-green-500 hover:bg-green-600 font-bold text-slate-900"
          onClick={() => handleAuth()}
        >
          {!isLoading ? (
            "LOGIN"
          ) : (
            <span className="flex text-white items-center justify-center">
              Connecting <Circles className="w-8 h-8 p-0 m-0 mx-5" />
            </span>
          )}
        </button>
      ) : (
        <button className="px-5 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 font-bold text-slate-900" onClick={() => handleSignOut()}>
          LOGOUT
        </button>
      )}
    </header>
  );
};

export default Header;
