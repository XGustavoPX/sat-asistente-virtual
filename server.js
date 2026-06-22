const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos
app.use(express.static(__dirname));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API para el logo (opcional)
app.get('/api/logo-base64', (req, res) => {
  // Si tienes un logo en base64, devuélvelo aquí
  res.json({ base64: null });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor SAT corriendo en http://localhost:${PORT}`);
});