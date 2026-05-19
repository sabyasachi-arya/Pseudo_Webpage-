const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes, Op } = require('sequelize');

dotenv.config();

function nowIso() {
  return new Date().toISOString();
}

function log(level, event, meta) {
  const payload = {
    ts: nowIso(),
    level,
    event,
    ...(meta && typeof meta === 'object' ? meta : {}),
  };
  // PM2 captures stdout/stderr; JSON logs are easy to parse
  const line = JSON.stringify(payload);
  if (level === 'error') {
    // eslint-disable-next-line no-console
    console.error(line);
  } else {
    // eslint-disable-next-line no-console
    console.log(line);
  }
}

process.on('unhandledRejection', (reason) => {
  log('error', 'process.unhandledRejection', {
    reason: reason instanceof Error ? reason.message : String(reason),
  });
});

process.on('uncaughtException', (err) => {
  log('error', 'process.uncaughtException', { message: err.message });
  process.exit(1);
});

function requireEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

const PORT = Number(process.env.PORT || 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const JWT_SECRET = requireEnv('JWT_SECRET');

function parseOrigins(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function normalizeOrigin(origin) {
  if (!origin) return origin;
  return String(origin).replace(/\/+$/, '');
}

const allowedOrigins = parseOrigins(CORS_ORIGIN).map(normalizeOrigin);

const sequelize = new Sequelize(
  process.env.DB_NAME || 'ajiva_crm',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false,
    define: {
      underscored: true,
      freezeTableName: true,
    },
  },
);

const User = sequelize.define(
  'users',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'sales', 'operations', 'accountant'),
      allowNull: false,
      defaultValue: 'sales',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    indexes: [{ unique: true, fields: ['email'] }],
  },
);

const Customer = sequelize.define(
  'customers',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    contact_person: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    region: {
      type: DataTypes.ENUM('GCC', 'China', 'India', 'Africa', 'International'),
      allowNull: false,
      defaultValue: 'International',
    },
    tax_id: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    assigned_to: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  },
);

const Vendor = sequelize.define(
  'vendors',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    vendor_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    vendor_type: {
      type: DataTypes.ENUM('carrier', 'shipping_line', 'agent', 'warehouse', 'other'),
      allowNull: false,
      defaultValue: 'other',
    },
    contact_person: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    whatsapp: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    countries_supported: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    indexes: [{ fields: ['vendor_name'] }],
  },
);

const VendorRateCard = sequelize.define(
  'vendor_rate_cards',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    vendor_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    lane_type: {
      type: DataTypes.ENUM('FCL', 'LCL', 'Air', 'Road_FTL', 'Road_LTL'),
      allowNull: false,
    },
    origin_country: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    origin_city: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    destination_country: {
      type: DataTypes.STRING(128),
      allowNull: true,
    },
    destination_city: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    currency: {
      type: DataTypes.ENUM('AED', 'USD', 'SAR'),
      allowNull: false,
      defaultValue: 'AED',
    },
    base_rate: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    min_charge: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    valid_from: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    valid_to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    indexes: [{ fields: ['vendor_id'] }],
  },
);

const Lead = sequelize.define(
  'leads',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    company_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    contact_person: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: { isEmail: true },
    },
    phone: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    region: {
      type: DataTypes.ENUM('GCC', 'China', 'India', 'Africa', 'International'),
      allowNull: false,
      defaultValue: 'International',
    },
    source: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    outreach_status: {
      type: DataTypes.ENUM('new', 'contacted', 'responded', 'qualified', 'lost'),
      allowNull: false,
      defaultValue: 'new',
    },
    response_summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    last_contacted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    next_follow_up_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    assigned_to: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    indexes: [{ fields: ['company_name'] }, { fields: ['assigned_to'] }],
  },
);

const LeadActivity = sequelize.define(
  'lead_activities',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    lead_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    activity_type: {
      type: DataTypes.ENUM('call', 'whatsapp', 'email', 'meeting', 'note'),
      allowNull: false,
      defaultValue: 'note',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    indexes: [{ fields: ['lead_id'] }],
  },
);

const AuditLog = sequelize.define(
  'audit_log',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    entity_type: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    action: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    actor_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    before_json: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    after_json: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    indexes: [{ fields: ['entity_type', 'entity_id'] }, { fields: ['created_at'] }],
  },
);

