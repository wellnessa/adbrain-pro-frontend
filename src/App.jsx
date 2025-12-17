import React, { useState, useEffect, useMemo } from 'react';

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
const Icon = ({ name, size = 20, className = '', style = {} }) => {
  const icons = {
    brain: <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Zm5 0A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/>,
    layoutDashboard: <><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></>,
    target: <><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></>,
    image: <><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    logOut: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>,
    refreshCw: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    x: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    alertTriangle: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/></>,
    play: <polygon points="5 3 19 12 5 21 5 3"/>,
    pause: <><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></>,
    chevronDown: <polyline points="6 9 12 15 18 9"/>,
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
    dollarSign: <><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    trendingUp: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
    barChart3: <><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></>,
    activity: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></>,
    flame: <><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></>,
    alertCircle: <><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></>,
    checkCircle: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></>,
    eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
    externalLink: <><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
    moreVertical: <><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></>,
    arrowUp: <><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></>,
    arrowDown: <><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></>,
    sparkles: <><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></>,
    lightbulb: <><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></>,
    sliders: <><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></>,
    link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>{icons[name] || icons.alertCircle}</svg>;
};

// =============================================================================
// FORMATTERS
// =============================================================================
const fmt = {
  money: (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0),
  moneyCompact: (v) => {
    if (v >= 1000000) return `R$ ${(v/1000000).toFixed(1)}M`;
    if (v >= 1000) return `R$ ${(v/1000).toFixed(1)}K`;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0);
  },
  num: (v) => new Intl.NumberFormat('pt-BR').format(Math.round(v || 0)),
  pct: (v) => `${(v || 0).toFixed(2)}%`,
};

// =============================================================================
// AI ENGINE
// =============================================================================
const AIEngine = {
  config: { metaCPA: 400, metaROAS: 3, ctrMinimo: 1, frequenciaMaxima: 3 },

  calcScore: (campaign) => {
    const ins = campaign.insights || {};
    const cfg = AIEngine.config;
    let scores = { cpa: 50, ctr: 50, freq: 100, roas: 50 };
    
    if (ins.conversions > 0 && ins.cpa > 0) {
      const r = ins.cpa / cfg.metaCPA;
      scores.cpa = r <= 0.5 ? 100 : r <= 0.7 ? 90 : r <= 1.0 ? 70 : r <= 1.5 ? 40 : r <= 2.0 ? 20 : 5;
    } else if (ins.spend > 100 && ins.conversions === 0) {
      scores.cpa = 0;
    }
    if (ins.ctr > 0) {
      const r = ins.ctr / cfg.ctrMinimo;
      scores.ctr = r >= 2.0 ? 100 : r >= 1.5 ? 85 : r >= 1.0 ? 70 : r >= 0.5 ? 40 : 20;
    }
    if (ins.frequency > 0) {
      scores.freq = ins.frequency <= cfg.frequenciaMaxima ? 100 : ins.frequency <= cfg.frequenciaMaxima * 1.5 ? 60 : 30;
    }
    if (ins.roas > 0) {
      const r = ins.roas / cfg.metaROAS;
      scores.roas = r >= 1.5 ? 100 : r >= 1.0 ? 80 : r >= 0.5 ? 50 : 20;
    } else if (ins.spend > 50) {
      scores.roas = 10;
    }
    const total = Math.round(scores.cpa * 0.40 + scores.ctr * 0.25 + scores.freq * 0.15 + scores.roas * 0.20);
    return { total: Math.max(0, Math.min(100, total)), breakdown: scores };
  },

  getStatus: (score) => {
    if (score >= 80) return { label: 'Excelente', color: '#10b981', bg: 'rgba(16,185,129,0.12)' };
    if (score >= 65) return { label: 'Boa', color: '#22c55e', bg: 'rgba(34,197,94,0.12)' };
    if (score >= 45) return { label: 'Atenção', color: '#eab308', bg: 'rgba(234,179,8,0.12)' };
    if (score >= 25) return { label: 'Alerta', color: '#f97316', bg: 'rgba(249,115,22,0.12)' };
    return { label: 'Crítico', color: '#ef4444', bg: 'rgba(239,68,68,0.12)' };
  },

  analyze: (campaign) => {
    const ins = campaign.insights || {};
    const cfg = AIEngine.config;
    const issues = [], opportunities = [];
    
    if (ins.spend > 150 && ins.conversions === 0) {
      issues.push({ severity: 'critical', icon: 'flame', title: 'Gasto sem conversões', desc: `${fmt.money(ins.spend)} investidos sem resultado.` });
    }
    if (ins.cpa > cfg.metaCPA * 2) {
      issues.push({ severity: 'critical', icon: 'alertTriangle', title: 'CPA muito alto', desc: `CPA de ${fmt.money(ins.cpa)} está ${Math.round((ins.cpa / cfg.metaCPA - 1) * 100)}% acima da meta.` });
    }
    if (ins.frequency > cfg.frequenciaMaxima * 1.5) {
      issues.push({ severity: 'warning', icon: 'eye', title: 'Público saturado', desc: `Frequência de ${ins.frequency?.toFixed(1)}x indica saturação.` });
    }
    if (ins.ctr < cfg.ctrMinimo * 0.5 && ins.impressions > 1000) {
      issues.push({ severity: 'warning', icon: 'image', title: 'CTR baixo', desc: `CTR de ${ins.ctr?.toFixed(2)}% - criativos precisam melhorar.` });
    }
    if (ins.cpa > 0 && ins.cpa < cfg.metaCPA * 0.6 && ins.conversions >= 2) {
      opportunities.push({ icon: 'rocket', title: 'Pronta para escalar', desc: `CPA ${Math.round((1 - ins.cpa / cfg.metaCPA) * 100)}% abaixo da meta.` });
    }
    if (ins.roas >= cfg.metaROAS * 1.5 && ins.spend > 50) {
      opportunities.push({ icon: 'trendingUp', title: 'ROAS excelente', desc: `ROAS de ${ins.roas?.toFixed(2)}x merece mais investimento.` });
    }
    return { issues, opportunities };
  },

  getSummary: (campaigns) => {
    const critical = campaigns.filter(c => c.score?.total < 30);
    const scalable = campaigns.filter(c => c.score?.total >= 75 && c.insights?.conversions > 0);
    const wastedSpend = critical.reduce((s, c) => s + (c.insights?.spend || 0), 0);
    return { critical: critical.length, scalable: scalable.length, wastedSpend };
  }
};

// =============================================================================
// STYLES
// =============================================================================
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg-base: #09090b; --bg-subtle: #0f0f12; --bg-muted: #18181b; --bg-elevated: #1f1f23; --bg-hover: #27272a;
  --border-subtle: #27272a; --border-muted: #3f3f46;
  --text-primary: #fafafa; --text-secondary: #a1a1aa; --text-muted: #71717a; --text-faint: #52525b;
  --accent-primary: #10b981; --accent-primary-hover: #059669; --accent-primary-muted: rgba(16,185,129,0.12);
  --accent-danger: #ef4444; --accent-danger-muted: rgba(239,68,68,0.12);
  --accent-warning: #f59e0b; --accent-warning-muted: rgba(245,158,11,0.12);
  --accent-info: #3b82f6; --accent-info-muted: rgba(59,130,246,0.12);
  --font-sans: 'Outfit', -apple-system, sans-serif; --font-mono: 'JetBrains Mono', monospace;
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 14px; --radius-xl: 20px;
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--font-sans); background: var(--bg-base); color: var(--text-primary); line-height: 1.5; -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--border-muted); border-radius: 3px; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-fade { animation: fadeIn 0.3s ease forwards; }
.animate-spin { animation: spin 1s linear infinite; }

