var express = require('express');
var router = express.Router();

/* GET api listing. */
router.get('/', function(req, res) {
  res.send('general API endpoint');
});

router.get('/imageoftheday', function(req, res){
  // get image from https://api.nasa.gov/api.html#authentication
  // https://api.nasa.gov/#live_example
  // https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo
  // API code alexberndt7@gmail.com :

  res.send('image of the day endpoint')
});

router.get('/iss-trajectory', function(req, res){
  res.send('iss trajectory endpoint')
});

module.exports = router;
