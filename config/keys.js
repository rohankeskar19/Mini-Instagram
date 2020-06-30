<<<<<<< HEAD
module.exports = {
  mongoDBUri: "mongouri",
  saltRounds: 10,
  secret: "ahsfk1924usnfjkhafs194y!#$!@39r214nsf",
  tokenDuration: "1h",
  accesKey: "awskey",
  secretAccessKey: "awskey"
};
=======
if (process.env.NODE_ENV === "production") {
  module.exports = require("./production");
} else {
  module.exports = require("./dev");
}
>>>>>>> 54b3ff00ef58c7aa50794ed8dd392fc9e7fb1c9a
