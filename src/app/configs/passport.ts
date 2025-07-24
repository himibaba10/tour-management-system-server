import bcryptjs from "bcryptjs";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import envVars from "./env";
import User from "../modules/user/user.model";
import { AuthProvider, IUser, Role } from "../modules/user/user.interface";
import { Strategy as LocalStrategy } from "passport-local";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });

        if (!user) {
          return done(null, false, { message: "User does not exist" });
        }

        if (!user.password) {
          return done(null, false, {
            message: "Try to login with Google or set password in the settings",
          });
        }

        const passwordMatched = await bcryptjs.compare(password, user.password);

        if (!passwordMatched) {
          return done(null, false, { message: "Password did not match" });
        }

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;

        if (!email) {
          return done(null, false, {
            message: "Email not found",
          });
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0].value,
            isVerified: true,
            role: Role.USER,
            auths: [
              {
                provider: AuthProvider.GOOGLE,
                providerId: profile.id,
              },
            ],
          });
        }

        done(null, user);
      } catch (error) {
        done(error, false, {
          message: "Could not connect with Google",
        });
      }
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, (user as IUser)._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
