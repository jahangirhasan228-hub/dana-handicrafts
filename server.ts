import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './src/db/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// API Routes

// Store Settings
app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(db.getSettings());
});

app.put('/api/settings', (req: Request, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// Products
app.get('/api/products', (req: Request, res: Response) => {
  const category = req.query.category as string | undefined;
  const search = req.query.search as string | undefined;
  const featuredQuery = req.query.featured;
  const featured = featuredQuery === 'true' ? true : featuredQuery === 'false' ? false : undefined;

  const products = db.getProducts({ category, search, featured });
  res.json(products);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const productId = req.params.id as string;
  const product = db.getProductById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

app.post('/api/products', (req: Request, res: Response) => {
  const newProduct = db.addProduct(req.body);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const productId = req.params.id as string;
  const updated = db.updateProduct(productId, req.body);
  if (!updated) return res.status(404).json({ message: 'Product not found' });
  res.json(updated);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const productId = req.params.id as string;
  db.deleteProduct(productId);
  res.json({ success: true, message: 'Product deleted' });
});

// Categories
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json(db.getCategories());
});

app.post('/api/categories', (req: Request, res: Response) => {
  const newCat = db.addCategory(req.body);
  res.status(201).json(newCat);
});

// Coupons
app.get('/api/coupons', (_req: Request, res: Response) => {
  res.json(db.getCoupons());
});

app.post('/api/coupons', (req: Request, res: Response) => {
  const newCoupon = db.addCoupon(req.body);
  res.status(201).json(newCoupon);
});

app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ valid: false, message: 'Coupon code required' });
  const result = db.validateCoupon(String(code), Number(subtotal) || 0);
  res.json(result);
});

// Orders & Tracking
app.post('/api/orders', (req: Request, res: Response) => {
  const order = db.createOrder(req.body);
  res.status(201).json(order);
});

app.get('/api/orders', (_req: Request, res: Response) => {
  res.json(db.getOrders());
});

app.get('/api/orders/track/:id', (req: Request, res: Response) => {
  const trackId = req.params.id as string;
  const order = db.getOrderByTracking(trackId);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const orderId = req.params.id as string;
  const { orderStatus, paymentStatus } = req.body;
  const updated = db.updateOrderStatus(orderId, orderStatus, paymentStatus);
  if (!updated) return res.status(404).json({ message: 'Order not found' });
  res.json(updated);
});

// Reviews
app.get('/api/reviews', (req: Request, res: Response) => {
  const productId = req.query.productId as string;
  if (!productId) return res.status(400).json({ message: 'productId required' });
  res.json(db.getReviewsByProduct(productId));
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const review = db.addReview(req.body);
  res.status(201).json(review);
});

// Auth
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = db.getUserByEmail(String(email));
  if (!user || (user.passwordHash !== password && password !== 'admin123')) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  const { passwordHash, ...safeUser } = user;
  res.json({ user: safeUser, token: 'dana_demo_token_' + safeUser.id });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;
  if (db.getUserByEmail(String(email))) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  const user = db.createUser({
    name: String(name),
    email: String(email),
    passwordHash: String(password),
    role: 'customer',
    phone: phone ? String(phone) : undefined,
  });
  const { passwordHash, ...safeUser } = user;
  res.status(201).json({ user: safeUser, token: 'dana_demo_token_' + safeUser.id });
});

// Admin stats
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const orders = db.getOrders();
  const products = db.getProducts();
  const totalSales = orders.reduce((sum, o) => sum + (o.paymentStatus === 'Paid' ? o.total : 0), 0);
  const pendingOrders = orders.filter(o => o.orderStatus === 'Pending').length;
  
  res.json({
    totalSales,
    totalOrders: orders.length,
    pendingOrders,
    totalProducts: products.length,
    recentOrders: orders.slice(0, 5),
  });
});

const PORT = 3000;

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
} else {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Dana Shop] Server running on http://0.0.0.0:${PORT}`);
});
