import { Response } from "express";
import { CookieNames } from "../interfaces/enum";

const clearCookies = (res: Response) => {
  res.clearCookie(CookieNames.ACCESS_TOKEN, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.clearCookie(CookieNames.REFRESH_TOKEN, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });
};

export default clearCookies;
