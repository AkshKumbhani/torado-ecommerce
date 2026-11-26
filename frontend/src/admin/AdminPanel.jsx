import React, { useEffect, useMemo, useState } from 'react';
import AdminIcon from './AdminIcons';
import './admin.css';

const navGroups = [
  {
    group: 'CORE WORKSPACE',
    items: [
      { name: 'Dashboard', icon: 'dashboard', endpoint: null },
      { name: 'Orders', icon: 'orders', endpoint: 'orders' },
      { name: 'Products', icon: 'products', endpoint: 'products' },
      { name: 'Categories', icon: 'categories', endpoint: 'categories' },
      { name: 'Inventory', icon: 'inventory', endpoint: 'inventory' },
    ]
  },
  {
    group: 'STORE COMMERCE',
    items: [
      { name: 'Customers', icon: 'customers', endpoint: 'customers' },
      { name: 'Coupons', icon: 'coupons', endpoint: 'coupons' },
      { name: 'Banners', icon: 'banners', endpoint: 'banners' },
      { name: 'Payments', icon: 'payments', endpoint: 'payments' },
      { name: 'Returns & refunds', icon: 'returns', endpoint: 'returns' },
      { name: 'Reviews', icon: 'reviews', endpoint: 'reviews' },
    ]
  },
  {
    group: 'INSIGHTS & OPS',
    items: [
      { name: 'Reports', icon: 'reports', endpoint: 'reports' },
      { name: 'Notifications', icon: 'notifications', endpoint: 'notifications' },
      { name: 'Settings', icon: 'settings', endpoint: 'settings' },
      { name: 'Admin profile', icon: 'profile', endpoint: 'admin/profile' },
    ]
  }
];

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

const formatDateTime = (val) => {
  if (!val) return { date: '—', time: '' };
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return { date: String(val), time: '' };
    const dateStr = new Intl.DateTimeFormat('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(d);
    const timeStr = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).format(d);
    return { date: dateStr, time: timeStr };
  } catch {
    return { date: String(val), time: '' };
  }
};

