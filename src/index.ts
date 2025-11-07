import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact.routes';
import listRoutes from './routes/list.routes';
import tagRoutes from './routes/tag.routes';
import segmentRoutes from './routes/segment.routes';
import importRoutes from './routes/import.routes';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'Email Marketing CRM API',
    version: '1.0.0',
    status: 'running',
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rotas da API
app.use('/api/contacts', contactRoutes);
app.use('/api/lists', listRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/segments', segmentRoutes);
app.use('/api/imports', importRoutes);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email Marketing CRM API`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n📋 Available endpoints:`);
  console.log(`   - GET  /health`);
  console.log(`   - POST /api/contacts`);
  console.log(`   - GET  /api/contacts`);
  console.log(`   - POST /api/lists`);
  console.log(`   - GET  /api/lists`);
  console.log(`   - POST /api/tags`);
  console.log(`   - GET  /api/tags`);
  console.log(`   - POST /api/segments`);
  console.log(`   - GET  /api/segments`);
  console.log(`   - POST /api/imports/csv`);
  console.log(`   - POST /api/imports/woocommerce`);
});

export default app;
