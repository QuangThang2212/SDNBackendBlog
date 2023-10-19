import jwt from "jsonwebtoken";

const listByPassURL = ["/accounts/login", "/accounts/register", "/accounts/verify"];

function checkExistURL(url) {
  const result = listByPassURL.find((u) => u.toLocaleLowerCase().trim() == url.toLowerCase().trim());
  if (result) return true;
  else return false;
}

const checkToken = (req, res, next) => {
  if (checkExistURL(req.url)) {
    next();
    return;
  }

  try {
    const token = req.headers?.authorization?.split(" ")[1];
    const jwtObject = jwt.verify(token, process.env.SECRET_KEY);

    let isExpired = Date.now() >= jwtObject.exp * 1000;

    if (isExpired) {
      res.status(400).json({
        message: "Access token expired",
      });
      res.end();
    } else {
      req.user = jwt.decode(token, process.env.SECRET_KEY);
      next();
      return;
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default checkToken;
