import React, { useState, useEffect } from 'react';

// =============================================================================
// API CONFIG
// =============================================================================
const API_URL = 'https://adbrain-pro-api.vercel.app';

const api = {
  getHeaders: () => {
    const token = localStorage.getItem('adbrain_meta_token');
    return { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) };
  },
  get: async (endpoint) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, { headers: api.getHeaders() });
      return res.json();
    } catch (e) { return { success: false, error: e.message }; }
  },
  post: async (endpoint, data) => {
    try {
      const res = await fetch(`${API_URL}${endpoint}`, { method: 'POST', headers: api.getHeaders(), body: JSON.stringify(data) });
      return res.json();
    } catch (e) { return { success: false, error: e.message }; }
  }
};

// =============================================================================
// ICONS
// =============================================================================
const Icon = ({ name, size = 20, style = {} }) => {
  const icons = {
    brain: <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Zm5 0A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>,
    dashboard: <><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></>,
    target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    image: <><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    bot: <><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    funnel: <><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>,
    refresh: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    x: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    alert: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/></>,
    play: <polygon points="5 3 19 12 5 21 5 3"/>,
    pause: <><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></>,
    rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></>,
    calendar: <><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></>,
    chevronDown: <polyline points="6 9 12 15 18 9"/>,
    dollar: <><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    trendUp: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
    trendDown: <><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></>,
    link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    smartphone: <><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></>,
    monitor: <><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {icons[name]}
    </svg>
  );
};

// =============================================================================
// HELPERS
// =============================================================================
const fmt = {
  money: (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0),
  num: (v) => new Intl.NumberFormat('pt-BR').format(v || 0),
  pct: (v) => `${(v || 0).toFixed(2)}%`,
};

const getScoreColor = (score) => {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#22c55e';
  if (score >= 40) return '#f59e0b';
  if (score >= 20) return '#f97316';
  return '#ef4444';
};

const getScoreLabel = (score) => {
  if (score >= 80) return 'Excelente';
  if (score >= 60) return 'Bom';
  if (score >= 40) return 'Atenção';
  if (score >= 20) return 'Alerta';
  return 'Crítico';
};

