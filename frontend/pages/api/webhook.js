export default function handler(req, res) {
  if (req.method == "POST") {
    res.status(200).json({ name: "POST" });
  } else {
    // res.redirect(307, "/");
    res.status(200).json("Welcome to rapidx");
  }
}
