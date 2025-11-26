import { v4 as uuidv4 } from "uuid";

export const ensureUserToken = (req, res, next) => {
  if (!req.cookies.user_token) {
    const token = uuidv4();
    res.cookie("user_token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 año
    });
    req.user_token = token;
  } else {
    req.user_token = req.cookies.user_token;
  }
  next();
};
