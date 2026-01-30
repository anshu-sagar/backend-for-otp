const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let savedOtp = null;

// STEP 1: REQUEST OTP
app.post("/request-otp", (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.json({ status: "error", msg: "Email required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  savedOtp = otp;

  console.log("OTP:", otp); // Render logs me dikhega

  res.json({ status: "ok" });
});

// STEP 2: VERIFY OTP
app.post("/verify-otp", (req, res) => {
  const otp = req.body.otp;

  if (otp == savedOtp) {
    res.json({ status: "success" });
  } else {
    res.json({ status: "fail" });
  }
});

app.listen(3000, () => {
  console.log("Server started");
});
