const fs = require('fs');

let index = JSON.parse(fs.readFileSync("./code.json", "utf-8"));

index[0]["version"] = process.argv[2];

fs.writeFileSync("./code.json", JSON.stringify(index, null, 2));



