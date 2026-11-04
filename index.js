const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const apiKey = process.env.OPENWEATHER_API_KEY;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.use((req,res,next)=>{res.locals.city='';res.locals.state='';res.locals.units='metric';next();})

app.get('/',(req, res) => {
  res.render('index', {weather: null, error: null});
})

app.post('/',async (req, res) => {
  res.locals.units = req.body.units === 'imperial' ? 'imperial' : 'metric';
  res.locals.city = typeof req.body.city === 'string' ? req.body.city.trim().slice(0,120) : '';
  if (!res.locals.city) return res.status(400).render('index', {weather:null,error:'Enter a city to look up its current weather.'});
  if (!apiKey) {
    return res.render('index', {weather: null, state:'not-configured', error: 'Weather service is not configured. Set OPENWEATHER_API_KEY.'});
  }
  let city = res.locals.city;
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=${res.locals.units}&appid=${apiKey}`;

  try {
    const response = await fetch(url, {signal: AbortSignal.timeout(8000), redirect:'error'});
    let weather;
    try { weather = await response.json(); }
    catch { return res.render('index', {weather:null,error:'Error: Weather service returned an invalid response.'}); }
    if(!response.ok || !weather || !weather.main || !Number.isFinite(weather.main.temp) || !Array.isArray(weather.weather) || !weather.weather[0] || typeof weather.weather[0].description !== 'string' || typeof weather.weather[0].main !== 'string' || !weather.wind) {
      return res.render('index', {weather:null,error:'Error: City not found or API data unavailable.'});
    }
    const description = weather.weather[0].description;
    const weatherData = {temp:weather.main.temp,name:weather.name,humidity:weather.main.humidity,windSpeed:weather.wind.speed,description:description.charAt(0).toUpperCase()+description.slice(1),condition:weather.weather[0].main};
    return res.render('index', {weather:weatherData,error:null});
  } catch {
    return res.render('index', {weather:null,error:'Error: Could not connect to weather service. Please try again.'});
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Weather app is ready'));
