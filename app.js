const credentials = { secretUser: "user", secretPassword: "password" };
const cors = require("cors");
const express = require("express");

const res = require("express/lib/response");
const app = express();
process.env.PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
  );
  next();
});

app.get("/", (req, res) => {
  const encodedAuth = (req.headers.authorization || "").split(" ")[1] || ""; // getting the part after Basic

  const [user, password] = Buffer.from(encodedAuth, "base64")
    .toString()
    .split(":");
  if (
    user === credentials.secretUser &&
    password === credentials.secretPassword
  ) {
    res.status(200).send({ STATUS: "SUCCESS" });
    console.log("Logged in");
  } else {
    res.set("WWW-Authenticate", 'Basic realm="Access to Index"');
    res.status(401).send("Unauthorised access");
  }
});

app.get("/health", (req, res) => {
  headers = { http_status: 200, "cache-control": "no-chache" };
  body = { status: "available" };
});

app.post("/authorize", (req, res) => {
  //insert login code here
  let user = req.body.user;
  let password = req.body.password;
  console.log(`User $(user)`);
  console.log(`Password $(password)`);

  if (
    user === credentials.secretUser &&
    password === credentials.secretPassword
  ) {
    console.log("Authorized");
    res.status(200).send({ STATUS: "SUCCESS" });
  }
});

app.listen(3000, () => {
  console.log(`STARTED LISTENING ON PORT ${process.env.PORT}`);
});