// =============================================================================
// MAIN APP
// =============================================================================
export default function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Meta connection
  const [connected, setConnected] = useState(false);
  const [token, setToken] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [dateRange, setDateRange] = useState('last_30d');
  
  // Data
  const [campaigns, setCampaigns] = useState([]);
  const [ads, setAds] = useState([]);
  const [metrics, setMetrics] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [breakdown, setBreakdown] = useState(null);
  const [funnel, setFunnel] = useState(null);

  // Date options
  const dateOptions = [
    { value: 'today', label: 'Hoje' },
    { value: 'yesterday', label: 'Ontem' },
    { value: 'last_7d', label: 'Últimos 7 dias' },
    { value: 'last_14d', label: 'Últimos 14 dias' },
    { value: 'last_30d', label: 'Últimos 30 dias' },
    { value: 'this_month', label: 'Este mês' },
    { value: 'last_month', label: 'Mês passado' },
  ];

  // Check auth on load
  useEffect(() => {
    const savedUser = localStorage.getItem('adbrain_user');
    const savedToken = localStorage.getItem('adbrain_meta_token');
    const savedAccount = localStorage.getItem('adbrain_account');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setPage('dashboard');
      if (savedToken) {
        setToken(savedToken);
        setConnected(true);
        if (savedAccount) setSelectedAccount(savedAccount);
      }
    }
  }, []);

  // Load data when account changes
  useEffect(() => {
    if (connected && selectedAccount) {
      loadAllData();
    }
  }, [connected, selectedAccount, dateRange]);

  // Clear messages
  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => { setError(''); setSuccess(''); }, 4000);
      return () => clearTimeout(t);
    }
  }, [error, success]);

  // =============================================================================
  // AUTH FUNCTIONS
  // =============================================================================
  const handleLogin = async (email, password) => {
    setLoading(true);
    const res = await api.post('/api/auth/login', { email, password });
    setLoading(false);
    
    if (res.success) {
      localStorage.setItem('adbrain_user', JSON.stringify(res.user));
      localStorage.setItem('adbrain_token', res.token);
      setUser(res.user);
      setPage('dashboard');
    } else {
      setError(res.error || 'Erro ao fazer login');
    }
  };

  const handleRegister = async (name, email, password) => {
    setLoading(true);
    const res = await api.post('/api/auth/register', { name, email, password });
    setLoading(false);
    
    if (res.success) {
      localStorage.setItem('adbrain_user', JSON.stringify(res.user));
      localStorage.setItem('adbrain_token', res.token);
      setUser(res.user);
      setPage('dashboard');
    } else {
      setError(res.error || 'Erro ao criar conta');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setConnected(false);
    setToken('');
    setAccounts([]);
    setSelectedAccount('');
    setCampaigns([]);
    setAds([]);
    setPage('login');
  };

  // =============================================================================
  // META FUNCTIONS
  // =============================================================================
  const handleConnect = async () => {
    if (!token.trim()) { setError('Cole o token do Meta'); return; }
    
    setLoading(true);
    const res = await api.post('/api/meta/connect', { accessToken: token });
    setLoading(false);
    
    if (res.success) {
      localStorage.setItem('adbrain_meta_token', token);
      setConnected(true);
      setSuccess('Meta conectado!');
      loadAccounts();
    } else {
      setError(res.error || 'Token inválido');
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('adbrain_meta_token');
    localStorage.removeItem('adbrain_account');
    setConnected(false);
    setToken('');
    setAccounts([]);
    setSelectedAccount('');
    setCampaigns([]);
    setAds([]);
  };

  const loadAccounts = async () => {
    const res = await api.get('/api/meta/ad-accounts');
    if (res.success && res.adAccounts) {
      setAccounts(res.adAccounts);
      if (res.adAccounts.length > 0 && !selectedAccount) {
        const first = res.adAccounts[0].id;
        setSelectedAccount(first);
        localStorage.setItem('adbrain_account', first);
      }
    }
  };

  const loadAllData = async () => {
    if (!selectedAccount) return;
    const id = selectedAccount.replace('act_', '');
    
    setLoading(true);
    
    const [campRes, adsRes, breakRes] = await Promise.all([
      api.get(`/api/meta/campaigns/${id}?date_preset=${dateRange}`),
      api.get(`/api/meta/ads/${id}?date_preset=${dateRange}`),
      api.get(`/api/meta/breakdown/${id}?date_preset=${dateRange}`)
    ]);
    
    if (campRes.success) {
      setCampaigns(campRes.campaigns || []);
      setMetrics(campRes.metrics || {});
      setRecommendations(campRes.recommendations || []);
      setFunnel(campRes.funnel || null);
    }
    
    if (adsRes.success) setAds(adsRes.ads || []);
    if (breakRes.success) setBreakdown(breakRes.breakdown || null);
    
    setLoading(false);
  };

  // =============================================================================
  // ACTION FUNCTIONS
  // =============================================================================
  const handleAction = async (action, targetId, targetType, value = null) => {
    const id = selectedAccount.replace('act_', '');
    setLoading(true);
    
    const res = await api.post(`/api/meta/actions/${id}`, { action, targetId, targetType, value });
    
    if (res.success) {
      setSuccess(res.message);
      loadAllData();
    } else {
      setError(res.error || 'Erro ao executar ação');
    }
    setLoading(false);
  };

  // =============================================================================
  // RENDER LOGIN
  // =============================================================================
  if (page === 'login') {
    return <LoginPage onLogin={handleLogin} onRegister={handleRegister} loading={loading} error={error} />;
  }

  // =============================================================================
  // RENDER APP
  // =============================================================================
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'campaigns', label: 'Campanhas', icon: 'target' },
    { id: 'creatives', label: 'Criativos Campeões', icon: 'image' },
    { id: 'audience', label: 'Análise de Público', icon: 'users' },
    { id: 'recommendations', label: 'IA Recomenda', icon: 'bot' },
    { id: 'funnel', label: 'Estratégia Funil', icon: 'funnel' },
    { id: 'settings', label: 'Configurações', icon: 'settings' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: '#0d1321', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: 24, borderBottom: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, background: '#10b981', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="brain" size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>AdBrain Pro</div>
              <div style={{ fontSize: 12, color: '#10b981' }}>Gestor Sênior IA</div>
            </div>
          </div>
        </div>
        
        <nav style={{ flex: 1, padding: 16 }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 16px',
                marginBottom: 4,
                border: 'none',
                borderRadius: 8,
                background: page === item.id ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
                color: page === item.id ? '#10b981' : '#94a3b8',
                fontSize: 14,
                fontWeight: 500,
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <Icon name={item.icon} size={20} />
              {item.label}
            </button>
          ))}
        </nav>
        
        <div style={{ padding: 16, borderTop: '1px solid #1e293b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, background: '#1e293b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</div>
              <div style={{ fontSize: 12, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b', marginBottom: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: connected ? '#10b981' : '#ef4444' }} />
            {connected ? 'Meta Conectado' : 'Desconectado'}
          </div>
          <button
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '8px 12px', border: 'none', borderRadius: 8, background: 'transparent', color: '#94a3b8', fontSize: 14 }}
          >
            <Icon name="logout" size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: 24, overflow: 'auto' }}>
        {/* Header */}
        <header style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {connected && accounts.length > 0 && (
              <select
                value={selectedAccount}
                onChange={(e) => { setSelectedAccount(e.target.value); localStorage.setItem('adbrain_account', e.target.value); }}
                style={{ padding: '8px 12px', borderRadius: 8, minWidth: 200 }}
              >
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>{acc.name}</option>
                ))}
              </select>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: 8 }}
            >
              {dateOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={loadAllData}
              disabled={loading || !connected}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', border: '1px solid #1e293b', borderRadius: 8, background: '#0d1321', color: '#fff' }}
            >
              <Icon name="refresh" size={16} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} /> Atualizar
            </button>
          </div>
        </header>

        {/* Messages */}
        {error && (
          <div style={{ marginBottom: 16, padding: 16, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: 8, color: '#fca5a5' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ marginBottom: 16, padding: 16, background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981', borderRadius: 8, color: '#6ee7b7' }}>
            {success}
          </div>
        )}

        {/* Pages */}
        {page === 'dashboard' && <DashboardPage metrics={metrics} campaigns={campaigns} recommendations={recommendations} loading={loading} onAction={handleAction} />}
        {page === 'campaigns' && <CampaignsPage campaigns={campaigns} loading={loading} onAction={handleAction} />}
        {page === 'creatives' && <CreativesPage ads={ads} loading={loading} />}
        {page === 'audience' && <AudiencePage breakdown={breakdown} loading={loading} />}
        {page === 'recommendations' && <RecommendationsPage recommendations={recommendations} loading={loading} onAction={handleAction} />}
        {page === 'funnel' && <FunnelPage funnel={funnel} />}
        {page === 'settings' && <SettingsPage connected={connected} token={token} setToken={setToken} onConnect={handleConnect} onDisconnect={handleDisconnect} loading={loading} user={user} />}
      </main>
    </div>
  );
}

