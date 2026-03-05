import express, { Request, Response } from 'express';
import path from 'path';

import 'dotenv/config';
import authRoutes from './routes/auth.routes';
import { authenticate, authorize } from './middlewares/auth.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, '..', 'public')));
// ruta login (pagina por defecto)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});

// ruta register
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
});



app.use('/auth', authRoutes);

app.get('/public', (req: Request, res: Response) => {
  res.json({
    message: 'Cualquiera puede entrar!',
  });
});

app.get('/protected', authenticate, (req, res) => {
  res.json({
    message: 'Acceso permitido',
  });
});

// Ruta de administrador (requiere autenticación y rol admin)
app.get('/admin', authenticate, authorize(['admin']), (req, res) => {
  res.json({
    message: 'Acceso de administrador permitido',
  });
});

// Iniciar el servidor HTTP
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
});