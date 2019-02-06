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
  let IOTDdescription = "Watch Juno zoom past Jupiter again.  NASA's robotic spacecraft Juno is continuing on its 53-day, highly-elongated orbits around our Solar System's largest planet.  The featured video is from perijove 16, the sixteenth time that Juno has passed near Jupiter since it arrived in mid-2016. Each perijove passes near a slightly different part of Jupiter's cloud tops.  This color-enhanced video has been digitally composed from 21 JunoCam still images, resulting in a 125-fold time-lapse. The video begins with Jupiter rising as Juno approaches from the north.";
  let IOTDlastupdate = "Last updated 5 mins ago";
  let IOTDurl = ""

  // fetch image of the day from NASA API
  axios.get('https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo')
  .then(response => {
    console.log(response.data);
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
    console.log(error);
    res.render('index', { IOTDtitle, IOTDdescription, IOTDlastupdate});
  });
});



module.exports = router;