const Quote = sequelize.define(
  'quotes',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customer_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    origin_city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    destination_city: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    cargo_type: {
      type: DataTypes.ENUM('FCL', 'LCL', 'Air', 'Road_FTL', 'Road_LTL'),
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    currency: {
      type: DataTypes.ENUM('AED', 'USD', 'SAR'),
      allowNull: false,
      defaultValue: 'AED',
    },
    status: {
      type: DataTypes.ENUM('draft', 'sent', 'approved', 'expired'),
      allowNull: false,
      defaultValue: 'draft',
    },
    valid_until: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    selected_vendor_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    vendor_rate_card_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    cost_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    margin_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    finalized_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    timestamps: false,
  },
);

const Shipment = sequelize.define(
  'shipments',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quote_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    tracking_number: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    current_status: {
      type: DataTypes.ENUM(
        'booked',
        'at_origin',
        'in_transit',
        'customs_clearance',
        'out_for_delivery',
        'delivered',
      ),
      allowNull: false,
      defaultValue: 'booked',
    },
    carrier_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    estimated_delivery: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    actual_delivery: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    vendor_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    vendor_reference: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    cost_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    revenue_amount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
  },
  {
    timestamps: false,
    indexes: [{ unique: true, fields: ['tracking_number'] }],
  },
);

const Document = sequelize.define(
  'documents',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    shipment_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    doc_type: {
      type: DataTypes.ENUM('BOL', 'Commercial_Invoice', 'Packing_List', 'COO', 'Customs_Exit'),
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    uploaded_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
);

Customer.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });
User.hasMany(Customer, { foreignKey: 'assigned_to', as: 'customers' });

Quote.belongsTo(Customer, { foreignKey: 'customer_id', as: 'customer' });
Customer.hasMany(Quote, { foreignKey: 'customer_id', as: 'quotes' });

Shipment.belongsTo(Quote, { foreignKey: 'quote_id', as: 'quote' });
Quote.hasOne(Shipment, { foreignKey: 'quote_id', as: 'shipment' });

Document.belongsTo(Shipment, { foreignKey: 'shipment_id', as: 'shipment' });
Shipment.hasMany(Document, { foreignKey: 'shipment_id', as: 'documents' });

Document.belongsTo(User, { foreignKey: 'uploaded_by', as: 'uploader' });
User.hasMany(Document, { foreignKey: 'uploaded_by', as: 'documents' });

VendorRateCard.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });
Vendor.hasMany(VendorRateCard, { foreignKey: 'vendor_id', as: 'rate_cards' });

Lead.belongsTo(User, { foreignKey: 'assigned_to', as: 'assignee' });
User.hasMany(Lead, { foreignKey: 'assigned_to', as: 'leads' });

LeadActivity.belongsTo(Lead, { foreignKey: 'lead_id', as: 'lead' });
Lead.hasMany(LeadActivity, { foreignKey: 'lead_id', as: 'activities' });

LeadActivity.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
User.hasMany(LeadActivity, { foreignKey: 'created_by', as: 'lead_activities' });

Quote.belongsTo(Vendor, { foreignKey: 'selected_vendor_id', as: 'selected_vendor' });
Vendor.hasMany(Quote, { foreignKey: 'selected_vendor_id', as: 'quotes' });

Quote.belongsTo(VendorRateCard, { foreignKey: 'vendor_rate_card_id', as: 'vendor_rate_card' });
VendorRateCard.hasMany(Quote, { foreignKey: 'vendor_rate_card_id', as: 'quotes' });

Shipment.belongsTo(Vendor, { foreignKey: 'vendor_id', as: 'vendor' });
Vendor.hasMany(Shipment, { foreignKey: 'vendor_id', as: 'shipments' });

function snapshotModel(model) {
  if (!model) return null;
  if (typeof model.toJSON === 'function') return model.toJSON();
  return null;
}

async function writeAudit(req, action, entityType, entityId, beforeModel, afterModel) {
  await AuditLog.create({
    entity_type: entityType,
    entity_id: entityId || null,
    action,
    actor_user_id: req.user && req.user.sub ? req.user.sub : null,
    before_json: snapshotModel(beforeModel),
    after_json: snapshotModel(afterModel),
    ip: String(req.headers['x-real-ip'] || req.ip || ''),
    user_agent: String(req.headers['user-agent'] || ''),
  });
}

function signToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email, full_name: user.full_name },
    JWT_SECRET,
    { expiresIn: '12h' },
  );
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization;
  if (!h || !h.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = h.slice('Bearer '.length);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (!allowed.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    return next();
  };
}

function trackingNumber() {
  const rand = Math.random().toString(16).slice(2, 10).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase();
  return `AJV-${ts}-${rand}`;
}

