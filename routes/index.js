var express = require('express');
const axios = require('axios');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  // MAPBOX credentials
  // mapbox
  // lx-proto
  // ae -> VEJXVarU5G9Wc3Q

  let IOTDtitle = "Space Walk";
  let IOTDdescription = "NASA astronaut Drew Feustel seemingly hangs off the International Space Station while conducting a spacewalk with fellow NASA astronaut Ricky Arnold (out of frame) on March 29, 2018. Feustel, as are all spacewalkers, was safely tethered at all times to the space station during the six-hour, ten-minute spacewalk.";
  let IOTDlastupdate = "2019-01-01";
  let IOTDcopyright = "api.nasa.gov";
  let IOTDurl = "/images/space_walk.jpg";

  // fetch image of the day from NASA API
  axios.get('https://api.nasa.gov/planetary/apod?api_key=NNKOjkoul8n1CH18TWA9gwngW1s1SmjESPjNoUFo')
  .then(response => {
    // console.log(response.data);
    // media can also be video
    if (response.data.media_type == "image"){
      IOTDtitle = response.data.title;
      IOTDdescription = response.data.explanation;
      IOTDlastupdate = response.data.date;
      IOTDcopyright = response.data.copyright;
      IOTDurl = response.data.url;
    }
    res.render('isstracker', { IOTDtitle,
                          IOTDdescription,
                          IOTDlastupdate,
                          IOTDcopyright,
                          IOTDurl });
  })
  .catch(error => {
    // console.log(error);
    res.render('isstracker', { IOTDtitle,
                          IOTDdescription,
                          IOTDlastupdate,
                          IOTDcopyright,
                          IOTDurl });
  });
});

router.get('/photos', (req, res) => {
  res.render('photos', {});
});

// router.get('/hubble-telescope', (req, res) => {
//   res.render('hubble', {});
// });

module.exports = router;
