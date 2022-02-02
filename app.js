const credentials = {
  secretUser: "user",
  secretPassword: "password",
};

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
//const https = require("https");
const http = require("http");
const fs = require("fs");
const auditLog = require("audit-log");

const app = express();
const PORT = process.env.PORT || 80;

let options = {
  key: fs.readFileSync("backend-key.pem"),
  cert: fs.readFileSync("backend-cert.pem"),
};

http.createServer(app).listen(8080, function () {
  console.log("HTTP listening on 8080");
});
https.createServer(options, app).listen(443, function () {
  console.log("HTTPS listening on 443");
});

app.use("/healthcheck", require("./routes/healthcheck.routes"));

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  headers = { http_status: 200, "cache-control": "no-cache" };
  body = { status: "available" };
  res.status(200).send(body);
});

app.get("/health", (req, res) => {
  headers = { http_status: 200, "cache-control": "no-cache" };
  body = { status: "available" };
  res.status(200).send(body);
});

app.post("/authorize", (req, res) => {
  // Insert Login Code Here
  let user = req.body.user;
  let password = req.body.password;
  console.log(`User ${user}`);
  console.log(`Password ${password}`);

  if (
    user === credentials.secretUser &&
    password === credentials.secretPassword
  ) {
    auditLog.addTransport("console");
    auditLog.logEvent(
      `user with the credentials ${user} and password ${password} just logged in`,
      "https://annika-backend.herokuapp.com/authorize",
      "logged in"
    );
    console.log("Authorized");

    const token = jwt.sign(
      {
        data: "foobar",
      },
      "6LfOqhUeAAAAAIbaaTXQ7FMWusEyDFisQSHpGiLL",
      { expiresIn: 60 * 60 }
    );

    console.log(token);
    res.status(200).send(token);
  } else {
    console.log("Not authorized");
    res.status(200).send({ STATUS: "FAILURE" });
  }
  auditLog.logEvent("user", "password");
});

app.listen(PORT, () => {
  console.log(`STARTED LISTENING ON PORT ${PORT}`);
});

// app.use(function (req, res, next) {
//   res.setHeader(
//     "Content-Security-Policy",
//     "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
//   );
//   next();
// });
