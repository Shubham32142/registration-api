import { login, register, resetPass } from "../Controller/API.controller.js";

export function Routes(server) {
  server.post("/register", register);
  server.post("/login", login);
  server.put("/reset-password", resetPass);
}
