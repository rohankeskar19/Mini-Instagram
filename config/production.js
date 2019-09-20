module.exports = {
  mongoDBUri: process.env.mongoDBUri,
  saltRounds: 10,
  secret: process.env.secret,
  tokenDuration: "5h",
  accesKey: process.env.accesKey,
  secretAccessKey: process.env.secretAccessKey
};
