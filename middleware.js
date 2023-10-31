const verifyApiKey = (req, res, next) => {
  if (req.headers["api-key"] == undefined || req.headers["api-key"] == "") {
    return res.status(401).json({ code: 401, message: "Unauthorized Access" });
  }
  const apiKey = req.headers["api-key"];
  if (apiKey != process.env.SECRET_KEY) {
    return res.status(401).json({ code: 401, message: "Unauthorized Access" });
  }
  next();
};

module.exports = {
  verifyApiKey,
};
