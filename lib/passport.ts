const LocalStrategy = require('passport-local').Strategy;

import Users from './models/users';

function setupLocalStrategy(passport: any) {

    passport.serializeUser(function(user: any, done: any) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id: any, done: any) {
        Users.findById(id, function(err: any, user: any) {
            done(err, user);
        });
    });

    passport.use('local-login', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req: any, email: any, password: any, done: any) {

            Users.findOne({ 'local.email' :  email }, function(err: any, user: any) {
                if(err) return done(err);

                if(!user) 
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if(!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Wrong password.'));

                return done(null, user);
            });
    }));

    passport.use('local-signup', new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true
        },
        function(req: any, email: any, password: any, done: any) {
            Users.findOne({ 'local.email' :  email }, function(err: any, user: any) {
                if(err) return done(err);

                if(user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    var newUser = new Users();

                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password);

                    newUser.save(function(err: any) {
                        if(err) throw err;

                        return done(null, newUser);
                    });
                }
            });    
        }
    ));
};

export default setupLocalStrategy;