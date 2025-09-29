import * as uuid from "uuid";
import { prisma } from "../prisma/prisma-client.js";
import jwt from "jsonwebtoken";
import tokenService from "../service/tokenService.js";
export default async function (req, res, next) {
  try {
    let sessionId = req.cookies.sessionId;

    if (!sessionId) {
      sessionId = uuid.v4();

      await prisma.cart.create({
        data: {
          sessionId,
          items: {
            create: [],
          },
        },
      });
      res.cookie("sessionId", sessionId, {
        httpOnly: true,
      });
    }
    // else {
    //   const cart = await prisma.cart.findFirst({
    //     where: { sessionId },
    //   });

    //   if (!cart) {
    //     await prisma.cart.create({
    //       data: {
    //         sessionId,
    //         items: {
    //           create: [],
    //         },
    //       },
    //     });
    //   }
    // }

    req.sessionId = sessionId;
    next();
  } catch (error) {
    console.log(error, "Error cartInit");
  }
}
