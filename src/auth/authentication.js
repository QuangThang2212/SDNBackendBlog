import jwt from "jsonwebtoken";

const listByPassURL = ["/accounts/login", "/accounts/register"];
const listOfURLwithParams = ["/getall","/blogDetail"];
const adminByPassURL = ["/topic/create"];
const userURL = [];

function checkExistURL(url) {
  // if (url.includes("/blog/getall")) {
  //   return true;
  // }
  // if (url.includes("/socket.io")) {
  //   return true;
  // }
  var result = false;
  result = listByPassURL.find((u) => u.toLocaleLowerCase().trim() == url.toLowerCase().trim());
  if (!result) {
    result = listOfURLwithParams.find((u) => url.toLowerCase().trim().includes(u.toLocaleLowerCase().trim()));
  }
  return result;
}
function checkURLWithRole(url, role) {
  var result = true;
  if (role === process.env.ROLE_ADMIN) {
    result = adminByPassURL.includes(url.toLowerCase().trim());
  }
  // if(role===process.env.ROLE_USER){
  //   result = listByPassURL.find((u) => u.toLocaleLowerCase().trim() == url.toLowerCase().trim());
  // }
  return result;
}

const checkToken = (req, res, next) => {
  console.log(req.url);
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
      //const roleCheck = checkURLWithRole(req.url, req.user.data.role);
      //if(roleCheck){
      next();
      // }else{
      //   res.status(500).json({
      //     message: "Don't have authority to access",
      //   });
      // }
    }
  } catch (error) {
    console.log(error.toString());
    res.status(500).json({
      message: "Please login the system",
      error: error.toString(),
    });
  }
};

export default checkToken;
