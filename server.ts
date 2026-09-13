import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { INITIAL_PRODUCTS, INITIAL_OFFERS } from './src/data/initialData';
import { Product, Order, FlashOffer, SearchMetric, AppNotification } from './src/types';

// In-memory persistent state while server is alive
let products: Product[] = [...INITIAL_PRODUCTS];
let offers: FlashOffer[] = [...INITIAL_OFFERS];
let orders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: 'VOLTS-89210',
    userId: 'cust-demo-1',
    customer: {
      name: 'Kasun Perera',
      email: 'kasun.p@gmail.com',
      phone: '+94 77 123 4567',
      address: '42/B, Galle Road, Bambalapitiya',
      city: 'Colombo',
      district: 'Colombo',
      postalCode: '00400',
      notes: 'Please call before delivery'
    },
    items: [
      {
        productId: 'prod-xenofold-pro',
        title: 'XenoFold Pro 5G - Titanium Edition',
        price: 1799.00,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
        color: 'Midnight Titanium',
        storage: '256GB Included'
      }
    ],
    subtotal: 1799.00,
    discountAmount: 179.90,
    shippingFee: 0,
    total: 1619.10,
    currency: 'USD',
    paymentMethod: 'koko_bnpl',
    paymentStatus: 'paid',
    kokoInstallments: {
      totalInstallments: 3,
      amountPerInstallment: 539.70,
      paidInstallments: 1
    },
    status: 'dispatched',
    trackingNumber: 'LK-DOM-994821',
    courierName: 'Pronto Express Sri Lanka',
    estimatedDelivery: 'Tomorrow, by 4:00 PM',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 86400000).toISOString(), note: 'Order placed via Koko BNPL' },
      { status: 'confirmed', timestamp: new Date(Date.now() - 80000000).toISOString(), note: 'Koko 1st installment verified' },
      { status: 'processing', timestamp: new Date(Date.now() - 60000000).toISOString(), note: 'Item packaged & inspected in Colombo 03 hub' },
      { status: 'dispatched', timestamp: new Date(Date.now() - 20000000).toISOString(), note: 'Handed over to Pronto Express (AWB: LK-DOM-994821)' }
    ]
  },
  {
    id: 'ord-1002',
    orderNumber: 'VOLTS-89211',
    userId: 'cust-demo-2',
    customer: {
      name: 'Nadeesha Senanayake',
      email: 'nadeesha.s@yahoo.com',
      phone: '+94 71 987 6543',
      address: '15/4 Peradeniya Road',
      city: 'Kandy',
      district: 'Kandy',
      postalCode: '20000'
    },
    items: [
      {
        productId: 'prod-sonicflow-pro',
        title: 'SonicFlow Pro Wireless Noise Canceling Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
        color: 'Matte Obsidian'
      },
      {
        productId: 'prod-baseus-blade-100w',
        title: 'Baseus Blade 100W GaN Ultra-Slim Power Bank 20,000mAh',
        price: 89.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
        color: 'Obsidian Black'
      }
    ],
    subtotal: 389.98,
    discountAmount: 38.99,
    shippingFee: 0,
    total: 350.99,
    currency: 'USD',
    paymentMethod: 'ipg_card',
    paymentStatus: 'paid',
    status: 'processing',
    trackingNumber: 'LK-DOM-994822',
    courierName: 'Certis Lanka Logistics',
    estimatedDelivery: 'In 2 days',
    createdAt: new Date(Date.now() - 36000000).toISOString(),
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 36000000).toISOString(), note: 'Order placed online' },
      { status: 'confirmed', timestamp: new Date(Date.now() - 35000000).toISOString(), note: 'Card payment authorized via IPG' },
      { status: 'processing', timestamp: new Date(Date.now() - 10000000).toISOString(), note: 'Quality check completed, boxing for dispatch' }
    ]
  }
];

let searchMetrics: SearchMetric[] = [
  { query: 'iPhone 15', count: 184, lastSearched: new Date().toISOString(), resultsCount: 4 },
  { query: 'MacBook M3', count: 142, lastSearched: new Date().toISOString(), resultsCount: 2 },
  { query: 'OLED TV', count: 96, lastSearched: new Date().toISOString(), resultsCount: 1 },
  { query: 'Baseus GaN', count: 85, lastSearched: new Date().toISOString(), resultsCount: 2 },
  { query: 'Washing Machine', count: 64, lastSearched: new Date().toISOString(), resultsCount: 1 },
  { query: 'Type C Cable', count: 58, lastSearched: new Date().toISOString(), resultsCount: 3 }
];

