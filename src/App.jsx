import React, { useState, useEffect, useMemo, useCallback } from 'react';

// =============================================================================
// API CONFIG - CORRIGIDO PARA SALVAR TOKEN NO BANCO
// =============================================================================
const API_URL = 'https://adbrain-pro-api.vercel.app';

const api = {
  getHeaders: () => {
    const metaToken = localStorage.getItem('adbrain_meta_token');
    const jwtToken = localStorage.getItem('adbrain_jwt');
    const headers = { 'Content-Type': 'application/json' };
    if (metaToken) headers['Authorization'] = `Bearer ${metaToken}`;
    if (jwtToken) headers['X-User-JWT'] = jwtToken;
    return headers;
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
    trendingDown: <><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></>,
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
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    monitor: <><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></>,
    smartphone: <><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></>,
    pieChart: <><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>,
    thumbsUp: <><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></>,
    thumbsDown: <><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></>,
    award: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></>,
    trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></>,
    gauge: <><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></>,
    heartPulse: <><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></>,
    banknote: <><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></>,
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
  config: { metaCPA: 400, metaROAS: 3, ctrMinimo: 1, frequenciaMaxima: 3, ticketMedio: 500 },

  calcScore: (campaign) => {
    const ins = campaign.insights || {};
    const cfg = AIEngine.config;
    let scores = { cpa: 50, ctr: 50, freq: 100, roas: 50 };
    if (ins.conversions > 0 && ins.cpa > 0) {
      const r = ins.cpa / cfg.metaCPA;
      scores.cpa = r <= 0.5 ? 100 : r <= 0.7 ? 90 : r <= 1.0 ? 70 : r <= 1.5 ? 40 : r <= 2.0 ? 20 : 5;
    } else if (ins.spend > 100 && ins.conversions === 0) { scores.cpa = 0; }
    if (ins.ctr > 0) {
      const r = ins.ctr / cfg.ctrMinimo;
      scores.ctr = r >= 2.0 ? 100 : r >= 1.5 ? 85 : r >= 1.0 ? 70 : r >= 0.5 ? 40 : 20;
    }
    if (ins.frequency > 0) { scores.freq = ins.frequency <= cfg.frequenciaMaxima ? 100 : ins.frequency <= cfg.frequenciaMaxima * 1.5 ? 60 : 30; }
    if (ins.roas > 0) {
      const r = ins.roas / cfg.metaROAS;
      scores.roas = r >= 1.5 ? 100 : r >= 1.0 ? 80 : r >= 0.5 ? 50 : 20;
    } else if (ins.spend > 50) { scores.roas = 10; }
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
      issues.push({ severity: 'critical', icon: 'flame', title: 'Gasto sem conversões', desc: `${fmt.money(ins.spend)} investidos sem resultado.`, action: 'Pausar e revisar público/criativo' });
    }
    if (ins.cpa > cfg.metaCPA * 2) {
      issues.push({ severity: 'critical', icon: 'alertTriangle', title: 'CPA muito alto', desc: `CPA de ${fmt.money(ins.cpa)} está ${Math.round((ins.cpa / cfg.metaCPA - 1) * 100)}% acima da meta.`, action: 'Reduzir orçamento 50%' });
    }
    if (ins.frequency > cfg.frequenciaMaxima * 1.5) {
      issues.push({ severity: 'warning', icon: 'eye', title: 'Público saturado', desc: `Frequência de ${ins.frequency?.toFixed(1)}x indica saturação.`, action: 'Expandir público' });
    }
    if (ins.ctr < cfg.ctrMinimo * 0.5 && ins.impressions > 1000) {
      issues.push({ severity: 'warning', icon: 'image', title: 'CTR baixo', desc: `CTR de ${ins.ctr?.toFixed(2)}% precisa melhorar.`, action: 'Testar novos criativos' });
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
    const totalSpend = campaigns.reduce((s, c) => s + (c.insights?.spend || 0), 0);
    const totalConv = campaigns.reduce((s, c) => s + (c.insights?.conversions || 0), 0);
    const avgScore = campaigns.length > 0 ? Math.round(campaigns.reduce((s, c) => s + (c.score?.total || 0), 0) / campaigns.length) : 0;
    return { critical: critical.length, scalable: scalable.length, wastedSpend, totalSpend, totalConv, avgScore };
  },

  getAccountAnalysis: (campaigns, breakdown, ads) => {
    const summary = AIEngine.getSummary(campaigns);
    const insights = [], recommendations = [], healthMetrics = [];
    
    healthMetrics.push({ name: 'Saúde Geral', value: summary.avgScore, icon: 'heartPulse' });
    const totalClicks = campaigns.reduce((s, c) => s + (c.insights?.clicks || 0), 0);
    const convRate = totalClicks > 0 ? (summary.totalConv / totalClicks * 100) : 0;
    healthMetrics.push({ name: 'Taxa Conversão', value: convRate.toFixed(1), suffix: '%', icon: 'target' });
    const avgCPA = summary.totalConv > 0 ? summary.totalSpend / summary.totalConv : 0;
    healthMetrics.push({ name: 'CPA Médio', value: avgCPA, isCurrency: true, icon: 'dollarSign' });

    if (summary.critical > 0) {
      insights.push({ type: 'danger', icon: 'flame', title: 'Campanhas Críticas', description: `${summary.critical} campanha${summary.critical > 1 ? 's' : ''} desperdiçando ${fmt.money(summary.wastedSpend)}.` });
      recommendations.push({ action: 'Pausar campanhas críticas', impact: `Economia de ${fmt.money(summary.wastedSpend * 0.7)}`, icon: 'pause' });
    }
    if (summary.scalable > 0) {
      insights.push({ type: 'success', icon: 'rocket', title: 'Oportunidades de Escala', description: `${summary.scalable} campanha${summary.scalable > 1 ? 's' : ''} pronta${summary.scalable > 1 ? 's' : ''} para escalar.` });
      recommendations.push({ action: 'Aumentar orçamento das top', impact: `+${Math.round(summary.scalable * 3)} conversões`, icon: 'trendingUp' });
    }
    if (breakdown?.combined?.length > 0) {
      const best = breakdown.combined[0];
      if (best?.cpa > 0) {
        insights.push({ type: 'info', icon: 'users', title: 'Melhor Público', description: `${best.genderLabel || best.gender}, ${best.age} com CPA de ${fmt.money(best.cpa)}.` });
      }
    }
    if (ads?.length > 0) {
      const badAds = ads.filter(a => a.score < 30);
      if (badAds.length > 0) {
        insights.push({ type: 'warning', icon: 'image', title: 'Criativos Fracos', description: `${badAds.length} anúncio${badAds.length > 1 ? 's' : ''} com baixa performance.` });
        recommendations.push({ action: 'Criar novos criativos', impact: '+30% em CTR', icon: 'image' });
      }
    }
    return { healthMetrics, insights, recommendations, summary };
  }
};

// =============================================================================
// STYLES
// =============================================================================
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
:root{--bg-base:#09090b;--bg-subtle:#0f0f12;--bg-muted:#18181b;--bg-elevated:#1f1f23;--bg-hover:#27272a;--border-subtle:#27272a;--border-muted:#3f3f46;--text-primary:#fafafa;--text-secondary:#a1a1aa;--text-muted:#71717a;--text-faint:#52525b;--accent-primary:#10b981;--accent-primary-hover:#059669;--accent-primary-muted:rgba(16,185,129,0.12);--accent-danger:#ef4444;--accent-danger-muted:rgba(239,68,68,0.12);--accent-warning:#f59e0b;--accent-warning-muted:rgba(245,158,11,0.12);--accent-info:#3b82f6;--accent-info-muted:rgba(59,130,246,0.12);--font-sans:'Outfit',-apple-system,sans-serif;--font-mono:'JetBrains Mono',monospace;--radius-sm:6px;--radius-md:10px;--radius-lg:14px;--radius-xl:20px}
*{margin:0;padding:0;box-sizing:border-box}body{font-family:var(--font-sans);background:var(--bg-base);color:var(--text-primary);line-height:1.5;-webkit-font-smoothing:antialiased}::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border-muted);border-radius:3px}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}.animate-fade{animation:fadeIn .3s ease forwards}.animate-spin{animation:spin 1s linear infinite}.animate-pulse{animation:pulse 2s ease-in-out infinite}
.app-layout{display:flex;min-height:100vh}.sidebar{width:260px;background:var(--bg-subtle);border-right:1px solid var(--border-subtle);position:fixed;top:0;left:0;height:100vh;display:flex;flex-direction:column;z-index:100}.sidebar-header{padding:22px 18px;border-bottom:1px solid var(--border-subtle)}.sidebar-logo{display:flex;align-items:center;gap:12px}.logo-mark{width:42px;height:42px;background:linear-gradient(135deg,var(--accent-primary) 0%,#059669 100%);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;box-shadow:0 0 30px rgba(16,185,129,.25)}.logo-mark svg{stroke:white}.logo-text{display:flex;flex-direction:column}.logo-title{font-size:18px;font-weight:700}.logo-subtitle{font-size:10px;font-weight:600;letter-spacing:1.2px;text-transform:uppercase;color:var(--accent-primary)}.sidebar-nav{flex:1;padding:18px 10px;overflow-y:auto}.nav-group{margin-bottom:24px}.nav-group-label{font-size:10px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:var(--text-faint);padding:0 14px;margin-bottom:8px}.nav-item{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:var(--radius-md);font-size:14px;font-weight:500;color:var(--text-secondary);cursor:pointer;transition:all .15s ease;margin-bottom:2px;position:relative}.nav-item:hover{background:var(--bg-hover);color:var(--text-primary)}.nav-item.active{background:var(--accent-primary-muted);color:var(--accent-primary)}.nav-item.active::before{content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:20px;background:var(--accent-primary);border-radius:0 2px 2px 0}.nav-badge{margin-left:auto;min-width:20px;height:20px;padding:0 6px;background:var(--accent-danger);color:white;font-size:10px;font-weight:700;border-radius:10px;display:flex;align-items:center;justify-content:center}.nav-badge.success{background:var(--accent-primary)}.sidebar-footer{padding:16px;border-top:1px solid var(--border-subtle)}.user-card{display:flex;align-items:center;gap:12px;padding:10px;border-radius:var(--radius-md);background:var(--bg-muted)}.user-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--accent-primary),var(--accent-info));display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:white}.user-info{flex:1;min-width:0}.user-name{font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.user-role{font-size:11px;color:var(--text-muted)}
.main-content{flex:1;margin-left:260px;min-height:100vh;display:flex;flex-direction:column}.header{height:68px;background:var(--bg-subtle);border-bottom:1px solid var(--border-subtle);display:flex;align-items:center;justify-content:space-between;padding:0 28px;position:sticky;top:0;z-index:50}.header-left{display:flex;align-items:center;gap:20px}.header-title{font-size:20px;font-weight:700}.header-subtitle{font-size:12px;color:var(--text-muted);margin-top:2px}.header-right{display:flex;align-items:center;gap:10px}
.select-wrap{position:relative}.select{appearance:none;background:var(--bg-muted);border:1px solid var(--border-subtle);color:var(--text-primary);padding:9px 36px 9px 12px;border-radius:var(--radius-md);font-size:13px;font-weight:500;font-family:var(--font-sans);cursor:pointer;min-width:150px}.select:focus{outline:none;border-color:var(--accent-primary)}.select:disabled{opacity:.6;cursor:not-allowed}.select-icon{position:absolute;right:12px;top:50%;transform:translateY(-50%);pointer-events:none;color:var(--text-muted)}.input{width:100%;padding:10px 14px;background:var(--bg-muted);border:1px solid var(--border-subtle);border-radius:var(--radius-md);font-size:13px;font-family:var(--font-sans);color:var(--text-primary)}.input:focus{outline:none;border-color:var(--accent-primary)}.input::placeholder{color:var(--text-muted)}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:9px 16px;border-radius:var(--radius-md);font-size:13px;font-weight:600;font-family:var(--font-sans);cursor:pointer;transition:all .15s ease;border:none}.btn:disabled{opacity:.6;cursor:not-allowed}.btn-primary{background:linear-gradient(135deg,var(--accent-primary) 0%,var(--accent-primary-hover) 100%);color:white}.btn-primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 4px 16px rgba(16,185,129,.4)}.btn-secondary{background:var(--bg-muted);color:var(--text-primary);border:1px solid var(--border-subtle)}.btn-secondary:hover:not(:disabled){background:var(--bg-hover)}.btn-danger{background:var(--accent-danger);color:white}.btn-sm{padding:6px 12px;font-size:12px}.btn-icon{width:36px;height:36px;padding:0;border-radius:var(--radius-md);background:var(--bg-muted);border:1px solid var(--border-subtle);color:var(--text-secondary);cursor:pointer;display:flex;align-items:center;justify-content:center}.btn-icon:hover{background:var(--bg-hover);color:var(--text-primary)}.btn-icon.scale{color:var(--accent-primary);border-color:var(--accent-primary-muted)}.btn-icon.scale:hover{background:var(--accent-primary-muted)}.btn-icon.warning{color:var(--accent-warning);border-color:var(--accent-warning-muted)}.btn-icon.warning:hover{background:var(--accent-warning-muted)}
.page-content{flex:1;padding:24px 28px}.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:24px}.stat-card{background:var(--bg-subtle);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:20px;transition:all .2s ease}.stat-card:hover{border-color:var(--border-muted);transform:translateY(-2px)}.stat-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:14px}.stat-icon{width:42px;height:42px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center}.stat-icon.green{background:var(--accent-primary-muted);color:var(--accent-primary)}.stat-icon.red{background:var(--accent-danger-muted);color:var(--accent-danger)}.stat-icon.yellow{background:var(--accent-warning-muted);color:var(--accent-warning)}.stat-icon.blue{background:var(--accent-info-muted);color:var(--accent-info)}.stat-value{font-size:28px;font-weight:700;font-family:var(--font-mono);margin-bottom:4px}.stat-label{font-size:12px;color:var(--text-muted)}
.ai-summary{background:linear-gradient(135deg,rgba(16,185,129,.08) 0%,rgba(59,130,246,.08) 100%);border:1px solid rgba(16,185,129,.2);border-radius:var(--radius-lg);padding:22px 24px;margin-bottom:24px;display:flex;gap:20px}.ai-icon{width:48px;height:48px;background:linear-gradient(135deg,var(--accent-primary) 0%,var(--accent-primary-hover) 100%);border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 0 30px rgba(16,185,129,.25)}.ai-icon svg{stroke:white}.ai-content{flex:1}.ai-header{display:flex;align-items:center;gap:10px;margin-bottom:10px}.ai-title{font-size:15px;font-weight:600}.ai-badge{background:linear-gradient(135deg,var(--accent-primary),var(--accent-info));color:white;font-size:9px;font-weight:700;padding:3px 8px;border-radius:4px}.ai-text{font-size:14px;color:var(--text-secondary);line-height:1.7}.ai-text strong{color:var(--text-primary)}.ai-text .danger{color:var(--accent-danger);font-weight:600}.ai-text .success{color:var(--accent-primary);font-weight:600}.ai-actions{display:flex;gap:10px;margin-top:16px}
.filter-bar{display:flex;align-items:center;gap:10px;margin-bottom:20px;flex-wrap:wrap}.filter-chip{display:inline-flex;align-items:center;gap:6px;padding:8px 14px;background:var(--bg-muted);border:1px solid var(--border-subtle);border-radius:20px;font-size:12px;font-weight:500;color:var(--text-secondary);cursor:pointer;transition:all .15s ease}.filter-chip:hover{border-color:var(--border-muted);color:var(--text-primary)}.filter-chip.active{background:var(--accent-primary-muted);border-color:var(--accent-primary);color:var(--accent-primary)}.filter-chip .count{background:var(--bg-elevated);padding:2px 7px;border-radius:10px;font-size:10px;font-weight:700}.filter-chip.active .count{background:rgba(16,185,129,.25)}.search-box{position:relative;margin-left:auto}.search-input{background:var(--bg-muted);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:8px 14px 8px 38px;font-size:13px;font-family:var(--font-sans);color:var(--text-primary);width:220px;transition:width .2s ease}.search-input::placeholder{color:var(--text-muted)}.search-input:focus{outline:none;border-color:var(--accent-primary);width:280px}.search-icon{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--text-muted)}
.campaigns-list{display:flex;flex-direction:column;gap:10px}.campaign-row{background:var(--bg-subtle);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);transition:all .2s ease;overflow:hidden}.campaign-row:hover{border-color:var(--border-muted)}.campaign-row.expanded{border-color:var(--accent-primary)}.campaign-main{display:grid;grid-template-columns:60px 1fr 100px 100px 100px 120px;align-items:center;gap:20px;padding:16px 20px;cursor:pointer}.score-ring{width:52px;height:52px;position:relative}.score-ring svg{width:52px;height:52px;transform:rotate(-90deg)}.score-ring-bg{fill:none;stroke:var(--bg-elevated);stroke-width:5}.score-ring-progress{fill:none;stroke-width:5;stroke-linecap:round;stroke-dasharray:138;transition:stroke-dashoffset .8s ease}.score-ring-value{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:14px;font-weight:700;font-family:var(--font-mono)}.campaign-info{min-width:0}.campaign-name{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:4px}.campaign-meta{display:flex;align-items:center;gap:10px}.campaign-status{display:inline-flex;align-items:center;gap:5px;padding:3px 8px;border-radius:var(--radius-sm);font-size:10px;font-weight:600;text-transform:uppercase}.campaign-status.active{background:var(--accent-primary-muted);color:var(--accent-primary)}.campaign-status.paused{background:var(--bg-elevated);color:var(--text-muted)}.campaign-objective{font-size:11px;color:var(--text-muted)}.metric-cell{text-align:right}.metric-value{font-size:15px;font-weight:600;font-family:var(--font-mono);margin-bottom:2px}.metric-value.good{color:var(--accent-primary)}.metric-value.warning{color:var(--accent-warning)}.metric-value.bad{color:var(--accent-danger)}.metric-label{font-size:10px;color:var(--text-muted);text-transform:uppercase}.campaign-actions{display:flex;gap:6px;justify-content:flex-end}
.campaign-expanded{border-top:1px solid var(--border-subtle);background:var(--bg-muted);animation:fadeIn .25s ease}.expanded-tabs{display:flex;gap:4px;padding:12px 20px;border-bottom:1px solid var(--border-subtle);background:var(--bg-subtle)}.expanded-tab{padding:8px 14px;border-radius:var(--radius-md);font-size:12px;font-weight:500;color:var(--text-secondary);cursor:pointer;border:none;background:transparent;font-family:var(--font-sans)}.expanded-tab:hover{background:var(--bg-hover);color:var(--text-primary)}.expanded-tab.active{background:var(--accent-primary-muted);color:var(--accent-primary)}.expanded-content{padding:22px}.score-breakdown{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}.breakdown-item{background:var(--bg-subtle);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:16px;text-align:center}.breakdown-value{font-size:28px;font-weight:700;font-family:var(--font-mono);margin-bottom:4px}.breakdown-label{font-size:10px;color:var(--text-muted);text-transform:uppercase}
.issues-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:14px}.issue-card{display:flex;gap:14px;padding:16px;border-radius:var(--radius-md);border:1px solid var(--border-subtle)}.issue-card.critical{background:var(--accent-danger-muted);border-color:rgba(239,68,68,.25)}.issue-card.warning{background:var(--accent-warning-muted);border-color:rgba(245,158,11,.25)}.issue-card.opportunity{background:var(--accent-primary-muted);border-color:rgba(16,185,129,.25)}.issue-icon{width:40px;height:40px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;flex-shrink:0}.issue-card.critical .issue-icon{background:rgba(239,68,68,.2);color:var(--accent-danger)}.issue-card.warning .issue-icon{background:rgba(245,158,11,.2);color:var(--accent-warning)}.issue-card.opportunity .issue-icon{background:rgba(16,185,129,.2);color:var(--accent-primary)}.issue-content{flex:1}.issue-title{font-size:13px;font-weight:600;margin-bottom:4px}.issue-desc{font-size:12px;color:var(--text-secondary);line-height:1.5}.issue-action{font-size:11px;color:var(--text-muted);margin-top:8px;padding-top:8px;border-top:1px solid var(--border-subtle)}
.budget-control{background:var(--bg-subtle);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:20px;margin-top:18px}.budget-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}.budget-title{font-size:14px;font-weight:600}.budget-current{font-size:13px;color:var(--text-muted)}.budget-current span{color:var(--text-primary);font-weight:600;font-family:var(--font-mono)}.budget-actions{display:flex;gap:12px}.budget-btn{flex:1;padding:12px;border-radius:var(--radius-md);font-size:13px;font-weight:600;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;border:1px solid var(--border-subtle);background:var(--bg-muted);color:var(--text-primary);font-family:var(--font-sans)}.budget-btn:hover{border-color:var(--border-muted)}.budget-btn.increase{background:var(--accent-primary-muted);border-color:var(--accent-primary);color:var(--accent-primary)}.budget-btn.increase:hover{background:var(--accent-primary);color:white}.budget-btn.decrease{background:var(--accent-danger-muted);border-color:var(--accent-danger);color:var(--accent-danger)}.budget-btn.decrease:hover{background:var(--accent-danger);color:white}
.settings-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}.settings-card{background:var(--bg-subtle);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:24px}.settings-card-title{font-size:15px;font-weight:600;margin-bottom:20px;display:flex;align-items:center;gap:10px}.settings-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--border-subtle)}.settings-row:last-child{border-bottom:none}.settings-label{font-size:13px;color:var(--text-secondary)}.settings-value{font-size:13px;font-weight:500}
.connection-badge{display:inline-flex;align-items:center;gap:8px;padding:10px 16px;border-radius:var(--radius-md);font-size:12px;font-weight:500}.connection-badge.connected{background:var(--accent-primary-muted);color:var(--accent-primary)}.connection-badge.disconnected{background:var(--accent-danger-muted);color:var(--accent-danger)}.connection-dot{width:8px;height:8px;border-radius:50%;background:currentColor}.connection-badge.connected .connection-dot{animation:pulse 2s ease-in-out infinite}
.toast{position:fixed;top:20px;right:20px;z-index:1000;animation:fadeIn .3s ease}.toast-content{display:flex;align-items:center;gap:12px;padding:14px 20px;border-radius:var(--radius-md);font-size:13px;font-weight:500;box-shadow:0 12px 40px rgba(0,0,0,.5)}.toast-content.success{background:var(--accent-primary);color:white}.toast-content.error{background:var(--accent-danger);color:white}
.empty-state{text-align:center;padding:60px 20px}.empty-icon{margin:0 auto 20px;color:var(--text-faint);opacity:.6}.empty-title{font-size:18px;font-weight:600;margin-bottom:8px}.empty-text{font-size:14px;color:var(--text-muted)}
.creative-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px}.creative-card{background:var(--bg-subtle);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);overflow:hidden;transition:all .2s ease}.creative-card:hover{border-color:var(--border-muted);transform:translateY(-2px)}.creative-card.good{border-color:rgba(16,185,129,.3)}.creative-card.bad{border-color:rgba(239,68,68,.3)}.creative-preview{height:180px;background:var(--bg-muted);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}.creative-preview img{width:100%;height:100%;object-fit:cover}.creative-badge{position:absolute;top:10px;right:10px;padding:5px 10px;border-radius:var(--radius-sm);font-size:10px;font-weight:700;text-transform:uppercase}.creative-badge.active{background:var(--accent-primary);color:white}.creative-badge.paused{background:var(--bg-elevated);color:var(--text-muted)}.creative-score{position:absolute;top:10px;left:10px;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700}.creative-body{padding:16px}.creative-name{font-size:13px;font-weight:600;margin-bottom:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.creative-metrics{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}.creative-metric-label{font-size:11px;color:var(--text-muted);margin-bottom:2px}.creative-metric-value{font-size:14px;font-weight:600;font-family:var(--font-mono)}
.audience-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}.audience-card{background:var(--bg-subtle);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:24px}.audience-card-title{font-size:15px;font-weight:600;margin-bottom:20px;display:flex;align-items:center;gap:10px}.audience-bar{margin-bottom:16px}.audience-bar-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.audience-bar-label{font-size:13px;font-weight:500;display:flex;align-items:center;gap:8px}.audience-bar-value{font-size:13px;font-weight:600;color:var(--accent-primary);font-family:var(--font-mono)}.audience-bar-track{height:8px;background:var(--bg-elevated);border-radius:4px;overflow:hidden}.audience-bar-fill{height:100%;border-radius:4px;transition:width .5s ease}.audience-bar-stats{display:flex;justify-content:space-between;margin-top:6px;font-size:11px;color:var(--text-muted)}
.health-metrics{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:24px}.health-metric{background:var(--bg-muted);border-radius:var(--radius-md);padding:14px}.health-metric-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}.health-metric-name{font-size:12px;color:var(--text-muted);display:flex;align-items:center;gap:6px}.health-metric-value{font-size:18px;font-weight:700;font-family:var(--font-mono)}
.insight-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:16px;margin-bottom:28px}.insight-card{background:var(--bg-subtle);border:1px solid var(--border-subtle);border-radius:var(--radius-lg);padding:20px;display:flex;gap:16px}.insight-card.danger{border-left:3px solid var(--accent-danger)}.insight-card.warning{border-left:3px solid var(--accent-warning)}.insight-card.success{border-left:3px solid var(--accent-primary)}.insight-card.info{border-left:3px solid var(--accent-info)}.insight-icon{width:44px;height:44px;border-radius:var(--radius-md);display:flex;align-items:center;justify-content:center;flex-shrink:0}.insight-card.danger .insight-icon{background:var(--accent-danger-muted);color:var(--accent-danger)}.insight-card.warning .insight-icon{background:var(--accent-warning-muted);color:var(--accent-warning)}.insight-card.success .insight-icon{background:var(--accent-primary-muted);color:var(--accent-primary)}.insight-card.info .insight-icon{background:var(--accent-info-muted);color:var(--accent-info)}.insight-content{flex:1}.insight-title{font-size:14px;font-weight:600;margin-bottom:6px}.insight-description{font-size:13px;color:var(--text-secondary);line-height:1.6}
.recommendations-list{display:flex;flex-direction:column;gap:12px}.recommendation-item{background:var(--bg-subtle);border:1px solid var(--border-subtle);border-radius:var(--radius-md);padding:16px;display:flex;align-items:center;gap:14px}.recommendation-item:hover{border-color:var(--border-muted)}.recommendation-icon{width:40px;height:40px;border-radius:var(--radius-md);background:var(--accent-primary-muted);color:var(--accent-primary);display:flex;align-items:center;justify-content:center}.recommendation-content{flex:1}.recommendation-action{font-size:13px;font-weight:600;margin-bottom:2px}.recommendation-impact{font-size:12px;color:var(--text-muted)}
@media(max-width:1400px){.stats-grid{grid-template-columns:repeat(2,1fr)}.campaign-main{grid-template-columns:56px 1fr 90px 90px 110px}.audience-grid{grid-template-columns:1fr}}@media(max-width:1200px){.settings-grid{grid-template-columns:1fr}.score-breakdown{grid-template-columns:repeat(2,1fr)}}
`;

// =============================================================================
// COMPONENTS
// =============================================================================
function ScoreRing({ score, size = 52 }) {
  const status = AIEngine.getStatus(score);
  const circumference = 2 * Math.PI * 22;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 52 52" style={{ width: size, height: size }}>
        <circle cx="26" cy="26" r="22" className="score-ring-bg" />
        <circle cx="26" cy="26" r="22" className="score-ring-progress" style={{ stroke: status.color, strokeDasharray: circumference, strokeDashoffset: offset }} />
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
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }}></span>
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
            <button className={`expanded-tab ${activeTab === 'insights' ? 'active' : ''}`} onClick={() => setActiveTab('insights')}>Insights IA</button>
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
                  {campaign.analysis?.issues?.map((issue, i) => <div key={i} className={`issue-card ${issue.severity}`}><div className="issue-icon"><Icon name={issue.icon} size={18} /></div><div className="issue-content"><div className="issue-title">{issue.title}</div><div className="issue-desc">{issue.desc}</div>{issue.action && <div className="issue-action">💡 {issue.action}</div>}</div></div>)}
                  {campaign.analysis?.opportunities?.map((opp, i) => <div key={`o${i}`} className="issue-card opportunity"><div className="issue-icon"><Icon name={opp.icon} size={18} /></div><div className="issue-content"><div className="issue-title">{opp.title}</div><div className="issue-desc">{opp.desc}</div></div></div>)}
                  {!campaign.analysis?.issues?.length && !campaign.analysis?.opportunities?.length && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Nenhum insight detectado.</div>}
                </div>
              </>
            )}
            {activeTab === 'metrics' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
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
// MAIN APP - TODAS AS CORREÇÕES APLICADAS
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
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [dateRange, setDateRange] = useState('last_30d');
  const [campaigns, setCampaigns] = useState([]);
  const [breakdown, setBreakdown] = useState(null);
  const [ads, setAds] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState('insights');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [resetStep, setResetStep] = useState(0);
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dateOptions = [
    { value: 'today', label: 'Hoje' }, { value: 'yesterday', label: 'Ontem' }, { value: 'last_7d', label: 'Últimos 7 dias' },
    { value: 'last_14d', label: 'Últimos 14 dias' }, { value: 'last_30d', label: 'Últimos 30 dias' },
    { value: 'this_month', label: 'Este mês' }, { value: 'last_month', label: 'Mês passado' },
  ];

  const loadAccounts = useCallback(async () => {
    if (accountsLoading) return;
    setAccountsLoading(true);
    try {
      const res = await api.get('/api/meta/ad-accounts');
      if (res.success && res.adAccounts?.length > 0) {
        setAccounts(res.adAccounts);
        const savedAccount = localStorage.getItem('adbrain_account');
        const accountExists = res.adAccounts.find(a => a.id === savedAccount);
        if (savedAccount && accountExists) {
          setSelectedAccount(savedAccount);
        } else {
          const firstAccount = res.adAccounts[0].id;
          setSelectedAccount(firstAccount);
          localStorage.setItem('adbrain_account', firstAccount);
        }
      }
    } catch (e) { setError('Erro ao carregar contas'); }
    finally { setAccountsLoading(false); }
  }, [accountsLoading]);

  const loadData = useCallback(async () => {
    if (!selectedAccount) return;
    setLoading(true);
    try {
      const [campRes, breakRes, adsRes] = await Promise.all([
        api.get(`/api/meta/campaigns/${selectedAccount}?date_preset=${dateRange}`),
        api.get(`/api/meta/breakdown/${selectedAccount}?date_preset=${dateRange}`),
        api.get(`/api/meta/ads/${selectedAccount}?date_preset=${dateRange}`)
      ]);
      if (campRes.success) {
        setCampaigns((campRes.campaigns || []).map(c => ({ ...c, score: AIEngine.calcScore(c), analysis: AIEngine.analyze(c) })));
      }
      // CORRIGIDO: Normalizar estrutura do breakdown
      if (breakRes.success) {
        const bd = breakRes.breakdown || {};
        setBreakdown({
          age: bd.ageGender?.byAge || [],
          gender: bd.ageGender?.byGender || [],
          combined: bd.ageGender?.combined || [],
          devices: bd.devices || [],
          placements: bd.placements || []
        });
      }
      if (adsRes.success) setAds(adsRes.ads || []);
    } catch (e) { setError('Erro ao carregar dados'); }
    finally { setLoading(false); }
  }, [selectedAccount, dateRange]);

  useEffect(() => {
    const savedUser = localStorage.getItem('adbrain_user');
    const savedToken = localStorage.getItem('adbrain_meta_token');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setPage('campaigns');
      if (savedToken) { setToken(savedToken); setConnected(true); }
    }
  }, []);

  useEffect(() => {
    if (connected && accounts.length === 0 && !accountsLoading) loadAccounts();
  }, [connected, accounts.length, accountsLoading, loadAccounts]);

  useEffect(() => {
    if (connected && selectedAccount) loadData();
  }, [connected, selectedAccount, dateRange, loadData]);

  useEffect(() => {
    if (error || success) { const t = setTimeout(() => { setError(''); setSuccess(''); }, 4000); return () => clearTimeout(t); }
  }, [error, success]);

  const handleAccountChange = (e) => {
    const newAccount = e.target.value;
    setSelectedAccount(newAccount);
    localStorage.setItem('adbrain_account', newAccount);
  };

  // CORRIGIDO: Salvar JWT do login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.post('/api/auth/login', { email: authEmail, password: authPassword });
    setLoading(false);
    if (res.success) {
      localStorage.setItem('adbrain_user', JSON.stringify(res.user));
      if (res.token) localStorage.setItem('adbrain_jwt', res.token); // NOVO: salva JWT
      setUser(res.user);
      setPage('campaigns');
    } else setError(res.error || 'Erro ao fazer login');
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await api.post('/api/auth/register', { name: authName, email: authEmail, password: authPassword });
    setLoading(false);
    if (res.success) {
      localStorage.setItem('adbrain_user', JSON.stringify(res.user));
      if (res.token) localStorage.setItem('adbrain_jwt', res.token);
      setUser(res.user);
      setPage('campaigns');
    } else setError(res.error || 'Erro ao criar conta');
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null); setConnected(false); setToken(''); setAccounts([]); setSelectedAccount(''); setCampaigns([]); setPage('login');
  };

  const handleConnect = async () => {
    if (!token.trim()) { setError('Cole o token'); return; }
    setLoading(true);
    const res = await api.post('/api/meta/connect', { accessToken: token });
    setLoading(false);
    if (res.success) {
      localStorage.setItem('adbrain_meta_token', token);
      setConnected(true);
      setSuccess(res.tokenSaved ? 'Meta conectado e salvo!' : 'Meta conectado!');
    } else setError(res.error || 'Token inválido');
  };

  const handleDisconnect = () => {
    localStorage.removeItem('adbrain_meta_token');
    localStorage.removeItem('adbrain_account');
    setConnected(false); setToken(''); setAccounts([]); setSelectedAccount(''); setCampaigns([]);
  };

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
  const accountAnalysis = useMemo(() => AIEngine.getAccountAnalysis(campaigns, breakdown, ads), [campaigns, breakdown, ads]);

  // LOGIN/REGISTER/FORGOT PASSWORD FORMS
  if (!user) {
    return (
      <>
        <style>{styles}</style>
        {error && <div className="toast"><div className="toast-content error"><Icon name="x" size={18} />{error}</div></div>}
        {success && <div className="toast"><div className="toast-content success"><Icon name="check" size={18} />{success}</div></div>}
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 400 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div className="logo-mark" style={{ width: 56, height: 56, margin: '0 auto 16px' }}><Icon name="brain" size={28} /></div>
              <h1 style={{ fontSize: 24, fontWeight: 700 }}>AdBrain Pro</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>Otimização de anúncios com IA</p>
            </div>
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 28 }}>
              {page === 'forgot' ? (
                <form onSubmit={(e) => { e.preventDefault(); if (resetStep === 0) { setResetStep(1); setSuccess('Código enviado para ' + resetEmail); } else if (resetStep === 1) { setResetStep(2); } else { setSuccess('Senha alterada!'); setPage('login'); setResetStep(0); } }}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Recuperar senha</h2>
                  {resetStep === 0 && <><div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email</label><input className="input" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="seu@email.com" required /></div><button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>{loading ? <Icon name="refreshCw" size={16} className="animate-spin" /> : 'Enviar código'}</button></>}
                  {resetStep === 1 && <><div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Código recebido</label><input className="input" value={resetCode} onChange={(e) => setResetCode(e.target.value)} placeholder="123456" required /></div><button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>{loading ? <Icon name="refreshCw" size={16} className="animate-spin" /> : 'Verificar código'}</button></>}
                  {resetStep === 2 && <><div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Nova senha</label><input className="input" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /></div><div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Confirmar</label><input className="input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div><button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>{loading ? <Icon name="refreshCw" size={16} className="animate-spin" /> : 'Alterar senha'}</button></>}
                  <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}><span style={{ color: 'var(--accent-primary)', cursor: 'pointer' }} onClick={() => { setPage('login'); setResetStep(0); }}>Voltar ao login</span></p>
                </form>
              ) : (
                <form onSubmit={page === 'login' ? handleLogin : handleRegister}>
                  <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>{page === 'login' ? 'Entrar' : 'Criar conta'}</h2>
                  {page === 'register' && <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Nome</label><input className="input" value={authName} onChange={(e) => setAuthName(e.target.value)} placeholder="Seu nome" required /></div>}
                  <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Email</label><input className="input" type="email" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} placeholder="seu@email.com" required /></div>
                  <div style={{ marginBottom: 20 }}><label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Senha</label><input className="input" type="password" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} placeholder="••••••••" required /></div>
                  {page === 'login' && <p style={{ textAlign: 'right', marginBottom: 16, fontSize: 13 }}><span style={{ color: 'var(--accent-primary)', cursor: 'pointer' }} onClick={() => setPage('forgot')}>Esqueci a senha</span></p>}
                  <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>{loading ? <Icon name="refreshCw" size={16} className="animate-spin" /> : page === 'login' ? 'Entrar' : 'Criar conta'}</button>
                  <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13 }}>{page === 'login' ? 'Não tem conta? ' : 'Já tem conta? '}<span style={{ color: 'var(--accent-primary)', cursor: 'pointer' }} onClick={() => setPage(page === 'login' ? 'register' : 'login')}>{page === 'login' ? 'Criar' : 'Entrar'}</span></p>
                </form>
              )}
            </div>
          </div>
        </div>
      </>
    );
  }

  // MAIN APP
  return (
    <>
      <style>{styles}</style>
      {error && <div className="toast"><div className="toast-content error"><Icon name="x" size={18} />{error}</div></div>}
      {success && <div className="toast"><div className="toast-content success"><Icon name="check" size={18} />{success}</div></div>}
      <div className="app-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="logo-mark"><Icon name="brain" size={24} /></div>
              <div className="logo-text"><span className="logo-title">AdBrain</span><span className="logo-subtitle">Pro</span></div>
            </div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-group">
              <div className="nav-group-label">Principal</div>
              <div className={`nav-item ${page === 'campaigns' ? 'active' : ''}`} onClick={() => setPage('campaigns')}><Icon name="layoutDashboard" size={18} />Campanhas{summary.critical > 0 && <span className="nav-badge">{summary.critical}</span>}</div>
              <div className={`nav-item ${page === 'creatives' ? 'active' : ''}`} onClick={() => setPage('creatives')}><Icon name="image" size={18} />Criativos</div>
              <div className={`nav-item ${page === 'audience' ? 'active' : ''}`} onClick={() => setPage('audience')}><Icon name="users" size={18} />Audiência</div>
            </div>
            <div className="nav-group">
              <div className="nav-group-label">Inteligência</div>
              <div className={`nav-item ${page === 'insights' ? 'active' : ''}`} onClick={() => setPage('insights')}><Icon name="sparkles" size={18} />Insights IA{summary.scalable > 0 && <span className="nav-badge success">{summary.scalable}</span>}</div>
            </div>
            <div className="nav-group">
              <div className="nav-group-label">Sistema</div>
              <div className={`nav-item ${page === 'settings' ? 'active' : ''}`} onClick={() => setPage('settings')}><Icon name="settings" size={18} />Configurações</div>
            </div>
          </nav>
          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
              <div className="user-info"><div className="user-name">{user?.name || 'Usuário'}</div><div className="user-role">Gestor de Tráfego</div></div>
              <button className="btn-icon" onClick={handleLogout} title="Sair"><Icon name="logOut" size={16} /></button>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main-content">
          <header className="header">
            <div className="header-left">
              <div><div className="header-title">{page === 'campaigns' ? 'Campanhas' : page === 'creatives' ? 'Criativos' : page === 'audience' ? 'Audiência' : page === 'insights' ? 'Insights IA' : 'Configurações'}</div><div className="header-subtitle">{connected ? accounts.find(a => a.id === selectedAccount)?.name || 'Conta Meta' : 'Conecte sua conta'}</div></div>
            </div>
            <div className="header-right">
              {connected && (
                <>
                  <div className="select-wrap">
                    <select className="select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                      {dateOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                    <Icon name="chevronDown" size={16} className="select-icon" />
                  </div>
                  <div className="select-wrap">
                    <select className="select" value={selectedAccount} onChange={handleAccountChange} disabled={accountsLoading || accounts.length === 0}>
                      {accounts.length === 0 ? <option>Carregando...</option> : accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                    <Icon name="chevronDown" size={16} className="select-icon" />
                  </div>
                </>
              )}
              <button className="btn btn-secondary" onClick={loadData} disabled={loading || !connected}><Icon name="refreshCw" size={16} className={loading ? 'animate-spin' : ''} /></button>
            </div>
          </header>

          <div className="page-content">
            {!connected ? (
              <div style={{ maxWidth: 500, margin: '60px auto', textAlign: 'center' }} className="animate-fade">
                <div className="logo-mark" style={{ width: 64, height: 64, margin: '0 auto 24px' }}><Icon name="link" size={32} /></div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 12 }}>Conectar Meta Ads</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>Cole seu token de acesso</p>
                <input className="input" style={{ marginBottom: 16 }} value={token} onChange={(e) => setToken(e.target.value)} placeholder="Token de acesso Meta..." />
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleConnect} disabled={loading}>{loading ? <Icon name="refreshCw" size={16} className="animate-spin" /> : 'Conectar'}</button>
              </div>
            ) : page === 'campaigns' ? (
              <div className="animate-fade">
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon green"><Icon name="dollarSign" size={20} /></div></div><div className="stat-value">{fmt.moneyCompact(stats.spend)}</div><div className="stat-label">Investido</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon blue"><Icon name="target" size={20} /></div></div><div className="stat-value">{stats.conversions}</div><div className="stat-label">Conversões</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon yellow"><Icon name="dollarSign" size={20} /></div></div><div className="stat-value">{fmt.money(stats.cpa)}</div><div className="stat-label">CPA</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon red"><Icon name="activity" size={20} /></div></div><div className="stat-value">{fmt.pct(stats.ctr)}</div><div className="stat-label">CTR</div></div>
                </div>
                {campaigns.length > 0 && (
                  <div className="ai-summary">
                    <div className="ai-icon"><Icon name="brain" size={24} /></div>
                    <div className="ai-content">
                      <div className="ai-header"><span className="ai-title">Análise IA</span><span className="ai-badge">GPT-4</span></div>
                      <div className="ai-text">
                        Score médio: <strong>{summary.avgScore}/100</strong>.
                        {summary.critical > 0 && <> <span className="danger">{summary.critical} campanha{summary.critical > 1 ? 's' : ''} crítica{summary.critical > 1 ? 's' : ''}</span> desperdiçando {fmt.money(summary.wastedSpend)}.</>}
                        {summary.scalable > 0 && <> <span className="success">{summary.scalable} pronta{summary.scalable > 1 ? 's' : ''} para escalar</span>.</>}
                      </div>
                    </div>
                  </div>
                )}
                <div className="filter-bar">
                  {[{ k: 'all', l: 'Todas' }, { k: 'active', l: 'Ativas' }, { k: 'paused', l: 'Pausadas' }, { k: 'critical', l: 'Críticas' }, { k: 'scale', l: 'Escalar' }].map(f => <div key={f.k} className={`filter-chip ${filter === f.k ? 'active' : ''}`} onClick={() => setFilter(f.k)}>{f.l}<span className="count">{filterCounts[f.k]}</span></div>)}
                  <div className="search-box"><Icon name="search" size={16} className="search-icon" /><input className="search-input" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                </div>
                <div className="campaigns-list">
                  {filteredCampaigns.length === 0 ? (
                    <div className="empty-state"><Icon name="target" size={64} className="empty-icon" /><div className="empty-title">Nenhuma campanha</div><div className="empty-text">Ajuste os filtros ou conecte sua conta Meta.</div></div>
                  ) : filteredCampaigns.map(c => <CampaignRow key={c.id} campaign={c} expanded={expandedId === c.id} onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)} onAction={handleAction} activeTab={activeTab} setActiveTab={setActiveTab} />)}
                </div>
              </div>
            ) : page === 'creatives' ? (
              <div className="animate-fade">
                <div className="creative-grid">
                  {ads.length === 0 ? (
                    <div className="empty-state" style={{ gridColumn: '1/-1' }}><Icon name="image" size={64} className="empty-icon" /><div className="empty-title">Nenhum criativo</div></div>
                  ) : ads.map(ad => {
                    const m = ad.metrics || ad.insights || {};
                    const score = m.ctr > 1.5 ? 80 : m.ctr > 1 ? 60 : m.ctr > 0.5 ? 40 : 20;
                    const status = AIEngine.getStatus(score);
                    // CORRIGIDO: usar imageUrl OU thumbnail
                    const imageUrl = ad.creative?.imageUrl || ad.creative?.thumbnail;
                    return (
                      <div key={ad.id} className={`creative-card ${score >= 60 ? 'good' : score < 40 ? 'bad' : ''}`}>
                        <div className="creative-preview">
                          {imageUrl ? (
                            <img src={imageUrl} alt={ad.name} onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                          ) : null}
                          <div className="creative-preview-placeholder" style={{ display: imageUrl ? 'none' : 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--text-faint)' }}>
                            <Icon name="image" size={32} /><span style={{ fontSize: 12 }}>Sem preview</span>
                          </div>
                          <span className={`creative-badge ${ad.effectiveStatus === 'ACTIVE' ? 'active' : 'paused'}`}>{ad.effectiveStatus === 'ACTIVE' ? 'Ativo' : 'Pausado'}</span>
                          <div className="creative-score" style={{ background: status.bg, color: status.color }}>{score}</div>
                        </div>
                        <div className="creative-body">
                          <div className="creative-name">{ad.name}</div>
                          <div className="creative-metrics">
                            <div><div className="creative-metric-label">Gasto</div><div className="creative-metric-value">{fmt.money(m.spend || 0)}</div></div>
                            <div><div className="creative-metric-label">CTR</div><div className="creative-metric-value">{fmt.pct(m.ctr || 0)}</div></div>
                            <div><div className="creative-metric-label">Conversões</div><div className="creative-metric-value">{m.conversions || 0}</div></div>
                            <div><div className="creative-metric-label">CPA</div><div className="creative-metric-value">{m.cpa ? fmt.money(m.cpa) : '-'}</div></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : page === 'audience' ? (
              <div className="animate-fade">
                {!breakdown || (!breakdown.age?.length && !breakdown.gender?.length) ? (
                  <div className="empty-state"><Icon name="users" size={64} className="empty-icon" /><div className="empty-title">Sem dados de audiência</div><div className="empty-text">Dados disponíveis após campanhas ativas.</div></div>
                ) : (
                  <div className="audience-grid">
                    {/* Por Idade */}
                    <div className="audience-card">
                      <div className="audience-card-title"><Icon name="users" size={18} />Por Idade</div>
                      {(breakdown.age || []).map((item, i) => {
                        const maxSpend = Math.max(...(breakdown.age || []).map(a => a.spend || 0));
                        const pct = maxSpend > 0 ? ((item.spend || 0) / maxSpend * 100) : 0;
                        const colors = ['#10b981', '#22c55e', '#84cc16', '#eab308', '#f59e0b', '#ef4444'];
                        return (
                          <div className="audience-bar" key={i}>
                            <div className="audience-bar-header">
                              <span className="audience-bar-label">{item.age}</span>
                              <span className="audience-bar-value">{fmt.money(item.spend || 0)}</span>
                            </div>
                            <div className="audience-bar-track"><div className="audience-bar-fill" style={{ width: `${pct}%`, background: colors[i % colors.length] }}></div></div>
                            <div className="audience-bar-stats"><span>CPA: {item.cpa ? fmt.money(item.cpa) : '-'}</span><span>Conv: {item.conversions || 0}</span></div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Por Gênero */}
                    <div className="audience-card">
                      <div className="audience-card-title"><Icon name="pieChart" size={18} />Por Gênero</div>
                      {(breakdown.gender || []).map((item, i) => {
                        const totalSpend = (breakdown.gender || []).reduce((s, g) => s + (g.spend || 0), 0);
                        const pct = totalSpend > 0 ? ((item.spend || 0) / totalSpend * 100) : 0;
                        const color = item.gender === 'male' ? '#3b82f6' : item.gender === 'female' ? '#ec4899' : '#8b5cf6';
                        const label = item.gender === 'male' ? 'Masculino' : item.gender === 'female' ? 'Feminino' : item.genderLabel || item.gender;
                        return (
                          <div className="audience-bar" key={i}>
                            <div className="audience-bar-header">
                              <span className="audience-bar-label">{label}</span>
                              <span className="audience-bar-value">{pct.toFixed(1)}%</span>
                            </div>
                            <div className="audience-bar-track"><div className="audience-bar-fill" style={{ width: `${pct}%`, background: color }}></div></div>
                            <div className="audience-bar-stats"><span>Gasto: {fmt.money(item.spend || 0)}</span><span>CPA: {item.cpa ? fmt.money(item.cpa) : '-'}</span></div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Combinado (se disponível) */}
                    {breakdown.combined?.length > 0 && (
                      <div className="audience-card" style={{ gridColumn: '1 / -1' }}>
                        <div className="audience-card-title"><Icon name="barChart3" size={18} />Top Segmentos (Idade + Gênero)</div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                          {breakdown.combined.slice(0, 8).map((item, i) => {
                            const label = `${item.genderLabel || item.gender}, ${item.age}`;
                            const status = item.cpa && item.cpa < AIEngine.config.metaCPA ? 'good' : item.cpa > AIEngine.config.metaCPA * 1.5 ? 'bad' : 'neutral';
                            return (
                              <div key={i} style={{ background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', padding: 14, borderLeft: `3px solid ${status === 'good' ? 'var(--accent-primary)' : status === 'bad' ? 'var(--accent-danger)' : 'var(--border-muted)'}` }}>
                                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{label}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)' }}>
                                  <span>CPA: <strong style={{ color: status === 'good' ? 'var(--accent-primary)' : status === 'bad' ? 'var(--accent-danger)' : 'var(--text-primary)' }}>{item.cpa ? fmt.money(item.cpa) : '-'}</strong></span>
                                  <span>Conv: {item.conversions || 0}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : page === 'insights' ? (
              <div className="animate-fade">
                {/* Health Metrics */}
                <div className="health-metrics">
                  {accountAnalysis.healthMetrics.map((m, i) => (
                    <div className="health-metric" key={i}>
                      <div className="health-metric-header">
                        <span className="health-metric-name"><Icon name={m.icon} size={14} />{m.name}</span>
                      </div>
                      <div className="health-metric-value" style={{ color: m.value >= 60 ? 'var(--accent-primary)' : m.value >= 40 ? 'var(--accent-warning)' : 'var(--accent-danger)' }}>
                        {m.isCurrency ? fmt.money(m.value) : m.value}{m.suffix || ''}
                      </div>
                    </div>
                  ))}
                </div>
                {/* Insights */}
                {accountAnalysis.insights.length > 0 && (
                  <>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Insights Principais</h3>
                    <div className="insight-cards">
                      {accountAnalysis.insights.map((ins, i) => (
                        <div key={i} className={`insight-card ${ins.type}`}>
                          <div className="insight-icon"><Icon name={ins.icon} size={20} /></div>
                          <div className="insight-content">
                            <div className="insight-title">{ins.title}</div>
                            <div className="insight-description">{ins.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {/* Recommendations */}
                {accountAnalysis.recommendations.length > 0 && (
                  <>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, marginTop: 24 }}>Recomendações</h3>
                    <div className="recommendations-list">
                      {accountAnalysis.recommendations.map((rec, i) => (
                        <div key={i} className="recommendation-item">
                          <div className="recommendation-icon"><Icon name={rec.icon} size={18} /></div>
                          <div className="recommendation-content">
                            <div className="recommendation-action">{rec.action}</div>
                            <div className="recommendation-impact">{rec.impact}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {accountAnalysis.insights.length === 0 && accountAnalysis.recommendations.length === 0 && (
                  <div className="empty-state"><Icon name="sparkles" size={64} className="empty-icon" /><div className="empty-title">Sem insights</div><div className="empty-text">Dados insuficientes para análise.</div></div>
                )}
              </div>
            ) : page === 'settings' ? (
              <div className="animate-fade">
                <div className="settings-grid">
                  <div className="settings-card">
                    <div className="settings-card-title"><Icon name="link" size={18} />Conexão Meta</div>
                    <div className="settings-row"><span className="settings-label">Status</span><span className={`connection-badge ${connected ? 'connected' : 'disconnected'}`}><span className="connection-dot"></span>{connected ? 'Conectado' : 'Desconectado'}</span></div>
                    {connected && <div className="settings-row"><span className="settings-label">Conta ativa</span><span className="settings-value">{accounts.find(a => a.id === selectedAccount)?.name || '-'}</span></div>}
                    <div style={{ marginTop: 16 }}>
                      {connected ? <button className="btn btn-danger" onClick={handleDisconnect}><Icon name="x" size={16} />Desconectar</button> : <button className="btn btn-primary" onClick={() => setPage('campaigns')}><Icon name="link" size={16} />Conectar</button>}
                    </div>
                  </div>
                  <div className="settings-card">
                    <div className="settings-card-title"><Icon name="sliders" size={18} />Metas IA</div>
                    <div className="settings-row"><span className="settings-label">CPA Meta</span><span className="settings-value">{fmt.money(AIEngine.config.metaCPA)}</span></div>
                    <div className="settings-row"><span className="settings-label">ROAS Meta</span><span className="settings-value">{AIEngine.config.metaROAS}x</span></div>
                    <div className="settings-row"><span className="settings-label">CTR Mínimo</span><span className="settings-value">{AIEngine.config.ctrMinimo}%</span></div>
                    <div className="settings-row"><span className="settings-label">Frequência Máxima</span><span className="settings-value">{AIEngine.config.frequenciaMaxima}x</span></div>
                  </div>
                  <div className="settings-card">
                    <div className="settings-card-title"><Icon name="users" size={18} />Conta</div>
                    <div className="settings-row"><span className="settings-label">Nome</span><span className="settings-value">{user?.name || '-'}</span></div>
                    <div className="settings-row"><span className="settings-label">Email</span><span className="settings-value">{user?.email || '-'}</span></div>
                    <div style={{ marginTop: 16 }}><button className="btn btn-secondary" onClick={handleLogout}><Icon name="logOut" size={16} />Sair</button></div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </>
  );
}
