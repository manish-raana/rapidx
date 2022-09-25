import axios from 'axios';

const initVerification = async (reqBody) => { 
    const url = "https://developer.worldcoin.org/api/v1/verify";
    try {
        const response = await axios.post(url, reqBody, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        return response;
    } catch (error) {
        return error;
    }
}
const handler = async (req, res) => {
  if (req.method == "POST") {
      const response = await initVerification(req.body);
      res.status(200).json(response);
  } else {
    res.status(200).json("");
  }
};
export default handler;
