import axios from "axios";

const fetchTransactions = async (reqBody) => {
  const url = `${process.env.NEXT_PUBLIC_COVALENT_BASE_URL}/address/${reqBody.walletAddress}/transfers_v2/?quote-currency=USD&format=JSON&contract-address=${reqBody.contractAddress}&key=${process.env.COVALENT_API_KEY}`;
    try
    {
        const response = await axios.get(url);
        return response.data.data
  } catch (error) {
    return error;
  }
};
const handler = async (req, res) => {
  if (req.method == "POST") {
    res.status(200).json('not allowed');
  } else
  {
      if (req.query && req.query.walletAddress && req.query.contractAddress) {
          const response = await fetchTransactions(req.query);
            res.status(200).send(response);
      } else {
        res.status(300).json("invalid paramerters, wallet address and contract address required");
      }
  }
};
export default handler;
