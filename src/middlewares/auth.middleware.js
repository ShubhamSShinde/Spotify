const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

const token = req.cookies.token;

if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "artist") {
      return res.status(403).json({ message: "YOU DONT HAVE PERMISSION" });
    }

    req.user = decoded; //creating new property in req object to store the decoded user information

    next()
  }
  catch(error){
    console.log(error)
    return res.status(401).json({ message: "Unauthorized" });
  }

}

const authuser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== "user" ) {
        return res.status(403).json({ message: "YOU DONT HAVE PERMISSION" });
      }
      req.user = decoded;
      next();
    }
    catch(error){
      console.log(error)
      return res.status(401).json({ message: "Unauthorized" });
    }

}

module.exports = { authMiddleware, authuser }