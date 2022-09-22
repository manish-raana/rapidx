import { transferFunds } from "./adminTransfer";

const handler = async (req, res) => {
  if (req.method == "POST") {
    //console.log(req.body);
    try {
      const result = await transferFunds(req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json(error)
    }
  } else {
    //res.status(200).json("withdraw funds");
  }
};
export default handler;
