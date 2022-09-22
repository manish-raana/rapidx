import Image from 'next/image';
import Link from 'next/link';
import React, { useState, useEffect} from 'react'
import { useRouter } from "next/router";
const PaymentSuccess = () => {
  const router = useRouter();
  const [FiatHash, setFiatHash] = useState('');
  const [RapidHash, setRapidHash] = useState('');
  const [IsWalletPayment, setIsWalletPayment] = useState(false);
  useEffect(() => {
    const data = router.query;
    console.log(data);
    if (data)
    { 
      setFiatHash(data.fiatHash);
      setRapidHash(data.rapidHash);
      setIsWalletPayment(data.isWalletPayment);
    }
  }, []);
  return (
    <div className="text-green-500 h-screen w-full flex flex-col justify-center items-center">
      <Image src="/success.png" width={300} height={300} alt="success" />
      <p className="text-green-500 font-bold text-3xl mb-5 text-center mt-5">Payment Done Successfully...! </p>
      {FiatHash != undefined ? (
        <p className="text-gray-400 text-xl hover:underline underline-offset-4">
          <Link href={process.env.NEXT_PUBLIC_MATIC_EXPLORER_TXN + FiatHash}>
            <a target="_blank">Check Wallet to Rapid Contract Transaction</a>
          </Link>
        </p>
      ) : (
        <></>
      )}
      <p className="text-gray-400 text-xl hover:underline underline-offset-4">
        <Link href={process.env.NEXT_PUBLIC_MATIC_EXPLORER_TXN + RapidHash}>
          <a target="_blank">Check Rapid Contract to Seller Transaction</a>
        </Link>
      </p>
    </div>
  );
};

export default PaymentSuccess;