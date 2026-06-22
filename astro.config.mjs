import { defineConfig } from 'astro/config';

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 4321,
    allowedHosts: [
      'sat-asistente-virtual.onrender.com',
      '.onrender.com',
      'localhost',
      '127.0.0.1'
    ]
  },
  // Si usas Vite para algo específico, ve aquí:
  vite: {
    server: {
      allowedHosts: [
        'sat-asistente-virtual.onrender.com',
        '.onrender.com',
        'localhost',
        '127.0.0.1'
      ]
    }
  }
});