.app-layout { display: flex; min-height: 100vh; }
.sidebar { width: 250px; background: var(--bg-subtle); border-right: 1px solid var(--border-subtle); position: fixed; top: 0; left: 0; height: 100vh; display: flex; flex-direction: column; z-index: 100; }
.sidebar-header { padding: 22px 18px; border-bottom: 1px solid var(--border-subtle); }
.sidebar-logo { display: flex; align-items: center; gap: 12px; }
.logo-mark { width: 40px; height: 40px; background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-hover) 100%); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px rgba(16,185,129,0.25); }
.logo-mark svg { stroke: white; }
.logo-title { font-size: 18px; font-weight: 700; }
.logo-subtitle { font-size: 10px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: var(--accent-primary); }
.sidebar-nav { flex: 1; padding: 18px 10px; overflow-y: auto; }
.nav-group { margin-bottom: 22px; }
.nav-group-label { font-size: 10px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--text-faint); padding: 0 12px; margin-bottom: 8px; }
.nav-item { display: flex; align-items: center; gap: 11px; padding: 10px 14px; border-radius: var(--radius-md); font-size: 14px; font-weight: 500; color: var(--text-secondary); cursor: pointer; transition: all 0.15s ease; margin-bottom: 2px; position: relative; }
.nav-item:hover { background: var(--bg-hover); color: var(--text-primary); }
.nav-item.active { background: var(--accent-primary-muted); color: var(--accent-primary); }
.nav-item.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 18px; background: var(--accent-primary); border-radius: 0 2px 2px 0; }
.nav-badge { margin-left: auto; min-width: 18px; height: 18px; padding: 0 5px; background: var(--accent-danger); color: white; font-size: 10px; font-weight: 700; border-radius: 9px; display: flex; align-items: center; justify-content: center; }

.main-content { flex: 1; margin-left: 250px; min-height: 100vh; display: flex; flex-direction: column; }
.header { height: 68px; background: var(--bg-subtle); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; padding: 0 28px; position: sticky; top: 0; z-index: 50; }
.header-left { display: flex; align-items: center; gap: 20px; }
.header-title { font-size: 19px; font-weight: 700; }
.header-subtitle { font-size: 12px; color: var(--text-muted); margin-top: 1px; }
.header-right { display: flex; align-items: center; gap: 10px; }

.select-wrap { position: relative; }
.select { appearance: none; background: var(--bg-muted); border: 1px solid var(--border-subtle); color: var(--text-primary); padding: 8px 34px 8px 12px; border-radius: var(--radius-md); font-size: 13px; font-weight: 500; font-family: var(--font-sans); cursor: pointer; min-width: 140px; }
.select:focus { outline: none; border-color: var(--accent-primary); }
.select-icon { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-muted); }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; padding: 8px 14px; border-radius: var(--radius-md); font-size: 13px; font-weight: 600; font-family: var(--font-sans); cursor: pointer; transition: all 0.15s ease; border: none; }
.btn-primary { background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-hover) 100%); color: white; }
.btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(16,185,129,0.3); }
.btn-secondary { background: var(--bg-muted); color: var(--text-primary); border: 1px solid var(--border-subtle); }
.btn-secondary:hover { background: var(--bg-hover); }
.btn-danger { background: var(--accent-danger); color: white; }
.btn-sm { padding: 6px 10px; font-size: 12px; }
.btn-icon { width: 34px; height: 34px; padding: 0; border-radius: var(--radius-md); background: var(--bg-muted); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; }
.btn-icon:hover { background: var(--bg-hover); color: var(--text-primary); }
.btn-icon.scale { color: var(--accent-primary); border-color: var(--accent-primary-muted); }
.btn-icon.scale:hover { background: var(--accent-primary-muted); }
.btn-icon.warning { color: var(--accent-warning); border-color: var(--accent-warning-muted); }
.btn-icon.warning:hover { background: var(--accent-warning-muted); }

.page-content { flex: 1; padding: 24px 28px; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
.stat-card { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 18px; }
.stat-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; }
.stat-icon { width: 38px; height: 38px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
.stat-icon.green { background: var(--accent-primary-muted); color: var(--accent-primary); }
.stat-icon.red { background: var(--accent-danger-muted); color: var(--accent-danger); }
.stat-icon.yellow { background: var(--accent-warning-muted); color: var(--accent-warning); }
.stat-icon.blue { background: var(--accent-info-muted); color: var(--accent-info); }
.stat-value { font-size: 24px; font-weight: 700; font-family: var(--font-mono); margin-bottom: 2px; }
.stat-label { font-size: 12px; color: var(--text-muted); }

.ai-summary { background: linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(59,130,246,0.06) 100%); border: 1px solid rgba(16,185,129,0.15); border-radius: var(--radius-lg); padding: 20px 22px; margin-bottom: 22px; display: flex; gap: 18px; }
.ai-icon { width: 44px; height: 44px; background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-primary-hover) 100%); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ai-icon svg { stroke: white; }
.ai-content { flex: 1; }
.ai-header { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.ai-title { font-size: 14px; font-weight: 600; }
.ai-badge { background: var(--accent-primary); color: white; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 4px; }
.ai-text { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
.ai-text strong { color: var(--text-primary); }
.ai-text .danger { color: var(--accent-danger); font-weight: 600; }
.ai-text .success { color: var(--accent-primary); font-weight: 600; }
.ai-actions { display: flex; gap: 8px; margin-top: 14px; }

.filter-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 18px; flex-wrap: wrap; }
.filter-chip { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; background: var(--bg-muted); border: 1px solid var(--border-subtle); border-radius: 18px; font-size: 12px; font-weight: 500; color: var(--text-secondary); cursor: pointer; transition: all 0.15s ease; }
.filter-chip:hover { border-color: var(--border-muted); color: var(--text-primary); }
.filter-chip.active { background: var(--accent-primary-muted); border-color: var(--accent-primary); color: var(--accent-primary); }
.filter-chip .count { background: var(--bg-elevated); padding: 1px 6px; border-radius: 8px; font-size: 10px; font-weight: 600; }
.filter-chip.active .count { background: rgba(16,185,129,0.2); }
.search-box { position: relative; margin-left: auto; }
.search-input { background: var(--bg-muted); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 7px 12px 7px 34px; font-size: 13px; font-family: var(--font-sans); color: var(--text-primary); width: 200px; }
.search-input::placeholder { color: var(--text-muted); }
.search-input:focus { outline: none; border-color: var(--accent-primary); width: 260px; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }

.campaigns-list { display: flex; flex-direction: column; gap: 8px; }
.campaign-row { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); transition: all 0.15s ease; overflow: hidden; }
.campaign-row:hover { border-color: var(--border-muted); }
.campaign-row.expanded { border-color: var(--accent-primary); }
.campaign-main { display: grid; grid-template-columns: 56px 1fr 95px 95px 95px 110px; align-items: center; gap: 18px; padding: 14px 18px; cursor: pointer; }

.score-ring { width: 48px; height: 48px; position: relative; }
.score-ring svg { width: 48px; height: 48px; transform: rotate(-90deg); }
.score-ring-bg { fill: none; stroke: var(--bg-elevated); stroke-width: 5; }
.score-ring-progress { fill: none; stroke-width: 5; stroke-linecap: round; stroke-dasharray: 126; transition: stroke-dashoffset 0.5s ease; }
.score-ring-value { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 13px; font-weight: 700; font-family: var(--font-mono); }

.campaign-info { min-width: 0; }
.campaign-name { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 3px; }
.campaign-meta { display: flex; align-items: center; gap: 10px; }
.campaign-status { display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; border-radius: var(--radius-sm); font-size: 10px; font-weight: 600; text-transform: uppercase; }
.campaign-status.active { background: var(--accent-primary-muted); color: var(--accent-primary); }
.campaign-status.paused { background: var(--bg-elevated); color: var(--text-muted); }
.campaign-objective { font-size: 10px; color: var(--text-muted); }
.metric-cell { text-align: right; }
.metric-value { font-size: 14px; font-weight: 600; font-family: var(--font-mono); margin-bottom: 1px; }
.metric-value.good { color: var(--accent-primary); }
.metric-value.warning { color: var(--accent-warning); }
.metric-value.bad { color: var(--accent-danger); }
.metric-label { font-size: 9px; color: var(--text-muted); text-transform: uppercase; }
.campaign-actions { display: flex; gap: 5px; justify-content: flex-end; }

