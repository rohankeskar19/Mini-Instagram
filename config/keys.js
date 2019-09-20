<<<<<<< HEAD
module.exports = {
  mongoDBUri: "mongodb://rohan:Totalfire12345$@ds113482.mlab.com:13482/min-social-media",
  saltRounds: 10,
  secret: "ahsfk1924usnfjkhafs194y!#$!@39r214nsf",
  tokenDuration: "1h",
  accesKey: "AKIAVLCAOPF57L6Z7AX2",
  secretAccessKey: "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"
};
=======
if (process.env.NODE_ENV === "production") {
  module.exports = require("./production");
} else {
  module.exports = require("./dev");
}
>>>>>>> 54b3ff00ef58c7aa50794ed8dd392fc9e7fb1c9a
