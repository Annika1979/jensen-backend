const credentials = {
  secretUser: "user",
  secretPassword: "password",
  firstUser: "Annika",
  firstPassword: "Pannika",
};

const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 80;

// app.use(function (req, res, next) {
//   res.setHeader(
//     "Content-Security-Policy",
//     "default-src 'self'; font-src 'self'; img-src 'self'; script-src 'self'; style-src 'self'; frame-src 'self'"
//   );
//   next();
// });

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
    (user === credentials.secretUser &&
      password === credentials.secretPassword) ||
    (user === credentials.firstUser && password === credentials.firstPassword)
  ) {
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
