const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  var email = req.body.email;

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/b6446192f8";

  const options = {
    method: "POST",
    auth: "selviraja1:45f0ef067876aaf18c85d1db3dcdcdee-us5",
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3005");
});

// API Key: 45f0ef067876aaf18c85d1db3dcdcdee-us5
// Audience ID: b6446192f8
