import jwt from "jsonwebtoken";
import { prisma } from "../prisma/prisma-client.js";

class TokenService {
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "60d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }
  async saveToken(userId, refreshToken) {
    try {
      await prisma.token.upsert({
        where: {
          userid: userId,
        },
        update: {
          refreshToken: refreshToken,
        },
        create: {
          userid: userId,
          refreshToken: refreshToken,
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  validationRefreshToken(refreshToken) {
    try {
      const validRefreshToken = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );
      return validRefreshToken;
    } catch (error) {
      console.log(error, "validationRefreshToken");
    }
  }
  validationAccessToken(accessToken) {
    try {
      const validAccessToken = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET
      );
      return validAccessToken;
    } catch (error) {
      console.log(error, "validationAccessToken");
    }
  }
  async findToken(refreshToken) {
    const isExisting = await prisma.token.findFirst({
      where: { refreshToken },
    });

    return isExisting;
  }
  async removeToken(refreshToken) {
    try {
      await prisma.token.delete({ where: { refreshToken } });
    } catch (error) {}
  }
}

export default new TokenService();
