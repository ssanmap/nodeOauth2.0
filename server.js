const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const axios = require('axios');
const querystring = require('querystring');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bodyParser = require('body-parser');
const sequelize = require('./db'); // Importamos la instancia de Sequelize
const User = require('./models/user');

dotenv.config();

const app = express();
// Habilitar CORS para todas las rutas
app.use(cors({
    origin: 'http://localhost:3000', // Permitir solicitudes desde el frontend de React
    credentials: true
  }));

app.use(bodyParser.json());

const PORT = 4000;
const JWT_SECRET = process.env.JWT_SECRET;

sequelize.sync({ force: true }) // force: true recrea las tablas si no existen
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error al sincronizar la base de datos:', err);
  });

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_REDIRECT_URI,
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Verificar si el usuario ya existe en la base de datos
      let user = await User.findOne({ where: { id: profile.id } });

      if (!user) {
        // Si el usuario no existe, crear uno nuevo
        user = await User.create({
          id: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          picture: profile.photos[0].value
        });
        console.log('Usuario guardado en la base de datos');
      }

      // Generar el token JWT
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h',
      });

      return done(null, { token });
    } catch (error) {
      console.error('Error al crear o buscar usuario:', error);
      return done(error, null);
    }
  }
));

app.use(passport.initialize());

// Ruta para redirigir a Google para autenticarse
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// Nueva versión de la ruta de callback para manejar el intercambio del código
app.get('/auth/google/callback', async (req, res) => {
    const code = req.query.code;
  
    try {
      // Intercambiar el código de autorización por un token de acceso
      const response = await axios.post('https://oauth2.googleapis.com/token', querystring.stringify({
        code: code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code'
      }));
  
      const accessToken = response.data.access_token;
  
      // Ahora, con el token de acceso, obtener el perfil del usuario
      const userInfoResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`);
      const userInfo = userInfoResponse.data;
  
      // Verificar si el usuario ya existe en la base de datos
      let user = await User.findOne({ where: { id: userInfo.id } });
  
      if (!user) {
        // Si el usuario no existe, guardarlo en la base de datos
        user = await User.create({
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture
        });
        console.log('Usuario guardado en la base de datos');
      }
  
      // Generar el token JWT con la información del usuario
      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: '1h',
      });
  
      // Redirigir al frontend con el token JWT
      res.redirect(`http://localhost:3000?token=${token}`);
  
    } catch (error) {
      console.error('Error al intercambiar el código por el token:', error);
      res.status(500).json({ message: 'Error al autenticar' });
    }
  });

// Ruta protegida
app.get('/protected', (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: 'Access granted to protected route', user: decoded });
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
