const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const app = express()
const apiKey = 'ade6ca51701b480b4ff90740e6d14611';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')

app.get('/',(req, res) => {
  res.render('index', {weather: null, error: null});
})

app.post('/',(req, res) => {
  let city = req.body.city;
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  request(url,(err, response, body) => {
    if(err){
      console.log(err);
      res.render('index', {weather: null, error: 'Error, please try again'});
    } else {
      let weather = JSON.parse(body)
      console.log(weather);
      if(weather.main == undefined){
        res.render('index', {weather: null, error: 'Error, please try again'});
      } else {
        let weatherText = `It's ${weather.main.temp} degrees in ${weather.name}!`;
        res.render('index', {weather: weatherText, error: null});
      }
    }
  });
})

app.listen(3000, () => {
  console.log('Weather forecast app running in port 3000!')
})
