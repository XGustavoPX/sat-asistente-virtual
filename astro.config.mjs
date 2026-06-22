import { defineConfig } from 'astro/config';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 4321,  // ← Convierte a número
    allowedHosts: [
      'sat-asistente-virtual.onrender.com',
      '.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  }
});