.campaign-expanded { border-top: 1px solid var(--border-subtle); background: var(--bg-muted); animation: fadeIn 0.2s ease; }
.expanded-tabs { display: flex; gap: 3px; padding: 10px 18px; border-bottom: 1px solid var(--border-subtle); background: var(--bg-subtle); }
.expanded-tab { padding: 7px 12px; border-radius: var(--radius-md); font-size: 12px; font-weight: 500; color: var(--text-secondary); cursor: pointer; border: none; background: transparent; font-family: var(--font-sans); }
.expanded-tab:hover { background: var(--bg-hover); color: var(--text-primary); }
.expanded-tab.active { background: var(--accent-primary-muted); color: var(--accent-primary); }
.expanded-content { padding: 20px; }

.score-breakdown { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
.breakdown-item { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 14px; text-align: center; }
.breakdown-value { font-size: 26px; font-weight: 700; font-family: var(--font-mono); margin-bottom: 2px; }
.breakdown-label { font-size: 10px; color: var(--text-muted); text-transform: uppercase; }

.issues-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
.issue-card { display: flex; gap: 12px; padding: 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); }
.issue-card.critical { background: var(--accent-danger-muted); border-color: rgba(239,68,68,0.2); }
.issue-card.warning { background: var(--accent-warning-muted); border-color: rgba(245,158,11,0.2); }
.issue-card.opportunity { background: var(--accent-primary-muted); border-color: rgba(16,185,129,0.2); }
.issue-icon { width: 36px; height: 36px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.issue-card.critical .issue-icon { background: rgba(239,68,68,0.2); color: var(--accent-danger); }
.issue-card.warning .issue-icon { background: rgba(245,158,11,0.2); color: var(--accent-warning); }
.issue-card.opportunity .issue-icon { background: rgba(16,185,129,0.2); color: var(--accent-primary); }
.issue-content { flex: 1; }
.issue-title { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
.issue-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.5; }

.budget-control { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 18px; margin-top: 16px; }
.budget-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.budget-title { font-size: 13px; font-weight: 600; }
.budget-current { font-size: 12px; color: var(--text-muted); }
.budget-current span { color: var(--text-primary); font-weight: 600; font-family: var(--font-mono); }
.budget-actions { display: flex; gap: 10px; }
.budget-btn { flex: 1; padding: 10px; border-radius: var(--radius-md); font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; border: 1px solid var(--border-subtle); background: var(--bg-muted); color: var(--text-primary); font-family: var(--font-sans); }
.budget-btn:hover { border-color: var(--border-muted); }
.budget-btn.increase { background: var(--accent-primary-muted); border-color: var(--accent-primary); color: var(--accent-primary); }
.budget-btn.increase:hover { background: var(--accent-primary); color: white; }
.budget-btn.decrease { background: var(--accent-danger-muted); border-color: var(--accent-danger); color: var(--accent-danger); }
.budget-btn.decrease:hover { background: var(--accent-danger); color: white; }

.settings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
.settings-card { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 22px; }
.settings-card-title { font-size: 14px; font-weight: 600; margin-bottom: 18px; display: flex; align-items: center; gap: 10px; }
.settings-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border-subtle); }
.settings-row:last-child { border-bottom: none; }
.settings-label { font-size: 13px; color: var(--text-secondary); }
.settings-value { font-size: 13px; font-weight: 500; }

.input { width: 100%; padding: 10px 12px; background: var(--bg-muted); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 13px; font-family: var(--font-sans); color: var(--text-primary); }
.input:focus { outline: none; border-color: var(--accent-primary); box-shadow: 0 0 0 3px var(--accent-primary-muted); }
.input::placeholder { color: var(--text-muted); }

.connection-badge { display: inline-flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: var(--radius-md); font-size: 12px; font-weight: 500; }
.connection-badge.connected { background: var(--accent-primary-muted); color: var(--accent-primary); }
.connection-badge.disconnected { background: var(--accent-danger-muted); color: var(--accent-danger); }
.connection-dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }

.toast { position: fixed; top: 20px; right: 20px; z-index: 1000; animation: fadeIn 0.25s ease; }
.toast-content { display: flex; align-items: center; gap: 10px; padding: 12px 18px; border-radius: var(--radius-md); font-size: 13px; font-weight: 500; box-shadow: 0 12px 40px rgba(0,0,0,0.4); }
.toast-content.success { background: var(--accent-primary); color: white; }
.toast-content.error { background: var(--accent-danger); color: white; }

.empty-state { text-align: center; padding: 50px 20px; }
.empty-icon { width: 56px; height: 56px; margin: 0 auto 16px; color: var(--text-faint); }
.empty-title { font-size: 16px; font-weight: 600; margin-bottom: 6px; }
.empty-text { font-size: 13px; color: var(--text-muted); }

.table-wrap { overflow-x: auto; border-radius: var(--radius-lg); border: 1px solid var(--border-subtle); }
.table { width: 100%; border-collapse: collapse; background: var(--bg-subtle); }
.table th { text-align: left; padding: 12px 16px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: var(--text-muted); border-bottom: 1px solid var(--border-subtle); background: var(--bg-muted); }
.table td { padding: 12px 16px; font-size: 13px; border-bottom: 1px solid var(--border-subtle); }
.table tr:last-child td { border-bottom: none; }
.table tr:hover td { background: var(--bg-hover); }

