import dotenv from 'dotenv';
dotenv.config();

import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import Student from '../Schema/Student.js';

const secret = process.env.JWT_SECRETE;

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
};

const passportConfig = (passport) => {
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await Student.findById(jwt_payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        console.error(error);
        return done(error, false);
      }
    })
  );
};

export default passportConfig;