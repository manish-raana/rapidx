const handler = async (req, res) => {
  if (req.method == "POST") {
    //console.log(req.body);
    const response = await addLiquidity(req.body);
    res.status(200).json(response);
  } else {
    res.status(200).json("withdraw funds");
  }
};
export default handler;
