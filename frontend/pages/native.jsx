import Moralis from "moralis";
import { AppProps } from "next/app";

const Native = ({ nativeBalance, address }) => {
  return (
    <div>
      <h3>Wallet: {address}</h3>
      <h3>Native Balance: {nativeBalance} ETH</h3>
    </div>
  );
};

export async function getServerSideProps(context) {
  // reads the api key from .env.local and starts Moralis SDK
  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  const address = "0xD06FD80e2FEaFfF202De8Feb543F9269206090ED";

  const nativeBalance = await Moralis.EvmApi.account.getNativeBalance({
    address,
  });

  return {
    props: {
      address,
      // Return the native balance formatted in ether via the .ether getter
      nativeBalance: nativeBalance.result.balance.ether,
    },
  };
}
export default Native;
