require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const github = new require('github')()

const app = express()

app.use(bodyParser.json({
  limit: '5000kb'
}))
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '5000kb'
}))
app.use(cors())

app.use(express.static(__dirname + '/../public'))

github.authenticate({
    type: 'oauth',
    token: process.env.GHTOKEN
})

app.post('/feedback', function(req, res) {
  console.log(req.body.feedback)
  createGHissue(req.body.feedback)
  res.sendStatus(200)
})

app.set('port', process.env.PORT || 3333);

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

function createGHissue(data) {
  var browserData = `<pre> ${JSON.stringify(data.browser, null, 4)} </pre>`
  var message = `<p>Feedback: ${data.note}</p>`
  var img = `<img src='${data.img}'></img>`
  var html = `${browserData} <br> ${message} <br>`
  console.log(html);
  return github.issues.create({
    user: 'sfbrigade',
    repo: 'sf-crime-data',
    title: 'User Feedback',
    body: html,
    labels: ['Type: User Feedback'],
    assignees: []
  }, function (err, data) {
    console.log(data)
    return data
  })
}