@media (max-width: 1400px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .campaign-main { grid-template-columns: 50px 1fr 85px 85px 100px; } }
@media (max-width: 1200px) { .settings-grid { grid-template-columns: 1fr; } .score-breakdown { grid-template-columns: repeat(2, 1fr); } }
`;

// =============================================================================
// COMPONENTS
// =============================================================================
function ScoreRing({ score, size = 48 }) {
  const status = AIEngine.getStatus(score);
  const circumference = 2 * Math.PI * 20;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" style={{ width: size, height: size }}>
        <circle cx="24" cy="24" r="20" className="score-ring-bg" />
        <circle cx="24" cy="24" r="20" className="score-ring-progress" style={{ stroke: status.color, strokeDasharray: circumference, strokeDashoffset: offset }} />
      </svg>
      <span className="score-ring-value" style={{ color: status.color }}>{score}</span>
    </div>
  );
}

function CampaignRow({ campaign, expanded, onToggle, onAction, activeTab, setActiveTab }) {
  const ins = campaign.insights || {};
  const score = campaign.score?.total || 0;
  const isActive = campaign.effectiveStatus === 'ACTIVE';
  const getCpaClass = () => (!ins.cpa || ins.cpa === 0) ? '' : ins.cpa <= AIEngine.config.metaCPA * 0.7 ? 'good' : ins.cpa <= AIEngine.config.metaCPA * 1.2 ? 'warning' : 'bad';
  const getRoasClass = () => (!ins.roas || ins.roas === 0) ? '' : ins.roas >= AIEngine.config.metaROAS ? 'good' : ins.roas >= AIEngine.config.metaROAS * 0.7 ? 'warning' : 'bad';

  return (
    <div className={`campaign-row ${expanded ? 'expanded' : ''}`}>
      <div className="campaign-main" onClick={onToggle}>
        <ScoreRing score={score} />
        <div className="campaign-info">
          <div className="campaign-name">{campaign.name}</div>
          <div className="campaign-meta">
            <span className={`campaign-status ${isActive ? 'active' : 'paused'}`}>
              <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor' }}></span>
              {isActive ? 'Ativa' : 'Pausada'}
            </span>
            <span className="campaign-objective">{campaign.objective?.replace('OUTCOME_', '') || '-'}</span>
          </div>
        </div>
        <div className="metric-cell"><div className="metric-value">{fmt.moneyCompact(ins.spend || 0)}</div><div className="metric-label">Gasto</div></div>
        <div className="metric-cell"><div className={`metric-value ${getCpaClass()}`}>{ins.cpa ? fmt.money(ins.cpa) : '-'}</div><div className="metric-label">CPA</div></div>
        <div className="metric-cell"><div className={`metric-value ${getRoasClass()}`}>{ins.roas ? `${ins.roas.toFixed(2)}x` : '-'}</div><div className="metric-label">ROAS</div></div>
        <div className="campaign-actions" onClick={(e) => e.stopPropagation()}>
          {score >= 75 && ins.conversions > 0 && <button className="btn-icon scale" title="Escalar" onClick={() => onAction('scale', campaign.id)}><Icon name="rocket" size={16} /></button>}
          {isActive ? <button className="btn-icon warning" title="Pausar" onClick={() => onAction('pause', campaign.id)}><Icon name="pause" size={16} /></button> : <button className="btn-icon scale" title="Ativar" onClick={() => onAction('activate', campaign.id)}><Icon name="play" size={16} /></button>}
          <button className="btn-icon"><Icon name="moreVertical" size={16} /></button>
        </div>
      </div>
      {expanded && (
        <div className="campaign-expanded">
          <div className="expanded-tabs">
            <button className={`expanded-tab ${activeTab === 'insights' ? 'active' : ''}`} onClick={() => setActiveTab('insights')}>Insights</button>
            <button className={`expanded-tab ${activeTab === 'metrics' ? 'active' : ''}`} onClick={() => setActiveTab('metrics')}>Métricas</button>
            <button className={`expanded-tab ${activeTab === 'actions' ? 'active' : ''}`} onClick={() => setActiveTab('actions')}>Ações</button>
          </div>
          <div className="expanded-content">
            {activeTab === 'insights' && (
              <>
                <div className="score-breakdown">
                  <div className="breakdown-item"><div className="breakdown-value" style={{ color: AIEngine.getStatus(campaign.score?.breakdown?.cpa || 0).color }}>{campaign.score?.breakdown?.cpa || 0}</div><div className="breakdown-label">CPA Score</div></div>
                  <div className="breakdown-item"><div className="breakdown-value" style={{ color: AIEngine.getStatus(campaign.score?.breakdown?.ctr || 0).color }}>{campaign.score?.breakdown?.ctr || 0}</div><div className="breakdown-label">CTR Score</div></div>
                  <div className="breakdown-item"><div className="breakdown-value" style={{ color: AIEngine.getStatus(campaign.score?.breakdown?.freq || 0).color }}>{campaign.score?.breakdown?.freq || 0}</div><div className="breakdown-label">Frequência</div></div>
                  <div className="breakdown-item"><div className="breakdown-value" style={{ color: AIEngine.getStatus(campaign.score?.breakdown?.roas || 0).color }}>{campaign.score?.breakdown?.roas || 0}</div><div className="breakdown-label">ROAS Score</div></div>
                </div>
                <div className="issues-grid">
                  {campaign.analysis?.issues?.map((issue, i) => <div key={i} className={`issue-card ${issue.severity}`}><div className="issue-icon"><Icon name={issue.icon} size={18} /></div><div className="issue-content"><div className="issue-title">{issue.title}</div><div className="issue-desc">{issue.desc}</div></div></div>)}
                  {campaign.analysis?.opportunities?.map((opp, i) => <div key={`o${i}`} className="issue-card opportunity"><div className="issue-icon"><Icon name={opp.icon} size={18} /></div><div className="issue-content"><div className="issue-title">{opp.title}</div><div className="issue-desc">{opp.desc}</div></div></div>)}
                  {!campaign.analysis?.issues?.length && !campaign.analysis?.opportunities?.length && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Nenhum insight detectado.</div>}
                </div>
              </>
            )}
            {activeTab === 'metrics' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                <div className="breakdown-item"><div className="breakdown-value">{fmt.num(ins.impressions || 0)}</div><div className="breakdown-label">Impressões</div></div>
                <div className="breakdown-item"><div className="breakdown-value">{fmt.num(ins.clicks || 0)}</div><div className="breakdown-label">Cliques</div></div>
                <div className="breakdown-item"><div className="breakdown-value">{fmt.pct(ins.ctr || 0)}</div><div className="breakdown-label">CTR</div></div>
                <div className="breakdown-item"><div className="breakdown-value">{(ins.frequency || 0).toFixed(2)}</div><div className="breakdown-label">Frequência</div></div>
                <div className="breakdown-item"><div className="breakdown-value">{fmt.num(ins.reach || 0)}</div><div className="breakdown-label">Alcance</div></div>
                <div className="breakdown-item"><div className="breakdown-value">{ins.conversions || 0}</div><div className="breakdown-label">Conversões</div></div>
                <div className="breakdown-item"><div className="breakdown-value">{fmt.money(ins.cpm || 0)}</div><div className="breakdown-label">CPM</div></div>
                <div className="breakdown-item"><div className="breakdown-value">{fmt.money(ins.spend || 0)}</div><div className="breakdown-label">Gasto Total</div></div>
              </div>
            )}
            {activeTab === 'actions' && (
              <>
                <div className="budget-control">
                  <div className="budget-header"><span className="budget-title">Controle de Orçamento</span><span className="budget-current">Atual: <span>{fmt.money(campaign.daily_budget / 100 || 0)}</span>/dia</span></div>
                  <div className="budget-actions">
                    <button className="budget-btn increase" onClick={() => onAction('scale', campaign.id)}><Icon name="arrowUp" size={16} />Aumentar 30%</button>
                    <button className="budget-btn decrease" onClick={() => onAction('reduce', campaign.id)}><Icon name="arrowDown" size={16} />Reduzir 20%</button>
                  </div>
                </div>
                <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
                  {isActive ? <button className="btn btn-danger" onClick={() => onAction('pause', campaign.id)}><Icon name="pause" size={16} />Pausar</button> : <button className="btn btn-primary" onClick={() => onAction('activate', campaign.id)}><Icon name="play" size={16} />Ativar</button>}
                  <button className="btn btn-secondary"><Icon name="externalLink" size={16} />Ver no Facebook</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN APP
// =============================================================================
export default function App() {
  const [page, setPage] = useState('login');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [connected, setConnected] = useState(false);
  const [token, setToken] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [dateRange, setDateRange] = useState('last_30d');
  const [campaigns, setCampaigns] = useState([]);
  const [breakdown, setBreakdown] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState('insights');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);

  const dateOptions = [
    { value: 'today', label: 'Hoje' }, { value: 'yesterday', label: 'Ontem' }, { value: 'last_7d', label: 'Últimos 7 dias' },
    { value: 'last_14d', label: 'Últimos 14 dias' }, { value: 'last_30d', label: 'Últimos 30 dias' },
    { value: 'this_month', label: 'Este mês' }, { value: 'last_month', label: 'Mês passado' },
  ];

  useEffect(() => {
    const savedUser = localStorage.getItem('adbrain_user');
    const savedToken = localStorage.getItem('adbrain_meta_token');
    const savedAccount = localStorage.getItem('adbrain_account');
    if (savedUser) { 
      setUser(JSON.parse(savedUser)); 
      setPage('campaigns'); 
      if (savedToken) { 
        setToken(savedToken); 
        setConnected(true); 
        // Carregar contas quando já está logado
        api.get('/api/meta/ad-accounts').then(res => {
          console.log('Ad accounts response:', res);
          if (res.success && res.accounts?.length > 0) {
            setAccounts(res.accounts);
            if (savedAccount && res.accounts.some(a => a.id === savedAccount)) {
              setSelectedAccount(savedAccount);
            } else {
              const firstAccount = res.accounts[0].id;
              setSelectedAccount(firstAccount);
              localStorage.setItem('adbrain_account', firstAccount);
            }
          } else if (res.error) {
            console.error('Erro ao carregar contas:', res.error);
          }
        }).catch(err => {
          console.error('Erro na requisição de contas:', err);
        });
      }
    }
  }, []);

  useEffect(() => { if (connected && selectedAccount) loadData(); }, [connected, selectedAccount, dateRange]);
  useEffect(() => { if (error || success) { const t = setTimeout(() => { setError(''); setSuccess(''); }, 4000); return () => clearTimeout(t); } }, [error, success]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [campRes, breakRes] = await Promise.all([api.get(`/api/meta/campaigns/${selectedAccount}?date_preset=${dateRange}`), api.get(`/api/meta/breakdown/${selectedAccount}?date_preset=${dateRange}`)]);
      if (campRes.success) setCampaigns((campRes.campaigns || []).map(c => ({ ...c, score: AIEngine.calcScore(c), analysis: AIEngine.analyze(c) })));
      if (breakRes.success) setBreakdown(breakRes.breakdown);
    } catch (e) { setError('Erro ao carregar dados'); }
    setLoading(false);
  };

  const loadAccounts = async () => { const res = await api.get('/api/meta/ad-accounts'); if (res.success && res.accounts?.length > 0) { setAccounts(res.accounts); const first = res.accounts[0].id; setSelectedAccount(first); localStorage.setItem('adbrain_account', first); } };

  const loadAds = async () => {
    if (!selectedAccount) return;
    setLoadingAds(true);
    try {
      const res = await api.get(`/api/meta/ads/${selectedAccount}?date_preset=${dateRange}`);
      if (res.success) {
        const adsWithAnalysis = (res.ads || []).map(ad => ({
          ...ad,
          score: AIEngine.calcScore({ insights: ad.insights }),
          fatigueLevel: ad.insights?.frequency > 4 ? 'critical' : ad.insights?.frequency > 2.5 ? 'warning' : 'healthy'
        }));
        setAds(adsWithAnalysis.sort((a, b) => (b.score?.total || 0) - (a.score?.total || 0)));
      }
    } catch (e) { console.error('Erro ao carregar ads:', e); }
    setLoadingAds(false);
  };

  // Carregar ads quando mudar para página de criativos
  useEffect(() => { if (page === 'creatives' && connected && selectedAccount) loadAds(); }, [page, selectedAccount, dateRange]);

  const handleLogin = async (e) => { e.preventDefault(); setLoading(true); const res = await api.post('/api/auth/login', { email: authEmail, password: authPassword }); setLoading(false); if (res.success) { localStorage.setItem('adbrain_user', JSON.stringify(res.user)); setUser(res.user); setPage('campaigns'); } else setError(res.error || 'Erro ao fazer login'); };
  const handleRegister = async (e) => { e.preventDefault(); setLoading(true); const res = await api.post('/api/auth/register', { name: authName, email: authEmail, password: authPassword }); setLoading(false); if (res.success) { localStorage.setItem('adbrain_user', JSON.stringify(res.user)); setUser(res.user); setPage('campaigns'); } else setError(res.error || 'Erro ao criar conta'); };
  const handleLogout = () => { localStorage.clear(); setUser(null); setConnected(false); setToken(''); setAccounts([]); setSelectedAccount(''); setCampaigns([]); setAds([]); setPage('login'); };
  const handleConnect = async () => { if (!token.trim()) { setError('Cole o token'); return; } setLoading(true); const res = await api.post('/api/meta/connect', { accessToken: token }); setLoading(false); if (res.success) { localStorage.setItem('adbrain_meta_token', token); setConnected(true); setSuccess('Meta conectado!'); loadAccounts(); } else setError(res.error || 'Token inválido'); };
  const handleDisconnect = () => { localStorage.removeItem('adbrain_meta_token'); localStorage.removeItem('adbrain_account'); setConnected(false); setToken(''); setAccounts([]); setSelectedAccount(''); setCampaigns([]); };
  const handleAction = async (action, campaignId) => {
    setLoading(true);
    let body = { objectId: campaignId, objectType: 'campaign' };
    if (action === 'pause') { body.action = 'updateStatus'; body.params = { status: 'PAUSED' }; }
    else if (action === 'activate') { body.action = 'updateStatus'; body.params = { status: 'ACTIVE' }; }
    else if (action === 'scale') { body.action = 'updateBudget'; body.params = { increase_percent: 30 }; }
    else if (action === 'reduce') { body.action = 'updateBudget'; body.params = { decrease_percent: 20 }; }
    const res = await api.post(`/api/meta/actions/${selectedAccount}`, body);
    setLoading(false);
    if (res.success) { setSuccess(action === 'pause' ? 'Pausada' : action === 'activate' ? 'Ativada' : action === 'scale' ? 'Orçamento +30%' : 'Orçamento -20%'); loadData(); } 
    else setError(res.error || 'Erro');
  };

  const filteredCampaigns = useMemo(() => {
    let result = [...campaigns];
    if (search) result = result.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
    if (filter === 'active') result = result.filter(c => c.effectiveStatus === 'ACTIVE');
    else if (filter === 'paused') result = result.filter(c => c.effectiveStatus === 'PAUSED');
    else if (filter === 'critical') result = result.filter(c => c.score?.total < 40);
    else if (filter === 'scale') result = result.filter(c => c.score?.total >= 75 && c.insights?.conversions > 0);
    result.sort((a, b) => (a.score?.total || 50) - (b.score?.total || 50));
    return result;
  }, [campaigns, filter, search]);

  const stats = useMemo(() => {
    const t = campaigns.reduce((acc, c) => ({ spend: acc.spend + (c.insights?.spend || 0), conversions: acc.conversions + (c.insights?.conversions || 0), clicks: acc.clicks + (c.insights?.clicks || 0), impressions: acc.impressions + (c.insights?.impressions || 0) }), { spend: 0, conversions: 0, clicks: 0, impressions: 0 });
    return { ...t, cpa: t.conversions > 0 ? t.spend / t.conversions : 0, ctr: t.impressions > 0 ? (t.clicks / t.impressions * 100) : 0 };
  }, [campaigns]);

  const summary = useMemo(() => AIEngine.getSummary(campaigns), [campaigns]);
  const filterCounts = useMemo(() => ({ all: campaigns.length, active: campaigns.filter(c => c.effectiveStatus === 'ACTIVE').length, paused: campaigns.filter(c => c.effectiveStatus === 'PAUSED').length, critical: campaigns.filter(c => c.score?.total < 40).length, scale: campaigns.filter(c => c.score?.total >= 75 && c.insights?.conversions > 0).length }), [campaigns]);

  // LOGIN/REGISTER
  if (page === 'login' || page === 'register') {
    return (
      <><style>{styles}</style>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 20 }}>
          <div className="animate-fade" style={{ width: '100%', maxWidth: 380, background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-xl)', padding: '40px 32px' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div className="logo-mark" style={{ width: 60, height: 60, margin: '0 auto 16px', borderRadius: 14 }}><Icon name="brain" size={28} /></div>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>AdBrain Pro</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Gestão inteligente de Facebook Ads</p>
            </div>
            {error && <div style={{ background: 'var(--accent-danger-muted)', border: '1px solid rgba(239,68,68,0.25)', color: 'var(--accent-danger)', padding: '10px 14px', borderRadius: 'var(--radius-md)', marginBottom: 18, fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}><Icon name="alertCircle" size={16} />{error}</div>}
            <form onSubmit={page === 'register' ? handleRegister : handleLogin}>
              {page === 'register' && <div style={{ marginBottom: 14 }}><label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Nome</label><input className="input" type="text" value={authName} onChange={(e) => setAuthName(e.target.value)} placeholder="Seu nome" required /></div>}
              <div style={{ marginBottom: 14 }}><label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label><input className="input" type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="seu@email.com" required /></div>
              <div style={{ marginBottom: 22 }}><label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Senha</label><input className="input" type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="********" required /></div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: 12 }} disabled={loading}>{loading ? 'Aguarde...' : (page === 'register' ? 'Criar Conta' : 'Entrar')}</button>
              <p style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'var(--text-muted)' }}>{page === 'register' ? 'Já tem conta?' : 'Não tem conta?'} <span onClick={() => setPage(page === 'login' ? 'register' : 'login')} style={{ color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 500 }}>{page === 'register' ? 'Fazer login' : 'Criar conta'}</span></p>
            </form>
          </div>
        </div>
      </>
    );
  }

  // MAIN APP
  return (
    <><style>{styles}</style>
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-header"><div className="sidebar-logo"><div className="logo-mark"><Icon name="brain" size={20} /></div><div><span className="logo-title">AdBrain</span><br/><span className="logo-subtitle">AI-Powered</span></div></div></div>
          <nav className="sidebar-nav">
            <div className="nav-group">
              <div className="nav-group-label">Menu</div>
              <div className={`nav-item ${page === 'dashboard' ? 'active' : ''}`} onClick={() => setPage('dashboard')}><Icon name="layoutDashboard" size={18} />Dashboard</div>
              <div className={`nav-item ${page === 'campaigns' ? 'active' : ''}`} onClick={() => setPage('campaigns')}><Icon name="target" size={18} />Campanhas{filterCounts.critical > 0 && <span className="nav-badge">{filterCounts.critical}</span>}</div>
              <div className={`nav-item ${page === 'creatives' ? 'active' : ''}`} onClick={() => setPage('creatives')}><Icon name="image" size={18} />Criativos</div>
              <div className={`nav-item ${page === 'audience' ? 'active' : ''}`} onClick={() => setPage('audience')}><Icon name="users" size={18} />Público</div>
              <div className={`nav-item ${page === 'insights' ? 'active' : ''}`} onClick={() => setPage('insights')}><Icon name="sparkles" size={18} />Insights IA</div>
            </div>
            <div className="nav-group">
              <div className="nav-group-label">Sistema</div>
              <div className={`nav-item ${page === 'settings' ? 'active' : ''}`} onClick={() => setPage('settings')}><Icon name="settings" size={18} />Configurações</div>
              <div className="nav-item" onClick={handleLogout}><Icon name="logOut" size={18} />Sair</div>
            </div>
          </nav>
        </aside>

        <main className="main-content">
          <header className="header">
            <div className="header-left"><div><h1 className="header-title">{page === 'campaigns' ? 'Campanhas' : page === 'dashboard' ? 'Dashboard' : page === 'settings' ? 'Configurações' : page === 'audience' ? 'Análise de Público' : page === 'creatives' ? 'Criativos' : 'Insights IA'}</h1><p className="header-subtitle">{page === 'campaigns' ? 'Gerencie suas campanhas' : page === 'creatives' ? 'Análise de performance dos anúncios' : 'Visão geral'}</p></div></div>
            <div className="header-right">
              {connected && (
                <div className="select-wrap">
                  <select className="select" value={selectedAccount} onChange={(e) => { setSelectedAccount(e.target.value); localStorage.setItem('adbrain_account', e.target.value); }}>
                    {accounts.length === 0 ? (
                      <option value="">Carregando contas...</option>
                    ) : (
                      accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name || acc.id}</option>)
                    )}
                  </select>
                  <Icon name="chevronDown" size={14} className="select-icon" />
                </div>
              )}
              <div className="select-wrap"><select className="select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>{dateOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select><Icon name="chevronDown" size={14} className="select-icon" /></div>
              <button className="btn btn-secondary" onClick={loadData} disabled={loading}><Icon name="refreshCw" size={15} className={loading ? 'animate-spin' : ''} />Atualizar</button>
            </div>
          </header>

          {(error || success) && <div className="toast"><div className={`toast-content ${error ? 'error' : 'success'}`}><Icon name={error ? 'alertCircle' : 'checkCircle'} size={16} />{error || success}</div></div>}

          <div className="page-content">
            {!connected ? (
              <div style={{ maxWidth: 440, margin: '50px auto', textAlign: 'center' }}>
                <div style={{ width: 70, height: 70, background: 'var(--accent-info-muted)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}><Icon name="zap" size={36} style={{ color: 'var(--accent-info)' }} /></div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Conecte sua conta Meta</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 14 }}>Para começar, conecte sua conta do Facebook Ads</p>
                <div style={{ textAlign: 'left', marginBottom: 14 }}><label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Token de Acesso</label><input className="input" type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Cole seu token aqui" /></div>
                <button className="btn btn-primary" style={{ width: '100%', padding: 12 }} onClick={handleConnect} disabled={loading || !token.trim()}>{loading ? 'Conectando...' : 'Conectar'}</button>
              </div>
            ) : page === 'campaigns' ? (
              <>
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon blue"><Icon name="dollarSign" size={18} /></div></div><div className="stat-value">{fmt.moneyCompact(stats.spend)}</div><div className="stat-label">Gasto Total</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon green"><Icon name="checkCircle" size={18} /></div></div><div className="stat-value">{stats.conversions}</div><div className="stat-label">Conversões</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon yellow"><Icon name="target" size={18} /></div></div><div className="stat-value">{stats.cpa > 0 ? fmt.money(stats.cpa) : '-'}</div><div className="stat-label">CPA Médio</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon red"><Icon name="activity" size={18} /></div></div><div className="stat-value">{fmt.pct(stats.ctr)}</div><div className="stat-label">CTR Médio</div></div>
                </div>
                {(summary.critical > 0 || summary.scalable > 0) && (
                  <div className="ai-summary">
                    <div className="ai-icon"><Icon name="sparkles" size={22} /></div>
                    <div className="ai-content">
                      <div className="ai-header"><span className="ai-title">Resumo Inteligente</span><span className="ai-badge">IA</span></div>
                      <p className="ai-text">{summary.critical > 0 && <><strong className="danger">{summary.critical} campanha{summary.critical > 1 ? 's' : ''} crítica{summary.critical > 1 ? 's' : ''}</strong> desperdiçando {fmt.money(summary.wastedSpend)}. </>}{summary.scalable > 0 && <><strong className="success">{summary.scalable}</strong> pronta{summary.scalable > 1 ? 's' : ''} para escalar.</>}</p>
                      <div className="ai-actions">{summary.critical > 0 && <button className="btn btn-danger btn-sm" onClick={() => setFilter('critical')}><Icon name="alertTriangle" size={14} />Ver Críticas</button>}{summary.scalable > 0 && <button className="btn btn-primary btn-sm" onClick={() => setFilter('scale')}><Icon name="rocket" size={14} />Ver para Escalar</button>}</div>
                    </div>
                  </div>
                )}
                <div className="filter-bar">
                  <div className={`filter-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Todas<span className="count">{filterCounts.all}</span></div>
                  <div className={`filter-chip ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Ativas<span className="count">{filterCounts.active}</span></div>
                  <div className={`filter-chip ${filter === 'paused' ? 'active' : ''}`} onClick={() => setFilter('paused')}>Pausadas<span className="count">{filterCounts.paused}</span></div>
                  <div className={`filter-chip ${filter === 'critical' ? 'active' : ''}`} onClick={() => setFilter('critical')}>Críticas<span className="count">{filterCounts.critical}</span></div>
                  <div className={`filter-chip ${filter === 'scale' ? 'active' : ''}`} onClick={() => setFilter('scale')}>Para Escalar<span className="count">{filterCounts.scale}</span></div>
                  <div className="search-box"><Icon name="search" size={15} className="search-icon" /><input className="search-input" type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                </div>
                <div className="campaigns-list">
                  {filteredCampaigns.length === 0 ? <div className="empty-state"><Icon name="target" size={48} className="empty-icon" /><h3 className="empty-title">Nenhuma campanha</h3><p className="empty-text">Ajuste os filtros</p></div> : filteredCampaigns.map(c => <CampaignRow key={c.id} campaign={c} expanded={expandedId === c.id} onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)} onAction={handleAction} activeTab={activeTab} setActiveTab={setActiveTab} />)}
                </div>
              </>
            ) : page === 'dashboard' ? (
              <>
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon blue"><Icon name="dollarSign" size={18} /></div></div><div className="stat-value">{fmt.moneyCompact(stats.spend)}</div><div className="stat-label">Investimento</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon green"><Icon name="checkCircle" size={18} /></div></div><div className="stat-value">{stats.conversions}</div><div className="stat-label">Conversões</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon yellow"><Icon name="target" size={18} /></div></div><div className="stat-value">{stats.cpa > 0 ? fmt.money(stats.cpa) : '-'}</div><div className="stat-label">CPA</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon red"><Icon name="barChart3" size={18} /></div></div><div className="stat-value">{fmt.num(stats.clicks)}</div><div className="stat-label">Cliques</div></div>
                </div>
                <div className="settings-grid">
                  <div className="settings-card"><h3 className="settings-card-title"><Icon name="target" size={18} />Campanhas</h3><div className="settings-row"><span className="settings-label">Total</span><span className="settings-value">{campaigns.length}</span></div><div className="settings-row"><span className="settings-label">Ativas</span><span className="settings-value" style={{color:'var(--accent-primary)'}}>{filterCounts.active}</span></div><div className="settings-row"><span className="settings-label">Críticas</span><span className="settings-value" style={{color:'var(--accent-danger)'}}>{filterCounts.critical}</span></div><div className="settings-row"><span className="settings-label">Para Escalar</span><span className="settings-value" style={{color:'var(--accent-primary)'}}>{filterCounts.scale}</span></div></div>
                  <div className="settings-card"><h3 className="settings-card-title"><Icon name="activity" size={18} />Métricas</h3><div className="settings-row"><span className="settings-label">Impressões</span><span className="settings-value">{fmt.num(stats.impressions)}</span></div><div className="settings-row"><span className="settings-label">Cliques</span><span className="settings-value">{fmt.num(stats.clicks)}</span></div><div className="settings-row"><span className="settings-label">CTR</span><span className="settings-value">{fmt.pct(stats.ctr)}</span></div></div>
                </div>
              </>
            ) : page === 'settings' ? (
              <div className="settings-grid">
                <div className="settings-card">
                  <h3 className="settings-card-title"><Icon name="link" size={18} />Conexão Meta</h3>
                  <div className="settings-row">
                    <span className="settings-label">Status</span>
                    <span className={`connection-badge ${connected ? 'connected' : 'disconnected'}`}>
                      <span className="connection-dot"></span>
                      {connected ? 'Conectado' : 'Desconectado'}
                    </span>
                  </div>
                  {connected && accounts.length > 0 && (
                    <div className="settings-row">
                      <span className="settings-label">Conta Selecionada</span>
                      <span className="settings-value">{accounts.find(a => a.id === selectedAccount)?.name || selectedAccount}</span>
                    </div>
                  )}
                  {connected && (
                    <div style={{marginTop:16}}>
                      <button className="btn btn-danger" onClick={handleDisconnect}>
                        <Icon name="x" size={16} />Desconectar
                      </button>
                    </div>
                  )}
                </div>
                <div className="settings-card">
                  <h3 className="settings-card-title"><Icon name="users" size={18} />Conta</h3>
                  <div className="settings-row">
                    <span className="settings-label">Usuário</span>
                    <span className="settings-value">{user?.name || user?.email || '-'}</span>
                  </div>
                  <div className="settings-row">
                    <span className="settings-label">Email</span>
                    <span className="settings-value">{user?.email || '-'}</span>
                  </div>
                  <div style={{marginTop:16}}>
                    <button className="btn btn-secondary" onClick={handleLogout}>
                      <Icon name="logOut" size={16} />Sair da Conta
                    </button>
                  </div>
                </div>
              </div>
            ) : page === 'audience' ? (
              <>
                {!breakdown ? (
                  <div className="empty-state">
                    <Icon name="users" size={48} className="empty-icon" />
                    <h3 className="empty-title">Carregando dados de público...</h3>
                    <p className="empty-text">Os dados de segmentação aparecerão aqui quando disponíveis.</p>
                    <button className="btn btn-primary" style={{marginTop: 16}} onClick={loadData}>
                      <Icon name="refreshCw" size={16} />Carregar Dados
                    </button>
                  </div>
                ) : (
                  <div className="settings-grid">
                    <div className="settings-card">
                      <h3 className="settings-card-title"><Icon name="users" size={18} />Por Gênero</h3>
                      {breakdown.gender?.length > 0 ? breakdown.gender.map((g,i) => (
                        <div className="settings-row" key={i}>
                          <span className="settings-label">{g.gender === 'male' ? 'Masculino' : g.gender === 'female' ? 'Feminino' : g.gender}</span>
                          <span className="settings-value">
                            {g.conversions || 0} conv. • {fmt.money(g.spend || 0)}
                          </span>
                        </div>
                      )) : <p style={{color:'var(--text-muted)', padding: '10px 0'}}>Sem dados de gênero</p>}
                    </div>
                    <div className="settings-card">
                      <h3 className="settings-card-title"><Icon name="barChart3" size={18} />Por Idade</h3>
                      {breakdown.age?.length > 0 ? breakdown.age.map((a,i) => (
                        <div className="settings-row" key={i}>
                          <span className="settings-label">{a.age}</span>
                          <span className="settings-value">
                            {a.conversions || 0} conv. • {fmt.money(a.spend || 0)}
                          </span>
                        </div>
                      )) : <p style={{color:'var(--text-muted)', padding: '10px 0'}}>Sem dados de idade</p>}
                    </div>
                    {breakdown.placement?.length > 0 && (
                      <div className="settings-card">
                        <h3 className="settings-card-title"><Icon name="target" size={18} />Por Posicionamento</h3>
                        {breakdown.placement.map((p,i) => (
                          <div className="settings-row" key={i}>
                            <span className="settings-label">{p.publisher_platform} - {p.platform_position}</span>
                            <span className="settings-value">
                              {p.conversions || 0} conv. • {fmt.money(p.spend || 0)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : page === 'insights' ? (
              <>
                <div className="ai-summary"><div className="ai-icon"><Icon name="sparkles" size={22} /></div><div className="ai-content"><div className="ai-header"><span className="ai-title">Análise da Conta</span><span className="ai-badge">IA</span></div><p className="ai-text">Você tem <strong>{campaigns.length} campanhas</strong>. {summary.critical > 0 && <><strong className="danger">{summary.critical}</strong> precisam de atenção.</>} {summary.scalable > 0 && <><strong className="success">{summary.scalable}</strong> podem ser escaladas.</>}</p></div></div>
                <h3 style={{fontSize:15,fontWeight:600,marginBottom:16}}>Problemas Detectados</h3>
                <div className="issues-grid" style={{marginBottom:28}}>{campaigns.flatMap(c => (c.analysis?.issues || []).map((issue,i) => <div key={`${c.id}-${i}`} className={`issue-card ${issue.severity}`}><div className="issue-icon"><Icon name={issue.icon} size={18} /></div><div className="issue-content"><div className="issue-title">{issue.title}</div><div className="issue-desc"><strong>{c.name}:</strong> {issue.desc}</div></div></div>)).slice(0,6)}{campaigns.every(c => !c.analysis?.issues?.length) && <div style={{gridColumn:'1/-1',textAlign:'center',padding:30,color:'var(--text-muted)'}}><Icon name="checkCircle" size={40} style={{marginBottom:12,opacity:0.5}} /><div>Nenhum problema detectado.</div></div>}</div>
                <h3 style={{fontSize:15,fontWeight:600,marginBottom:16}}>Oportunidades</h3>
                <div className="issues-grid">{campaigns.flatMap(c => (c.analysis?.opportunities || []).map((opp,i) => <div key={`${c.id}-o-${i}`} className="issue-card opportunity"><div className="issue-icon"><Icon name={opp.icon} size={18} /></div><div className="issue-content"><div className="issue-title">{opp.title}</div><div className="issue-desc"><strong>{c.name}:</strong> {opp.desc}</div></div></div>)).slice(0,6)}{campaigns.every(c => !c.analysis?.opportunities?.length) && <div style={{gridColumn:'1/-1',textAlign:'center',padding:30,color:'var(--text-muted)'}}><Icon name="lightbulb" size={40} style={{marginBottom:12,opacity:0.5}} /><div>Melhore as campanhas para desbloquear oportunidades.</div></div>}</div>
              </>
            ) : page === 'creatives' ? (
              <>
                {/* Stats dos Criativos */}
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-header"><div className="stat-icon blue"><Icon name="image" size={18} /></div></div>
                    <div className="stat-value">{ads.length}</div>
                    <div className="stat-label">Total de Anúncios</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-header"><div className="stat-icon green"><Icon name="trendingUp" size={18} /></div></div>
                    <div className="stat-value">{ads.filter(a => a.score?.total >= 70).length}</div>
                    <div className="stat-label">Performando Bem</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-header"><div className="stat-icon yellow"><Icon name="alertTriangle" size={18} /></div></div>
                    <div className="stat-value">{ads.filter(a => a.fatigueLevel === 'warning').length}</div>
                    <div className="stat-label">Em Fadiga</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-header"><div className="stat-icon red"><Icon name="flame" size={18} /></div></div>
                    <div className="stat-value">{ads.filter(a => a.fatigueLevel === 'critical').length}</div>
                    <div className="stat-label">Fadiga Crítica</div>
                  </div>
                </div>

                {/* Alerta de Criativos com Fadiga */}
                {ads.filter(a => a.fatigueLevel === 'critical').length > 0 && (
                  <div className="ai-summary" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(245,158,11,0.08) 100%)', borderColor: 'rgba(239,68,68,0.2)' }}>
                    <div className="ai-icon" style={{ background: 'linear-gradient(135deg, var(--accent-danger) 0%, var(--accent-warning) 100%)' }}>
                      <Icon name="alertTriangle" size={22} />
                    </div>
                    <div className="ai-content">
                      <div className="ai-header"><span className="ai-title">Alerta de Fadiga de Criativo</span><span className="ai-badge" style={{ background: 'var(--accent-danger)' }}>Urgente</span></div>
                      <p className="ai-text">
                        <strong className="danger">{ads.filter(a => a.fatigueLevel === 'critical').length} criativo{ads.filter(a => a.fatigueLevel === 'critical').length > 1 ? 's' : ''}</strong> com frequência muito alta (acima de 4x). 
                        Isso significa que o público já viu o anúncio muitas vezes e pode estar ignorando. <strong>Recomendamos trocar esses criativos urgentemente.</strong>
                      </p>
                    </div>
                  </div>
                )}

                {/* Loading */}
                {loadingAds ? (
                  <div className="empty-state">
                    <Icon name="refreshCw" size={48} className="empty-icon animate-spin" />
                    <h3 className="empty-title">Carregando criativos...</h3>
                  </div>
                ) : ads.length === 0 ? (
                  <div className="empty-state">
                    <Icon name="image" size={48} className="empty-icon" />
                    <h3 className="empty-title">Nenhum criativo encontrado</h3>
                    <p className="empty-text">Seus anúncios aparecerão aqui quando disponíveis.</p>
                  </div>
                ) : (
                  <>
                    {/* Top Performers */}
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon name="trophy" size={18} style={{ color: 'var(--accent-warning)' }} />
                      Top Performers
                    </h3>
                    <div className="issues-grid" style={{ marginBottom: 28 }}>
                      {ads.filter(a => a.score?.total >= 60).slice(0, 6).map((ad, i) => {
                        const ins = ad.insights || {};
                        const status = AIEngine.getStatus(ad.score?.total || 0);
                        return (
                          <div key={ad.id} className="issue-card opportunity">
                            <div className="issue-icon" style={{ background: status.bg, color: status.color, fontWeight: 700, fontSize: 14 }}>
                              {ad.score?.total}
                            </div>
                            <div className="issue-content">
                              <div className="issue-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                {ad.name || `Anúncio ${i + 1}`}
                                {ad.fatigueLevel === 'healthy' && <span style={{ fontSize: 9, background: 'var(--accent-primary-muted)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>SAUDÁVEL</span>}
                              </div>
                              <div className="issue-desc">
                                CTR: {fmt.pct(ins.ctr || 0)} • CPA: {ins.cpa ? fmt.money(ins.cpa) : '-'} • {ins.conversions || 0} conv.
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {ads.filter(a => a.score?.total >= 60).length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>
                          <Icon name="target" size={40} style={{ marginBottom: 12, opacity: 0.5 }} />
                          <div>Nenhum criativo com score acima de 60 ainda.</div>
                        </div>
                      )}
                    </div>

                    {/* Criativos com Fadiga */}
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon name="eye" size={18} style={{ color: 'var(--accent-warning)' }} />
                      Criativos com Fadiga (Trocar em breve)
                    </h3>
                    <div className="issues-grid" style={{ marginBottom: 28 }}>
                      {ads.filter(a => a.fatigueLevel !== 'healthy').map((ad, i) => {
                        const ins = ad.insights || {};
                        return (
                          <div key={ad.id} className={`issue-card ${ad.fatigueLevel === 'critical' ? 'critical' : 'warning'}`}>
                            <div className="issue-icon">
                              <Icon name={ad.fatigueLevel === 'critical' ? 'flame' : 'alertTriangle'} size={20} />
                            </div>
                            <div className="issue-content">
                              <div className="issue-title">{ad.name || `Anúncio ${i + 1}`}</div>
                              <div className="issue-desc">
                                Frequência: <strong>{(ins.frequency || 0).toFixed(1)}x</strong> • 
                                {ad.fatigueLevel === 'critical' ? ' Público saturado - trocar urgente!' : ' Monitore nos próximos dias'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {ads.filter(a => a.fatigueLevel !== 'healthy').length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>
                          <Icon name="checkCircle" size={40} style={{ marginBottom: 12, opacity: 0.5, color: 'var(--accent-primary)' }} />
                          <div>Nenhum criativo com fadiga. Tudo saudável!</div>
                        </div>
                      )}
                    </div>

                    {/* Todos os Criativos */}
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Todos os Criativos ({ads.length})</h3>
                    <div className="table-wrap">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Score</th>
                            <th>Nome</th>
                            <th>Gasto</th>
                            <th>CPA</th>
                            <th>CTR</th>
                            <th>Conv.</th>
                            <th>Freq.</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ads.map((ad, i) => {
                            const ins = ad.insights || {};
                            const status = AIEngine.getStatus(ad.score?.total || 0);
                            return (
                              <tr key={ad.id}>
                                <td>
                                  <span style={{ 
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    width: 36, height: 36, borderRadius: '50%', 
                                    background: status.bg, color: status.color, 
                                    fontWeight: 700, fontSize: 12, fontFamily: 'var(--font-mono)' 
                                  }}>
                                    {ad.score?.total || 0}
                                  </span>
                                </td>
                                <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {ad.name || `Anúncio ${i + 1}`}
                                </td>
                                <td style={{ fontFamily: 'var(--font-mono)' }}>{fmt.money(ins.spend || 0)}</td>
                                <td style={{ fontFamily: 'var(--font-mono)', color: ins.cpa && ins.cpa <= AIEngine.config.metaCPA ? 'var(--accent-primary)' : ins.cpa > AIEngine.config.metaCPA * 1.5 ? 'var(--accent-danger)' : 'inherit' }}>
                                  {ins.cpa ? fmt.money(ins.cpa) : '-'}
                                </td>
                                <td style={{ fontFamily: 'var(--font-mono)' }}>{fmt.pct(ins.ctr || 0)}</td>
                                <td style={{ fontFamily: 'var(--font-mono)', color: ins.conversions > 0 ? 'var(--accent-primary)' : 'inherit' }}>{ins.conversions || 0}</td>
                                <td style={{ fontFamily: 'var(--font-mono)', color: ad.fatigueLevel === 'critical' ? 'var(--accent-danger)' : ad.fatigueLevel === 'warning' ? 'var(--accent-warning)' : 'inherit' }}>
                                  {(ins.frequency || 0).toFixed(1)}x
                                </td>
                                <td>
                                  <span style={{ 
                                    fontSize: 10, fontWeight: 600, padding: '4px 8px', borderRadius: 4,
                                    background: ad.fatigueLevel === 'critical' ? 'var(--accent-danger-muted)' : ad.fatigueLevel === 'warning' ? 'var(--accent-warning-muted)' : 'var(--accent-primary-muted)',
                                    color: ad.fatigueLevel === 'critical' ? 'var(--accent-danger)' : ad.fatigueLevel === 'warning' ? 'var(--accent-warning)' : 'var(--accent-primary)'
                                  }}>
                                    {ad.fatigueLevel === 'critical' ? 'TROCAR' : ad.fatigueLevel === 'warning' ? 'ATENÇÃO' : 'OK'}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="empty-state"><Icon name="image" size={48} className="empty-icon" /><h3 className="empty-title">Em breve</h3><p className="empty-text">Seção em desenvolvimento.</p></div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