const api = async (path, options = {}) => {
  const token = localStorage.getItem('torado_admin_token');
  const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}${path}`, {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    localStorage.removeItem('torado_admin_token');
    throw new Error(data.message || 'Your session expired. Please sign in again.');
  }
  if (!res.ok) throw new Error(data.message || 'Could not connect to the store API.');
  return data;
};

// Password policy rules matching Hospital project
const getPasswordChecks = (pw = '') => [
  { label: '8 to 18 characters', valid: pw.length >= 8 && pw.length <= 18 },
  { label: 'At least one uppercase and one lowercase letter', valid: /[A-Z]/.test(pw) && /[a-z]/.test(pw) },
  { label: 'At least one number (0-9)', valid: /[0-9]/.test(pw) },
  { label: 'At least one special sign (@, $, !, %, etc.)', valid: /[^A-Za-z0-9]/.test(pw) },
];

const PasswordStrengthGuidance = ({ password }) => {
  if (!password) return null;
  const checks = getPasswordChecks(password);
  const strength = checks.filter((c) => c.valid).length;
  const accepted = strength === checks.length;

  return (
    <div className="adm-strength-guidance">
      <div className={`adm-strength-track strength-${strength}`}>
        <span className={accepted ? 'is-accepted' : ''} />
      </div>
      <div className={`adm-strength-status ${accepted ? 'is-accepted' : ''}`}>
        {accepted ? '✓ Password accepted' : 'Complete the requirements below:'}
      </div>
      <ul className="adm-strength-list">
        {checks.map((check) => (
          <li key={check.label} className={check.valid ? 'is-valid' : ''}>
            <span className="chk-mark">{check.valid ? '✓' : '•'}</span> {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function AdminPanel() {
  const [section, setSection] = useState('Dashboard');
  const [token, setToken] = useState(localStorage.getItem('torado_admin_token'));
  const [data, setData] = useState({});
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterCoords, setFilterCoords] = useState({ top: 180, right: 24 });
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [tempFilters, setTempFilters] = useState([]);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewingRecord, setViewingRecord] = useState(null);
  const [stockModal, setStockModal] = useState(null);
  const [refundModal, setRefundModal] = useState(null);
  const [toast, setToast] = useState('');
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('torado_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Auth Modes: 'login' | 'register' | 'forgot'
  const [authMode, setAuthMode] = useState('login');
  const [forgotStep, setForgotStep] = useState(1); // 1 = Enter email, 2 = Enter OTP & New Password
  const [showPassword, setShowPassword] = useState(false);

  // Auth Form inputs
  const [login, setLogin] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [forgotForm, setForgotForm] = useState({ email: '', otp: '', password: '', confirmPassword: '' });

  const endpoint = useMemo(() => {
    for (const grp of navGroups) {
      const match = grp.items.find((item) => item.name === section);
      if (match) return match.endpoint;
    }
    return null;
  }, [section]);

  const refresh = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const [summary, pageData] = await Promise.all([
        api('/admin/summary'),
        endpoint ? api(`/${endpoint}`) : Promise.resolve(null)
      ]);
      setData({ summary, pageData });
      if (summary?.adminUser) {
        setAdminUser(summary.adminUser);
        localStorage.setItem('torado_admin_user', JSON.stringify(summary.adminUser));
      }
      if (section === 'Admin profile' && Array.isArray(pageData) && pageData[0]) {
        setAdminUser((prev) => ({ ...prev, ...pageData[0] }));
        localStorage.setItem('torado_admin_user', JSON.stringify({ ...(adminUser || {}), ...pageData[0] }));
      }
    } catch (e) {
      setError(e.message);
      if (
        e.message &&
        (e.message.toLowerCase().includes('session') ||
          e.message.toLowerCase().includes('token') ||
          e.message.toLowerCase().includes('authorized') ||
          e.message.toLowerCase().includes('sign in'))
      ) {
        localStorage.removeItem('torado_admin_token');
        setToken(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, [token, section]);

  // Handle Admin Sign In
  const signIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      const r = await api('/auth/admin/login', { method: 'POST', body: JSON.stringify(login) });
      localStorage.setItem('torado_admin_token', r.token);
      if (r.user) {
        setAdminUser(r.user);
        localStorage.setItem('torado_admin_user', JSON.stringify(r.user));
      }
      setToken(r.token);
    } catch (e2) {
      setError(e2.message);
    }
  };

  // Handle Admin Register (Create Account)
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const checks = getPasswordChecks(registerForm.password);
    if (!checks.every((c) => c.valid)) {
      setError('Please fulfill all password security requirements.');
      return;
    }
    try {
      const r = await api('/auth/admin/register', {
        method: 'POST',
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password
        })
      });
      localStorage.setItem('torado_admin_token', r.token);
      if (r.user) {
        setAdminUser(r.user);
        localStorage.setItem('torado_admin_user', JSON.stringify(r.user));
      }
      setToken(r.token);
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Forgot Password Step 1 (Request OTP)
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (!forgotForm.email) {
      setError('Please enter your admin email address.');
      return;
    }
    try {
      setLoading(true);
      await api('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: forgotForm.email })
      });
      setSuccessMsg(`Verification code (OTP) sent to ${forgotForm.email}! Please check your inbox.`);
      setForgotStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Step 2 (Verify OTP & Reset Password)
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    if (forgotForm.password !== forgotForm.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const checks = getPasswordChecks(forgotForm.password);
    if (!checks.every((c) => c.valid)) {
      setError('Please fulfill all password security requirements.');
      return;
    }
    try {
      setLoading(true);
      await api('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          email: forgotForm.email,
          otp: forgotForm.otp,
          password: forgotForm.password
        })
      });
      setSuccessMsg('Password updated successfully! You can now sign in.');
      setTimeout(() => {
        setAuthMode('login');
        setForgotStep(1);
        setLogin({ email: forgotForm.email, password: '' });
        setError('');
        setSuccessMsg('');
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    localStorage.removeItem('torado_admin_token');
    localStorage.removeItem('torado_admin_user');
    setToken(null);
    setAdminUser(null);
  };

  const adminDisplayName = adminUser?.name || 'Store Admin';
  const adminEmail = adminUser?.email || 'Active Desk';
  const adminInitial = (adminDisplayName.trim()[0] || 'A').toUpperCase();

  const formatDetailValue = (key, val) => {
    if (val === null || val === undefined || val === '') return '—';
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('date') || lowerKey.includes('created') || lowerKey.includes('updated')) {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
      }
    }
    if (['total', 'price', 'amount', 'revenue', 'discount'].some((k) => lowerKey.includes(k)) && !isNaN(Number(val))) {
      return `₹${Number(val).toLocaleString('en-IN')}`;
    }
    if (lowerKey === 'provider') {
      const p = String(val).toLowerCase();
      return (p === 'cash' || p === 'cod') ? 'Cash' : 'Online';
    }
    if (lowerKey === 'status' && section === 'Payments') {
      const isPaid = ['paid', 'completed'].includes(String(val).toLowerCase());
      return (
        <span className={`adm-status-badge ${isPaid ? 'paid' : 'pending'}`}>
          <i /> {isPaid ? 'Completed' : 'Pending'}
        </span>
      );
    }
    if (lowerKey === 'status' || lowerKey === 'payment_status') {
      const s = String(val).toLowerCase();
      const isGreen = ['active', 'paid', 'delivered', 'completed', 'approved'].includes(s);
      const isAmber = ['pending', 'processing', 'shipped'].includes(s);
      return (
        <span className={`adm-status-badge ${isGreen ? 'active' : isAmber ? 'pending' : 'cancelled'}`}>
          <i /> {val}
        </span>
      );
    }
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    if (typeof val === 'object') return JSON.stringify(val);
    return String(val);
  };

  const records = Array.isArray(data.pageData) ? data.pageData : data.pageData?.items || [];

  const filterOptions = useMemo(() => {
    if (section === 'Orders') {
      return [
        { id: 'pending', label: 'Pending' },
        { id: 'confirmed', label: 'Confirmed' },
        { id: 'processing', label: 'Processing' },
        { id: 'shipped', label: 'Shipped' },
        { id: 'out_for_delivery', label: 'Out for Delivery' },
        { id: 'delivered', label: 'Delivered' },
        { id: 'cancelled', label: 'Cancelled' },
        { id: 'returned', label: 'Returned' },
      ];
    }
    if (section === 'Products') {
      const cats = Array.from(new Set(records.map((r) => r.category).filter(Boolean)));
      return cats.map((cat) => ({ id: cat, label: cat }));
    }
    if (section === 'Inventory') {
      return [
        { id: 'in_stock', label: 'In Stock (> 0)' },
        { id: 'low_stock', label: 'Low Stock (≤ 5)' },
        { id: 'out_of_stock', label: 'Out of Stock (0)' },
      ];
    }
    if (['Coupons', 'Banners', 'Categories'].includes(section)) {
      return [
        { id: 'active', label: 'Active' },
        { id: 'inactive', label: 'Inactive' },
      ];
    }
    if (section === 'Payments') {
      return [
        { id: 'completed', label: 'Completed' },
        { id: 'pending', label: 'Pending' },
        { id: 'failed', label: 'Failed' },
      ];
    }
    if (section === 'Returns & refunds') {
      return [
        { id: 'pending', label: 'Pending' },
        { id: 'approved', label: 'Approved' },
        { id: 'rejected', label: 'Rejected' },
      ];
    }
    if (section === 'Reviews') {
      return [
        { id: '5', label: '5 Stars ★★★★★' },
        { id: '4', label: '4 Stars ★★★★☆' },
        { id: '3', label: '3 Stars ★★★☆☆' },
        { id: '2', label: '2 Stars ★★☆☆☆' },
        { id: '1', label: '1 Star ★☆☆☆☆' },
      ];
    }
    if (section === 'Customers') {
      return [
        { id: 'has_phone', label: 'With Phone Number' },
        { id: 'no_phone', label: 'Without Phone Number' },
      ];
    }
    if (section === 'Notifications') {
      return [
        { id: 'unread', label: 'Unread Only' },
        { id: 'order', label: 'Order Alerts' },
        { id: 'refund', label: 'Refund Alerts' },
        { id: 'inventory', label: 'Inventory / Stock' },
      ];
    }
    return [];
  }, [section, records]);

  // Section-Specific Summary KPI Metrics (Hospital SaaS Architecture)
  const sectionMetrics = useMemo(() => {
    if (section === 'Orders') {
      const pending = records.filter((r) => (r.status || 'pending').toLowerCase() === 'pending').length;
      const delivered = records.filter((r) => (r.status || '').toLowerCase() === 'delivered').length;
      const totalRev = records.reduce((sum, r) => sum + Number(r.total || 0), 0);
      return [
        { label: 'Total Orders', value: records.length, tone: 'blue', icon: 'orders' },
        { label: 'Pending Orders', value: pending, tone: 'amber', icon: 'clock' },
        { label: 'Delivered', value: delivered, tone: 'green', icon: 'check' },
        { label: 'Order Volume', value: money(totalRev), tone: 'purple', icon: 'payments' },
      ];
    }
    if (section === 'Products') {
      const active = records.filter((r) => r.status === 'active' || !r.status).length;
      const outOfStock = records.filter((r) => Number(r.stock || 0) <= 0).length;
      const cats = new Set(records.map((r) => r.category).filter(Boolean)).size;
      return [
        { label: 'Total Products', value: records.length, tone: 'blue', icon: 'products' },
        { label: 'Active Catalogue', value: active, tone: 'green', icon: 'check' },
        { label: 'Out of Stock', value: outOfStock, tone: 'red', icon: 'alert' },
        { label: 'Categories', value: cats, tone: 'purple', icon: 'categories' },
      ];
    }
    if (section === 'Categories') {
      const active = records.filter((r) => r.status === 'active' || !r.status).length;
      return [
        { label: 'Total Categories', value: records.length, tone: 'blue', icon: 'categories' },
        { label: 'Active Categories', value: active, tone: 'green', icon: 'check' },
        { label: 'Product Linked', value: records.length, tone: 'purple', icon: 'products' },
      ];
    }
    if (section === 'Inventory') {
      const inStock = records.filter((r) => Number(r.stock || 0) > 5).length;
      const lowStock = records.filter((r) => Number(r.stock || 0) > 0 && Number(r.stock || 0) <= 5).length;
      const outOfStock = records.filter((r) => Number(r.stock || 0) <= 0).length;
      return [
        { label: 'Total Tracked', value: records.length, tone: 'blue', icon: 'inventory' },
        { label: 'Healthy Stock', value: inStock, tone: 'green', icon: 'check' },
        { label: 'Low Stock Alert', value: lowStock, tone: 'amber', icon: 'alert' },
        { label: 'Out of Stock', value: outOfStock, tone: 'red', icon: 'close' },
      ];
    }
    if (section === 'Customers') {
      return [
        { label: 'Total Customers', value: records.length, tone: 'blue', icon: 'customers' },
        { label: 'Active Shoppers', value: records.length, tone: 'green', icon: 'check' },
        { label: 'Verified Accounts', value: records.length, tone: 'purple', icon: 'profile' },
      ];
    }
    if (section === 'Coupons') {
      const active = records.filter((r) => Boolean(r.active)).length;
      const inactive = records.filter((r) => !Boolean(r.active)).length;
      return [
        { label: 'Total Coupons', value: records.length, tone: 'blue', icon: 'coupons' },
        { label: 'Active Coupons', value: active, tone: 'green', icon: 'check' },
        { label: 'Inactive / Expired', value: inactive, tone: 'amber', icon: 'clock' },
      ];
    }
    if (section === 'Banners') {
      const active = records.filter((r) => Boolean(r.active)).length;
      const inactive = records.filter((r) => !Boolean(r.active)).length;
      return [
        { label: 'Total Banners', value: records.length, tone: 'blue', icon: 'banners' },
        { label: 'Active Banners', value: active, tone: 'green', icon: 'check' },
        { label: 'Inactive Banners', value: inactive, tone: 'amber', icon: 'clock' },
      ];
    }
    if (section === 'Payments') {
      const paid = records.filter((r) => ['paid', 'completed'].includes((r.status || '').toLowerCase()));
      const paidVol = paid.reduce((a, b) => a + Number(b.amount || 0), 0);
      const pending = records.filter((r) => ['pending', 'created'].includes((r.status || '').toLowerCase())).length;
      const failed = records.filter((r) => (r.status || '').toLowerCase() === 'failed').length;
      return [
        { label: 'Total Transactions', value: records.length, tone: 'blue', icon: 'payments' },
        { label: 'Settled Volume', value: money(paidVol), tone: 'green', icon: 'trendingUp' },
        { label: 'Pending Orders', value: pending, tone: 'amber', icon: 'clock' },
        { label: 'Failed Settlements', value: failed, tone: 'red', icon: 'alert' },
      ];
    }
    if (section === 'Returns & refunds') {
      const pending = records.filter((r) => (r.status || '').toLowerCase() === 'pending').length;
      const approved = records.filter((r) => (r.status || '').toLowerCase() === 'approved');
      const refundedVol = approved.reduce((a, b) => a + Number(b.refund_amount || 0), 0);
      return [
        { label: 'Total Claims', value: records.length, tone: 'blue', icon: 'returns' },
        { label: 'Pending Review', value: pending, tone: 'amber', icon: 'clock' },
        { label: 'Approved Returns', value: approved.length, tone: 'green', icon: 'check' },
        { label: 'Refund Volume', value: money(refundedVol), tone: 'purple', icon: 'payments' },
      ];
    }
    if (section === 'Reviews') {
      const fiveStar = records.filter((r) => Number(r.rating) === 5).length;
      const positive = records.filter((r) => Number(r.rating) >= 4).length;
      return [
        { label: 'Total Reviews', value: records.length, tone: 'blue', icon: 'reviews' },
        { label: '5-Star Reviews', value: fiveStar, tone: 'green', icon: 'check' },
        { label: 'Positive Feedback', value: positive, tone: 'purple', icon: 'trendingUp' },
      ];
    }
    if (section === 'Notifications') {
      const unread = records.filter((r) => !r.read_at).length;
      const orderAlerts = records.filter((r) => r.type === 'order').length;
      const systemAlerts = records.filter((r) => r.type !== 'order').length;
      return [
        { label: 'Total Notifications', value: records.length, tone: 'blue', icon: 'notifications' },
        { label: 'Unread Alerts', value: unread, tone: unread > 0 ? 'red' : 'green', icon: 'alert' },
        { label: 'Order Alerts', value: orderAlerts, tone: 'purple', icon: 'orders' },
        { label: 'System & Stock', value: systemAlerts, tone: 'amber', icon: 'clock' },
      ];
    }
    return [];
  }, [section, records]);

  const visible = useMemo(() => {
    return records.filter((row) => {
      // 1. Live text search query across all row fields
      if (query && !JSON.stringify(row).toLowerCase().includes(query.toLowerCase())) {
        return false;
      }
      // 2. Interactive Multi-Checkbox filter
      if (selectedFilters.length > 0) {
        if (section === 'Products') {
          if (!selectedFilters.includes(row.category)) return false;
        } else if (section === 'Orders') {
          const st = (row.status || 'pending').toLowerCase();
          if (!selectedFilters.includes(st)) return false;
        } else if (section === 'Inventory') {
          const qty = Number(row.stock || 0);
          const isOutOfStock = qty <= 0;
          const isLowStock = qty > 0 && qty <= 5;
          const isInStock = qty > 0;
          const matches =
            (selectedFilters.includes('out_of_stock') && isOutOfStock) ||
            (selectedFilters.includes('low_stock') && isLowStock) ||
            (selectedFilters.includes('in_stock') && isInStock);
          if (!matches) return false;
        } else if (['Coupons', 'Banners', 'Categories'].includes(section)) {
          const isActive = Boolean(row.active ?? row.status === 'active');
          const matches =
            (selectedFilters.includes('active') && isActive) ||
            (selectedFilters.includes('inactive') && !isActive);
          if (!matches) return false;
        } else if (section === 'Payments') {
          const raw = (row.status || '').toLowerCase();
          const st = ['paid', 'completed'].includes(raw) ? 'completed' : raw === 'failed' ? 'failed' : 'pending';
          if (!selectedFilters.includes(st)) return false;
        } else if (section === 'Returns & refunds') {
          const st = (row.status || '').toLowerCase();
          if (!selectedFilters.includes(st)) return false;
        } else if (section === 'Reviews') {
          if (!selectedFilters.includes(String(row.rating))) return false;
        } else if (section === 'Customers') {
          const hasPhone = Boolean(row.phone && row.phone !== '—');
          const matches =
            (selectedFilters.includes('has_phone') && hasPhone) ||
            (selectedFilters.includes('no_phone') && !hasPhone);
          if (!matches) return false;
        } else if (section === 'Notifications') {
          const isUnread = !row.read_at;
          const matchUnread = selectedFilters.includes('unread') && isUnread;
          const matchType = selectedFilters.includes(row.type);
          if (selectedFilters.includes('unread') && !matchUnread && !matchType) return false;
          if (!selectedFilters.includes('unread') && !matchType) return false;
        }
      }
      return true;
    });
  }, [records, query, selectedFilters, section]);

  // Hospital-Style Table Pagination Architecture (10 items per page)
  const PAGE_SIZE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [section, query, selectedFilters]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedVisible = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return visible.slice(start, start + PAGE_SIZE);
  }, [visible, safeCurrentPage]);

  // Hospital-Style Visible Pages ([1, 2] pair)
  const visiblePages = useMemo(() => {
    if (totalPages <= 1) return [1];
    if (safeCurrentPage < totalPages) {
      return [safeCurrentPage, safeCurrentPage + 1];
    }
    return [Math.max(1, totalPages - 1), totalPages];
  }, [totalPages, safeCurrentPage]);

  const summary = data.summary || {};

  // Build a complete 7-day chronological dataset for the sales graph
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const iso = d.toISOString().split('T')[0];
      const match = (summary.weeklySales || []).find(
        (s) => s.date === iso || (s.date && String(s.date).startsWith(iso))
      );
      return {
        date: iso,
        label: new Intl.DateTimeFormat('en-IN', { weekday: 'short' }).format(d),
        revenue: Number(match?.revenue || 0)
      };
    });
  }, [summary.weeklySales]);

  const saveRecord = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const raw = Object.fromEntries(form.entries());
    const file = form.get('image');
    delete raw.image;
    try {
      if (file instanceof File && file.size) {
        const uploaded = new FormData();
        uploaded.append('image', file);
        const result = await api('/uploads/products', { method: 'POST', body: uploaded });
        raw.image_url = result.image_url;
      }
      if (!raw.password) {
        delete raw.password;
      }
      await api(editing ? `/${endpoint}/${editing.id}` : `/${endpoint}`, {
        method: editing ? 'PATCH' : 'POST',
        body: JSON.stringify(raw)
      });
      if (section === 'Admin profile') {
        const updated = { ...(adminUser || {}), ...raw };
        delete updated.password;
        setAdminUser(updated);
        localStorage.setItem('torado_admin_user', JSON.stringify(updated));
      }
      setModal(false);
      setEditing(null);
      setToast('Changes saved successfully');
      refresh();
      setTimeout(() => setToast(''), 2600);
    } catch (e2) {
      setError(e2.message);
    }
  };

  const removeRecord = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    try {
      await api(`/${endpoint}/${id}`, { method: 'DELETE' });
      setToast('Record removed');
      refresh();
      setTimeout(() => setToast(''), 2600);
    } catch (e) {
      setError(e.message);
    }
  };

  const updateRecord = async (id, value) => {
    try {
      await api(`/${endpoint}/${id}`, { method: 'PATCH', body: JSON.stringify(value) });
      setToast('Status updated');
      refresh();
      setTimeout(() => setToast(''), 2600);
    } catch (e) {
      setError(e.message);
    }
  };

  const handleConfirmRefund = async (e) => {
    e.preventDefault();
    if (!refundModal) return;
    const { id, amount, reason } = refundModal;
    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid refund amount');
      return;
    }
    if (!reason || !reason.trim()) {
      setError('Please provide a refund reason');
      return;
    }
    try {
      setLoading(true);
      await api('/payments/refunds', {
        method: 'POST',
        body: JSON.stringify({ requestId: id, amount: Number(amount), reason: reason.trim() })
      });
      setToast('Refund processed successfully & confirmation email sent to customer');
      setRefundModal(null);
      refresh();
      setTimeout(() => setToast(''), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================================
  // AUTH SCREEN (Hospital Project Split-Screen Style with White Theme)
  // =========================================================================
  if (!token) {
    return (
      <div className="adm-split-wrapper adm-theme-light">
        {/* Left Branding Panel (Clean White / Light Background) */}
        <div className="adm-brand-side">
          <div className="adm-brand-top">
            <span className="adm-brand-title">Torado Commerce</span>
          </div>

          <div className="adm-brand-center">
            <h2>Unified E-Commerce Catalogue & Operations Desk</h2>
            <p>
              Complete governance across real-time customer orders, inventory dispatch, product catalogue updates, Google customer accounts, and automated store settlements.
            </p>

            <div className="adm-feature-list">
              <div className="adm-feature-item">
                <span className="adm-feature-icon">✓</span>
                <span><strong>Live Orders</strong>: Real-time order dispatch, processing & customer status</span>
              </div>
              <div className="adm-feature-item">
                <span className="adm-feature-icon">✓</span>
                <span><strong>Dynamic Catalogue</strong>: Product creation, price rules, variants & stock</span>
              </div>
              <div className="adm-feature-item">
                <span className="adm-feature-icon">✓</span>
                <span><strong>Customer Insights</strong>: Google Sign-In & registered customer registry</span>
              </div>
              <div className="adm-feature-item">
                <span className="adm-feature-icon">✓</span>
                <span><strong>Payment Gateway</strong>: Razorpay transaction logs & instant refunds</span>
              </div>
            </div>
          </div>

          <div className="adm-brand-bottom">
            © 2026 Torado Commerce • Enterprise Store Edition
          </div>
        </div>

        {/* Right Form Panel (Clean White / Light Background) */}
        <div className="adm-form-side">
          <div className="adm-form-box">
            <a href="/" className="adm-back-link">
              ← Back to Torado Store
            </a>

            {/* 1. LOGIN MODE */}
            {authMode === 'login' && (
              <>
                <div className="adm-form-header">
                  <h1>Admin Sign in</h1>
                  <p>Access your store dashboard and operations</p>
                </div>

                {error && <div className="adm-error-banner">⚠️ {error}</div>}
                {successMsg && <div className="adm-success-banner">✓ {successMsg}</div>}

                <form onSubmit={signIn}>
                  <div className="adm-input-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      required
                      autoComplete="username"
                      value={login.email}
                      onChange={(e) => setLogin({ ...login, email: e.target.value })}
                      placeholder="Enter your admin email"
                    />
                  </div>

                  <div className="adm-input-group">
                    <div className="adm-label-row">
                      <label>Password</label>
                      <button
                        type="button"
                        className="adm-link-text-btn"
                        onClick={() => { setAuthMode('forgot'); setError(''); setSuccessMsg(''); }}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="adm-password-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        autoComplete="current-password"
                        value={login.password}
                        onChange={(e) => setLogin({ ...login, password: e.target.value })}
                        placeholder="Enter admin password"
                      />
                      <button
                        type="button"
                        className="adm-toggle-pw"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <button className="adm-submit-btn" type="submit">
                    Sign in to Workspace <span>→</span>
                  </button>

                  <div className="adm-switch-mode">
                    <span>Don't have an admin account?</span>
                    <button
                      type="button"
                      className="adm-switch-btn"
                      onClick={() => { setAuthMode('register'); setError(''); setSuccessMsg(''); }}
                    >
                      Create Account
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* 2. CREATE ACCOUNT (REGISTER) MODE */}
            {authMode === 'register' && (
              <>
                <div className="adm-form-header">
                  <h1>Create Admin Account</h1>
                  <p>Register as a new store administrator</p>
                </div>

                {error && <div className="adm-error-banner">⚠️ {error}</div>}
                {successMsg && <div className="adm-success-banner">✓ {successMsg}</div>}

                <form onSubmit={handleRegister}>
                  <div className="adm-input-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      required
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      placeholder="e.g. Aksh Kumbhani"
                    />
                  </div>

                  <div className="adm-input-group">
                    <label>Admin Email</label>
                    <input
                      type="email"
                      required
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      placeholder="admin@yourstore.com"
                    />
                  </div>

                  <div className="adm-input-group">
                    <label>Password</label>
                    <div className="adm-password-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={registerForm.password}
                        onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                        placeholder="Create strong password"
                      />
                      <button
                        type="button"
                        className="adm-toggle-pw"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <PasswordStrengthGuidance password={registerForm.password} />

                  <div className="adm-input-group">
                    <label>Confirm Password</label>
                    <input
                      type="password"
                      required
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      placeholder="Repeat your password"
                    />
                  </div>

                  <button className="adm-submit-btn" type="submit">
                    Create Admin Account <span>→</span>
                  </button>

                  <div className="adm-switch-mode">
                    <span>Already have an account?</span>
                    <button
                      type="button"
                      className="adm-switch-btn"
                      onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
                    >
                      Back to Sign In
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* 3. FORGOT PASSWORD (EMAIL OTP) MODE */}
            {authMode === 'forgot' && (
              <>
                <div className="adm-form-header">
                  <h1>Reset Password</h1>
                  <p>
                    {forgotStep === 1
                      ? 'Enter your admin email to receive a verification OTP'
                      : `Enter the 6-digit code sent to ${forgotForm.email}`}
                  </p>
                </div>

                {error && <div className="adm-error-banner">⚠️ {error}</div>}
                {successMsg && <div className="adm-success-banner">✓ {successMsg}</div>}

                {forgotStep === 1 ? (
                  <form onSubmit={handleRequestOtp}>
                    <div className="adm-input-group">
                      <label>Admin Email Address</label>
                      <input
                        type="email"
                        required
                        value={forgotForm.email}
                        onChange={(e) => setForgotForm({ ...forgotForm, email: e.target.value })}
                        placeholder="admin@yourstore.com"
                      />
                    </div>

                    <button className="adm-submit-btn" type="submit" disabled={loading}>
                      {loading ? 'Sending OTP...' : 'Send Verification OTP →'}
                    </button>

                    <div className="adm-switch-mode">
                      <button
                        type="button"
                        className="adm-switch-btn"
                        onClick={() => { setAuthMode('login'); setError(''); setSuccessMsg(''); }}
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword}>
                    <div className="adm-input-group">
                      <div className="adm-label-row">
                        <label>Verification Code (OTP)</label>
                        <button
                          type="button"
                          className="adm-link-text-btn"
                          onClick={() => setForgotStep(1)}
                        >
                          Resend / Change Email
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={forgotForm.otp}
                        onChange={(e) => setForgotForm({ ...forgotForm, otp: e.target.value.replace(/\D/g, '') })}
                        placeholder="Enter 6-digit OTP"
                        style={{ letterSpacing: '4px', fontSize: '18px', textAlign: 'center', fontWeight: '700' }}
                      />
                    </div>

                    <div className="adm-input-group">
                      <label>New Password</label>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={forgotForm.password}
                        onChange={(e) => setForgotForm({ ...forgotForm, password: e.target.value })}
                        placeholder="Enter new password"
                      />
                    </div>

                    <PasswordStrengthGuidance password={forgotForm.password} />

                    <div className="adm-input-group">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        required
                        value={forgotForm.confirmPassword}
                        onChange={(e) => setForgotForm({ ...forgotForm, confirmPassword: e.target.value })}
                        placeholder="Repeat new password"
                      />
                    </div>

                    <button className="adm-submit-btn" type="submit" disabled={loading}>
                      {loading ? 'Updating Password...' : 'Reset Password & Sign In →'}
                    </button>

                    <div className="adm-switch-mode">
                      <button
                        type="button"
                        className="adm-switch-btn"
                        onClick={() => { setAuthMode('login'); setForgotStep(1); setError(''); setSuccessMsg(''); }}
                      >
                        ← Back to Sign In
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}

            <small className="adm-secure-footnote">
              Admin access only · Encrypted & secure session
            </small>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED ADMIN DASHBOARD (Modern Hospital SaaS Style)
  // =========================================================================
  const maxVal = Math.max(10000, ...last7Days.map((d) => d.revenue));
  const yMax = Math.ceil(maxVal / 5000) * 5000;
  const chartWidth = 700;
  const chartHeight = 150;
  
  const chartPoints = last7Days.map((d, i) => {
    const x = Math.round((i * chartWidth) / (last7Days.length - 1));
    const y = Math.round(chartHeight - (d.revenue / yMax) * (chartHeight - 30) - 15);
    return { x, y, revenue: d.revenue, label: d.label };
  });

  const chartLine = chartPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const chartFill = `${chartLine} L ${chartWidth} ${chartHeight + 10} L 0 ${chartHeight + 10} Z`;

  const cols =
    section === 'Products'
      ? ['name', 'category', 'price', 'stock', 'status']
      : section === 'Orders'
      ? ['id', 'customer_name', 'total', 'payment_status', 'status']
      : section === 'Customers'
      ? ['name', 'email', 'phone', 'city', 'country', 'created_at']
      : section === 'Categories'
      ? ['name', 'description', 'status']
      : section === 'Inventory'
      ? ['name', 'sku', 'stock', 'category']
      : section === 'Coupons'
      ? ['code', 'discount_type', 'discount_value', 'usage_limit', 'active']
      : section === 'Banners'
      ? ['title', 'subtitle', 'position', 'active']
      : section === 'Returns & refunds'
      ? ['order_id', 'customer_name', 'reason', 'refund_amount', 'status']
      : section === 'Payments'
      ? ['order_id', 'provider', 'transaction_id', 'amount', 'status']
      : section === 'Reviews'
      ? ['customer_name', 'product_name', 'rating', 'description', 'status']
      : section === 'Notifications'
      ? ['type', 'title', 'body', 'created_at']
      : section === 'Reports'
      ? ['date', 'orders_count', 'revenue']
      : section === 'Settings'
      ? ['setting_key', 'value']
      : section === 'Admin profile'
      ? ['name', 'email', 'phone', 'city', 'country', 'created_at']
      : null;

  return (
    <div className="adm-shell">
      {/* Mobile Backdrop */}
      {mobileNav && (
        <div className="adm-sidebar-backdrop" onClick={() => setMobileNav(false)} />
      )}

      {/* 1. Sidebar (Hospital Project SaaS Architecture) */}
      <aside className={`adm-sidebar ${mobileNav ? 'open' : ''}`}>
        <a className="adm-sidebar-brand" href="/">
          <div className="adm-brand-icon-box">T</div>
          <div className="adm-brand-meta">
            <span className="adm-brand-name">Torado<span>.</span></span>
            <span className="adm-brand-badge">Store Workspace</span>
          </div>
        </a>

        <div className="adm-nav-container">
          {navGroups.map((grp) => (
            <div key={grp.group} className="adm-nav-group">
              <div className="adm-nav-group-label">{grp.group}</div>
              <ul className="adm-nav-list">
                {grp.items.map((item) => (
                  <li key={item.name}>
                    <button
                      type="button"
                      className={`adm-nav-item ${section === item.name ? 'active' : ''}`}
                      onClick={() => {
                        setSection(item.name);
                        setMobileNav(false);
                        setQuery('');
                        setSelectedFilters([]);
                        setTempFilters([]);
                        setIsFilterOpen(false);
                      }}
                    >
                      <span className="adm-nav-icon">
                        <AdminIcon name={item.icon} size={18} />
                      </span>
                      <span>{item.name}</span>
                      {item.name === 'Returns & refunds' && summary.pendingReturns > 0 && (
                        <span className="adm-nav-badge">{summary.pendingReturns}</span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="adm-sidebar-footer">
          <div className="adm-user-card">
            <div className="adm-user-avatar">{adminInitial}</div>
            <div className="adm-user-info">
              <span className="adm-user-name" title={adminDisplayName}>{adminDisplayName}</span>
              <span className="adm-user-status" title={adminEmail}>
                <i /> {adminEmail}
              </span>
            </div>
            <button
              type="button"
              className="adm-logout-btn"
              onClick={signOut}
              title="Sign Out"
              aria-label="Sign Out"
            >
              <AdminIcon name="logout" size={17} />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main View Canvas */}
      <main className="adm-main">
        {/* Sticky Topbar */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <button
              type="button"
              className="adm-mobile-toggle"
              onClick={() => setMobileNav(!mobileNav)}
              aria-label="Toggle navigation"
            >
              <AdminIcon name="menu" size={20} />
            </button>
            <div className="adm-breadcrumb">
              Workspace <span>/</span> <strong>{section}</strong>
            </div>
          </div>

          <div className="adm-topbar-right">
            <button
              type="button"
              className="adm-icon-btn"
              title="Notifications"
              onClick={() => setSection('Notifications')}
            >
              <AdminIcon name="notifications" size={16} />
              {Number(data.summary?.unreadNotificationsCount || 0) > 0 && (
                <span className="adm-icon-badge" style={{ background: '#FE4267', width: '8px', height: '8px', display: 'inline-block' }} />
              )}
            </button>
            <div
              className="adm-user-avatar"
              style={{ width: '34px', height: '34px', fontSize: '0.85rem' }}
              title={adminDisplayName}
            >
              {adminInitial}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="adm-content">
          {/* Page Header (Clean & Minimalist) */}
          {section !== 'Dashboard' && (
            <div className="adm-page-header" style={{ marginBottom: '18px' }}>
              <div>
                <h1 className="adm-page-title" style={{ margin: 0, fontSize: '1.45rem' }}>
                  {section}<span>.</span>
                </h1>
              </div>

              <div className="adm-header-actions">
                {endpoint && ['Products', 'Categories', 'Coupons', 'Banners', 'Admin profile'].includes(section) && (
                  <button
                    type="button"
                    className="adm-btn-primary"
                    onClick={() => {
                      setEditing(section === 'Admin profile' ? (records[0] || null) : null);
                      setModal(true);
                    }}
                  >
                    <AdminIcon name={section === 'Admin profile' ? 'edit' : 'plus'} size={15} />
                    <span>
                      {section === 'Admin profile'
                        ? 'Edit Profile'
                        : section === 'Products'
                        ? 'Add Product'
                        : section === 'Categories'
                        ? 'Add Category'
                        : `Add ${section.replace(/s$/, '')}`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="adm-error-alert">
              <span>⚠️ {error}</span>
              <button type="button" onClick={() => setError('')}>
                ×
              </button>
            </div>
          )}

          {/* SECTION: DASHBOARD */}
          {section === 'Dashboard' ? (
            <>
              {/* 1. 4 Primary KPI Metric Cards (Clean Hospital SaaS Style) */}
              <div className="adm-kpi-grid">
                <div className="ha-kpi-card tone-blue">
                  <div className="ha-kpi-card-icon">
                    <AdminIcon name="payments" size={24} />
                  </div>
                  <div className="ha-kpi-card-copy">
                    <span className="ha-kpi-card-label">Total Revenue</span>
                    <strong className="ha-kpi-card-value">
                      {money(summary.totalRevenue)}
                    </strong>
                  </div>
                </div>

                <div className="ha-kpi-card tone-purple">
                  <div className="ha-kpi-card-icon">
                    <AdminIcon name="orders" size={24} />
                  </div>
                  <div className="ha-kpi-card-copy">
                    <span className="ha-kpi-card-label">Total Orders</span>
                    <strong className="ha-kpi-card-value">
                      {summary.totalOrders ?? '0'}
                    </strong>
                  </div>
                </div>

                <div className="ha-kpi-card tone-green">
                  <div className="ha-kpi-card-icon">
                    <AdminIcon name="customers" size={24} />
                  </div>
                  <div className="ha-kpi-card-copy">
                    <span className="ha-kpi-card-label">Registered Customers</span>
                    <strong className="ha-kpi-card-value">
                      {summary.totalCustomers ?? '0'}
                    </strong>
                  </div>
                </div>

                <div className="ha-kpi-card tone-amber">
                  <div className="ha-kpi-card-icon">
                    <AdminIcon name="inventory" size={24} />
                  </div>
                  <div className="ha-kpi-card-copy">
                    <span className="ha-kpi-card-label">Products in Catalogue</span>
                    <strong className="ha-kpi-card-value">
                      {summary.totalProducts ?? '0'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 2. 3 Operational Insight Cards (Clean & Minimalist) */}
              <div className="adm-bottom-grid" style={{ marginBottom: '24px' }}>
                <div
                  className="adm-insight-card"
                  onClick={() => setSection('Orders')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="adm-insight-icon-box orange">
                    <AdminIcon name="clock" size={22} />
                  </div>
                  <div className="adm-insight-body">
                    <h3>Pending Orders</h3>
                    <strong>{summary.pendingOrders ?? '0'}</strong>
                  </div>
                </div>

                <div
                  className="adm-insight-card"
                  onClick={() => setSection('Inventory')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="adm-insight-icon-box amber">
                    <AdminIcon name="alert" size={22} />
                  </div>
                  <div className="adm-insight-body">
                    <h3>Low Stock Alert</h3>
                    <strong>{summary.lowStockCount ?? '0'}</strong>
                  </div>
                </div>

                <div
                  className="adm-insight-card"
                  onClick={() => setSection('Reports')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="adm-insight-icon-box green">
                    <AdminIcon name="trendingUp" size={22} />
                  </div>
                  <div className="adm-insight-body">
                    <h3>Today's Sales</h3>
                    <strong>{money(summary.todayRevenue)}</strong>
                  </div>
                </div>
              </div>

              {/* 3. Sales Analytics Chart & Recent Orders Grid */}
              <div className="adm-overview-grid">
                {/* Sales Chart Card */}
                <section className="adm-card">
                  <div className="adm-card-header">
                    <div>
                      <h2>Sales Performance Overview</h2>
                      <p>Revenue performance over the last 7 days</p>
                    </div>
                    <span className="adm-pill-badge">Last 7 days</span>
                  </div>

                  <div className="adm-chart-meta">
                    <strong>{money(summary.weeklyRevenue || 0)}</strong>
                    <span>Revenue this week</span>
                  </div>

                  <div className="adm-chart-container">
                    <div className="adm-ylabels">
                      <span>₹{Math.round(yMax / 1000)}k</span>
                      <span>₹{Math.round((yMax * 0.75) / 1000)}k</span>
                      <span>₹{Math.round((yMax * 0.5) / 1000)}k</span>
                      <span>₹{Math.round((yMax * 0.25) / 1000)}k</span>
                      <span>₹0</span>
                    </div>

                    <div className="adm-chart-canvas">
                      <div className="adm-gridlines">
                        <i />
                        <i />
                        <i />
                        <i />
                        <i />
                      </div>

                      <svg
                        viewBox={`0 0 ${chartWidth} ${chartHeight + 10}`}
                        preserveAspectRatio="none"
                        aria-label="Revenue performance graph"
                      >
                        <defs>
                          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#ed7968" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#ed7968" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d={chartFill} fill="url(#chartGradient)" />
                        <path
                          d={chartLine}
                          fill="none"
                          stroke="#ed7968"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        />
                        {chartPoints.map((p, idx) => (
                          <circle
                            key={idx}
                            cx={p.x}
                            cy={p.y}
                            r={p.revenue > 0 ? 5 : 4}
                            fill={p.revenue > 0 ? '#ed7968' : '#94a3b8'}
                            stroke="#ffffff"
                            strokeWidth="2"
                          />
                        ))}
                      </svg>

                      <div className="adm-xlabels">
                        {last7Days.map((day) => (
                          <span key={day.date}>{day.label}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Recent Orders Card */}
                <section className="adm-card">
                  <div className="adm-card-header">
                    <div>
                      <h2>Recent Orders</h2>
                      <p>Your latest incoming customer orders</p>
                    </div>
                    <button
                      type="button"
                      className="adm-text-link"
                      onClick={() => setSection('Orders')}
                    >
                      View all →
                    </button>
                  </div>

                  {(summary.recentOrders || []).length ? (
                    <div className="adm-recent-orders-list">
                      {summary.recentOrders.slice(0, 5).map((o) => (
                        <div key={o.id} className="adm-order-row-item">
                          <div className="adm-order-avatar-pill">
                            {(o.customer_name || 'C')[0].toUpperCase()}
                          </div>
                          <div className="adm-order-details">
                            <span className="adm-order-customer-name">
                              {o.customer_name || 'Store Customer'}
                            </span>
                            <span className="adm-order-id-sub">Order #{o.id}</span>
                          </div>
                          <strong className="adm-order-price-badge">
                            {money(o.total)}
                          </strong>
                          <span className={`adm-status-badge ${String(o.status).toLowerCase()}`}>
                            <span className="adm-status-dot" />
                            {o.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="adm-empty-state">
                      <div className="adm-empty-icon-wrap">
                        <AdminIcon name="orders" size={26} />
                      </div>
                      <h3 className="adm-empty-title">No orders yet</h3>
                      <p className="adm-empty-desc">
                        New orders will appear here automatically when customers complete checkout.
                      </p>
                    </div>
                  )}
                </section>
              </div>
            </>
          ) : (
            <>
              {sectionMetrics.length > 0 && (
                <div className="adm-section-cards-grid">
                  {sectionMetrics.map((item) => (
                    <div key={item.label} className={`section-summary-card tone-${item.tone || 'blue'}`}>
                      <span className="section-summary-icon">
                        <AdminIcon name={item.icon || 'dashboard'} size={19} />
                      </span>
                      <div className="section-summary-copy">
                        <span className="section-summary-label">{item.label}</span>
                        <strong className="section-summary-value">{item.value ?? 0}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SECTION: DATA TABLE VIEW */}
              <section className="adm-table-card">
              <div className="adm-table-toolbar">
                <div className="adm-toolbar-actions">
                  <div className="adm-search-input-wrap">
                    <AdminIcon name="search" size={16} />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={`Search in ${section.toLowerCase()}...`}
                      autoComplete="off"
                      spellCheck="false"
                    />
                    {query && (
                      <button
                        type="button"
                        className="adm-search-clear"
                        onClick={() => setQuery('')}
                        aria-label="Clear search"
                      >
                        <AdminIcon name="close" size={14} />
                      </button>
                    )}
                  </div>

                  {filterOptions.length > 0 && (
                    <button
                      type="button"
                      className={`adm-filter-btn ${selectedFilters.length > 0 ? 'active' : ''}`}
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setFilterCoords({
                          top: rect.bottom + 8,
                          right: Math.max(16, window.innerWidth - rect.right),
                        });
                        setTempFilters([...selectedFilters]);
                        setIsFilterOpen(!isFilterOpen);
                      }}
                      title="Filter records"
                      aria-label="Filter records"
                    >
                      <AdminIcon name="filter" size={15} />
                      {selectedFilters.length > 0 && (
                        <span className="adm-filter-count-badge">
                          {selectedFilters.length}
                        </span>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    className="adm-btn-secondary adm-btn-icon-only"
                    style={{ width: '36px', height: '36px' }}
                    onClick={refresh}
                    title="Refresh records"
                    aria-label="Refresh records"
                  >
                    <AdminIcon name="refresh" size={14} className={loading ? 'adm-spin' : ''} />
                  </button>
                </div>
              </div>

              {cols ? (
                <>
                  <div className="adm-table-responsive">
                  <table className="adm-data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '48px', color: '#94a3b8' }}>#</th>
                        {cols.map((c) => (
                          <th key={c}>{c.replaceAll('_', ' ')}</th>
                        ))}
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedVisible.map((row, i) => (
                        <tr key={row.id || i}>
                          <td style={{ color: '#94a3b8', fontWeight: 600, width: '48px' }}>
                            {(safeCurrentPage - 1) * PAGE_SIZE + i + 1}
                          </td>
                          {cols.map((c) => (
                            <td key={c}>
                              {section === 'Customers' && c === 'name' ? (
                                <div className="adm-customer-cell">
                                  <div className="adm-avatar-circle">
                                    {(row.name || 'C').charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <strong style={{ color: '#0f172a' }}>{row.name || 'Anonymous Customer'}</strong>
                                  </div>
                                </div>
                              ) : c === 'created_at' || c === 'date' ? (
                                <div className="adm-datetime-cell">
                                  <span className="adm-date-text">{formatDateTime(row[c]).date}</span>
                                  {formatDateTime(row[c]).time && (
                                    <span className="adm-time-text">{formatDateTime(row[c]).time}</span>
                                  )}
                                </div>
                              ) : c === 'status' && section === 'Orders' ? (
                                <select
                                  className="adm-inline-select"
                                  value={row[c] || 'pending'}
                                  onChange={(e) => updateRecord(row.id, { status: e.target.value })}
                                >
                                  {[
                                    'pending',
                                    'confirmed',
                                    'processing',
                                    'shipped',
                                    'out_for_delivery',
                                    'delivered',
                                    'cancelled',
                                    'returned'
                                  ].map((x) => (
                                    <option key={x} value={x}>
                                      {x.replaceAll('_', ' ')}
                                    </option>
                                  ))}
                                </select>
                              ) : c === 'status' && section === 'Returns & refunds' ? (
                                <select
                                  className="adm-inline-select"
                                  value={row[c] || 'pending'}
                                  onChange={(e) => updateRecord(row.id, { status: e.target.value })}
                                >
                                  {['pending', 'approved', 'rejected', 'refunded'].map((x) => (
                                    <option key={x} value={x}>
                                      {x}
                                    </option>
                                  ))}
                                </select>
                              ) : c === 'price' ||
                                c === 'total' ||
                                c === 'amount' ||
                                c === 'refund_amount' ||
                                c === 'revenue' ? (
                                <strong>{money(row[c])}</strong>
                              ) : c === 'status' && ['Products', 'Categories'].includes(section) ? (
                                <button
                                  type="button"
                                  className={`adm-status-badge ${String(row[c] || 'active').toLowerCase()} adm-status-toggle-btn`}
                                  title={row[c] === 'active' ? 'Click to mark Inactive' : 'Click to mark Active'}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const nextStatus = (row[c] || 'active') === 'active' ? 'inactive' : 'active';
                                    try {
                                      await api(`/${endpoint}/${row.id}`, {
                                        method: 'PATCH',
                                        body: JSON.stringify({ status: nextStatus })
                                      });
                                      setToast(`${section === 'Categories' ? 'Category' : 'Product'} marked ${nextStatus}`);
                                      window.dispatchEvent(new Event('torado_products_changed'));
                                      localStorage.setItem('torado_products_updated', Date.now().toString());
                                      refresh();
                                      setTimeout(() => setToast(''), 2200);
                                    } catch (err) {
                                      setError(err.message);
                                    }
                                  }}
                                >
                                  <span className="adm-status-dot" />
                                  <span style={{ textTransform: 'capitalize' }}>{row[c] || 'active'}</span>
                                </button>
                              ) : c === 'stock' && section === 'Products' ? (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                  <strong style={{ color: Number(row[c]) <= 5 ? '#dc2626' : '#0f172a', fontWeight: 700 }}>
                                    {row[c] ?? 0}
                                  </strong>
                                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>items</span>
                                </div>
                              ) : c === 'provider' && section === 'Payments' ? (
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>
                                  {['cash', 'cod'].includes(String(row[c] || '').toLowerCase()) ? 'Cash' : 'Online'}
                                </span>
                              ) : c === 'status' && section === 'Payments' ? (
                                <span
                                  className={`adm-status-badge ${
                                    ['paid', 'completed'].includes(String(row[c] || '').toLowerCase())
                                      ? 'paid'
                                      : 'pending'
                                  }`}
                                >
                                  <span className="adm-status-dot" />
                                  {['paid', 'completed'].includes(String(row[c] || '').toLowerCase()) ? 'Completed' : 'Pending'}
                                </span>
                              ) : c === 'status' || c === 'payment_status' ? (
                                <span
                                  className={`adm-status-badge ${String(row[c] || '').toLowerCase()}`}
                                >
                                  <span className="adm-status-dot" />
                                  {row[c] || '—'}
                                </span>
                              ) : (
                                <span>{row[c] ?? '—'}</span>
                              )}
                            </td>
                          ))}
                          <td style={{ textAlign: 'right' }}>
                            <div className="adm-action-btns" style={{ justifyContent: 'flex-end' }}>
                              {['Products', 'Categories', 'Coupons', 'Banners', 'Admin profile'].includes(section) && (
                                <>
                                  <button
                                    type="button"
                                    className="adm-row-action-btn edit"
                                    title="Edit record"
                                    aria-label="Edit record"
                                    onClick={() => {
                                      setEditing(row);
                                      setModal(true);
                                    }}
                                  >
                                    <AdminIcon name="edit" size={15} />
                                  </button>
                                  {section !== 'Admin profile' && (
                                    <button
                                      type="button"
                                      className="adm-row-action-btn danger"
                                      title="Delete record"
                                      aria-label="Delete record"
                                      onClick={() => removeRecord(row.id)}
                                    >
                                      <AdminIcon name="trash" size={15} />
                                    </button>
                                  )}
                                </>
                              )}
                              {section === 'Inventory' && (
                                <button
                                  type="button"
                                  className="adm-row-action-btn edit"
                                  title="Edit stock & SKU"
                                  aria-label="Edit stock & SKU"
                                  onClick={() => {
                                    setEditing(row);
                                    setModal(true);
                                  }}
                                >
                                  <AdminIcon name="edit" size={15} />
                                </button>
                              )}
                              {section === 'Products' && (
                                <>
                                  <button
                                    type="button"
                                    className="adm-row-action-btn add-stock"
                                    title="Add inventory stock (+)"
                                    aria-label="Add stock"
                                    onClick={() => {
                                      setStockModal({
                                        id: row.id,
                                        name: row.name,
                                        currentStock: Number(row.stock || 0),
                                        addQty: 10
                                      });
                                    }}
                                  >
                                    <AdminIcon name="plus" size={15} />
                                  </button>
                                  <button
                                    type="button"
                                    className="adm-row-action-btn view"
                                    title="View product details"
                                    aria-label="View product details"
                                    onClick={() => {
                                      setViewingRecord({
                                        section,
                                        title: 'Product Details',
                                        data: row,
                                      });
                                    }}
                                  >
                                    <AdminIcon name="eye" size={15} />
                                  </button>
                                </>
                              )}
                              {section === 'Orders' && (
                                <button
                                  type="button"
                                  className="adm-row-action-btn edit"
                                  style={{ background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }}
                                  title="Dispatch with Shiprocket"
                                  aria-label="Dispatch with Shiprocket"
                                  onClick={async () => {
                                    if (window.confirm(`Dispatch Order #TRD-${row.id} via Shiprocket Logistics?`)) {
                                      try {
                                        await api(`/orders/${row.id}/ship`, {
                                          method: 'POST',
                                          body: JSON.stringify({ courierName: 'Shiprocket Express' })
                                        });
                                        setToast(`Order #TRD-${row.id} assigned to Shiprocket! Status: Shipped`);
                                        refresh();
                                      } catch (err) {
                                        setError(err.message || 'Courier dispatch failed');
                                      }
                                    }
                                  }}
                                >
                                  <AdminIcon name="check" size={15} />
                                </button>
                              )}
                              {['Orders', 'Customers', 'Payments', 'Reviews', 'Notifications', 'Reports', 'Admin profile'].includes(section) && (
                                <button
                                  type="button"
                                  className="adm-row-action-btn view"
                                  title={`View ${section === 'Admin profile' ? 'Admin Profile' : section === 'Reports' ? 'Daily Report' : section.replace(/s$/, '')} details`}
                                  aria-label="View details"
                                  onClick={() => {
                                    if (section === 'Notifications' && !row.read_at) {
                                      api(`/notifications/${row.id}`, { method: 'PATCH', body: JSON.stringify({ read_at: new Date() }) }).catch(() => {});
                                      row.read_at = new Date().toISOString();
                                      setTimeout(refresh, 500);
                                    }
                                    setViewingRecord({
                                      section,
                                      title: section === 'Notifications' ? `Notification: ${row.title}` : section === 'Admin profile' ? 'Admin Profile Details' : section === 'Reports' ? `Daily Sales Report - ${row.date}` : `${section.replace(/s$/, '')} Details`,
                                      data: section === 'Reports' ? {
                                        date: row.date,
                                        orders_count: row.orders_count,
                                        total_revenue: row.revenue,
                                        average_order_value: Number(row.orders_count) > 0 ? (Number(row.revenue) / Number(row.orders_count)).toFixed(2) : 0,
                                        status: 'Audited & Verified'
                                      } : row,
                                    });
                                  }}
                                >
                                  <AdminIcon name="eye" size={15} />
                                </button>
                              )}
                              {section === 'Notifications' && (
                                <button
                                  type="button"
                                  className="adm-row-action-btn danger"
                                  title="Delete notification"
                                  aria-label="Delete notification"
                                  onClick={() => removeRecord(row.id)}
                                >
                                  <AdminIcon name="trash" size={15} />
                                </button>
                              )}
                              {section === 'Reports' && (
                                <button
                                  type="button"
                                  className="adm-row-action-btn edit"
                                  title="Export Daily Report (CSV)"
                                  aria-label="Export Report"
                                  onClick={() => {
                                    const csvContent = "data:text/csv;charset=utf-8," + 
                                      "Date,Orders Count,Total Revenue (INR),Average Order Value (INR),Status\n" +
                                      `"${row.date}","${row.orders_count}","₹${Number(row.revenue).toLocaleString('en-IN')}","₹${(Number(row.revenue) / Number(row.orders_count || 1)).toFixed(2)}","Audited & Verified"\n`;
                                    const encodedUri = encodeURI(csvContent);
                                    const link = document.createElement("a");
                                    link.setAttribute("href", encodedUri);
                                    link.setAttribute("download", `Daily_Report_${row.date}.csv`);
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    setToast(`Report for ${row.date} exported successfully!`);
                                    setTimeout(() => setToast(''), 2200);
                                  }}
                                >
                                  <AdminIcon name="download" size={15} />
                                </button>
                              )}
                              {section === 'Returns & refunds' && (
                                <>
                                  {row.status === 'approved' && (
                                    <button
                                      type="button"
                                      className="adm-btn-primary"
                                      style={{ height: '32px', padding: '0 10px', fontSize: '0.78rem' }}
                                      onClick={() =>
                                        setRefundModal({
                                          id: row.id,
                                          orderId: row.order_id,
                                          customerName: row.customer_name,
                                          amount: row.refund_amount || '',
                                          reason: row.reason || 'Customer Return Approved'
                                        })
                                      }
                                    >
                                      Issue Refund
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    className="adm-row-action-btn view"
                                    title="View return details"
                                    aria-label="View return details"
                                    onClick={() => {
                                      setViewingRecord({
                                        section,
                                        title: 'Return Request Details',
                                        data: row,
                                      });
                                    }}
                                  >
                                    <AdminIcon name="eye" size={15} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {!visible.length && (
                    <div className="adm-empty-state">
                      <div className="adm-empty-icon-wrap">
                        <AdminIcon name="search" size={26} />
                      </div>
                      <h3 className="adm-empty-title">
                        No {section.toLowerCase()} found
                      </h3>
                      <p className="adm-empty-desc">
                        {query
                          ? `No records match your search query "${query}". Try clearing the search.`
                          : `There are currently no records available in ${section.toLowerCase()}.`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Hospital-Style Table Pagination Footer */}
                {visible.length > 0 && (
                  <div className="table-pagination-footer">
                    <div className="pagination-info">
                      Showing <strong>{(safeCurrentPage - 1) * PAGE_SIZE + 1}</strong> to{' '}
                      <strong>{Math.min(safeCurrentPage * PAGE_SIZE, visible.length)}</strong> of{' '}
                      <strong>{visible.length}</strong> {section.toLowerCase()}
                    </div>

                    <div className="pagination-controls" role="navigation" aria-label="Pagination">
                      <button
                        type="button"
                        className="pagination-btn pagination-nav-btn"
                        disabled={safeCurrentPage <= 1}
                        onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                        title="Previous Page"
                        aria-label="Previous Page"
                      >
                        ‹ Prev
                      </button>

                      {visiblePages.map((pageNum) => (
                        <button
                          key={pageNum}
                          type="button"
                          className={`pagination-btn ${pageNum === safeCurrentPage ? 'active' : ''}`}
                          onClick={() => setCurrentPage(pageNum)}
                          aria-current={pageNum === safeCurrentPage ? 'page' : undefined}
                        >
                          {pageNum}
                        </button>
                      ))}

                      <button
                        type="button"
                        className="pagination-btn pagination-nav-btn"
                        disabled={safeCurrentPage >= totalPages}
                        onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
                        title="Next Page"
                        aria-label="Next Page"
                      >
                        Next ›
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
                <div className="adm-empty-state">
                  <div className="adm-empty-icon-wrap">
                    <AdminIcon name="dashboard" size={26} />
                  </div>
                  <h3 className="adm-empty-title">{section} Workspace</h3>
                  <p className="adm-empty-desc">
                    Connect the required store data to manage {section.toLowerCase()} records here.
                  </p>
                </div>
              )}
            </section>
          </>
        )}


        </div>
      </main>

      {/* Add / Edit Modal Dialog */}
      {modal && (
        <div
          className="adm-modal-overlay"
          onClick={() => {
            setModal(false);
            setEditing(null);
          }}
        >
          <div className="adm-modal-container" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="adm-modal-close-btn"
              onClick={() => {
                setModal(false);
                setEditing(null);
              }}
              aria-label="Close"
            >
              <AdminIcon name="close" size={16} />
            </button>

            <div className="adm-modal-header">
              <div className="adm-modal-eyebrow">STORE CATALOGUE MANAGEMENT</div>
              <h2 className="adm-modal-title">
                {editing ? 'Edit' : 'Add New'}{' '}
                {section === 'Products' ? 'Product' : section.replace(/s$/, '')}
              </h2>
              <p className="adm-modal-subtitle">
                Fill in the details below to publish changes to your live storefront.
              </p>
            </div>

            <form className="adm-modal-form" onSubmit={saveRecord} autoComplete="off">
              {(section === 'Products'
                ? [
                    ['name', 'Product Name', 'text', true],
                    ['description', 'Description', 'textarea', false],
                    ['category', 'Category', 'text', false],
                    ['price', 'Selling Price (₹)', 'number', true],
                    ['original_price', 'Original MRP (₹)', 'number', false],
                    ['stock', 'Available Stock Quantity', 'number', true],
                    ['image_url', 'Product Image URL', 'text', false],
                    ['sku', 'SKU Identifier', 'text', false]
                  ]
                : section === 'Inventory'
                ? [
                    ['name', 'Product Name', 'text', true],
                    ['sku', 'SKU Identifier', 'text', false],
                    ['stock', 'Available Stock Quantity', 'number', true],
                    ['category', 'Category', 'text', false]
                  ]
                : section === 'Categories'
                ? [
                    ['name', 'Category Name', 'text', true],
                    ['description', 'Description', 'textarea', false]
                  ]
                : section === 'Coupons'
                ? [
                    ['code', 'Coupon Code', 'text', true],
                    ['discount_value', 'Discount Value', 'number', true],
                    ['minimum_order', 'Minimum Order (₹)', 'number', false],
                    ['usage_limit', 'Usage Limit', 'number', false]
                  ]
                : section === 'Admin profile'
                ? [
                    ['name', 'Admin Full Name', 'text', true],
                    ['email', 'Admin Email Address', 'email', true],
                    ['phone', 'Phone Number', 'text', false],
                    ['address', 'Street Address', 'text', false],
                    ['city', 'City', 'text', false],
                    ['country', 'Country', 'text', false],
                    ['password', 'New Password (optional)', 'password', false]
                  ]
                : [
                    ['title', 'Banner Title', 'text', true],
                    ['subtitle', 'Subtitle', 'text', false],
                    ['button_text', 'Button Text', 'text', false],
                    ['image_url', 'Image URL', 'text', false],
                    ['redirect_url', 'Redirect URL', 'text', false]
                  ]
              ).map(([key, label, type, req]) => (
                <div key={key} className="adm-form-field">
                  <label>
                    {label} {req && <span style={{ color: '#ef4444' }}>*</span>}
                  </label>
                  {type === 'textarea' ? (
                    <textarea
                      name={key}
                      rows="3"
                      defaultValue={editing?.[key] || ''}
                      placeholder={`Enter ${label.toLowerCase()}...`}
                      autoComplete="off"
                      spellCheck="false"
                    />
                  ) : (
                    <input
                      name={key}
                      type={type}
                      required={req}
                      defaultValue={key === 'password' ? '' : (editing?.[key] ?? '')}
                      placeholder={`Enter ${label.toLowerCase()}...`}
                      autoComplete="new-password"
                      autoCorrect="off"
                      spellCheck="false"
                    />
                  )}
                </div>
              ))}

              {section === 'Products' && (
                <>
                  <div className="adm-form-field">
                    <label>Available Sizes</label>
                    <input
                      name="sizes"
                      defaultValue={editing?.sizes || ''}
                      placeholder="e.g. S, M, L, XL, XXL"
                    />
                  </div>
                  <div className="adm-form-field">
                    <label>Product Image</label>
                    <input
                      name="image"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/avif"
                    />
                  </div>
                </>
              )}

              <div className="adm-modal-actions">
                <button type="submit" className="adm-btn-primary">
                  <AdminIcon name="check" size={16} />
                  <span>Save {section === 'Products' ? 'Product' : 'Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hospital-Style Multi-Filter Popover Box */}
      {isFilterOpen && filterOptions.length > 0 && (
        <>
          <div
            className="filter-popover-backdrop"
            onClick={() => setIsFilterOpen(false)}
          />
          <div
            className="filter-popover-box"
            style={{
              top: `${filterCoords.top || 180}px`,
              right: `${filterCoords.right || 24}px`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="filter-popover-header">
              <span className="filter-popover-title">
                Filter {section} {tempFilters.length > 0 ? `(${tempFilters.length})` : ''}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {tempFilters.length > 0 && (
                  <button
                    type="button"
                    className="filter-popover-clear-btn"
                    onClick={() => setTempFilters([])}
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  className="filter-popover-close-btn"
                  onClick={() => setIsFilterOpen(false)}
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="filter-popover-list">
              <label
                className={`filter-popover-item ${tempFilters.length === 0 ? 'checked' : ''}`}
                onClick={() => setTempFilters([])}
              >
                <input
                  type="checkbox"
                  checked={tempFilters.length === 0}
                  onChange={() => setTempFilters([])}
                />
                <span className="filter-popover-item-text">
                  All {section} ({records.length})
                </span>
              </label>

              {filterOptions.map((opt) => {
                const isChecked = tempFilters.includes(opt.id);
                let count = 0;
                if (section === 'Products') {
                  count = records.filter((r) => r.category === opt.id).length;
                } else if (section === 'Orders') {
                  count = records.filter((r) => (r.status || 'pending').toLowerCase() === opt.id).length;
                } else if (section === 'Inventory') {
                  count = records.filter((r) => {
                    const q = Number(r.stock || 0);
                    if (opt.id === 'out_of_stock') return q <= 0;
                    if (opt.id === 'low_stock') return q > 0 && q <= 5;
                    if (opt.id === 'in_stock') return q > 0;
                    return false;
                  }).length;
                } else if (['Coupons', 'Banners', 'Categories'].includes(section)) {
                  count = records.filter((r) => {
                    const act = Boolean(r.active ?? r.status === 'active');
                    return opt.id === 'active' ? act : !act;
                  }).length;
                } else if (section === 'Payments') {
                  count = records.filter((r) => {
                    const raw = (r.status || '').toLowerCase();
                    const st = ['paid', 'completed'].includes(raw) ? 'completed' : raw === 'failed' ? 'failed' : 'pending';
                    return st === opt.id;
                  }).length;
                } else if (section === 'Returns & refunds') {
                  count = records.filter((r) => (r.status || '').toLowerCase() === opt.id).length;
                } else if (section === 'Reviews') {
                  count = records.filter((r) => String(r.rating) === opt.id).length;
                } else if (section === 'Customers') {
                  count = records.filter((r) => {
                    const hasPhone = Boolean(r.phone && r.phone !== '—');
                    return opt.id === 'has_phone' ? hasPhone : !hasPhone;
                  }).length;
                }

                return (
                  <label
                    key={opt.id}
                    className={`filter-popover-item ${isChecked ? 'checked' : ''}`}
                    onClick={() => {
                      setTempFilters((prev) =>
                        prev.includes(opt.id)
                          ? prev.filter((x) => x !== opt.id)
                          : [...prev, opt.id]
                      );
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                    />
                    <span className="filter-popover-item-text">
                      {opt.label} {count > 0 ? `(${count})` : ''}
                    </span>
                  </label>
                );
              })}
            </div>

            <div className="filter-popover-footer">
              <button
                type="button"
                className="filter-popover-reset-btn"
                onClick={() => {
                  setTempFilters([]);
                  setSelectedFilters([]);
                  setIsFilterOpen(false);
                }}
              >
                Reset All
              </button>
              <button
                type="button"
                className="filter-popover-apply-btn"
                onClick={() => {
                  setSelectedFilters([...tempFilters]);
                  setIsFilterOpen(false);
                }}
              >
                Apply Filter {tempFilters.length > 0 ? `(${tempFilters.length})` : ''}
              </button>
            </div>
          </div>
        </>
      )}

      {/* View Details Modal Dialog (Hospital SaaS Style) */}
      {viewingRecord && (
        <div className="adm-modal-overlay" onClick={() => setViewingRecord(null)}>
          <div
            className="vdm-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="vdm-header">
              <div className="vdm-header-left">
                <div className="vdm-icon-wrap">
                  <AdminIcon name="eye" size={22} />
                </div>
                <div className="vdm-title-wrap">
                  <div className="vdm-title-row">
                    <h3>{viewingRecord.title || `${viewingRecord.section} Record Details`}</h3>
                    {viewingRecord.data.status && (
                      <span
                        className={`vdm-badge ${
                          ['active', 'delivered', 'paid', 'approved', 'completed'].includes(
                            String(viewingRecord.data.status).toLowerCase()
                          )
                            ? 'badge-green'
                            : ['pending', 'processing', 'shipped'].includes(
                                String(viewingRecord.data.status).toLowerCase()
                              )
                            ? 'badge-amber'
                            : 'badge-red'
                        }`}
                      >
                        {viewingRecord.data.status}
                      </span>
                    )}
                  </div>
                  <p className="vdm-subtitle">
                    Record ID #{viewingRecord.data.id || '—'} • {viewingRecord.section} Master Desk
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="vdm-close-btn"
                onClick={() => setViewingRecord(null)}
                aria-label="Close modal"
                title="Close"
              >
                <AdminIcon name="x" size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="vdm-body">
              <div className="vdm-section">
                <div className="vdm-section-heading">
                  <AdminIcon name="info" size={16} />
                  <h4>Attributes & Information</h4>
                </div>
                <div className="vdm-grid vdm-grid-2">
                  {Object.entries(viewingRecord.data)
                    .filter(([k]) => !['password', 'password_hash', 'token'].includes(k))
                    .map(([key, val]) => (
                      <div
                        key={key}
                        className={`vdm-field ${
                          [
                            'description',
                            'address',
                            'shipping_address',
                            'reason',
                            'notes',
                            'comment',
                            'body',
                          ].includes(key)
                            ? 'vdm-field-full'
                            : ''
                        }`}
                      >
                        <span className="vdm-field-label">{key.replaceAll('_', ' ')}</span>
                        <div className="vdm-field-value">
                          {formatDetailValue(key, val)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>


          </div>
        </div>
      )}

      {/* In-App Stock Adjustment Modal Dialog */}
      {stockModal && (
        <div className="adm-modal-overlay" onClick={() => setStockModal(null)}>
          <div
            className="adm-modal-container"
            style={{ maxWidth: '440px' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="adm-modal-close-btn"
              onClick={() => setStockModal(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="adm-modal-header" style={{ marginBottom: '14px' }}>
              <div className="adm-modal-eyebrow">WAREHOUSE INVENTORY MANAGEMENT</div>
              <h2 className="adm-modal-title" style={{ fontSize: '1.25rem' }}>Update Product Stock</h2>
              <p className="adm-modal-subtitle" style={{ fontSize: '0.82rem' }}>
                Adjust live warehouse inventory for <strong>{stockModal.name}</strong>
              </p>
            </div>

            <div
              style={{
                background: '#f8fafc',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Current Stock
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
                  {stockModal.currentStock}{' '}
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748b' }}>items</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  New Total Stock
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#059669' }}>
                  {Math.max(0, Number(stockModal.currentStock || 0) + (parseInt(stockModal.addQty, 10) || 0))}{' '}
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#059669' }}>items</span>
                </div>
              </div>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const addQty = parseInt(stockModal.addQty, 10);
                if (isNaN(addQty)) {
                  setError('Please enter a valid stock quantity');
                  return;
                }
                const finalStock = Math.max(0, Number(stockModal.currentStock || 0) + addQty);
                try {
                  setLoading(true);
                  await api(`/products/${stockModal.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ stock: finalStock })
                  });
                  setToast(`Inventory updated for "${stockModal.name}". New stock: ${finalStock} items`);
                  setStockModal(null);
                  refresh();
                  setTimeout(() => setToast(''), 2500);
                } catch (err) {
                  setError(err.message);
                } finally {
                  setLoading(false);
                }
              }}
            >
              <div className="adm-form-field" style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Quantity to Add / Adjust</label>
                <input
                  type="number"
                  autoFocus
                  value={stockModal.addQty}
                  onChange={(e) => setStockModal({ ...stockModal, addQty: e.target.value })}
                  placeholder="e.g. 10 or 20"
                  style={{ fontSize: '1.15rem', fontWeight: 700 }}
                  required
                />
              </div>

              {/* Quick increment pills */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '22px' }}>
                {[5, 10, 20, 50].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    className="adm-btn-secondary"
                    style={{
                      flex: 1,
                      padding: '7px 0',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      background: Number(stockModal.addQty) === qty ? '#eff6ff' : '#ffffff',
                      borderColor: Number(stockModal.addQty) === qty ? '#3b82f6' : '#cbd5e1',
                      color: Number(stockModal.addQty) === qty ? '#1d4ed8' : '#334155'
                    }}
                    onClick={() => setStockModal({ ...stockModal, addQty: qty })}
                  >
                    +{qty}
                  </button>
                ))}
              </div>

              <div className="adm-modal-actions">
                <button
                  type="button"
                  className="adm-btn-secondary"
                  onClick={() => setStockModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary">
                  <AdminIcon name="check" size={16} />
                  <span>Update Stock in Database</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Centered Refund Settlement Modal Dialog */}
      {refundModal && (
        <div className="adm-modal-overlay" onClick={() => setRefundModal(null)}>
          <div
            className="adm-modal-container"
            style={{ maxWidth: '480px' }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="adm-modal-close-btn"
              onClick={() => setRefundModal(null)}
              aria-label="Close"
            >
              ✕
            </button>

            <div className="adm-modal-header" style={{ marginBottom: '16px' }}>
              <div className="adm-modal-eyebrow">STORE COMMERCE • REVERSE SETTLEMENT</div>
              <h2 className="adm-modal-title" style={{ fontSize: '1.35rem' }}>Issue Customer Refund</h2>
              <p className="adm-modal-subtitle" style={{ fontSize: '0.82rem' }}>
                Process reverse payment settlement for <strong>Order #{refundModal.orderId}</strong>
              </p>
            </div>

            {/* Order & Customer Summary Card */}
            <div
              style={{
                background: '#f8fafc',
                padding: '14px 18px',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                marginBottom: '18px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Customer Name:</span>
                <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>{refundModal.customerName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Linked Order:</span>
                <strong style={{ fontSize: '0.82rem', color: '#0f172a' }}>Order #{refundModal.orderId}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Eligible Refund:</span>
                <strong style={{ fontSize: '0.95rem', color: '#059669', fontWeight: 800 }}>
                  ₹{Number(refundModal.amount || 0).toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <form onSubmit={handleConfirmRefund}>
              <div className="adm-form-group" style={{ marginBottom: '14px' }}>
                <label className="adm-label" style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '6px', display: 'block' }}>
                  Refund Amount (₹) <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '10px', fontWeight: 700, color: '#64748b' }}>₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    style={{ paddingLeft: '28px' }}
                    className="adm-input"
                    value={refundModal.amount}
                    onChange={(e) => setRefundModal({ ...refundModal, amount: e.target.value })}
                    placeholder="Enter amount to refund"
                  />
                </div>
              </div>

              <div className="adm-form-group" style={{ marginBottom: '20px' }}>
                <label className="adm-label" style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '6px', display: 'block' }}>
                  Refund Reason / Internal Note <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  className="adm-input"
                  rows="3"
                  required
                  style={{ resize: 'vertical' }}
                  value={refundModal.reason}
                  onChange={(e) => setRefundModal({ ...refundModal, reason: e.target.value })}
                  placeholder="e.g. Size exchange requested, parcel QC approved"
                />
              </div>

              <div className="adm-modal-actions">
                <button
                  type="button"
                  className="adm-btn-secondary"
                  onClick={() => setRefundModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary" style={{ background: '#dc2626', borderColor: '#dc2626' }}>
                  <AdminIcon name="check" size={16} />
                  <span>Confirm & Issue Refund</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="adm-toast">
          <AdminIcon name="check" size={16} color="#10b981" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
