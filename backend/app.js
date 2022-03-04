// Create an express application
const express =  require('express');
const app = express();
const mongoose = require('mongoose');

/// Importer dotenv
const dotenv = require('dotenv').config();
const DB_NAME = dotenv.parsed.DB_NAME;
const DB_USER = dotenv.parsed.DB_USER;
const DB_PASS = dotenv.parsed.DB_PASS;
const DB_CONNECTION_URL =  'mongodb+srv://' + DB_USER +':'+ DB_PASS+ '@cluster0.fxvn3.mongodb.net/'+ DB_NAME+ '?retryWrites=true&w=majority';
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// connexion a la base de donnees avec mongoose
mongoose.connect(DB_CONNECTION_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true})
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

/// Systeme de securite Cors origin ressource sharing
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(helmet());
app.use(express.json());
app.use('/images' , express.static(path.join(__dirname , 'images')));
app.use('/api/auth' , userRoutes);
app.use('/api' , sauceRoutes);

module.exports = app;