const express = require('express');
const acquireRoutes = require('./routes/acquireRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health
app.get('/health', (req, res) => {
    res.json({
        status: "ok",
        service: "acquire",
        version: "1.0"
    });
});

// Ready
app.get('/ready', (req, res) => {
    res.json({
        ready: true,
        service: "acquire"
    });
});

// Rutas de acquire
app.use('/', acquireRoutes);

app.listen(PORT, () => {
    console.log('[ACQUIRE] Servicio en http://localhost:${PORT}');
});