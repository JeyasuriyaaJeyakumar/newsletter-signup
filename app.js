const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

//api keys cant be posted public

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

  

  const url = "https://us10.api.mailchimp.com/3.0/lists/-key-"

  const options = {
    method: "POST",
    auth: "Jeyasuriyaa:apikey-comes-here"
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



app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running in port 3000");
});
