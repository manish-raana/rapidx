import Moralis from "moralis";

export default async function handler(req, res) {
  // reads the api key from .env.local and starts Moralis SDK
  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  const address = "0xD06FD80e2FEaFfF202De8Feb543F9269206090ED";

  // Promise.all() for receiving data async from two endpoints
  const [nativeBalance, tokenBalances] = await Promise.all([
    Moralis.EvmApi.account.getNativeBalance({ address }),
    Moralis.EvmApi.account.getTokenBalances({ address }),
  ]);
  res.status(200).json({
    // formatting the output
    nativeBalance: nativeBalance.result.balance.ether,
    tokenBalances: tokenBalances.result.map((token) => token.display()),
  });
}
