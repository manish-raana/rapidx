import Image from 'next/image';
import React from 'react'
import { useRouter } from 'next/router'
import {
  createQR
} from '@solana/pay'
const QrModal = ({ showQrModal, setShowQrModal, upiUrl }) => {
  const handleCancelPayment = () => {
    setShowQrModal(false);
  };
  return (
    <>
      {showQrModal ? (
        <>
          <div className="w-full  justify-center items-center flex flex-col overflow-x-hidden overflow-y-auto fixed inset-0 z-[60] outline-none focus:outline-none">
            <div className="border-2 rounded-lg pt-5">
              <p className="text-white font-bold text-center text-xl mb-5">Scan and Pay</p>
              <iframe height={600} width={400} className="" name="iframe1" src={upiUrl} title="iframe1"></iframe>
            </div>
          </div>
          <div className="opacity-90 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
};

export default QrModal