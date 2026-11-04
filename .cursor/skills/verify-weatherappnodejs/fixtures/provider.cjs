const Module = require('node:module');
const original = Module._load;
Module._load = function(name, parent, isMain) {
  if(name === 'request') return (options, callback) => {
    const url = new URL(options.url);
    const city = url.searchParams.get('q');
    const metric = url.searchParams.get('units') === 'metric';
    setTimeout(() => {
      if(city === 'Bad JSON') return callback(null,{statusCode:502},'not json');
      if(city === 'Offline') return callback(new Error('fixture offline'));
      if(city === 'Missing') return callback(null,{statusCode:404},JSON.stringify({cod:'404'}));
      const rain = city === 'Rain fixture';
      callback(null,{statusCode:200},JSON.stringify({name:city,main:{temp:metric ? 26 : 79,humidity:73},wind:{speed:metric ? 3 : 7},weather:[{description:rain?'light rain':'clear sky',main:rain?'Rain':'Clear',icon:rain?'10d':'01d'}]}));
    }, 150);
  };
  return original.call(this,name,parent,isMain);
};
