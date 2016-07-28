var express = require('express');
var app = express();
var mcapi = require('mailchimp-api/mailchimp');
var bodyParser = require("body-parser");
mc = new mcapi.Mailchimp('c26e978a4a8a2fb358f9e3c6effa36a5-us13');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8000;

function subscribe (req, res) {
  mc.lists.subscribe({ double_optin: false, id: "74f64bda02", email:{email:req.body.email}}, function(data) {
			res.sendStatus(200);
    },
    function(error) {
			if (error.name == 'List_AlreadySubscribed') {
				res.sendStatus(200);
      } else {
				res.sendStatus(500);
      }
    });
};

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/'));

app.use(bodyParser.urlencoded({ extended: false }));

// set the home page route
app.get('/', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('index');
});

app.post('/lists/subscribe', subscribe);

app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});
