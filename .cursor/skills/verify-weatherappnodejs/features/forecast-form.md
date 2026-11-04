# Forecast form

Forecast form is a user-facing part of weatherAppNodeJS.

## Sub-features

- `forecast-form`: VERIFY_BROWSER=1 helper fills Chennai and submits the actual form; captures form and resulting not-configured state.

## How to get to it (user POV)

Open /; type into City Name and press Get Forecast.

## Driving it with verify-weatherappnodejs

Preconditions: launch and doctor pass on the helper-owned disposable instance.

VERIFY_BROWSER=1 helper fills Chennai and submits the actual form; captures form and resulting not-configured state. Run `node .cursor/skills/verify-weatherappnodejs/verify.cjs`. Capture action and resulting state in evidence.json; browser proof also requires screenshots and pixel inspection.

## Gotchas

Success forecast requires an approved provider key and external access. Missing key is a deliberate, tested state.
