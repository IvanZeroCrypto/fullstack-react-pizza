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
      return null;
    }
  }
  // validationRefreshToken(refreshToken) {
  //   try {
  //     const validRefreshToken = jwt.verify(
  //       refreshToken,
  //       process.env.JWT_REFRESH_SECRET
  //     );
  //     return validRefreshToken;
  //   } catch (error) {
  //     console.error(error, "validationRefreshToken");
  //     return null;
  //   }
  // }
  validationRefreshToken(refreshToken) {
    try {
      console.log("=== JWT VALIDATION DEBUG ===");
      console.log("Token exists:", !!refreshToken);
      console.log("Token length:", refreshToken?.length);
      console.log(
        "JWT_REFRESH_SECRET exists:",
        !!process.env.JWT_REFRESH_SECRET
      );
      console.log(
        "JWT_REFRESH_SECRET length:",
        process.env.JWT_REFRESH_SECRET?.length
      );
      console.log("Server time:", new Date().toISOString());

      const validRefreshToken = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      console.log("Token validation SUCCESS");
      console.log("Token payload:", validRefreshToken);
      return validRefreshToken;
    } catch (error) {
      console.error("=== JWT VALIDATION ERROR ===");
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);

      if (error.name === "TokenExpiredError") {
        console.error("Token expired at:", error.expiredAt);
        console.error("Current time:", new Date());
      }

      if (error.name === "JsonWebTokenError") {
        console.error("JWT error details:", error);
      }

      return null;
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
      console.error(error, "validationAccessToken");
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
