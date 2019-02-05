var express = require('express');
var router = express.Router();

/* GET api listing. */
router.get('/', function(req, res) {
  res.send('API endpoint');
});

module.exports = router;
