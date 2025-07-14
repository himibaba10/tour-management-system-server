import { Response } from "express";
import { CookieNames } from "../interfaces/enum";

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
      secure: false,
    });
  }

  if (token.refreshToken) {
    res.cookie(CookieNames.REFRESH_TOKEN, token.refreshToken, {
      httpOnly: true,
      secure: false,
    });
  }
};

export default setCookies;
