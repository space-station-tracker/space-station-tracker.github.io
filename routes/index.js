var express = require('express');
// const request = require('request-promise');
const axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  // MAPBOX credentials
  // mapbox
  // lx-proto
  // ae -> VEJXVarU5G9Wc3Q

  let IOTDtitle = "Space Walk";
  let IOTDdescription = "NASA astronaut Drew Feustel seemingly hangs off the International Space Station while conducting a spacewalk with fellow NASA astronaut Ricky Arnold (out of frame) on March 29, 2018. Feustel, as are all spacewalkers, was safely tethered at all times to the space station during the six-hour, ten-minute spacewalk.";
  let IOTDlastupdate = "2019-01-01";
  let IOTDcopyright = "NASA.org";
  let IOTDurl = "/images/space_walk.jpg";

  // fetch image of the day from NASA API
  axios.get('https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo')
  .then(response => {
    // console.log(response.data);
    IOTDtitle = response.data.title;
    IOTDdescription = response.data.explanation;
    IOTDlastupdate = response.data.date;
    IOTDcopyright = response.data.copyright;
    IOTDurl = response.data.url;
    res.render('index', { IOTDtitle,
                          IOTDdescription,
                          IOTDlastupdate,
                          IOTDcopyright,
                          IOTDurl });
  })
  .catch(error => {
    // console.log(error);
    res.render('index', { IOTDtitle,
                          IOTDdescription,
                          IOTDlastupdate,
                          IOTDcopyright,
                          IOTDurl });
  });
});



module.exports = router;
