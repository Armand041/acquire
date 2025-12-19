require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const acquireRoutes = require('./routes/acquireRoutes');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/acquire_db';

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: "ok", service: "acquire" }));
app.use('/', acquireRoutes);

mongoose.connect(MONGO_URI)
    .then(() => console.log('Conectado a MongoDB (acquire)'))
    .catch(err => console.error('Error MongoDB:', err));

app.listen(PORT, () => {
    console.log('[ACQUIRE] Servicio corriendo en puerto ${PORT}');
});