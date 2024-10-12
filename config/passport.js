const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User');

// Función para extraer el JWT de las cookies
const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['currentUser']; // Asegúrate de usar el mismo nombre que usas para la cookie
  }
  return token;
};

// Opciones para el JWT
const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
  secretOrKey: process.env.JWT_SECRET,
};

// Estrategia de JWT
passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
  try {
    const user = await User.findById(jwt_payload.id); // Asegúrate de que 'id' es correcto
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (err) {
    return done(err, false);
  }
}));

// Middleware de autenticación
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    req.user = user; // Almacena el usuario en la solicitud
    next();
  })(req, res, next);
};

module.exports = {
  authenticate,
  passport,
};
