const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cors())

app.use(express.static(__dirname + '/../public'))

app.post('/feedback', function(req, res) {
  console.log(req.body)
  res.end()
})

app.set('port', process.env.PORT || 3333);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
