# TZ-DB

A static database of timezone labels and both standard and DST offset values for each; as scraped from wikipedia.

```js
var tz = require('tz-db');

tz.zones[407];
//=> Europe/London

tz.tz['Europe/London'];
//=> { std: '+00:00', dst: '+01:00' }

tz.tz['America/New_York'];
//=> { std: '-05:00', dst: '-04:00' }
```

## Recompiling is easy:

```shell
cd tz-db
node src/compile.js
```
