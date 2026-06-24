const fs = require("fs");
const path = require("path");
const express = require("express");
const bodyParser = require('body-parser');
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');
const notFound = require('./middleware/notFound');
const { limiter, generatorLimiter } = require('./middleware/rateLimiter');
const authRoute = require('./routes/AuthRoutes');

dotenv.config();

const app = express();

// ---------- Sécurité ----------
app.use(helmet());
app.use(limiter);

// ---------- Middlewares ----------
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (
      origin.includes('vercel.app') || 
      origin.includes('onrender.com') || // ⭐ AJOUTÉ pour Render
      origin === 'http://localhost:3000'
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(bodyParser.json());

// ---------- Connexion à MongoDB ----------
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connecté ✅"))
.catch(err => console.log("Erreur MongoDB :", err));

// ---------- Route test ----------
app.get("/", (req, res) => {
  res.send("Backend Generator is running 🚀");
});

// ---------- Swagger ----------
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log("Swagger disponible sur http://localhost:5000/api-docs ✅");

// ---------- Auth Route ----------
app.use('/api/auth', authRoute);

// ---------- Charger toutes les routes ----------
const routesPath = path.join(__dirname, "routes");
fs.readdirSync(routesPath).forEach(file => {
  if (file.endsWith("Routes.js")) {
    const route = require(`./routes/${file}`);
    const routeName = file.replace("Routes.js", "").toLowerCase();
    app.use(`/api/${routeName}`, route);
    console.log(`Route /api/${routeName} chargée ✅`);
  }
});

// ---------- Generator avec rate limiter spécial ----------
app.use('/api/generator', generatorLimiter);

// ---------- Middleware erreurs ----------
app.use(notFound);
app.use(errorHandler);

// ---------- Lancer le serveur ----------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🔐`);
});