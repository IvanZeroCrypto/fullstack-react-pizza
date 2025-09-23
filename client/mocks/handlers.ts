// import { http, HttpResponse } from "msw";
// interface IRequestRegister {
//   email: string;
//   password: string;
// }

// export const handlers = [
//   http.post("http://localhost:5000/api/register", async ({ request }) => {
//     const body = (await request.json()) as IRequestRegister;

//     return HttpResponse.json(
//       {
//         accessToken: "jwt-fake-token",
//         user: {
//           id: 1,
//           email: body?.email,
//           role: "USER",
//         },
//         message:
//           "На вашу почту отправлена ссылка по которой вы можете активировать аккаунт",
//       },
//       {
//         status: 200,
//         headers: {
//           "Access-Control-Allow-Credentials": "true",
//         },
//       }
//     );
//   }),
// ];
