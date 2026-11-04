# weatherAppNodeJS

## Verification

Run `npm run verify` after installing dependencies. Read [.cursor/skills/verify-weatherappnodejs/SKILL.md](.cursor/skills/verify-weatherappnodejs/SKILL.md) for isolation, prerequisites, browser mode, proof locations, feature coverage and cleanup. Setup is not a claim of full feature or production verification.

## Weather configuration

Set OPENWEATHER_API_KEY as a private server environment variable. Never commit a key. The page shows an explicit unavailable state when it is absent. Default units are Celsius/m/s; the form also supports Fahrenheit/mph. Data is current conditions, not a multi-day forecast.

Provider-boundary UI fixtures (not live weather): `CHROME_BIN=/path/to/chrome node .cursor/skills/verify-weatherappnodejs/verify-fixtures.cjs`. This intercepts only native fetch at the provider boundary in a dedicated test subprocess; it never calls OpenWeather. Evidence is marked fixtureOnly.

Runtime requires Node20+. Deprecated request has been replaced by native fetch; EJS3.1.10 migration is exercised by real rendering and fixture tests. Production audit currently retains4moderate EJS CLI/build dependency-chain findings; no high/critical after refresh, not an all-dependency-clean claim.
