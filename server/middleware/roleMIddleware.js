import tokenService from "../service/tokenService.js";
import jwt from "jsonwebtoken";

export default function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  try {
    if (!token) {
      return res.status(401).json({ message: "Не авторизован acces" });
    }
    const userData = tokenService.validationAccessToken(token);

    if (!userData) {
      return res.status(401).json({ message: "Не авторизован validacces" });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    if (decoded.role === "USER") {
      return res.status(401).json({ message: "Нет доступа" });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error authRole middleware" });
  }
}
