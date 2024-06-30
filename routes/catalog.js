const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.get("/category/:id", function(req, res, next) {
  res.send("category")
})

module.exports = router;