let notifications: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'order',
    title: 'New Order Received: VOLTS-89211',
    message: 'Nadeesha Senanayake purchased SonicFlow Pro & Baseus Blade 100W ($350.99)',
    timestamp: new Date(Date.now() - 36000000).toISOString(),
    read: false,
    orderId: 'ord-1002'
  },
  {
    id: 'notif-2',
    type: 'stock',
    title: 'Low Stock Alert: LG 9kg AI DD Washing Machine',
    message: 'Only 6 units remaining in Colombo central stock.',
    timestamp: new Date(Date.now() - 72000000).toISOString(),
    read: true
  }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Routes ---

  // Health Check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', store: 'Volts Electronics', version: '2.0.0' });
  });

  // Get Products (supports search, category, brand, sorting, promo filters)
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, search, brand, sort, flashOnly, inStockOnly } = req.query;
    
    let result = [...products];

    if (search && typeof search === 'string' && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.specChips.some(chip => chip.toLowerCase().includes(q))
      );

      // Log search metric
      const existing = searchMetrics.find(m => m.query.toLowerCase() === q);
      if (existing) {
        existing.count += 1;
        existing.lastSearched = new Date().toISOString();
        existing.resultsCount = result.length;
      } else {
        searchMetrics.unshift({
          query: search.trim(),
          count: 1,
          lastSearched: new Date().toISOString(),
          resultsCount: result.length
        });
      }
    }

    if (category && category !== 'all' && typeof category === 'string') {
      result = result.filter(p => p.category === category);
    }

    if (brand && typeof brand === 'string') {
      const brands = brand.split(',');
      result = result.filter(p => brands.includes(p.brand));
    }

    if (flashOnly === 'true') {
      result = result.filter(p => p.isFlashDeal);
    }

    if (inStockOnly === 'true') {
      result = result.filter(p => p.stock > 0);
    }

    if (sort === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'discount') {
      result.sort((a, b) => b.discountPercent - a.discountPercent);
    } else if (sort === 'newest') {
      result.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    res.json(result);
  });

  // Get single product
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    // Increment view count
    product.viewsCount = (product.viewsCount || 0) + 1;
    res.json(product);
  });

  // Create Product (Admin)
  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct: Product = {
      ...req.body,
      id: 'prod-' + Date.now(),
      rating: req.body.rating || 5.0,
      reviewsCount: req.body.reviewsCount || 0,
      viewsCount: 1,
      salesCount: 0,
      specChips: req.body.specChips || [],
      specs: req.body.specs || [],
      colors: req.body.colors || [{ name: 'Default', hex: '#000000', inStock: true }],
      images: req.body.images?.length ? req.body.images : ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'],
      inTheBox: req.body.inTheBox || ['Device', 'Charging Cable', 'Manual'],
      warranty: req.body.warranty || '1 Year Official Warranty'
    };

    products.unshift(newProduct);
    res.status(201).json(newProduct);
  });

  // Update Product (Admin on-the-spot price, discount, stock, flash deal)
  app.put('/api/products/:id', (req: Request, res: Response) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updated: Product = {
      ...products[index],
      ...req.body
    };

    // Calculate discount percent if originalPrice and price changed
    if (req.body.originalPrice && req.body.price && req.body.originalPrice > req.body.price) {
      updated.discountPercent = Math.round(((req.body.originalPrice - req.body.price) / req.body.originalPrice) * 100);
    }

    products[index] = updated;

    // Check for low stock notification
    if (updated.stock <= updated.lowStockThreshold) {
      notifications.unshift({
        id: 'notif-' + Date.now(),
        type: 'stock',
        title: `Low Stock Alert: ${updated.title}`,
        message: `Stock level dropped to ${updated.stock} units (Threshold: ${updated.lowStockThreshold}).`,
        timestamp: new Date().toISOString(),
        read: false
      });
    }

    res.json(updated);
  });

  // Delete Product (Admin)
  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const deleted = products.splice(index, 1)[0];
    res.json({ message: 'Product deleted', product: deleted });
  });

  // Get Orders (Admin or Customer)
  app.get('/api/orders', (req: Request, res: Response) => {
    const { email, userId } = req.query;
    let list = [...orders];
    if (email && typeof email === 'string') {
      list = list.filter(o => o.customer.email.toLowerCase() === email.toLowerCase());
    } else if (userId && typeof userId === 'string') {
      list = list.filter(o => o.userId === userId);
    }
    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(list);
  });

  // Get Order by Order Number or ID
  app.get('/api/orders/:identifier', (req: Request, res: Response) => {
    const id = req.params.identifier.toUpperCase();
    const order = orders.find(o => o.id === req.params.identifier || o.orderNumber.toUpperCase() === id || o.trackingNumber.toUpperCase() === id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  // Create Order
  app.post('/api/orders', (req: Request, res: Response) => {
    const body = req.body;
    const orderNumber = 'VOLTS-' + Math.floor(10000 + Math.random() * 90000);
    const trackingNumber = 'LK-DOM-' + Math.floor(100000 + Math.random() * 900000);
    
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      userId: body.userId || 'guest-' + Date.now(),
      customer: body.customer,
      items: body.items,
      subtotal: body.subtotal,
      discountAmount: body.discountAmount || 0,
      shippingFee: body.shippingFee || 0,
      total: body.total,
      currency: body.currency || 'LKR',
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentMethod === 'cod' ? 'cod_pending' : (body.paymentMethod === 'bank_transfer' ? 'pending_verification' : 'paid'),
      bankTransferRef: body.bankTransferRef,
      kokoInstallments: body.kokoInstallments,
      status: 'pending',
      trackingNumber,
      courierName: 'Pronto Express Islandwide',
      estimatedDelivery: 'Within 2-3 Business Days',
      createdAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: `Order placed successfully via ${body.paymentMethod === 'koko_bnpl' ? 'Koko BNPL' : body.paymentMethod === 'ipg_card' ? 'Card IPG' : body.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery'}`
        }
      ]
    };

    // Deduct stock and increment sales count
    body.items.forEach((item: { productId: string; quantity: number }) => {
      const p = products.find(prod => prod.id === item.productId);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
        p.salesCount = (p.salesCount || 0) + item.quantity;
      }
    });

    orders.unshift(newOrder);

    // Create Admin notification
    const totalDisplay = body.currency === 'LKR' ? `Rs. ${body.total.toLocaleString()}` : `$${body.total.toFixed(2)}`;
    notifications.unshift({
      id: 'notif-' + Date.now(),
      type: 'order',
      title: `⚡ New Order Placed: ${orderNumber}`,
      message: `${body.customer.name} ordered ${body.items.length} item(s) (${totalDisplay}) via ${body.paymentMethod.toUpperCase()}`,
      timestamp: new Date().toISOString(),
      read: false,
      orderId: newOrder.id
    });

    res.status(201).json(newOrder);
  });

  // Update Order Status (Admin)
  app.patch('/api/orders/:id/status', (req: Request, res: Response) => {
    const { status, note, trackingNumber, courierName } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courierName) order.courierName = courierName;

    if (status === 'confirmed' && order.paymentStatus === 'pending_verification') {
      order.paymentStatus = 'paid';
    }

    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note: note || `Status updated to ${status.toUpperCase()} by store manager`
    });

    res.json(order);
  });

  // Flash Offers API
  app.get('/api/offers', (_req: Request, res: Response) => {
    res.json(offers);
  });

  app.post('/api/offers', (req: Request, res: Response) => {
    const newOffer: FlashOffer = {
      id: 'offer-' + Date.now(),
      code: req.body.code.toUpperCase(),
      title: req.body.title,
      discountPercent: Number(req.body.discountPercent) || 0,
      freeShipping: Boolean(req.body.freeShipping),
      minSpendUSD: Number(req.body.minSpendUSD) || 0,
      expiresAt: req.body.expiresAt || new Date(Date.now() + 86400000 * 7).toISOString(),
      isActive: true,
      bannerText: req.body.bannerText || `Special Offer: Use code ${req.body.code.toUpperCase()}`
    };
    offers.unshift(newOffer);
    res.status(201).json(newOffer);
  });

  app.patch('/api/offers/:id/toggle', (req: Request, res: Response) => {
    const offer = offers.find(o => o.id === req.params.id);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    offer.isActive = !offer.isActive;
    res.json(offer);
  });

  // Admin Metrics & Dashboard Analytics
  app.get('/api/admin/metrics', (_req: Request, res: Response) => {
    const totalRevenueUSD = orders.reduce((sum, o) => {
      const val = o.currency === 'LKR' ? o.total / 310 : o.total;
      return sum + (o.status !== 'cancelled' ? val : 0);
    }, 0);

    const lowStockCount = products.filter(p => p.stock <= p.lowStockThreshold).length;
    const activeDiscountsCount = products.filter(p => p.discountPercent > 0).length + offers.filter(o => o.isActive).length;

    // Last 7 days sales aggregation
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const recentSalesVolume = days.map((day, i) => ({
      date: day,
      amount: Math.round(1200 + (i * 350) + (Math.sin(i) * 300)),
      ordersCount: 4 + (i % 3) * 2
    }));

    res.json({
      totalRevenueUSD: Math.round(totalRevenueUSD * 100) / 100,
      totalOrders: orders.length,
      totalProducts: products.length,
      lowStockCount,
      activeDiscountsCount,
      topSearchTerms: searchMetrics.slice(0, 8),
      recentSalesVolume
    });
  });

  // Notifications API
  app.get('/api/notifications', (_req: Request, res: Response) => {
    res.json(notifications);
  });

  app.patch('/api/notifications/read-all', (_req: Request, res: Response) => {
    notifications.forEach(n => { n.read = true; });
    res.json({ success: true });
  });

  // Customer Directory (for email marketing export)
  app.get('/api/customers', (_req: Request, res: Response) => {
    // Unique customers extracted from orders & registrations
    const customerMap = new Map();
    orders.forEach(o => {
      if (!customerMap.has(o.customer.email)) {
        customerMap.set(o.customer.email, {
          name: o.customer.name,
          email: o.customer.email,
          phone: o.customer.phone,
          city: o.customer.city,
          district: o.customer.district,
          totalSpentUSD: o.currency === 'LKR' ? o.total / 310 : o.total,
          ordersCount: 1,
          lastOrderDate: o.createdAt
        });
      } else {
        const c = customerMap.get(o.customer.email);
        c.totalSpentUSD += (o.currency === 'LKR' ? o.total / 310 : o.total);
        c.ordersCount += 1;
      }
    });

    res.json(Array.from(customerMap.values()));
  });

  // Vite middleware for development / Static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Volts Electronics Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
