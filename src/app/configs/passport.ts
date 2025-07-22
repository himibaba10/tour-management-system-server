import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import envVars from "./env";
import User from "../modules/user/user.model";
import { AuthProvider, IUser, Role } from "../modules/user/user.interface";

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
