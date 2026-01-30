const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// TEMP storage (learning purpose)
let savedOtp = null;

// EMAIL CONFIG (NEW - Render friendly)
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  }
});


// STEP 1: REQUEST OTP
app.post("/request-otp", async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.json({ status: "error", msg: "Email required" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
savedOtp = otp;

// ❌ console.log("OTP:", otp);  // REMOVE THIS
  

  try {
    await transporter.sendMail({
      from: `OTP Login <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Login OTP",
      text: `Your OTP is: ${otp}\nValid for 5 minutes.`
    });

    res.json({ status: "ok", msg: "OTP sent to email" });

  } catch (err) {
    console.error(err);
    res.json({ status: "error", msg: "Email send failed" });
  }
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
