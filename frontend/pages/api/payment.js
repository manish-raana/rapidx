var axios = require("axios");

const createPayment = async (userWallet, amount) => {
  const date = await Date.now();
  var data = JSON.stringify({
    key:  process.env.UPI_KEY,
    client_txn_id: date.toString(),
    amount: amount.toFixed(2),
    p_info: "RapidX",
    customer_name: "Paypal",
    customer_email: "email@email.com",
    customer_mobile: "1234567890",
    redirect_url: "https://rapidx.live/shop",
    udf1: userWallet,
    udf2: "user detail 2",
    udf3: "user detail 3",
  });

  var config = {
    method: "post",
    url: "https://merchant.upigateway.com/api/create_order",
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };
  try {
    var response = await axios(config);
    var res = await response.data;
    return res;
  } catch (error)
  {
    return error;
  }
};

const handler = async (req, res) =>{
  if (req.method == "POST") {
    //console.log(req.body.address,req.body.amount);
    const response = await createPayment(req.body.address,req.body.amount)
    res.status(200).json(response);
  } else {
    res.redirect(307, "/");
    //res.status(200).json("Welcome to rapidx");
  }
}
export default handler;