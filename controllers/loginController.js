/**
 * @file
 * @module
 * @author Carl Gross
 */

import passport from "passport";

export const loginController = {
  loginPost: async (req, res, next) => {
    console.log("Inside POST /login callback");
    passport.authenticate("local", (err, user, info) => {
      console.log("Inside passport.authenticate() callback");
      if (req.session && req.session.passport)
        console.log(
          `req.session.passport: ${JSON.stringify(req.session.passport)}`
        );
      if (req && req.user) console.log(`req.user: ${JSON.stringify(req.user)}`);
      if (info) return res.send(info.message);
      if (err) return next(err);
      if (!user)
        return res
          .status(400)
          .json({ error: "Invalid username/password combination." });
      req.login(user, (err) => {
        console.log("Inside req.login() callback");
        console.log(
          `req.session.passport: ${JSON.stringify(req.session.passport)}`
        );
        console.log(`req.user: ${JSON.stringify(req.user)}`);
        if (err) {
          return next(err);
        }
        return res.json({
          userAuth: true,
        });
      });
    })(req, res, next);
  },
  testy: async (err, user, info) => {
    console.log("Inside passport.authenticate() callback");
    // const req = info.req;
    // const res = info.res;
    // console.log(
    //   `req.session.passport: ${JSON.stringify(req.session.passport)}`
    // );
    // console.log(`req.user: ${JSON.stringify(req.user)}`);
    if (info) return res.send(info.message);
    if (err) return next(err);
    // if (!user) return res.redirect("/login");
    if (!user)
      return res
        .status(400)
        .json({ error: "Invalid username/password combination." });

    req.login(user, (err) => {
      console.log("Inside req.login() callback");
      // console.log(
      //   `req.session.passport: ${JSON.stringify(req.session.passport)}`
      // );
      // console.log(`req.user: ${JSON.stringify(req.user)}`);
      if (err) {
        return next(err);
      }
      // return res.send("You were authenticated & logged in!");
      return res.json({
        userAuth: true,
      });
    });
  },
};
