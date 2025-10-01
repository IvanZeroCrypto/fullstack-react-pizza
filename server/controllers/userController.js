import { prisma } from "../prisma/prisma-client.js";
import bcrypt from "bcrypt";
import * as uuid from "uuid";
import { UserDto } from "../dtos/userDto.js";
import { TokenDto } from "../dtos/tokenDto.js";
import mailService from "../service/mail-service.js";
import tokenService from "../service/tokenService.js";
class UserController {
  async register(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Заполните все поля" });
      }

      const candidate = await prisma.user.findFirst({
        where: { email },
      });
      if (candidate) {
        return res.status(400).json({
          message: `Пользователь с почтовым адресом ${email} уже существует`,
        });
      }
      const hasPassword = await bcrypt.hash(password, 5);
      const activationLink = uuid.v4();

      const user = await prisma.user.create({
        data: {
          email,
          password: hasPassword,
          activationLink,
        },
      });

      const userData = new UserDto(user);
      const tokens = tokenService.generateToken({ ...userData });
      const { accessToken } = new TokenDto(tokens);
      await tokenService.saveToken(userData.id, tokens.refreshToken);

      await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });
      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 60 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.json({
        user: userData,
        accessToken,
        message:
          "На вашу почту отправлена ссылка по которой вы можете активировать аккаунт",
      });
    } catch (error) {
      res.status(500).json({ message: "Server error register " });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findFirst({
        where: { email },
        include: {
          cart: true,
        },
      });

      if (!user) {
        return res.status(400).json({ message: "Неверный логин или пароль" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(400).json({ message: "Неверный логин или пароль" });
      }
      const userData = new UserDto(user);
      const tokens = tokenService.generateToken({ ...userData });
      const { accessToken } = new TokenDto(tokens);
      await tokenService.saveToken(userData.id, tokens.refreshToken);
      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 60 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.cookie("sessionId", user.cart.sessionId, {
        maxAge: 60 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.json({
        user: userData,
        accessToken,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error " });
    }
  }
  async activate(req, res) {
    try {
      const activationLink = req.params.link;
      const user = await prisma.user.findFirst({ where: { activationLink } });

      await prisma.user.update({
        where: {
          id: user.id, //35653b39-ed71-492c-99db-fa2de42fbfc7
        },
        data: {
          isActivated: true,
        },
      });

      // return res.redirect(process.env.CLIENT_URL);
    } catch (error) {
      res.status(500).json({ message: "Server error " });
    }
  }
  async refresh(req, res) {
    try {
      const { refreshToken } = req.cookies;

      const validRefreshToken = await tokenService.validationRefreshToken(
        refreshToken
      );

      const tokenDb = await tokenService.findToken(refreshToken);

      if (!validRefreshToken) {
        return res.status(401).json({ message: "Нет доступа" });
      }
      if (!tokenDb) {
        return res.status(401).json({ message: "Нет доступа" });
      }

      const user = await prisma.user.findFirst({
        where: { id: validRefreshToken.id },
      });

      const userData = new UserDto(user);

      const tokens = tokenService.generateToken({ ...userData });
      const { accessToken } = new TokenDto(tokens);

      await tokenService.saveToken(userData.id, tokens.refreshToken);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 60 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      res.json({
        user: userData,
        accessToken,
      });
    } catch (error) {}
  }

  async logout(req, res) {
    try {
      const refreshToken = req.cookies;
      await tokenService.removeToken(refreshToken);
      res.clearCookie("refreshToken");
      res.clearCookie("sessionId");
      res.json("ok");
    } catch (error) {
      res.status(500).json({ message: "Server error " });
    }
  }
  async getAllUsers(req, res) {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error " });
    }
  }
  async checkAuth(req, res) {
    try {
      const user = req.user;

      const findUserDb = await prisma.user.findUnique({
        where: {
          email: user.email,
        },
      });
      if (!findUserDb) {
        return res.status(201).json({ message: "User не существует" });
      }
      res.json({
        user: user,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error " });
    }
  }
  async deleteUsers(req, res) {
    try {
      await prisma.user.delete({ where: { id: req.params.id } });
      res.json("delete user ok");
    } catch (error) {
      console.log(error, "deleteuser");
    }
  }
}

export default new UserController();
