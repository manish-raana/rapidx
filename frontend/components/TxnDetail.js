import React from "react";

const TxnDetail = ({ showModal, setShowModal, txnData }) => {
  return (
    <>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-800 outline-none focus:outline-none">
                {/*header*/}
                <div className="text-white flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl mx-20 text-center font-semibold">Transaction Details</h3>
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
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <div className="flex justify-between">
                    <p>From Address: </p>
                    <p>{txnData.address}</p>
                  </div>
                  <div className="flex justify-between">
                    <p>Tokens Sent: </p>
                    <p>
                      {txnData.tokenSent} {txnData.sendTokenSymbol}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>Txn Hash </p>
                    <a className="text-blue-500 text-xs" href={`${process.env.NEXT_PUBLIC_MATIC_EXPLORER_TXN}${txnData.sentHash}`} target="_blank">
                      <u>Check Txn</u>
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <p>Tokens Received: </p>
                    <p>
                      {txnData.tokenReceived} {txnData.receivedTokenSymbol}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>Txn Hash </p>
                    <a
                      className="text-blue-500 text-xs"
                      href={`${process.env.NEXT_PUBLIC_MATIC_EXPLORER_TXN}${txnData.receivedHash}`}
                      target="_blank"
                    >
                      <u>Check Txn</u>
                    </a>
                  </div>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-center p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default TxnDetail;
