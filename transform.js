const fs = require("fs");
const path = require("path");
const stringify = require("json-stable-stringify");

const es = require("./src/translations/es.json");

const msgs = Object.keys(es).reduce((acc, cur) => {
  acc[cur] = {
    message: es[cur],
  };
  return acc;
}, {});

fs.writeFileSync("messages/es.json", stringify(msgs, { space: "  " }));