// =============================================================================
// LOGIN PAGE
// =============================================================================
function LoginPage({ onLogin, onRegister, loading, error }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) onRegister(name, email, password);
    else onLogin(email, password);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 64, height: 64, background: '#10b981', borderRadius: 16, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Icon name="brain" size={40} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>AdBrain Pro</h1>
          <p style={{ color: '#64748b' }}>Gestor Sênior de Anúncios com IA</p>
        </div>

        <div style={{ background: '#0d1321', borderRadius: 16, padding: 32, border: '1px solid #1e293b' }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>{isRegister ? 'Criar Conta' : 'Entrar'}</h2>
          
          {error && <div style={{ marginBottom: 16, padding: 12, background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', borderRadius: 8, color: '#fca5a5', fontSize: 14 }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>Nome</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" style={{ width: '100%', padding: 12, borderRadius: 8 }} />
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required style={{ width: '100%', padding: 12, borderRadius: 8 }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>Senha</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required style={{ width: '100%', padding: 12, borderRadius: 8 }} />
            </div>
            <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, border: 'none', borderRadius: 8, background: '#10b981', color: '#fff', fontWeight: 600, fontSize: 16 }}>
              {loading ? 'Aguarde...' : (isRegister ? 'Criar Conta' : 'Entrar')}
            </button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button onClick={() => setIsRegister(!isRegister)} style={{ border: 'none', background: 'none', color: '#10b981', cursor: 'pointer' }}>
              {isRegister ? 'Já tem conta? Entrar' : 'Não tem conta? Criar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// DASHBOARD PAGE
// =============================================================================
function DashboardPage({ metrics, campaigns, recommendations, loading, onAction }) {
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Visão geral das suas campanhas</p>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <MetricCard icon="dollar" label="INVESTIMENTO" value={fmt.money(metrics.spend)} color="#3b82f6" />
        <MetricCard icon="check" label="CONVERSÕES" value={fmt.num(metrics.conversions)} color="#10b981" />
        <MetricCard icon="trendDown" label="CPA MÉDIO" value={fmt.money(metrics.cpa)} color={metrics.cpa > 400 ? '#f59e0b' : '#10b981'} />
        <MetricCard icon="trendUp" label="ROAS" value={`${(metrics.roas || 0).toFixed(2)}x`} color={metrics.roas >= 3 ? '#10b981' : '#f59e0b'} />
        <MetricCard icon="dollar" label="RECEITA" value={fmt.money(metrics.revenue)} color="#8b5cf6" />
        <MetricCard icon="target" label="CAMPANHAS" value={campaigns.length} color="#3b82f6" />
      </div>

      {/* Health Score & Recommendations */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ background: '#0d1321', borderRadius: 12, padding: 24, border: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Health Score</h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 140, height: 140, borderRadius: '50%', border: `8px solid ${getScoreColor(metrics.avgHealthScore || 50)}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <div>
                <div style={{ fontSize: 36, fontWeight: 700, color: getScoreColor(metrics.avgHealthScore || 50) }}>{metrics.avgHealthScore || 50}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{getScoreLabel(metrics.avgHealthScore || 50)}</div>
              </div>
            </div>
            <p style={{ color: '#64748b', fontSize: 14, marginTop: 16 }}>Média de saúde das campanhas</p>
          </div>
        </div>

        <div style={{ background: '#0d1321', borderRadius: 12, padding: 24, border: '1px solid #1e293b' }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="alert" size={20} /> Ações Prioritárias
          </h3>
          {recommendations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>
              <Icon name="check" size={48} />
              <p>Todas as campanhas estão saudáveis!</p>
            </div>
          ) : (
            <div style={{ maxHeight: 250, overflow: 'auto' }}>
              {recommendations.slice(0, 5).map((rec, i) => (
                <RecommendationCard key={i} rec={rec} onAction={onAction} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Campaigns List */}
      <div style={{ background: '#0d1321', borderRadius: 12, padding: 24, border: '1px solid #1e293b' }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Suas Campanhas</h3>
        {campaigns.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>
            <Icon name="target" size={48} />
            <p>Nenhuma campanha encontrada</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {campaigns.slice(0, 6).map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} onAction={onAction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// CAMPAIGNS PAGE
// =============================================================================
function CampaignsPage({ campaigns, loading, onAction }) {
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Campanhas</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Gerencie todas as suas campanhas</p>

      {campaigns.length === 0 ? (
        <EmptyState icon="target" message="Nenhuma campanha encontrada" />
      ) : (
        <div style={{ background: '#0d1321', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #1e293b' }}>
                  <th style={{ padding: 16, textAlign: 'left', color: '#64748b', fontWeight: 500 }}>Campanha</th>
                  <th style={{ padding: 16, textAlign: 'center', color: '#64748b', fontWeight: 500 }}>Status</th>
                  <th style={{ padding: 16, textAlign: 'center', color: '#64748b', fontWeight: 500 }}>Score</th>
                  <th style={{ padding: 16, textAlign: 'right', color: '#64748b', fontWeight: 500 }}>Gasto</th>
                  <th style={{ padding: 16, textAlign: 'right', color: '#64748b', fontWeight: 500 }}>Conv.</th>
                  <th style={{ padding: 16, textAlign: 'right', color: '#64748b', fontWeight: 500 }}>CPA</th>
                  <th style={{ padding: 16, textAlign: 'right', color: '#64748b', fontWeight: 500 }}>ROAS</th>
                  <th style={{ padding: 16, textAlign: 'center', color: '#64748b', fontWeight: 500 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => {
                  const active = c.effectiveStatus === 'ACTIVE';
                  const ins = c.insights || {};
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: 16, maxWidth: 250 }}>
                        <div style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{c.objective}</div>
                      </td>
                      <td style={{ padding: 16, textAlign: 'center' }}>
                        <span style={{ padding: '4px 8px', borderRadius: 4, fontSize: 12, background: active ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.2)', color: active ? '#10b981' : '#64748b' }}>
                          {active ? 'Ativa' : 'Pausada'}
                        </span>
                      </td>
                      <td style={{ padding: 16, textAlign: 'center' }}>
                        <span style={{ display: 'inline-block', width: 36, height: 36, lineHeight: '36px', borderRadius: '50%', fontWeight: 600, fontSize: 14, background: `${getScoreColor(c.healthScore)}30`, color: getScoreColor(c.healthScore) }}>
                          {c.healthScore || 0}
                        </span>
                      </td>
                      <td style={{ padding: 16, textAlign: 'right' }}>{fmt.money(ins.spend)}</td>
                      <td style={{ padding: 16, textAlign: 'right' }}>{ins.conversions || 0}</td>
                      <td style={{ padding: 16, textAlign: 'right', color: ins.cpa > 400 ? '#ef4444' : '#10b981' }}>{fmt.money(ins.cpa)}</td>
                      <td style={{ padding: 16, textAlign: 'right', color: ins.roas >= 3 ? '#10b981' : '#f59e0b' }}>{(ins.roas || 0).toFixed(2)}x</td>
                      <td style={{ padding: 16, textAlign: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                          {active ? (
                            <ActionButton icon="pause" color="#f59e0b" onClick={() => onAction('pause', c.id, 'campaign')} title="Pausar" />
                          ) : (
                            <ActionButton icon="play" color="#10b981" onClick={() => onAction('activate', c.id, 'campaign')} title="Ativar" />
                          )}
                          {c.healthScore >= 70 && (
                            <ActionButton icon="rocket" color="#3b82f6" onClick={() => onAction('scale', c.id, 'campaign', 25)} title="Escalar 25%" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// CREATIVES PAGE
// =============================================================================
function CreativesPage({ ads, loading }) {
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Criativos Campeões</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Seus melhores anúncios rankeados por performance</p>

      {ads.length === 0 ? (
        <EmptyState icon="image" message="Nenhum anúncio encontrado" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {ads.map((ad, i) => (
            <div key={ad.id} style={{ background: '#0d1321', borderRadius: 12, border: '1px solid #1e293b', overflow: 'hidden' }}>
              <div style={{ position: 'relative', height: 180, background: '#1e293b' }}>
                {ad.creative?.imageUrl ? (
                  <img src={ad.creative.imageUrl} alt={ad.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="image" size={48} />
                  </div>
                )}
                <div style={{ position: 'absolute', top: 12, left: 12, width: 32, height: 32, borderRadius: '50%', background: i === 0 ? '#eab308' : i === 1 ? '#94a3b8' : i === 2 ? '#cd7c00' : '#1e293b', color: i < 3 ? '#000' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {i + 1}
                </div>
                <div style={{ position: 'absolute', top: 12, right: 12, width: 40, height: 40, borderRadius: '50%', background: `${getScoreColor(ad.score)}30`, color: getScoreColor(ad.score), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  {ad.score}
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <h3 style={{ fontWeight: 500, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ad.name}</h3>
                {ad.creative?.body && <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{ad.creative.body}</p>}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <MiniMetric label="CPA" value={fmt.money(ad.metrics?.cpa)} good={ad.metrics?.cpa <= 400} />
                  <MiniMetric label="ROAS" value={`${(ad.metrics?.roas || 0).toFixed(2)}x`} good={ad.metrics?.roas >= 3} />
                  <MiniMetric label="CTR" value={fmt.pct(ad.metrics?.ctr)} />
                  <MiniMetric label="Conv." value={ad.metrics?.conversions || 0} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// AUDIENCE PAGE
// =============================================================================
function AudiencePage({ breakdown, loading }) {
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Análise de Público</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Entenda quem está convertendo</p>

      {!breakdown ? (
        <EmptyState icon="users" message="Dados não disponíveis" />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
          {/* Gender */}
          <Card title="Por Gênero">
            {breakdown.ageGender?.byGender?.length > 0 ? (
              breakdown.ageGender.byGender.map(item => (
                <div key={item.gender} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.label}</div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>{item.conversions} conversões</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 500, color: item.cpa > 400 ? '#ef4444' : '#10b981' }}>CPA {fmt.money(item.cpa)}</div>
                    <div style={{ fontSize: 13, color: '#64748b' }}>Gasto {fmt.money(item.spend)}</div>
                  </div>
                </div>
              ))
            ) : <p style={{ color: '#64748b', padding: 20, textAlign: 'center' }}>Sem dados</p>}
          </Card>

          {/* Age */}
          <Card title="Por Idade">
            {breakdown.ageGender?.byAge?.length > 0 ? (
              breakdown.ageGender.byAge.map(item => (
                <div key={item.age} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e293b' }}>
                  <span>{item.age}</span>
                  <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{ color: '#64748b' }}>{item.conversions} conv.</span>
                    <span style={{ fontWeight: 500, color: item.cpa > 400 ? '#ef4444' : '#10b981' }}>{fmt.money(item.cpa)}</span>
                  </div>
                </div>
              ))
            ) : <p style={{ color: '#64748b', padding: 20, textAlign: 'center' }}>Sem dados</p>}
          </Card>

          {/* Device */}
          <Card title="Por Dispositivo">
            {breakdown.devices?.length > 0 ? (
              breakdown.devices.map(item => (
                <div key={item.device} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #1e293b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Icon name={item.device?.includes('mobile') ? 'smartphone' : 'monitor'} size={20} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{item.deviceLabel}</div>
                      <div style={{ fontSize: 13, color: '#64748b' }}>{item.conversions} conversões</div>
                    </div>
                  </div>
                  <span style={{ fontWeight: 500, color: item.cpa > 400 ? '#ef4444' : '#10b981' }}>{fmt.money(item.cpa)}</span>
                </div>
              ))
            ) : <p style={{ color: '#64748b', padding: 20, textAlign: 'center' }}>Sem dados</p>}
          </Card>

          {/* Placement */}
          <Card title="Por Posicionamento">
            {breakdown.placements?.length > 0 ? (
              <div style={{ maxHeight: 250, overflow: 'auto' }}>
                {breakdown.placements.slice(0, 10).map((item, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e293b' }}>
                    <span style={{ fontSize: 14 }}>{item.label}</span>
                    <div style={{ display: 'flex', gap: 12 }}>
                      <span style={{ color: '#64748b', fontSize: 14 }}>{item.conversions}</span>
                      <span style={{ fontWeight: 500, fontSize: 14, color: item.cpa > 400 ? '#ef4444' : '#10b981' }}>{fmt.money(item.cpa)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : <p style={{ color: '#64748b', padding: 20, textAlign: 'center' }}>Sem dados</p>}
          </Card>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// RECOMMENDATIONS PAGE
// =============================================================================
function RecommendationsPage({ recommendations, loading, onAction }) {
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>IA Recomenda</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Recomendações inteligentes para otimizar suas campanhas</p>

      {recommendations.length === 0 ? (
        <div style={{ background: '#0d1321', borderRadius: 12, padding: 48, textAlign: 'center', border: '1px solid #1e293b' }}>
          <Icon name="check" size={64} />
          <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Tudo certo!</h3>
          <p style={{ color: '#64748b' }}>Suas campanhas estão performando bem</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {recommendations.map((rec, i) => (
            <div key={i} style={{ background: '#0d1321', borderRadius: 12, padding: 24, border: `1px solid ${rec.type === 'critical' ? '#ef444480' : rec.type === 'warning' ? '#f59e0b80' : '#10b98180'}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Icon name={rec.type === 'opportunity' ? 'rocket' : 'alert'} size={20} style={{ color: rec.type === 'critical' ? '#ef4444' : rec.type === 'warning' ? '#f59e0b' : '#10b981' }} />
                    <h3 style={{ fontSize: 18, fontWeight: 600 }}>{rec.title}</h3>
                  </div>
                  <p style={{ color: '#94a3b8' }}>{rec.description}</p>
                  {rec.impact && <p style={{ color: '#10b981', fontSize: 14, marginTop: 8 }}>💡 {rec.impact}</p>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>Confiança: {rec.confidence}%</div>
                  {rec.actionLabel && (
                    <button
                      onClick={() => {
                        const id = rec.id?.split('-').pop();
                        if (rec.action === 'pause') onAction('pause', id, 'campaign');
                        else if (rec.action === 'scale') onAction('scale', id, 'campaign', 25);
                      }}
                      style={{ padding: '8px 16px', border: 'none', borderRadius: 8, fontWeight: 500, background: rec.type === 'critical' ? '#ef4444' : rec.type === 'warning' ? '#f59e0b' : '#10b981', color: '#fff' }}
                    >
                      {rec.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// =============================================================================
// FUNNEL PAGE
// =============================================================================
function FunnelPage({ funnel }) {
  const stages = [
    { key: 'topo', label: 'TOPO', color: '#3b82f6', ideal: 20, desc: 'Alcance e awareness' },
    { key: 'meio', label: 'MEIO', color: '#eab308', ideal: 30, desc: 'Tráfego e engajamento' },
    { key: 'fundo', label: 'FUNDO', color: '#10b981', ideal: 50, desc: 'Conversão e vendas' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Estratégia de Funil</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Distribuição ideal de investimento</p>

      {!funnel ? (
        <EmptyState icon="funnel" message="Dados não disponíveis" />
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
            {stages.map(stage => {
              const data = funnel[stage.key] || {};
              const pct = data.percentage || 0;
              return (
                <div key={stage.key} style={{ background: stage.color, borderRadius: 12, overflow: 'hidden' }}>
                  <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <h3 style={{ fontSize: 20, fontWeight: 700 }}>{stage.label} - {stage.ideal}%</h3>
                      <span style={{ opacity: 0.8 }}>Atual: {pct.toFixed(0)}%</span>
                    </div>
                    <p style={{ opacity: 0.8 }}>{stage.desc}</p>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', fontSize: 14 }}>
                    <span style={{ opacity: 0.7 }}>{data.campaigns?.length || 0} campanhas</span>
                    <span>{fmt.money(data.spend || 0)} investido</span>
                  </div>
                </div>
              );
            })}
          </div>

          <Card title="💡 Distribuição Recomendada">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.2)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#3b82f6' }}>20%</div>
                <div style={{ color: '#64748b' }}>TOPO</div>
              </div>
              <div style={{ background: 'rgba(234, 179, 8, 0.2)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#eab308' }}>30%</div>
                <div style={{ color: '#64748b' }}>MEIO</div>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.2)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: '#10b981' }}>50%</div>
                <div style={{ color: '#64748b' }}>FUNDO</div>
              </div>
            </div>
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: 14 }}>Esta distribuição é recomendada para maximizar conversões com tráfego qualificado</p>
          </Card>
        </>
      )}
    </div>
  );
}

// =============================================================================
// SETTINGS PAGE
// =============================================================================
function SettingsPage({ connected, token, setToken, onConnect, onDisconnect, loading, user }) {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Configurações</h1>
      <p style={{ color: '#64748b', marginBottom: 24 }}>Configure sua conta e conexões</p>

      <div style={{ display: 'grid', gap: 24, maxWidth: 600 }}>
        {/* Meta Connection */}
        <Card title="Conexão Meta Business">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ width: 12, height: 12, borderRadius: '50%', background: connected ? '#10b981' : '#ef4444' }} />
            <span style={{ color: connected ? '#10b981' : '#ef4444' }}>{connected ? 'Conectado' : 'Desconectado'}</span>
          </div>

          {!connected ? (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 14, color: '#94a3b8', marginBottom: 8 }}>Token de Acesso</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Cole seu token do Meta aqui"
                  style={{ width: '100%', padding: 12, borderRadius: 8 }}
                />
                <p style={{ fontSize: 12, color: '#64748b', marginTop: 8 }}>Obtenha em: developers.facebook.com → Graph API Explorer</p>
              </div>
              <button onClick={onConnect} disabled={loading || !token.trim()} style={{ width: '100%', padding: 14, border: 'none', borderRadius: 8, background: '#10b981', color: '#fff', fontWeight: 600 }}>
                {loading ? 'Conectando...' : 'Conectar Meta Business'}
              </button>
            </>
          ) : (
            <button onClick={onDisconnect} style={{ padding: '10px 20px', border: 'none', borderRadius: 8, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
              Desconectar
            </button>
          )}
        </Card>

        {/* Account Info */}
        <Card title="Sua Conta">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Nome</span>
              <span>{user?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Email</span>
              <span>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Plano</span>
              <span style={{ color: '#10b981', fontWeight: 500 }}>Pro</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// =============================================================================
// COMPONENTS
// =============================================================================
function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <Icon name="refresh" size={32} />
    </div>
  );
}

function EmptyState({ icon, message }) {
  return (
    <div style={{ background: '#0d1321', borderRadius: 12, padding: 48, textAlign: 'center', border: '1px solid #1e293b' }}>
      <Icon name={icon} size={64} />
      <p style={{ color: '#64748b' }}>{message}</p>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={{ background: '#0d1321', borderRadius: 12, padding: 24, border: '1px solid #1e293b' }}>
      {title && <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{title}</h3>}
      {children}
    </div>
  );
}

function MetricCard({ icon, label, value, color }) {
  return (
    <div style={{ background: '#0d1321', borderRadius: 12, padding: 20, border: '1px solid #1e293b' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name={icon} size={20} style={{ color }} />
        </div>
        <span style={{ fontSize: 12, color: '#64748b', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 700 }}>{value}</div>
    </div>
  );
}

function MiniMetric({ label, value, good }) {
  return (
    <div style={{ background: '#1e293b', borderRadius: 8, padding: 10 }}>
      <div style={{ fontSize: 11, color: '#64748b' }}>{label}</div>
      <div style={{ fontWeight: 600, color: good === undefined ? '#fff' : good ? '#10b981' : '#ef4444' }}>{value}</div>
    </div>
  );
}

function CampaignCard({ campaign, onAction }) {
  const active = campaign.effectiveStatus === 'ACTIVE';
  const ins = campaign.insights || {};

  return (
    <div style={{ background: '#1e293b', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h4 style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{campaign.name}</h4>
          <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 4, background: active ? 'rgba(16,185,129,0.2)' : 'rgba(100,116,139,0.2)', color: active ? '#10b981' : '#64748b' }}>
            {active ? 'Ativa' : 'Pausada'}
          </span>
        </div>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${getScoreColor(campaign.healthScore)}30`, color: getScoreColor(campaign.healthScore), display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
          {campaign.healthScore || 0}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 14, marginBottom: 12 }}>
        <div><span style={{ color: '#64748b' }}>Gasto:</span> {fmt.money(ins.spend)}</div>
        <div><span style={{ color: '#64748b' }}>Conv:</span> {ins.conversions || 0}</div>
        <div><span style={{ color: '#64748b' }}>CPA:</span> <span style={{ color: ins.cpa > 400 ? '#ef4444' : '#10b981' }}>{fmt.money(ins.cpa)}</span></div>
        <div><span style={{ color: '#64748b' }}>ROAS:</span> <span style={{ color: ins.roas >= 3 ? '#10b981' : '#f59e0b' }}>{(ins.roas || 0).toFixed(2)}x</span></div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {active ? (
          <button onClick={() => onAction('pause', campaign.id, 'campaign')} style={{ flex: 1, padding: 8, border: 'none', borderRadius: 8, background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Icon name="pause" size={16} /> Pausar
          </button>
        ) : (
          <button onClick={() => onAction('activate', campaign.id, 'campaign')} style={{ flex: 1, padding: 8, border: 'none', borderRadius: 8, background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Icon name="play" size={16} /> Ativar
          </button>
        )}
      </div>
    </div>
  );
}

function RecommendationCard({ rec, onAction }) {
  const colors = { critical: '#ef4444', warning: '#f59e0b', opportunity: '#10b981' };
  return (
    <div style={{ padding: 12, marginBottom: 8, borderRadius: 8, background: `${colors[rec.type]}15`, border: `1px solid ${colors[rec.type]}40` }}>
      <div style={{ fontWeight: 500, marginBottom: 4 }}>{rec.title}</div>
      <div style={{ fontSize: 13, color: '#94a3b8' }}>{rec.description}</div>
    </div>
  );
}

function ActionButton({ icon, color, onClick, title }) {
  return (
    <button onClick={onClick} title={title} style={{ width: 32, height: 32, border: 'none', borderRadius: 8, background: `${color}20`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon name={icon} size={16} />
    </button>
  );
}
