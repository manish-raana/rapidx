import React from "react";
import { showSuccess } from "../utility/notification";
import { Circles } from "react-loading-icons";
const ProfileModal = ({ IsProfileModal, setIsProfileModal, handleSignOut }) => {
  return (
    <div>
      {IsProfileModal ? (
        <div className="w-full justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
          <div className="relative w-[30%] mx-auto">
            {/*content*/}

            <div className=" rounded-lg shadow-lg relative flex flex-col w-full bg-gray-700 outline-none focus:outline-none">
              {/*header*/}
              <div className="text-white flex items-end pb-1 px-2 justify-between rounded-t bg-purple-900">
                <span className="text-xl font-bold pt-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">RapidX</span>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-white  float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => setIsProfileModal(false)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
              {/*body*/}
              <div className="relative p-2 flex-auto text-gray-400 font-semibold text-lg">
                <div className="mb-2 flex justify-between">
                  <p>Your Name </p>
                  <input
                    className="rounded-lg bg-gray-900 focus-visible-none text-end px-5 w-[55%] text-white"
                    type="text"
                    name="name"
                    defaultValue=""
                    placeholder="Joe"
                  />
                </div>
                <div className="mb-2 flex justify-between">
                  <p>Email </p>
                  <input
                    className="rounded-lg bg-gray-900 focus-visible-none text-end px-5 w-[55%] text-white"
                    type="email"
                    name="email"
                    defaultValue=""
                    placeholder="test@gmail.com"
                  />
                </div>
                <div className="mb-2 flex justify-between">
                  <p>Address </p>
                  <input
                    className="rounded-lg bg-gray-900 focus-visible-none text-end px-5 w-[55%] text-white"
                    type="text"
                    name="email"
                    defaultValue=""
                    placeholder="test@gmail.com"
                  />
                </div>
                <div className="mb-2 flex justify-between">
                  <p>Bank Name </p>
                  <input
                    className="rounded-lg bg-gray-900 focus-visible-none text-end px-5 w-[55%] text-white"
                    type="text"
                    name="bankname"
                    defaultValue=""
                    placeholder="HDFC"
                  />
                </div>
                <div className="mb-2 flex justify-between">
                  <p>Account Number </p>
                  <input
                    className="rounded-lg bg-gray-900 focus-visible-none text-end px-5 w-[55%] text-white"
                    type="text"
                    name="email"
                    defaultValue=""
                    placeholder="012-345-6789"
                  />
                </div>
                <div></div>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-center rounded-b my-5">
                <button
                  className="text-white mx-3 bg-green-500 border-2 border-green-500 rounded-lg hover:text-green-500 hover:bg-slate-900 font-bold uppercase px-10 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  Save
                </button>
                <button
                  className="text-white mx-3 bg-rose-500 border-2 border-rose-500 rounded-lg hover:text-rose-500 hover:bg-slate-900 font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => setIsProfileModal(false)}
                >
                  Cancel
                </button>
              </div>
             
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
export default ProfileModal;
