# Service errors

Service errors is a user-facing part of weatherAppNodeJS.

## Sub-features

- `service-errors`: Read .error-message; require a useful error and a responsive form.

## How to get to it (user POV)

Submit the forecast form while provider is unavailable or city is missing.

## Driving it with verify-weatherappnodejs

Preconditions: launch and doctor pass on the helper-owned disposable instance.

Read .error-message; require a useful error and a responsive form. Run `node .cursor/skills/verify-weatherappnodejs/verify.cjs`. Capture action and resulting state in evidence.json; browser proof also requires screenshots and pixel inspection.

## Gotchas

Missing-key error verified. Transport failures, malformed JSON and city-not-found branches have source guards but no live provider proof.
