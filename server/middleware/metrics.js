import promClient from 'prom-client';
const register = new promClient.Registry();

register.setDefaultLabels({
  app: 'AM-Botonics',
});

promClient.collectDefaultMetrics({ register });

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

const httpRequestsTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections'
});

const orderMetrics = new promClient.Counter({
  name: 'orders_total',
  help: 'Total number of orders',
  labelNames: ['status', 'payment_method']
});

const productViews = new promClient.Counter({
  name: 'product_views_total',
  help: 'Total number of product views',
  labelNames: ['product_id']
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);
register.registerMetric(activeConnections);
register.registerMetric(orderMetrics);
register.registerMetric(productViews);

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestsTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });

  next();
};

export const incrementOrderMetric = (status, paymentMethod) => {
  orderMetrics.labels(status, paymentMethod).inc();
};

export const incrementProductView = (productId) => {
  productViews.labels(productId).inc();
};

export const setActiveConnections = (count) => {
  activeConnections.set(count);
};

export const getMetrics = async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.end(metrics);
  } catch (error) {
    res.status(500).end(error);
  }
};

export { register };