async function ensureBootstrapAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const fullName = process.env.ADMIN_FULL_NAME || 'Admin';

  if (!email || !password) return;

  const existing = await User.findOne({ where: { email } });
  if (existing) return;

  const password_hash = await bcrypt.hash(password, 12);
  await User.create({ email, password_hash, full_name: fullName, role: 'admin' });
  // No console logs to keep output clean under PM2
}

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server / Postman calls (no Origin header)
      if (!origin) return callback(null, true);
      const normalized = normalizeOrigin(origin);
      if (allowedOrigins.includes('*')) return callback(null, true);
      if (allowedOrigins.includes(normalized)) return callback(null, true);
      return callback(new Error(`Not allowed by CORS: ${normalized}`));
    },
    credentials: true,
  }),
);

// Make CORS failures explicit (instead of a generic 500)
app.use((err, req, res, next) => {
  if (err && typeof err.message === 'string' && err.message.startsWith('Not allowed by CORS')) {
    log('warn', 'http.cors_blocked', { origin: req.headers.origin || null, path: req.path, method: req.method });
    return res.status(403).json({ error: 'CORS blocked', detail: err.message });
  }
  return next(err);
});
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const requestId = `${Date.now().toString(36)}-${Math.random().toString(16).slice(2, 10)}`;
  req.requestId = requestId;
  res.setHeader('x-request-id', requestId);

  res.on('finish', () => {
    const ms = Date.now() - start;
    const userId = req.user && req.user.sub ? req.user.sub : null;
    const role = req.user && req.user.role ? req.user.role : null;
    log('info', 'http.request', {
      request_id: requestId,
      method: req.method,
      path: req.originalUrl || req.url,
      status: res.statusCode,
      ms,
      user_id: userId,
      role,
      ip: req.headers['x-real-ip'] || req.ip,
    });
  });

  return next();
});

app.get('/health', (req, res) => res.json({ ok: true }));

// Auth
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const user = await User.findOne({ where: { email } });
  if (!user) {
    log('warn', 'auth.login_failed', { email, reason: 'user_not_found', request_id: req.requestId });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    log('warn', 'auth.login_failed', { email, reason: 'bad_password', user_id: user.id, request_id: req.requestId });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  log('info', 'auth.login_success', { email, user_id: user.id, role: user.role, request_id: req.requestId });

  return res.json({ token: signToken(user), user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role } });
});

app.get('/auth/me', authMiddleware, async (req, res) => {
  const user = await User.findByPk(req.user.sub, { attributes: ['id', 'email', 'full_name', 'role', 'created_at'] });
  if (!user) return res.status(404).json({ error: 'User not found' });
  return res.json({ user });
});

app.get('/audit', authMiddleware, requireRole('admin'), async (req, res) => {
  const { entity_type, entity_id, limit } = req.query || {};
  const where = {};
  if (entity_type) where.entity_type = String(entity_type);
  if (entity_id) where.entity_id = String(entity_id);
  const rows = await AuditLog.findAll({
    where,
    order: [['created_at', 'DESC']],
    limit: Math.min(Number(limit || 200), 500),
  });
  return res.json({ audit: rows });
});

// Admin-only: Users
app.get('/admin/users', authMiddleware, requireRole('admin'), async (req, res) => {
  const users = await User.findAll({ attributes: ['id', 'email', 'full_name', 'role', 'created_at'], order: [['created_at', 'DESC']] });
  return res.json({ users });
});

app.post('/admin/users', authMiddleware, requireRole('admin'), async (req, res) => {
  const { email, password, full_name, role } = req.body || {};
  if (!email || !password || !full_name || !role) return res.status(400).json({ error: 'email, password, full_name, role required' });
  if (!['admin', 'sales', 'operations', 'accountant'].includes(role)) return res.status(400).json({ error: 'Invalid role' });

  const exists = await User.findOne({ where: { email } });
  if (exists) return res.status(409).json({ error: 'Email already in use' });

  const password_hash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, password_hash, full_name, role });
  log('info', 'admin.user_created', { actor_user_id: req.user.sub, created_user_id: user.id, created_email: user.email, created_role: user.role, request_id: req.requestId });
  await writeAudit(req, 'user.created', 'users', user.id, null, user);
  return res.status(201).json({ user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role, created_at: user.created_at } });
});

