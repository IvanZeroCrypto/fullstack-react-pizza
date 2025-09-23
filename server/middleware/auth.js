import tokenService from "../service/tokenService.js";
import { prisma } from "../prisma/prisma-client.js";

export default async function (req, res, next) {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Не авторизован refresh" });
    }
    if (!token) {
      return res.status(401).json({ message: "Не авторизован acces" });
    }
    const refreshDb = await prisma.token.findFirst({ where: { refreshToken } });
    const userData = tokenService.validationAccessToken(token);

    if (!userData) {
      return res.status(401).json({ message: "Не авторизован validacces" });
    }

    req.user = userData;
    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error auth middleware" });
  }
}
