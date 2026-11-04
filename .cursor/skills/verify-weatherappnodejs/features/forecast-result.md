# Forecast result

Forecast result is a user-facing part of weatherAppNodeJS.

## Sub-features

- `forecast-result`: Check city, Fahrenheit temperature, description, humidity and wind output in .weather-info.

## How to get to it (user POV)

Submit a city with OPENWEATHER_API_KEY set.

## Driving it with verify-weatherappnodejs

Preconditions: launch and doctor pass on the helper-owned disposable instance.

Check city, Fahrenheit temperature, description, humidity and wind output in .weather-info. Run `node .cursor/skills/verify-weatherappnodejs/verify.cjs`. Capture action and resulting state in evidence.json; browser proof also requires screenshots and pixel inspection.

## Gotchas

Not verified: no provider calls made. Do not use a key from repository history.