app.patch('/admin/users/:id', authMiddleware, requireRole('admin'), async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const before = snapshotModel(user);

  const { full_name, role, password } = req.body || {};

  if (role && !['admin', 'sales', 'operations', 'accountant'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  if (typeof full_name === 'string') user.full_name = full_name;
  if (typeof role === 'string') user.role = role;
  if (typeof password === 'string' && password.length > 0) {
    user.password_hash = await bcrypt.hash(password, 12);
  }

  await user.save();
  log('info', 'admin.user_updated', { actor_user_id: req.user.sub, updated_user_id: user.id, updated_role: user.role, request_id: req.requestId });
  await writeAudit(req, 'user.updated', 'users', user.id, { toJSON: () => before }, user);
  return res.json({ user: { id: user.id, email: user.email, full_name: user.full_name, role: user.role, created_at: user.created_at } });
});

app.get('/vendors', authMiddleware, requireRole(['admin', 'operations', 'accountant', 'sales']), async (req, res) => {
  const vendors = await Vendor.findAll({ order: [['created_at', 'DESC']] });
  return res.json({ vendors });
});

app.post('/vendors', authMiddleware, requireRole(['admin', 'operations', 'accountant']), async (req, res) => {
  const {
    vendor_name,
    vendor_type,
    contact_person,
    email,
    phone,
    whatsapp,
    address,
    country,
    countries_supported,
    status,
    notes,
  } = req.body || {};
  if (!vendor_name) return res.status(400).json({ error: 'vendor_name required' });

  const vendor = await Vendor.create({
    vendor_name,
    vendor_type: vendor_type || 'other',
    contact_person: contact_person || null,
    email: email || null,
    phone: phone || null,
    whatsapp: whatsapp || null,
    address: address || null,
    country: country || null,
    countries_supported: countries_supported || null,
    status: status || 'active',
    notes: notes || null,
  });

  log('info', 'crm.vendor_created', { actor_user_id: req.user.sub, vendor_id: vendor.id, request_id: req.requestId });
  await writeAudit(req, 'vendor.created', 'vendors', vendor.id, null, vendor);
  return res.status(201).json({ vendor });
});

app.patch('/vendors/:id', authMiddleware, requireRole(['admin', 'operations', 'accountant']), async (req, res) => {
  const vendor = await Vendor.findByPk(req.params.id);
  if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
  const before = snapshotModel(vendor);

  const fields = ['vendor_name', 'vendor_type', 'contact_person', 'email', 'phone', 'whatsapp', 'address', 'country', 'countries_supported', 'status', 'notes'];
  for (const f of fields) {
    if (Object.prototype.hasOwnProperty.call(req.body || {}, f)) vendor[f] = req.body[f];
  }

  await vendor.save();
  log('info', 'crm.vendor_updated', { actor_user_id: req.user.sub, vendor_id: vendor.id, request_id: req.requestId });
  await writeAudit(req, 'vendor.updated', 'vendors', vendor.id, { toJSON: () => before }, vendor);
  return res.json({ vendor });
});

app.get('/vendors/:vendorId/rate-cards', authMiddleware, requireRole(['admin', 'operations', 'accountant', 'sales']), async (req, res) => {
  const vendorId = req.params.vendorId;
  const vendor = await Vendor.findByPk(vendorId);
  if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
  const rate_cards = await VendorRateCard.findAll({ where: { vendor_id: vendorId }, order: [['created_at', 'DESC']] });
  return res.json({ vendor, rate_cards });
});

app.post('/vendors/:vendorId/rate-cards', authMiddleware, requireRole(['admin', 'operations', 'accountant']), async (req, res) => {
  const vendorId = req.params.vendorId;
  const vendor = await Vendor.findByPk(vendorId);
  if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

  const { lane_type, origin_country, origin_city, destination_country, destination_city, currency, base_rate, min_charge, valid_from, valid_to, notes } = req.body || {};
  if (!lane_type) return res.status(400).json({ error: 'lane_type required' });

  const rc = await VendorRateCard.create({
    vendor_id: vendorId,
    lane_type,
    origin_country: origin_country || null,
    origin_city: origin_city || null,
    destination_country: destination_country || null,
    destination_city: destination_city || null,
    currency: currency || 'AED',
    base_rate: base_rate || 0,
    min_charge: min_charge || null,
    valid_from: valid_from || null,
    valid_to: valid_to || null,
    notes: notes || null,
  });

  log('info', 'crm.vendor_rate_card_created', { actor_user_id: req.user.sub, vendor_id: vendorId, rate_card_id: rc.id, request_id: req.requestId });
  await writeAudit(req, 'vendor_rate_card.created', 'vendor_rate_cards', rc.id, null, rc);
  return res.status(201).json({ rate_card: rc });
});

app.patch('/vendor-rate-cards/:id', authMiddleware, requireRole(['admin', 'operations', 'accountant']), async (req, res) => {
  const rc = await VendorRateCard.findByPk(req.params.id);
  if (!rc) return res.status(404).json({ error: 'Rate card not found' });
  const before = snapshotModel(rc);
  const fields = ['lane_type', 'origin_country', 'origin_city', 'destination_country', 'destination_city', 'currency', 'base_rate', 'min_charge', 'valid_from', 'valid_to', 'notes'];
  for (const f of fields) {
    if (Object.prototype.hasOwnProperty.call(req.body || {}, f)) rc[f] = req.body[f];
  }
  await rc.save();
  log('info', 'crm.vendor_rate_card_updated', { actor_user_id: req.user.sub, rate_card_id: rc.id, vendor_id: rc.vendor_id, request_id: req.requestId });
  await writeAudit(req, 'vendor_rate_card.updated', 'vendor_rate_cards', rc.id, { toJSON: () => before }, rc);
  return res.json({ rate_card: rc });
});

app.get('/leads', authMiddleware, requireRole(['admin', 'sales']), async (req, res) => {
  const where = {};
  if (req.user.role === 'sales') where.assigned_to = req.user.sub;
  const leads = await Lead.findAll({ where, order: [['created_at', 'DESC']] });
  return res.json({ leads });
});

app.post('/leads', authMiddleware, requireRole(['admin', 'sales']), async (req, res) => {
  const {
    company_name,
    contact_person,
    email,
    phone,
    region,
    source,
    outreach_status,
    response_summary,
    last_contacted_at,
    next_follow_up_at,
    assigned_to,
  } = req.body || {};
  if (!company_name) return res.status(400).json({ error: 'company_name required' });

  const lead = await Lead.create({
    company_name,
    contact_person: contact_person || null,
    email: email || null,
    phone: phone || null,
    region: region || 'International',
    source: source || null,
    outreach_status: outreach_status || 'new',
    response_summary: response_summary || null,
    last_contacted_at: last_contacted_at || null,
    next_follow_up_at: next_follow_up_at || null,
    assigned_to: req.user.role === 'sales' ? req.user.sub : assigned_to || null,
  });

  log('info', 'crm.lead_created', { actor_user_id: req.user.sub, lead_id: lead.id, outreach_status: lead.outreach_status, request_id: req.requestId });
  await writeAudit(req, 'lead.created', 'leads', lead.id, null, lead);
  return res.status(201).json({ lead });
});

app.patch('/leads/:id', authMiddleware, requireRole(['admin', 'sales']), async (req, res) => {
  const lead = await Lead.findByPk(req.params.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  if (req.user.role === 'sales' && lead.assigned_to !== req.user.sub) return res.status(403).json({ error: 'Forbidden' });

  const before = snapshotModel(lead);
  const fields = [
    'company_name',
    'contact_person',
    'email',
    'phone',
    'region',
    'source',
    'outreach_status',
    'response_summary',
    'last_contacted_at',
    'next_follow_up_at',
  ];
  for (const f of fields) {
    if (Object.prototype.hasOwnProperty.call(req.body || {}, f)) lead[f] = req.body[f];
  }
  if (req.user.role === 'admin' && Object.prototype.hasOwnProperty.call(req.body || {}, 'assigned_to')) {
    lead.assigned_to = req.body.assigned_to || null;
  }
  await lead.save();

  log('info', 'crm.lead_updated', { actor_user_id: req.user.sub, lead_id: lead.id, outreach_status: lead.outreach_status, request_id: req.requestId });
  await writeAudit(req, 'lead.updated', 'leads', lead.id, { toJSON: () => before }, lead);
  return res.json({ lead });
});

app.get('/leads/:leadId/activities', authMiddleware, requireRole(['admin', 'sales']), async (req, res) => {
  const leadId = req.params.leadId;
  const lead = await Lead.findByPk(leadId);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  if (req.user.role === 'sales' && lead.assigned_to !== req.user.sub) return res.status(403).json({ error: 'Forbidden' });
  const activities = await LeadActivity.findAll({ where: { lead_id: leadId }, order: [['created_at', 'DESC']] });
  return res.json({ lead, activities });
});

app.post('/leads/:leadId/activities', authMiddleware, requireRole(['admin', 'sales']), async (req, res) => {
  const leadId = req.params.leadId;
  const lead = await Lead.findByPk(leadId);
  if (!lead) return res.status(404).json({ error: 'Lead not found' });
  if (req.user.role === 'sales' && lead.assigned_to !== req.user.sub) return res.status(403).json({ error: 'Forbidden' });

  const { activity_type, notes } = req.body || {};
  const act = await LeadActivity.create({
    lead_id: leadId,
    activity_type: activity_type || 'note',
    notes: notes || null,
    created_by: req.user.sub,
  });

  log('info', 'crm.lead_activity_created', { actor_user_id: req.user.sub, lead_id: leadId, activity_id: act.id, activity_type: act.activity_type, request_id: req.requestId });
  await writeAudit(req, 'lead_activity.created', 'lead_activities', act.id, null, act);
  return res.status(201).json({ activity: act });
});

// Customers
app.get('/customers', authMiddleware, async (req, res) => {
  const where = {};
  if (req.user.role === 'sales') where.assigned_to = req.user.sub;

  const customers = await Customer.findAll({
    where,
    order: [['company_name', 'ASC']],
  });
  return res.json({ customers });
});

app.post('/customers', authMiddleware, requireRole(['admin', 'sales']), async (req, res) => {
  const { company_name, contact_person, email, phone, region, tax_id, assigned_to } = req.body || {};
  if (!company_name) return res.status(400).json({ error: 'company_name required' });

  const payload = { company_name, contact_person: contact_person || null, email: email || null, phone: phone || null, region: region || 'International', tax_id: tax_id || null };

  if (req.user.role === 'sales') {
    payload.assigned_to = req.user.sub;
  } else {
    payload.assigned_to = assigned_to || null;
  }

  const customer = await Customer.create(payload);
  log('info', 'crm.customer_created', { actor_user_id: req.user.sub, customer_id: customer.id, region: customer.region, assigned_to: customer.assigned_to, request_id: req.requestId });
  await writeAudit(req, 'customer.created', 'customers', customer.id, null, customer);
  return res.status(201).json({ customer });
});

app.patch('/customers/:id', authMiddleware, async (req, res) => {
  const customer = await Customer.findByPk(req.params.id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  const before = snapshotModel(customer);

  if (req.user.role === 'sales' && customer.assigned_to !== req.user.sub) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { company_name, contact_person, email, phone, region, tax_id } = req.body || {};
  if (typeof company_name === 'string') customer.company_name = company_name;
  if (typeof contact_person === 'string' || contact_person === null) customer.contact_person = contact_person;
  if (typeof email === 'string' || email === null) customer.email = email;
  if (typeof phone === 'string' || phone === null) customer.phone = phone;
  if (typeof region === 'string') customer.region = region;
  if (typeof tax_id === 'string' || tax_id === null) customer.tax_id = tax_id;

  // Admin can reassign
  if (req.user.role === 'admin' && Object.prototype.hasOwnProperty.call(req.body || {}, 'assigned_to')) {
    customer.assigned_to = req.body.assigned_to || null;
  }

  await customer.save();
  await writeAudit(req, 'customer.updated', 'customers', customer.id, { toJSON: () => before }, customer);
  return res.json({ customer });
});

// Quotes
app.get('/quotes', authMiddleware, async (req, res) => {
  const include = [{ model: Customer, as: 'customer' }];

  if (req.user.role === 'sales') {
    const quotes = await Quote.findAll({
      include,
      order: [['valid_until', 'DESC']],
      where: {},
    });
    const filtered = quotes.filter((q) => q.customer && q.customer.assigned_to === req.user.sub);
    return res.json({ quotes: filtered });
  }

  const quotes = await Quote.findAll({ include, order: [['valid_until', 'DESC']] });
  return res.json({ quotes });
});

app.post('/quotes', authMiddleware, requireRole(['admin', 'sales']), async (req, res) => {
  const {
    customer_id,
    origin_city,
    destination_city,
    cargo_type,
    total_amount,
    currency,
    status,
    valid_until,
    selected_vendor_id,
    vendor_rate_card_id,
    cost_amount,
    margin_amount,
  } = req.body || {};
  if (!customer_id || !origin_city || !destination_city || !cargo_type) {
    return res.status(400).json({ error: 'customer_id, origin_city, destination_city, cargo_type required' });
  }

  const customer = await Customer.findByPk(customer_id);
  if (!customer) return res.status(404).json({ error: 'Customer not found' });

  if (req.user.role === 'sales' && customer.assigned_to !== req.user.sub) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const quote = await Quote.create({
    customer_id,
    origin_city,
    destination_city,
    cargo_type,
    total_amount: total_amount || 0,
    currency: currency || 'AED',
    status: status || 'draft',
    valid_until: valid_until || null,
    selected_vendor_id: selected_vendor_id || null,
    vendor_rate_card_id: vendor_rate_card_id || null,
    cost_amount: cost_amount || null,
    margin_amount: margin_amount || null,
    finalized_at: status === 'approved' ? new Date() : null,
  });

  // If quote is created as approved, create shipment
  if (quote.status === 'approved') {
    await Shipment.create({ quote_id: quote.id, tracking_number: trackingNumber(), current_status: 'booked' });
    log('info', 'ops.shipment_auto_created', { actor_user_id: req.user.sub, quote_id: quote.id, request_id: req.requestId });
  }

  await writeAudit(req, 'quote.created', 'quotes', quote.id, null, quote);

  return res.status(201).json({ quote });
});

app.patch('/quotes/:id', authMiddleware, async (req, res) => {
  const quote = await Quote.findByPk(req.params.id, { include: [{ model: Customer, as: 'customer' }, { model: Shipment, as: 'shipment' }] });
  if (!quote) return res.status(404).json({ error: 'Quote not found' });

  const before = snapshotModel(quote);

  if (req.user.role === 'sales' && quote.customer && quote.customer.assigned_to !== req.user.sub) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const { origin_city, destination_city, cargo_type, total_amount, currency, status, valid_until } = req.body || {};
  if (typeof origin_city === 'string') quote.origin_city = origin_city;
  if (typeof destination_city === 'string') quote.destination_city = destination_city;
  if (typeof cargo_type === 'string') quote.cargo_type = cargo_type;
  if (typeof total_amount === 'number' || typeof total_amount === 'string') quote.total_amount = total_amount;
  if (typeof currency === 'string') quote.currency = currency;
  if (typeof valid_until === 'string' || valid_until === null) quote.valid_until = valid_until;

  if (Object.prototype.hasOwnProperty.call(req.body || {}, 'selected_vendor_id')) quote.selected_vendor_id = req.body.selected_vendor_id || null;
  if (Object.prototype.hasOwnProperty.call(req.body || {}, 'vendor_rate_card_id')) quote.vendor_rate_card_id = req.body.vendor_rate_card_id || null;
  if (Object.prototype.hasOwnProperty.call(req.body || {}, 'cost_amount')) quote.cost_amount = req.body.cost_amount || null;
  if (Object.prototype.hasOwnProperty.call(req.body || {}, 'margin_amount')) quote.margin_amount = req.body.margin_amount || null;

  const prevStatus = quote.status;
  if (typeof status === 'string') quote.status = status;

  await quote.save();

  if (prevStatus !== 'approved' && quote.status === 'approved') {
    quote.finalized_at = new Date();
    await quote.save();
  }

  // Quote -> Shipment auto-create on approved
  if (prevStatus !== 'approved' && quote.status === 'approved') {
    const existingShipment = await Shipment.findOne({ where: { quote_id: quote.id } });
    if (!existingShipment) {
      await Shipment.create({ quote_id: quote.id, tracking_number: trackingNumber(), current_status: 'booked' });
    }
  }

  await writeAudit(req, 'quote.updated', 'quotes', quote.id, { toJSON: () => before }, quote);

  return res.json({ quote });
});

// Shipments
app.get('/shipments', authMiddleware, async (req, res) => {
  const include = [{ model: Quote, as: 'quote', include: [{ model: Customer, as: 'customer' }] }];

  if (req.user.role === 'sales') {
    const shipments = await Shipment.findAll({ include, order: [['estimated_delivery', 'DESC']] });
    const filtered = shipments.filter((s) => s.quote && s.quote.customer && s.quote.customer.assigned_to === req.user.sub);
    return res.json({ shipments: filtered });
  }

  // operations/accountant/admin see all shipments
  const shipments = await Shipment.findAll({ include, order: [['estimated_delivery', 'DESC']] });
  return res.json({ shipments });
});

app.patch('/shipments/:id', authMiddleware, requireRole(['admin', 'operations']), async (req, res) => {
  const shipment = await Shipment.findByPk(req.params.id);
  if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

  const before = snapshotModel(shipment);

  const { current_status, carrier_name, estimated_delivery, actual_delivery, vendor_id, vendor_reference, cost_amount, revenue_amount } = req.body || {};
  if (typeof current_status === 'string') shipment.current_status = current_status;
  if (typeof carrier_name === 'string' || carrier_name === null) shipment.carrier_name = carrier_name;
  if (typeof estimated_delivery === 'string' || estimated_delivery === null) shipment.estimated_delivery = estimated_delivery;
  if (typeof actual_delivery === 'string' || actual_delivery === null) shipment.actual_delivery = actual_delivery;
  if (Object.prototype.hasOwnProperty.call(req.body || {}, 'vendor_id')) shipment.vendor_id = vendor_id || null;
  if (Object.prototype.hasOwnProperty.call(req.body || {}, 'vendor_reference')) shipment.vendor_reference = vendor_reference || null;
  if (Object.prototype.hasOwnProperty.call(req.body || {}, 'cost_amount')) shipment.cost_amount = cost_amount || null;
  if (Object.prototype.hasOwnProperty.call(req.body || {}, 'revenue_amount')) shipment.revenue_amount = revenue_amount || null;

  await shipment.save();

  log('info', 'ops.shipment_updated', { actor_user_id: req.user.sub, shipment_id: shipment.id, current_status: shipment.current_status, request_id: req.requestId });

  await writeAudit(req, 'shipment.updated', 'shipments', shipment.id, { toJSON: () => before }, shipment);

  let warnings = [];
  if (shipment.current_status === 'customs_clearance') {
    const customsExitDoc = await Document.findOne({ where: { shipment_id: shipment.id, doc_type: 'Customs_Exit' } });
    if (!customsExitDoc) warnings.push('Customs_Exit document required for customs_clearance status');
  }

  return res.json({ shipment, warnings });
});

// Documents
app.get('/shipments/:shipmentId/documents', authMiddleware, async (req, res) => {
  const shipmentId = req.params.shipmentId;
  const shipment = await Shipment.findByPk(shipmentId, { include: [{ model: Quote, as: 'quote', include: [{ model: Customer, as: 'customer' }] }] });
  if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

  if (req.user.role === 'sales') {
    if (!shipment.quote || !shipment.quote.customer || shipment.quote.customer.assigned_to !== req.user.sub) {
      return res.status(403).json({ error: 'Forbidden' });
    }
  }

  const documents = await Document.findAll({ where: { shipment_id: shipmentId }, order: [['doc_type', 'ASC']] });
  return res.json({ documents });
});

app.post('/shipments/:shipmentId/documents', authMiddleware, requireRole(['admin', 'operations']), async (req, res) => {
  const shipmentId = req.params.shipmentId;
  const shipment = await Shipment.findByPk(shipmentId);
  if (!shipment) return res.status(404).json({ error: 'Shipment not found' });

  const { doc_type, file_url } = req.body || {};
  if (!doc_type || !file_url) return res.status(400).json({ error: 'doc_type and file_url required' });

  const doc = await Document.create({ shipment_id: shipmentId, doc_type, file_url, uploaded_by: req.user.sub });
  log('info', 'ops.document_uploaded', { actor_user_id: req.user.sub, shipment_id: shipmentId, document_id: doc.id, doc_type: doc.doc_type, request_id: req.requestId });
  return res.status(201).json({ document: doc });
});

// Admin lock: explicitly reject non-admin attempts to access /admin/*
app.use('/admin', authMiddleware, (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  return res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  // Avoid leaking internal details
  if (res.headersSent) return next(err);
  log('error', 'http.unhandled_error', {
    request_id: req.requestId || null,
    method: req.method,
    path: req.originalUrl || req.url,
    message: err && err.message ? err.message : 'unknown_error',
  });
  return res.status(500).json({ error: 'Internal server error' });
});

async function logSchemaSummary() {
  const qi = sequelize.getQueryInterface();
  const tables = await qi.showAllTables();
  const out = [];
  for (const t of tables) {
    const tableName = typeof t === 'string' ? t : t.tableName || String(t);
    if (!['users', 'customers', 'quotes', 'shipments', 'documents', 'vendors', 'vendor_rate_cards', 'leads', 'lead_activities', 'audit_log'].includes(tableName)) continue;
    // eslint-disable-next-line no-await-in-loop
    const desc = await qi.describeTable(tableName);
    out.push({ table: tableName, columns: Object.keys(desc) });
  }
  log('info', 'db.schema_summary', { tables: out });
}

async function start() {
  log('info', 'service.starting', { port: PORT, cors_origins: allowedOrigins });
  await sequelize.authenticate();
  log('info', 'db.connected', { host: process.env.DB_HOST || '127.0.0.1', port: Number(process.env.DB_PORT || 3306), db: process.env.DB_NAME || 'ajiva_crm' });

  await sequelize.sync({ alter: true });
  log('info', 'db.schema_sync_complete', { mode: 'alter' });
  await logSchemaSummary();
  await ensureBootstrapAdmin();

  app.listen(PORT, () => {
    log('info', 'service.listening', { port: PORT });
  });
}

start().catch(() => {
  log('error', 'service.start_failed', { message: 'startup_failed' });
  process.exit(1);
});
