const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
// const mailchimpClient = require("mailchimp_transactional")("95bc9118fce58fd9c5df258e39ccbc93-us10");


const app = express();

//to access the public folder
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

//gets the home page or main page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const eMail = req.body.email;

  //declaring corresponding data to get posted on mail chimp
  const data = {
    members: [
      {
      email_address: eMail,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName

      }
    }]
  }

  //converting json to string
  const jsonData = JSON.stringify(data);

  // api key
  // 95bc9118fce58fd9c5df258e39ccbc93-us10
  // audience id: b3bd55f7c3

  const url = "https://us10.api.mailchimp.com/3.0/lists/b3bd55f7c3"

  const options = {
    method: "POST",
    auth: "Jeyasuriyaa:95bc9118fce58fd9c5df258e39ccbc93-us10"
  }
  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200){
      res.sendFile(__dirname + "/success.html");
    }else{
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
});

app.post("/failure", function(req, res){
  res.redirect("/");
})



app.listen(3000, function() {
  console.log("Server is running in port 3000");
});
