import jwt from "jsonwebtoken";

const listByPassURL = ["/accounts/login", "/accounts/register"];
const listOfURLwithParams = ["/blog"];
const adminURL = ["/topic/create"];
const userURL = [];

function checkExistURL(req) {
  var result = false;
  result = listByPassURL.find((u) => u.toLocaleLowerCase().trim() == req.url.toLowerCase().trim());
  //result = listOfURLwithParams.find((u)=> req.url.toLowerCase().trim().includes(u.toLocaleLowerCase().trim()));
  return result;
}
function checkURLWithRole(url, role) {
  const result = true;
  // if (role === process.env.ROLE_ADMIN) {
  //   result = adminURL.find((u) => u.toLocaleLowerCase().trim() == url.toLowerCase().trim());
  // }
  // if(role===process.env.ROLE_USER){
  //   result = listByPassURL.find((u) => u.toLocaleLowerCase().trim() == url.toLowerCase().trim());
  // }
  return result;
}

const checkToken = (req, res, next) => {
  console.log(req.url);
  if (checkExistURL(req)) {
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
      message: error.message,
    });
  }
};

export default checkToken;
