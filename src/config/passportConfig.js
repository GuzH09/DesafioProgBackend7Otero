import passport from "passport";
import jwt, { ExtractJwt } from "passport-jwt";
import GitHubStrategy from 'passport-github2';

import userModel from "../models/usersModel.js";

import process from 'process';

const JWTStrategy = jwt.Strategy;

const initializatePassport = () => {
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_OR_KEY
    }, async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload);
                } catch (error) {
                    return done(error.message);
                }
            }
        )
    );

    const CLIENT_ID = process.env.CLIENT_ID;
    const SECRET_ID = process.env.CLIENT_SECRET;
    passport.use('github', new GitHubStrategy({
        clientID: CLIENT_ID,
        clientSecret: SECRET_ID,
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
    }, async (accessToken, refreshToken, profile, done) => {
                try {
                    let user = await userModel.findOne({email: profile._json.email}).lean();
                    if (!user) {
                        let newUser = {
                            first_name: profile._json.name,
                            last_name: 'GitHub',
                            age: 18,
                            email: profile._json.email,
                            password: 'GithubPassword'
                        }
                        let created = await userModel.create(newUser);
                        let result = await userModel.findOne(created).lean();
                        done(null, result);
                    } else {
                        done(null, user);
                    }
                } catch(error) {
                    return done(error);
                }
            }
        )
    );

    passport.serializeUser((user, done) => done(null, user._id));

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    });
};

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies.auth ?? null;
    }

    return token;
};

export default initializatePassport;