global.fetch = async (input) => {
  const url = new URL(input);
  if(url.hostname !== 'api.openweathermap.org') throw Error('fixture blocks unexpected network');
  const city=url.searchParams.get('q');const metric=url.searchParams.get('units')==='metric';
  await new Promise(r=>setTimeout(r,150));
  if(city==='Offline')throw Error('fixture offline');
  if(city==='Bad JSON')return new Response('not json',{status:502});
  if(city==='Missing')return Response.json({cod:404},{status:404});
  return Response.json({name:city,main:{temp:metric?26:79,humidity:73},wind:{speed:metric?3:7},weather:[{description:city==='Rain fixture'?'light rain':'clear sky',main:city==='Rain fixture'?'Rain':'Clear'}]});
};
