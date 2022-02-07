const credentials = { secretUser: "user", secretPassword: "password" };

const auditLog = require("audit-log");
const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const app = express();
const PORT = process.env.PORT || 3000;

//open SSL our own cert that we created.
let options = {
  key: fs.readFileSync("backend-key.pem"),
  cert: fs.readFileSync("backend-cert.pem"),
};

// healthcheck can be used for the monitoring can be checked via for exampel Pingdom
app.use("./healthcheck", require("./routes/healthcheck.routes"));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  headers = { http_status: 200, "cache-control": "no-cache" };
  body = { status: "available" };
  res.status(200).send(body);
});

app.get("/healthcheck", (req, res) => {
  headers = { http_status: 200, "cache-control": "no-cache" };
  body = { status: "available" };
  res.status(200).send(body);
});

// the authorization that we connect to the front end
app.post("/authorize", (req, res) => {
  // Insert Login Code Here

  let user = req.body.user;
  let password = req.body.password;
  console.log(`User ${user}`);
  console.log(`Password ${password}`);

  //   app.use(auditLogExpress.middleware);

  if (
    user === credentials.secretUser &&
    password === credentials.secretPassword
  ) {
    auditLog.addTransport("console");
    auditLog.logEvent(
      ` The user with the username: ${user} and password: ${password}`,
      "https://annika-backend.herokuapp.com/authorize",
      "logged in"
    );
    console.log("Authorized");
    const token = jwt.sign(
      {
        data: "foobar",
      },
      "your-secret-key-here",
      { expiresIn: 60 * 60 }
    );

    console.log(token);
    res.status(200).send(token);
  } else {
    console.log("Not authorized");
    res.status(200).send({ STATUS: "FAILURE" });
  }
});

app.listen(PORT, () => {
  console.log(`STARTED LISTENING ON PORT ${PORT}`);
});
