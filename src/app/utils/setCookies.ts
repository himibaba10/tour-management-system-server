import { Response } from "express";
import { CookieNames } from "../interfaces/enum";
import envVars from "../configs/env";

const setCookies = (
  res: Response,
  token: {
    accessToken?: string;
    refreshToken?: string;
  }
) => {
  if (token.accessToken) {
    res.cookie(CookieNames.ACCESS_TOKEN, token.accessToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });
  }

  if (token.refreshToken) {
    res.cookie(CookieNames.REFRESH_TOKEN, token.refreshToken, {
      httpOnly: true,
      secure: envVars.NODE_ENV === "production",
      sameSite: "none",
    });
  }
};

export default setCookies;
