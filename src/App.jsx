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
    user: <><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
    logOut: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></>,
    refreshCw: <><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></>,
    check: <polyline points="20 6 9 17 4 12"/>,
    x: <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>,
    alertTriangle: <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4M12 17h.01"/></>,
    play: <polygon points="5 3 19 12 5 21 5 3"/>,
    pause: <><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></>,
    chevronDown: <polyline points="6 9 12 15 18 9"/>,
    chevronUp: <polyline points="18 15 12 9 6 15"/>,
    chevronRight: <polyline points="9 18 15 12 9 6"/>,
    search: <><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></>,
    dollarSign: <><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    trendingUp: <><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></>,
    trendingDown: <><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></>,
    barChart3: <><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></>,
    pieChart: <><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></>,
    activity: <><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></>,
    zap: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    rocket: <><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></>,
    flame: <><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></>,
    alertCircle: <><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></>,
    checkCircle: <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></>,
    xCircle: <><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></>,
    eye: <><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></>,
    externalLink: <><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></>,
    moreVertical: <><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></>,
    arrowUp: <><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></>,
    arrowDown: <><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></>,
    arrowRight: <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>,
    sparkles: <><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></>,
    lightbulb: <><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></>,
    sliders: <><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/><line x1="2" x2="6" y1="14" y2="14"/><line x1="10" x2="14" y1="8" y2="8"/><line x1="18" x2="22" y1="16" y2="16"/></>,
    link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></>,
    trophy: <><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></>,
    award: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></>,
    star: <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
    heart: <><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></>,
    thumbsUp: <><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></>,
    thumbsDown: <><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></>,
    percent: <><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    calendar: <><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></>,
    mapPin: <><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    smartphone: <><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></>,
    monitor: <><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></>,
    instagram: <><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></>,
    facebook: <><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></>,
    messageCircle: <><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></>,
    mail: <><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></>,
    filter: <><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></>,
    layers: <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    grid: <><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></>,
    copy: <><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    trash: <><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></>,
    video: <><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></>,
    mousePointer: <><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></>,
    maximize2: <><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></>,
    crown: <><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></>,
    gem: <><path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/></>,
    wallet: <><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></>,
    shoppingBag: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></>,
    package: <><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></>,
    tag: <><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></>,
    info: <><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></>,
    helpCircle: <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></>,
    lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    shieldCheck: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></>,
    gauge: <><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></>,
    send: <><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    share2: <><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></>,
    repeat: <><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></>,
    power: <><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" x2="12" y1="2" y2="12"/></>,
    plusCircle: <><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/></>,
    minusCircle: <><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></>,
    plus: <><path d="M5 12h14"/><path d="M12 5v14"/></>,
    minus: <><path d="M5 12h14"/></>,
    male: <><circle cx="10" cy="14" r="5"/><path d="M19 5l-5.4 5.4"/><path d="M15 5h4v4"/></>,
    female: <><circle cx="12" cy="8" r="5"/><path d="M12 13v9"/><path d="M9 18h6"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>{icons[name] || icons.alertCircle}</svg>;
};

// =============================================================================
// FORMATTERS
// =============================================================================
const fmt = {
  money: (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v || 0),
  moneyCompact: (v) => {
    if (!v) return 'R$ 0';
    if (v >= 1000000) return `R$ ${(v/1000000).toFixed(1)}M`;
    if (v >= 1000) return `R$ ${(v/1000).toFixed(1)}K`;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  },
  num: (v) => new Intl.NumberFormat('pt-BR').format(Math.round(v || 0)),
  numCompact: (v) => {
    if (!v) return '0';
    if (v >= 1000000) return `${(v/1000000).toFixed(1)}M`;
    if (v >= 1000) return `${(v/1000).toFixed(1)}K`;
    return new Intl.NumberFormat('pt-BR').format(Math.round(v));
  },
  pct: (v) => `${(v || 0).toFixed(2)}%`,
};

// =============================================================================
// AI ENGINE
// =============================================================================
const AIEngine = {
  config: { metaCPA: 150, metaROAS: 3, ctrMinimo: 1, frequenciaMaxima: 3 },

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
    }
    const total = Math.round(scores.cpa * 0.40 + scores.ctr * 0.25 + scores.freq * 0.15 + scores.roas * 0.20);
    return { total: Math.max(0, Math.min(100, total)), breakdown: scores };
  },

  getStatus: (score) => {
    if (score >= 80) return { label: 'Excelente', color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: 'trophy' };
    if (score >= 65) return { label: 'Bom', color: '#22c55e', bg: 'rgba(34,197,94,0.15)', icon: 'thumbsUp' };
    if (score >= 45) return { label: 'Atenção', color: '#eab308', bg: 'rgba(234,179,8,0.15)', icon: 'alertTriangle' };
    if (score >= 25) return { label: 'Alerta', color: '#f97316', bg: 'rgba(249,115,22,0.15)', icon: 'alertCircle' };
    return { label: 'Crítico', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', icon: 'flame' };
  },

  analyze: (campaign) => {
    const ins = campaign.insights || {};
    const cfg = AIEngine.config;
    const issues = [], opportunities = [];
    
    if (ins.spend > 100 && ins.conversions === 0) {
      issues.push({ severity: 'critical', icon: 'flame', title: 'Sem conversões', desc: `${fmt.money(ins.spend)} gastos sem resultado` });
    }
    if (ins.cpa > cfg.metaCPA * 1.5) {
      issues.push({ severity: 'critical', icon: 'alertTriangle', title: 'CPA alto', desc: `CPA ${Math.round((ins.cpa / cfg.metaCPA - 1) * 100)}% acima da meta` });
    }
    if (ins.frequency > cfg.frequenciaMaxima * 1.3) {
      issues.push({ severity: 'warning', icon: 'eye', title: 'Frequência alta', desc: `${ins.frequency?.toFixed(1)}x - público saturado` });
    }
    if (ins.ctr < cfg.ctrMinimo * 0.5 && ins.impressions > 1000) {
      issues.push({ severity: 'warning', icon: 'image', title: 'CTR baixo', desc: `${ins.ctr?.toFixed(2)}% - melhore os criativos` });
    }
    if (ins.cpa > 0 && ins.cpa < cfg.metaCPA * 0.7 && ins.conversions >= 2) {
      opportunities.push({ icon: 'rocket', title: 'Escalar', desc: `CPA ${Math.round((1 - ins.cpa / cfg.metaCPA) * 100)}% abaixo da meta` });
    }
    if (ins.roas >= cfg.metaROAS * 1.3) {
      opportunities.push({ icon: 'trendingUp', title: 'ROAS alto', desc: `${ins.roas?.toFixed(2)}x - aumente investimento` });
    }
    return { issues, opportunities };
  },

  getSummary: (campaigns) => {
    const critical = campaigns.filter(c => (c.score?.total || c.healthScore || 0) < 30);
    const scalable = campaigns.filter(c => (c.score?.total || c.healthScore || 0) >= 70 && (c.insights?.conversions || 0) > 0);
    return { critical: critical.length, scalable: scalable.length };
  },
};
// =============================================================================
// STYLES
// =============================================================================
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

:root {
  --bg-base: #09090b; --bg-subtle: #0c0c0e; --bg-muted: #141417; --bg-elevated: #1a1a1f; --bg-hover: #222228;
  --border-subtle: rgba(255,255,255,0.06); --border-muted: rgba(255,255,255,0.1);
  --text-primary: #fafafa; --text-secondary: #a1a1aa; --text-muted: #71717a; --text-faint: #52525b;
  --accent-primary: #10b981; --accent-primary-hover: #059669; --accent-primary-muted: rgba(16,185,129,0.12);
  --accent-danger: #ef4444; --accent-danger-hover: #dc2626; --accent-danger-muted: rgba(239,68,68,0.1);
  --accent-warning: #f59e0b; --accent-warning-muted: rgba(245,158,11,0.1);
  --accent-info: #3b82f6; --accent-info-muted: rgba(59,130,246,0.1);
  --accent-purple: #8b5cf6; --accent-purple-muted: rgba(139,92,246,0.1);
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'SF Mono', 'Fira Code', monospace;
  --radius-sm: 6px; --radius-md: 10px; --radius-lg: 14px; --radius-xl: 20px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: var(--font-sans); background: var(--bg-base); color: var(--text-primary); line-height: 1.5; }

::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-muted); border-radius: 3px; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.animate-spin { animation: spin 1s linear infinite; }

.app-layout { display: flex; min-height: 100vh; }

/* Sidebar */
.sidebar { width: 240px; background: var(--bg-subtle); border-right: 1px solid var(--border-subtle); position: fixed; top: 0; left: 0; height: 100vh; display: flex; flex-direction: column; z-index: 100; }
.sidebar-header { padding: 20px 16px; border-bottom: 1px solid var(--border-subtle); }
.sidebar-logo { display: flex; align-items: center; gap: 12px; }
.logo-mark { width: 38px; height: 38px; background: linear-gradient(135deg, var(--accent-primary) 0%, #059669 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 20px rgba(16,185,129,0.3); }
.logo-mark svg { stroke: white; }
.logo-title { font-size: 18px; font-weight: 700; }
.logo-subtitle { font-size: 9px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--accent-primary); }
.sidebar-nav { flex: 1; padding: 16px 10px; overflow-y: auto; }
.nav-group { margin-bottom: 20px; }
.nav-group-label { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-faint); padding: 0 12px; margin-bottom: 8px; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-md); font-size: 13px; font-weight: 500; color: var(--text-secondary); cursor: pointer; transition: all 0.15s; margin-bottom: 2px; position: relative; }
.nav-item:hover { background: var(--bg-hover); color: var(--text-primary); }
.nav-item.active { background: var(--accent-primary-muted); color: var(--accent-primary); }
.nav-item.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 16px; background: var(--accent-primary); border-radius: 0 2px 2px 0; }
.nav-badge { margin-left: auto; min-width: 18px; height: 18px; padding: 0 5px; background: var(--accent-danger); color: white; font-size: 9px; font-weight: 700; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
.nav-badge.success { background: var(--accent-primary); }

/* Main */
.main-content { flex: 1; margin-left: 240px; min-height: 100vh; display: flex; flex-direction: column; }

/* Header */
.header { height: 64px; background: var(--bg-subtle); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; justify-content: space-between; padding: 0 24px; position: sticky; top: 0; z-index: 50; }
.header-left { display: flex; align-items: center; gap: 16px; }
.header-title { font-size: 18px; font-weight: 700; }
.header-subtitle { font-size: 12px; color: var(--text-muted); }
.header-right { display: flex; align-items: center; gap: 10px; }

/* Select */
.select-wrap { position: relative; }
.select { appearance: none; background: var(--bg-muted); border: 1px solid var(--border-subtle); color: var(--text-primary); padding: 8px 32px 8px 12px; border-radius: var(--radius-md); font-size: 12px; font-weight: 500; font-family: var(--font-sans); cursor: pointer; min-width: 140px; }
.select:focus { outline: none; border-color: var(--accent-primary); }
.select-icon { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-muted); }

/* Buttons */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 14px; border-radius: var(--radius-md); font-size: 12px; font-weight: 600; font-family: var(--font-sans); cursor: pointer; transition: all 0.15s; border: none; }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary { background: var(--accent-primary); color: white; }
.btn-primary:hover:not(:disabled) { background: var(--accent-primary-hover); }
.btn-secondary { background: var(--bg-muted); color: var(--text-primary); border: 1px solid var(--border-subtle); }
.btn-secondary:hover:not(:disabled) { background: var(--bg-hover); }
.btn-danger { background: var(--accent-danger); color: white; }
.btn-danger:hover:not(:disabled) { background: var(--accent-danger-hover); }
.btn-ghost { background: transparent; color: var(--text-secondary); }
.btn-ghost:hover { background: var(--bg-hover); color: var(--text-primary); }
.btn-sm { padding: 6px 10px; font-size: 11px; }
.btn-icon { width: 32px; height: 32px; padding: 0; border-radius: var(--radius-md); background: var(--bg-muted); border: 1px solid var(--border-subtle); color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
.btn-icon:hover { background: var(--bg-hover); color: var(--text-primary); }
.btn-icon.active { background: var(--accent-primary-muted); color: var(--accent-primary); border-color: var(--accent-primary); }

/* Page */
.page-content { flex: 1; padding: 20px 24px; }

/* Stats */
.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
.stat-card { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 16px; position: relative; overflow: hidden; }
.stat-card::before { content: ''; position: absolute; top: 0; right: 0; width: 80px; height: 80px; background: radial-gradient(circle, var(--accent-primary-muted) 0%, transparent 70%); opacity: 0.5; }
.stat-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.stat-icon { width: 36px; height: 36px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
.stat-icon.green { background: var(--accent-primary-muted); color: var(--accent-primary); }
.stat-icon.red { background: var(--accent-danger-muted); color: var(--accent-danger); }
.stat-icon.yellow { background: var(--accent-warning-muted); color: var(--accent-warning); }
.stat-icon.blue { background: var(--accent-info-muted); color: var(--accent-info); }
.stat-icon.purple { background: var(--accent-purple-muted); color: var(--accent-purple); }
.stat-value { font-size: 24px; font-weight: 700; letter-spacing: -1px; margin-bottom: 2px; }
.stat-label { font-size: 11px; color: var(--text-muted); font-weight: 500; }
.stat-change { display: inline-flex; align-items: center; gap: 2px; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; margin-top: 6px; }
.stat-change.up { background: var(--accent-primary-muted); color: var(--accent-primary); }
.stat-change.down { background: var(--accent-danger-muted); color: var(--accent-danger); }

/* Cards */
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; margin-bottom: 20px; }
.creative-card { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; transition: all 0.2s; cursor: pointer; }
.creative-card:hover { border-color: var(--border-muted); transform: translateY(-2px); }
.creative-card.top-performer { border-color: rgba(16,185,129,0.3); }
.card-thumbnail { width: 100%; height: 140px; background: var(--bg-muted); overflow: hidden; }
.card-thumbnail img { width: 100%; height: 100%; object-fit: cover; }
.card-body { padding: 14px; }
.card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.card-score { width: 38px; height: 38px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; }
.card-badge { padding: 3px 8px; border-radius: 4px; font-size: 9px; font-weight: 700; text-transform: uppercase; }
.card-badge.success { background: var(--accent-primary-muted); color: var(--accent-primary); }
.card-badge.warning { background: var(--accent-warning-muted); color: var(--accent-warning); }
.card-badge.danger { background: var(--accent-danger-muted); color: var(--accent-danger); }
.card-title { font-size: 13px; font-weight: 600; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.card-subtitle { font-size: 11px; color: var(--text-muted); }
.card-metrics { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 12px; padding-top: 12px; border-top: 1px solid var(--border-subtle); }
.card-metric { text-align: center; }
.card-metric-value { font-size: 13px; font-weight: 600; }
.card-metric-label { font-size: 9px; color: var(--text-muted); text-transform: uppercase; }

/* AI Summary */
.ai-summary { background: linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(59,130,246,0.08) 100%); border: 1px solid rgba(16,185,129,0.2); border-radius: var(--radius-lg); padding: 18px 20px; margin-bottom: 20px; display: flex; gap: 16px; }
.ai-icon { width: 42px; height: 42px; background: linear-gradient(135deg, var(--accent-primary) 0%, #059669 100%); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.ai-icon svg { stroke: white; }
.ai-content { flex: 1; }
.ai-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
.ai-title { font-size: 14px; font-weight: 600; }
.ai-badge { background: var(--accent-primary); color: white; font-size: 8px; font-weight: 700; padding: 2px 6px; border-radius: 3px; }
.ai-text { font-size: 13px; color: var(--text-secondary); line-height: 1.6; }
.ai-text strong { color: var(--text-primary); }
.ai-text .danger { color: var(--accent-danger); }
.ai-text .success { color: var(--accent-primary); }
.ai-actions { display: flex; gap: 8px; margin-top: 12px; }

/* Audience */
.audience-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 20px; }
.audience-card { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; }
.audience-title { font-size: 14px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
.audience-item { display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border-subtle); }
.audience-item:last-child { border-bottom: none; padding-bottom: 0; }
.audience-item:first-of-type { padding-top: 0; }
.audience-rank { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
.audience-rank.gold { background: linear-gradient(135deg, #fbbf24, #f59e0b); color: #000; }
.audience-rank.silver { background: linear-gradient(135deg, #9ca3af, #6b7280); color: #fff; }
.audience-rank.bronze { background: linear-gradient(135deg, #d97706, #b45309); color: #fff; }
.audience-rank.normal { background: var(--bg-elevated); color: var(--text-muted); }
.audience-info { flex: 1; min-width: 0; }
.audience-name { font-size: 13px; font-weight: 500; margin-bottom: 2px; }
.audience-stats { font-size: 11px; color: var(--text-muted); }
.audience-bar { width: 80px; height: 6px; background: var(--bg-elevated); border-radius: 3px; overflow: hidden; }
.audience-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }
.audience-bar-fill.green { background: var(--accent-primary); }
.audience-bar-fill.yellow { background: var(--accent-warning); }
.audience-bar-fill.red { background: var(--accent-danger); }
.audience-value { font-size: 12px; font-weight: 600; text-align: right; min-width: 70px; }
.audience-cpa { font-size: 10px; color: var(--text-muted); text-align: right; }

/* Insight Cards */
.insights-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; margin-bottom: 20px; }
.insight-card { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 16px; display: flex; gap: 14px; }
.insight-card.success { border-left: 3px solid var(--accent-primary); }
.insight-card.warning { border-left: 3px solid var(--accent-warning); }
.insight-card.danger { border-left: 3px solid var(--accent-danger); }
.insight-card.info { border-left: 3px solid var(--accent-info); }
.insight-icon { width: 40px; height: 40px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.insight-card.success .insight-icon { background: var(--accent-primary-muted); color: var(--accent-primary); }
.insight-card.warning .insight-icon { background: var(--accent-warning-muted); color: var(--accent-warning); }
.insight-card.danger .insight-icon { background: var(--accent-danger-muted); color: var(--accent-danger); }
.insight-card.info .insight-icon { background: var(--accent-info-muted); color: var(--accent-info); }
.insight-content { flex: 1; }
.insight-title { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
.insight-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.5; }
.insight-action { margin-top: 10px; }

/* Filter */
.filter-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.filter-chip { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; background: var(--bg-muted); border: 1px solid var(--border-subtle); border-radius: 20px; font-size: 11px; font-weight: 500; color: var(--text-secondary); cursor: pointer; transition: all 0.15s; }
.filter-chip:hover { border-color: var(--border-muted); color: var(--text-primary); }
.filter-chip.active { background: var(--accent-primary-muted); border-color: var(--accent-primary); color: var(--accent-primary); }
.filter-chip .count { background: var(--bg-elevated); padding: 1px 5px; border-radius: 8px; font-size: 9px; }
.search-box { position: relative; margin-left: auto; }
.search-input { background: var(--bg-muted); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 7px 12px 7px 32px; font-size: 12px; color: var(--text-primary); width: 200px; }
.search-input:focus { outline: none; border-color: var(--accent-primary); width: 260px; }
.search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }

/* Campaigns */
.campaigns-list { display: flex; flex-direction: column; gap: 8px; }
.campaign-row { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); overflow: hidden; }
.campaign-row:hover { border-color: var(--border-muted); }
.campaign-row.expanded { border-color: var(--accent-primary); }
.campaign-main { display: grid; grid-template-columns: 48px 1fr 100px 100px 80px 120px; align-items: center; gap: 14px; padding: 14px 16px; cursor: pointer; }

/* Score Ring */
.score-ring { width: 42px; height: 42px; position: relative; }
.score-ring svg { width: 42px; height: 42px; transform: rotate(-90deg); }
.score-ring-bg { fill: none; stroke: var(--bg-elevated); stroke-width: 4; }
.score-ring-progress { fill: none; stroke-width: 4; stroke-linecap: round; }
.score-ring-value { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 11px; font-weight: 700; }

/* Campaign Info */
.campaign-info { min-width: 0; }
.campaign-name { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 2px; }
.campaign-meta { display: flex; align-items: center; gap: 8px; }
.campaign-status { display: inline-flex; align-items: center; gap: 4px; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 600; text-transform: uppercase; }
.campaign-status.active { background: var(--accent-primary-muted); color: var(--accent-primary); }
.campaign-status.paused { background: var(--bg-elevated); color: var(--text-muted); }
.campaign-objective { font-size: 10px; color: var(--text-muted); }
.metric-cell { text-align: right; }
.metric-value { font-size: 13px; font-weight: 600; margin-bottom: 1px; }
.metric-value.good { color: var(--accent-primary); }
.metric-value.warning { color: var(--accent-warning); }
.metric-value.bad { color: var(--accent-danger); }
.metric-label { font-size: 9px; color: var(--text-muted); text-transform: uppercase; }
.campaign-actions { display: flex; gap: 4px; justify-content: flex-end; }

/* Expanded */
.campaign-expanded { border-top: 1px solid var(--border-subtle); background: var(--bg-muted); }
.expanded-tabs { display: flex; gap: 2px; padding: 10px 16px; border-bottom: 1px solid var(--border-subtle); background: var(--bg-subtle); }
.expanded-tab { padding: 6px 12px; border-radius: var(--radius-md); font-size: 11px; font-weight: 500; color: var(--text-secondary); cursor: pointer; border: none; background: transparent; font-family: var(--font-sans); }
.expanded-tab:hover { background: var(--bg-hover); color: var(--text-primary); }
.expanded-tab.active { background: var(--accent-primary-muted); color: var(--accent-primary); }
.expanded-content { padding: 16px; }

/* Score Breakdown */
.score-breakdown { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
.breakdown-item { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 12px; text-align: center; }
.breakdown-value { font-size: 22px; font-weight: 700; margin-bottom: 2px; }
.breakdown-label { font-size: 9px; color: var(--text-muted); text-transform: uppercase; font-weight: 600; }

/* Issues */
.issues-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 10px; }
.issue-card { display: flex; gap: 12px; padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); }
.issue-card.critical { background: var(--accent-danger-muted); border-color: rgba(239,68,68,0.2); }
.issue-card.warning { background: var(--accent-warning-muted); border-color: rgba(245,158,11,0.2); }
.issue-card.opportunity { background: var(--accent-primary-muted); border-color: rgba(16,185,129,0.2); }
.issue-icon { width: 32px; height: 32px; border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.issue-card.critical .issue-icon { background: rgba(239,68,68,0.2); color: var(--accent-danger); }
.issue-card.warning .issue-icon { background: rgba(245,158,11,0.2); color: var(--accent-warning); }
.issue-card.opportunity .issue-icon { background: rgba(16,185,129,0.2); color: var(--accent-primary); }
.issue-content { flex: 1; }
.issue-title { font-size: 12px; font-weight: 600; margin-bottom: 2px; }
.issue-desc { font-size: 11px; color: var(--text-secondary); }

/* Settings */
.settings-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.settings-card { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 20px; }
.settings-title { font-size: 14px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
.settings-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--border-subtle); }
.settings-row:last-child { border-bottom: none; }
.settings-label { font-size: 12px; color: var(--text-secondary); }
.settings-value { font-size: 12px; font-weight: 600; }

/* Input */
.input { width: 100%; padding: 10px 12px; background: var(--bg-muted); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); font-size: 13px; color: var(--text-primary); }
.input:focus { outline: none; border-color: var(--accent-primary); }

/* Connection */
.connection-badge { display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; border-radius: var(--radius-md); font-size: 11px; font-weight: 600; }
.connection-badge.connected { background: var(--accent-primary-muted); color: var(--accent-primary); }
.connection-badge.disconnected { background: var(--accent-danger-muted); color: var(--accent-danger); }
.connection-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; }

/* Toast */
.toast { position: fixed; top: 16px; right: 16px; z-index: 1000; animation: fadeIn 0.3s; }
.toast-content { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: var(--radius-md); font-size: 12px; font-weight: 500; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
.toast-content.success { background: var(--accent-primary); color: white; }
.toast-content.error { background: var(--accent-danger); color: white; }

/* Empty */
.empty-state { text-align: center; padding: 40px 20px; }
.empty-icon { width: 48px; height: 48px; margin: 0 auto 14px; color: var(--text-faint); opacity: 0.5; }
.empty-title { font-size: 15px; font-weight: 600; margin-bottom: 4px; }
.empty-text { font-size: 12px; color: var(--text-muted); }

/* Section */
.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.section-title { font-size: 14px; font-weight: 600; display: flex; align-items: center; gap: 8px; }

/* Dropdown Menu */
.dropdown { position: relative; }
.dropdown-menu { position: absolute; top: 100%; right: 0; margin-top: 4px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 4px; min-width: 160px; z-index: 100; box-shadow: 0 10px 40px rgba(0,0,0,0.3); }
.dropdown-item { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: var(--radius-sm); font-size: 12px; color: var(--text-secondary); cursor: pointer; }
.dropdown-item:hover { background: var(--bg-hover); color: var(--text-primary); }
.dropdown-item.danger { color: var(--accent-danger); }
.dropdown-item.danger:hover { background: var(--accent-danger-muted); }

/* Quick Actions */
.quick-actions { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
.quick-action { background: var(--bg-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-lg); padding: 16px; text-align: center; cursor: pointer; transition: all 0.2s; }
.quick-action:hover { border-color: var(--accent-primary); transform: translateY(-2px); }
.quick-action-icon { width: 44px; height: 44px; margin: 0 auto 10px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
.quick-action-title { font-size: 12px; font-weight: 600; margin-bottom: 2px; }
.quick-action-desc { font-size: 10px; color: var(--text-muted); }

/* Responsive */
@media (max-width: 1400px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .campaign-main { grid-template-columns: 44px 1fr 90px 90px 100px; } }
@media (max-width: 1200px) { .settings-grid, .audience-grid { grid-template-columns: 1fr; } .quick-actions { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .sidebar { display: none; } .main-content { margin-left: 0; } }
`;

// =============================================================================
// COMPONENTS
// =============================================================================

function ScoreRing({ score, size = 42 }) {
  const status = AIEngine.getStatus(score);
  const circumference = 2 * Math.PI * 18;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg viewBox="0 0 42 42">
        <circle cx="21" cy="21" r="18" className="score-ring-bg" />
        <circle cx="21" cy="21" r="18" className="score-ring-progress" style={{ stroke: status.color, strokeDasharray: circumference, strokeDashoffset: offset }} />
      </svg>
      <span className="score-ring-value" style={{ color: status.color }}>{score}</span>
    </div>
  );
}

function CampaignRow({ campaign, expanded, onToggle, onAction, activeTab, setActiveTab, loading }) {
  const ins = campaign.insights || {};
  const score = campaign.score?.total ?? campaign.healthScore ?? 50;
  const status = AIEngine.getStatus(score);
  const isActive = campaign.status === 'ACTIVE';
  const cfg = AIEngine.config;
  const [showMenu, setShowMenu] = useState(false);

  const handleAction = (action) => {
    setShowMenu(false);
    onAction(action, campaign.id);
  };

  return (
    <div className={`campaign-row ${expanded ? 'expanded' : ''}`}>
      <div className="campaign-main" onClick={onToggle}>
        <ScoreRing score={score} />
        <div className="campaign-info">
          <div className="campaign-name">{campaign.name}</div>
          <div className="campaign-meta">
            <span className={`campaign-status ${isActive ? 'active' : 'paused'}`}>
              <Icon name={isActive ? 'play' : 'pause'} size={8} />
              {isActive ? 'Ativo' : 'Pausado'}
            </span>
            <span className="campaign-objective">{campaign.objective?.replace('OUTCOME_', '') || 'Conversões'}</span>
          </div>
        </div>
        <div className="metric-cell">
          <div className="metric-value">{fmt.money(ins.spend || 0)}</div>
          <div className="metric-label">Gasto</div>
        </div>
        <div className="metric-cell">
          <div className={`metric-value ${ins.cpa && ins.cpa <= cfg.metaCPA ? 'good' : ins.cpa > cfg.metaCPA * 1.5 ? 'bad' : 'warning'}`}>
            {ins.cpa ? fmt.money(ins.cpa) : '-'}
          </div>
          <div className="metric-label">CPA</div>
        </div>
        <div className="metric-cell">
          <div className={`metric-value ${ins.conversions > 0 ? 'good' : ''}`}>{ins.conversions || 0}</div>
          <div className="metric-label">Conv.</div>
        </div>
        <div className="campaign-actions" onClick={e => e.stopPropagation()}>
          <button 
            className={`btn-icon ${isActive ? '' : 'active'}`} 
            onClick={() => handleAction(isActive ? 'pause' : 'resume')}
            disabled={loading}
            title={isActive ? 'Pausar' : 'Ativar'}
          >
            <Icon name={isActive ? 'pause' : 'play'} size={14} />
          </button>
          <div className="dropdown">
            <button className="btn-icon" onClick={() => setShowMenu(!showMenu)}>
              <Icon name="moreVertical" size={14} />
            </button>
            {showMenu && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => handleAction('duplicate')}>
                  <Icon name="copy" size={14} />Duplicar
                </div>
                <div className="dropdown-item" onClick={() => handleAction('edit')}>
                  <Icon name="edit" size={14} />Editar
                </div>
                {score >= 70 && (
                  <div className="dropdown-item" onClick={() => handleAction('scale')}>
                    <Icon name="trendingUp" size={14} />Escalar 20%
                  </div>
                )}
                <div className="dropdown-item danger" onClick={() => handleAction('delete')}>
                  <Icon name="trash" size={14} />Arquivar
                </div>
              </div>
            )}
          </div>
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
                  <div className="breakdown-item">
                    <div className="breakdown-value" style={{ color: AIEngine.getStatus(campaign.score?.breakdown?.cpa || 50).color }}>{campaign.score?.breakdown?.cpa || 50}</div>
                    <div className="breakdown-label">CPA Score</div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-value" style={{ color: AIEngine.getStatus(campaign.score?.breakdown?.ctr || 50).color }}>{campaign.score?.breakdown?.ctr || 50}</div>
                    <div className="breakdown-label">CTR Score</div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-value" style={{ color: AIEngine.getStatus(campaign.score?.breakdown?.freq || 100).color }}>{campaign.score?.breakdown?.freq || 100}</div>
                    <div className="breakdown-label">Frequência</div>
                  </div>
                  <div className="breakdown-item">
                    <div className="breakdown-value" style={{ color: AIEngine.getStatus(campaign.score?.breakdown?.roas || 50).color }}>{campaign.score?.breakdown?.roas || 50}</div>
                    <div className="breakdown-label">ROAS Score</div>
                  </div>
                </div>
                <div className="issues-grid">
                  {(campaign.analysis?.issues || []).map((issue, i) => (
                    <div key={i} className={`issue-card ${issue.severity || 'warning'}`}>
                      <div className="issue-icon"><Icon name={issue.icon || 'alertTriangle'} size={16} /></div>
                      <div className="issue-content"><div className="issue-title">{issue.title}</div><div className="issue-desc">{issue.desc}</div></div>
                    </div>
                  ))}
                  {(campaign.analysis?.opportunities || []).map((opp, i) => (
                    <div key={`o-${i}`} className="issue-card opportunity">
                      <div className="issue-icon"><Icon name={opp.icon || 'rocket'} size={16} /></div>
                      <div className="issue-content"><div className="issue-title">{opp.title}</div><div className="issue-desc">{opp.desc}</div></div>
                    </div>
                  ))}
                  {!campaign.analysis?.issues?.length && !campaign.analysis?.opportunities?.length && (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                      <Icon name="checkCircle" size={32} style={{ marginBottom: 8, opacity: 0.5 }} /><div>Campanha saudável</div>
                    </div>
                  )}
                </div>
              </>
            )}
            {activeTab === 'metrics' && (
              <div className="score-breakdown" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
                <div className="breakdown-item"><div className="breakdown-value">{fmt.numCompact(ins.impressions || 0)}</div><div className="breakdown-label">Impressões</div></div>
                <div className="breakdown-item"><div className="breakdown-value">{fmt.numCompact(ins.clicks || 0)}</div><div className="breakdown-label">Cliques</div></div>
                <div className="breakdown-item"><div className="breakdown-value">{fmt.pct(ins.ctr || 0)}</div><div className="breakdown-label">CTR</div></div>
                <div className="breakdown-item"><div className="breakdown-value">{(ins.frequency || 0).toFixed(1)}x</div><div className="breakdown-label">Frequência</div></div>
                <div className="breakdown-item"><div className="breakdown-value">{ins.roas ? `${ins.roas.toFixed(2)}x` : '-'}</div><div className="breakdown-label">ROAS</div></div>
              </div>
            )}
            {activeTab === 'actions' && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button className="btn btn-secondary" onClick={() => handleAction('duplicate')}><Icon name="copy" size={14} />Duplicar</button>
                <button className="btn btn-secondary" onClick={() => handleAction('edit')}><Icon name="sliders" size={14} />Editar</button>
                {score >= 70 && ins.conversions > 0 && <button className="btn btn-primary" onClick={() => handleAction('scale')}><Icon name="trendingUp" size={14} />Escalar 20%</button>}
                {isActive && score < 30 && <button className="btn btn-danger" onClick={() => handleAction('pause')}><Icon name="pause" size={14} />Pausar</button>}
                {!isActive && <button className="btn btn-primary" onClick={() => handleAction('resume')}><Icon name="play" size={14} />Ativar</button>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CreativeCard({ ad, rank }) {
  const ins = ad.metrics || ad.insights || {};
  const score = ad.score?.total ?? ad.score ?? 50;
  const status = AIEngine.getStatus(score);
  const imageUrl = ad.creative?.imageUrl || ad.creative?.thumbnail_url || null;
  
  return (
    <div className={`creative-card ${rank <= 3 ? 'top-performer' : ''}`}>
      {imageUrl && <div className="card-thumbnail"><img src={imageUrl} alt={ad.name} /></div>}
      <div className="card-body">
        <div className="card-header">
          <div className="card-score" style={{ background: status.bg, color: status.color }}>{score}</div>
          {rank <= 3 && <span className="card-badge success"><Icon name="trophy" size={10} /> #{rank}</span>}
        </div>
        <div className="card-title">{ad.name || 'Sem nome'}</div>
        <div className="card-subtitle">{ad.creative?.title || 'Anúncio'}</div>
        <div className="card-metrics">
          <div className="card-metric"><div className="card-metric-value" style={{ color: ins.cpa && ins.cpa <= AIEngine.config.metaCPA ? 'var(--accent-primary)' : 'inherit' }}>{ins.cpa ? fmt.money(ins.cpa) : '-'}</div><div className="card-metric-label">CPA</div></div>
          <div className="card-metric"><div className="card-metric-value">{fmt.pct(ins.ctr || 0)}</div><div className="card-metric-label">CTR</div></div>
          <div className="card-metric"><div className="card-metric-value" style={{ color: ins.conversions > 0 ? 'var(--accent-primary)' : 'inherit' }}>{ins.conversions || 0}</div><div className="card-metric-label">Conv</div></div>
        </div>
      </div>
    </div>
  );
}

function AudienceSection({ data, title, icon, type }) {
  if (!data || data.length === 0) return <div className="audience-card"><div className="audience-title"><Icon name={icon} size={18} />{title}</div><div style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>Sem dados</div></div>;

  const maxConv = Math.max(...data.map(d => d.conversions || 0), 1);
  const sorted = [...data].sort((a, b) => {
    const cpA = a.conversions > 0 ? (a.cpa || a.spend / a.conversions) : Infinity;
    const cpB = b.conversions > 0 ? (b.cpa || b.spend / b.conversions) : Infinity;
    return cpA - cpB;
  });

  return (
    <div className="audience-card">
      <div className="audience-title"><Icon name={icon} size={18} />{title}</div>
      {sorted.slice(0, 6).map((item, i) => {
        const name = type === 'gender' ? (item.gender === 'male' ? 'Masculino' : item.gender === 'female' ? 'Feminino' : item.label) : type === 'age' ? item.age : item.label || item.deviceLabel || item.platform || '-';
        const conv = item.conversions || 0;
        const spend = item.spend || 0;
        const cpa = item.cpa || (conv > 0 ? spend / conv : 0);
        const pct = (conv / maxConv) * 100;
        const isGood = cpa > 0 && cpa <= AIEngine.config.metaCPA;
        const isBad = cpa > AIEngine.config.metaCPA * 1.5;
        return (
          <div className="audience-item" key={i}>
            <div className={`audience-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'normal'}`}>{i + 1}</div>
            <div className="audience-info"><div className="audience-name">{name}</div><div className="audience-stats">{conv} conv • {fmt.money(spend)}</div></div>
            <div className="audience-bar"><div className={`audience-bar-fill ${isGood ? 'green' : isBad ? 'red' : 'yellow'}`} style={{ width: `${pct}%` }} /></div>
            <div><div className="audience-value" style={{ color: isGood ? 'var(--accent-primary)' : isBad ? 'var(--accent-danger)' : 'inherit' }}>{cpa > 0 ? fmt.money(cpa) : '-'}</div><div className="audience-cpa">CPA</div></div>
          </div>
        );
      })}
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

  // Computed values
  const filteredCampaigns = useMemo(() => {
    let result = campaigns;
    if (filter === 'active') result = result.filter(c => c.status === 'ACTIVE');
    if (filter === 'paused') result = result.filter(c => c.status === 'PAUSED');
    if (filter === 'critical') result = result.filter(c => (c.score?.total ?? c.healthScore ?? 50) < 30);
    if (filter === 'scale') result = result.filter(c => (c.score?.total ?? c.healthScore ?? 50) >= 70 && (c.insights?.conversions || 0) > 0);
    if (search) result = result.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [campaigns, filter, search]);

  const filterCounts = useMemo(() => ({
    all: campaigns.length,
    active: campaigns.filter(c => c.status === 'ACTIVE').length,
    paused: campaigns.filter(c => c.status === 'PAUSED').length,
    critical: campaigns.filter(c => (c.score?.total ?? c.healthScore ?? 50) < 30).length,
    scale: campaigns.filter(c => (c.score?.total ?? c.healthScore ?? 50) >= 70 && (c.insights?.conversions || 0) > 0).length,
  }), [campaigns]);

  const totals = useMemo(() => campaigns.reduce((t, c) => {
    const ins = c.insights || {};
    return { spend: t.spend + (ins.spend || 0), conversions: t.conversions + (ins.conversions || 0), clicks: t.clicks + (ins.clicks || 0), impressions: t.impressions + (ins.impressions || 0) };
  }, { spend: 0, conversions: 0, clicks: 0, impressions: 0 }), [campaigns]);

  const summary = useMemo(() => AIEngine.getSummary(campaigns), [campaigns]);

  // Audience insights
  const audienceInsights = useMemo(() => {
    const insights = [];
    const bd = breakdown?.ageGender || breakdown;
    
    if (bd?.byGender?.length >= 2) {
      const sorted = [...bd.byGender].filter(g => g.conversions > 0).sort((a, b) => (a.cpa || Infinity) - (b.cpa || Infinity));
      if (sorted.length >= 2 && sorted[0].cpa && sorted[1].cpa) {
        const diff = Math.round(((sorted[1].cpa - sorted[0].cpa) / sorted[1].cpa) * 100);
        if (diff > 15) {
          insights.push({ type: 'success', icon: 'users', title: `${sorted[0].label || (sorted[0].gender === 'male' ? 'Homens' : 'Mulheres')} convertem ${diff}% mais barato`, desc: `CPA de ${fmt.money(sorted[0].cpa)} vs ${fmt.money(sorted[1].cpa)}. Considere focar nesse público.` });
        }
      }
    }
    
    if (bd?.byAge?.length > 0) {
      const withConv = bd.byAge.filter(a => a.conversions > 0);
      if (withConv.length > 0) {
        const best = withConv.reduce((b, a) => (a.cpa || Infinity) < (b.cpa || Infinity) ? a : b);
        insights.push({ type: 'info', icon: 'calendar', title: `Melhor faixa etária: ${best.age}`, desc: `CPA de ${fmt.money(best.cpa)} com ${best.conversions} conversões.` });
      }
      const wasted = bd.byAge.filter(a => a.spend > 30 && (!a.conversions || a.conversions === 0));
      if (wasted.length > 0) {
        const total = wasted.reduce((s, a) => s + a.spend, 0);
        insights.push({ type: 'warning', icon: 'alertTriangle', title: `${wasted.length} faixa(s) sem conversão`, desc: `${fmt.money(total)} gastos sem resultado. Considere excluir: ${wasted.map(w => w.age).join(', ')}` });
      }
    }

    if (breakdown?.placements?.length > 0) {
      const withConv = breakdown.placements.filter(p => p.conversions > 0);
      if (withConv.length > 0) {
        const best = withConv.reduce((b, p) => (p.cpa || Infinity) < (b.cpa || Infinity) ? p : b);
        insights.push({ type: 'success', icon: 'smartphone', title: `Melhor posicionamento: ${best.label}`, desc: `CPA de ${fmt.money(best.cpa)} com ${best.conversions} conversões.` });
      }
    }

    return insights;
  }, [breakdown]);

  useEffect(() => { if (error || success) { const t = setTimeout(() => { setError(''); setSuccess(''); }, 4000); return () => clearTimeout(t); } }, [error, success]);

  // Init
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
        api.get('/api/meta/ad-accounts').then(res => {
          const list = res.adAccounts || res.accounts || [];
          if (res.success && list.length > 0) {
            setAccounts(list);
            const acc = savedAccount && list.some(a => a.id === savedAccount) ? savedAccount : list[0].id;
            setSelectedAccount(acc);
            localStorage.setItem('adbrain_account', acc);
          }
        });
      }
    }
  }, []);

  useEffect(() => { if (connected && selectedAccount) loadData(); }, [selectedAccount, dateRange]);
  useEffect(() => { if (page === 'creatives' && connected && selectedAccount && ads.length === 0) loadAds(); }, [page, selectedAccount]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [campRes, breakRes] = await Promise.all([
        api.get(`/api/meta/campaigns/${selectedAccount}?date_preset=${dateRange}`),
        api.get(`/api/meta/breakdown/${selectedAccount}?date_preset=${dateRange}`)
      ]);
      if (campRes.success) {
        const processed = (campRes.campaigns || []).map(c => ({ ...c, score: AIEngine.calcScore(c), analysis: AIEngine.analyze(c) }));
        setCampaigns(processed);
      }
      if (breakRes.success) setBreakdown(breakRes.breakdown);
    } catch (e) { setError('Erro ao carregar'); }
    setLoading(false);
  };

  const loadAds = async () => {
    setLoadingAds(true);
    try {
      const res = await api.get(`/api/meta/ads/${selectedAccount}?date_preset=${dateRange}`);
      if (res.success) setAds((res.ads || []).sort((a, b) => (b.score || 0) - (a.score || 0)));
    } catch (e) { console.error(e); }
    setLoadingAds(false);
  };

  const handleLogin = async (e) => { e.preventDefault(); setLoading(true); const res = await api.post('/api/auth/login', { email: authEmail, password: authPassword }); setLoading(false); if (res.success) { localStorage.setItem('adbrain_user', JSON.stringify(res.user)); setUser(res.user); setPage('dashboard'); } else setError(res.error || 'Erro'); };
  const handleRegister = async (e) => { e.preventDefault(); setLoading(true); const res = await api.post('/api/auth/register', { name: authName, email: authEmail, password: authPassword }); setLoading(false); if (res.success) { localStorage.setItem('adbrain_user', JSON.stringify(res.user)); setUser(res.user); setPage('dashboard'); } else setError(res.error || 'Erro'); };
  const handleLogout = () => { localStorage.clear(); setUser(null); setConnected(false); setCampaigns([]); setAds([]); setPage('login'); };
  const handleConnect = async () => { if (!token.trim()) { setError('Cole o token'); return; } setLoading(true); const res = await api.post('/api/meta/connect', { accessToken: token }); setLoading(false); if (res.success) { localStorage.setItem('adbrain_meta_token', token); setConnected(true); setSuccess('Conectado!'); const accRes = await api.get('/api/meta/ad-accounts'); const list = accRes.adAccounts || accRes.accounts || []; if (list.length > 0) { setAccounts(list); setSelectedAccount(list[0].id); localStorage.setItem('adbrain_account', list[0].id); } } else setError(res.error || 'Token inválido'); };
  const handleDisconnect = () => { localStorage.removeItem('adbrain_meta_token'); localStorage.removeItem('adbrain_account'); setConnected(false); setAccounts([]); setSelectedAccount(''); setCampaigns([]); };
  
  const handleAction = async (action, campaignId) => {
    if (action === 'pause' || action === 'resume') {
      setLoading(true);
      const res = await api.post(`/api/meta/campaigns/${campaignId}/${action}`);
      setLoading(false);
      if (res.success) { setSuccess(`Campanha ${action === 'pause' ? 'pausada' : 'ativada'}!`); loadData(); }
      else setError(res.error || 'Erro');
    } else if (action === 'scale') {
      setSuccess('Função de escalar em desenvolvimento');
    } else if (action === 'duplicate') {
      setSuccess('Função de duplicar em desenvolvimento');
    } else if (action === 'edit') {
      setSuccess('Abrindo editor...');
    }
  };

  // AUTH
  if (!user) {
    return (
      <><style>{styles}</style>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-base)', padding: 20 }}>
          <div style={{ width: '100%', maxWidth: 380 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, var(--accent-primary) 0%, #059669 100%)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}><Icon name="brain" size={28} style={{ stroke: 'white' }} /></div>
              <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>AdBrain Pro</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Gestão inteligente de campanhas</p>
            </div>
            {(error || success) && <div className="toast" style={{ position: 'relative', top: 0, right: 0, marginBottom: 16 }}><div className={`toast-content ${error ? 'error' : 'success'}`}><Icon name={error ? 'alertCircle' : 'checkCircle'} size={16} />{error || success}</div></div>}
            <div style={{ background: 'var(--bg-subtle)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
              {page === 'login' ? (
                <form onSubmit={handleLogin}>
                  <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label><input className="input" type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required /></div>
                  <div style={{ marginBottom: 20 }}><label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Senha</label><input className="input" type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required /></div>
                  <button className="btn btn-primary" style={{ width: '100%', padding: 12 }} disabled={loading}>{loading ? <><Icon name="refreshCw" size={16} className="animate-spin" />Entrando...</> : 'Entrar'}</button>
                </form>
              ) : (
                <form onSubmit={handleRegister}>
                  <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Nome</label><input className="input" type="text" value={authName} onChange={e => setAuthName(e.target.value)} required /></div>
                  <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label><input className="input" type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)} required /></div>
                  <div style={{ marginBottom: 20 }}><label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Senha</label><input className="input" type="password" value={authPassword} onChange={e => setAuthPassword(e.target.value)} required /></div>
                  <button className="btn btn-primary" style={{ width: '100%', padding: 12 }} disabled={loading}>{loading ? <><Icon name="refreshCw" size={16} className="animate-spin" />Criando...</> : 'Criar Conta'}</button>
                </form>
              )}
              <div style={{ textAlign: 'center', marginTop: 16 }}><button className="btn btn-ghost" onClick={() => setPage(page === 'login' ? 'register' : 'login')}>{page === 'login' ? 'Criar conta' : 'Já tenho conta'}</button></div>
            </div>
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
              <div className={`nav-item ${page === 'insights' ? 'active' : ''}`} onClick={() => setPage('insights')}><Icon name="sparkles" size={18} />Insights IA{summary.scalable > 0 && <span className="nav-badge success">{summary.scalable}</span>}</div>
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
            <div className="header-left">
              <div>
                <h1 className="header-title">{page === 'dashboard' ? 'Dashboard' : page === 'campaigns' ? 'Campanhas' : page === 'creatives' ? 'Criativos' : page === 'audience' ? 'Análise de Público' : page === 'insights' ? 'Insights IA' : 'Configurações'}</h1>
                <p className="header-subtitle">{page === 'dashboard' ? 'Visão geral da sua conta' : page === 'campaigns' ? 'Gerencie suas campanhas' : page === 'creatives' ? 'Performance dos anúncios' : page === 'audience' ? 'Entenda seu público' : page === 'insights' ? 'Recomendações inteligentes' : 'Configurações da conta'}</p>
              </div>
            </div>
            <div className="header-right">
              {connected && accounts.length > 0 && (
                <div className="select-wrap">
                  <select className="select" value={selectedAccount} onChange={(e) => { setSelectedAccount(e.target.value); localStorage.setItem('adbrain_account', e.target.value); }}>
                    {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name || acc.id}</option>)}
                  </select>
                  <Icon name="chevronDown" size={14} className="select-icon" />
                </div>
              )}
              <div className="select-wrap">
                <select className="select" value={dateRange} onChange={(e) => setDateRange(e.target.value)}>
                  {dateOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                <Icon name="chevronDown" size={14} className="select-icon" />
              </div>
              <button className="btn btn-secondary" onClick={loadData} disabled={loading}><Icon name="refreshCw" size={15} className={loading ? 'animate-spin' : ''} />Atualizar</button>
            </div>
          </header>

          {(error || success) && <div className="toast"><div className={`toast-content ${error ? 'error' : 'success'}`}><Icon name={error ? 'alertCircle' : 'checkCircle'} size={16} />{error || success}</div></div>}

          <div className="page-content">
            {!connected ? (
              <div style={{ maxWidth: 440, margin: '50px auto', textAlign: 'center' }}>
                <div style={{ width: 70, height: 70, background: 'var(--accent-info-muted)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px' }}><Icon name="zap" size={36} style={{ color: 'var(--accent-info)' }} /></div>
                <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>Conecte sua conta Meta</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 14 }}>Cole seu token de acesso para começar</p>
                <div style={{ textAlign: 'left', marginBottom: 14 }}><label style={{ display: 'block', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>Token de Acesso</label><input className="input" type="text" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Cole seu token aqui" /></div>
                <button className="btn btn-primary" style={{ width: '100%', padding: 12 }} onClick={handleConnect} disabled={loading}>{loading ? <><Icon name="refreshCw" size={16} className="animate-spin" />Conectando...</> : <><Icon name="link" size={16} />Conectar</>}</button>
              </div>
            ) : page === 'dashboard' ? (
              <>
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon green"><Icon name="dollarSign" size={18} /></div></div><div className="stat-value">{fmt.moneyCompact(totals.spend)}</div><div className="stat-label">Investimento</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon blue"><Icon name="shoppingBag" size={18} /></div></div><div className="stat-value">{fmt.numCompact(totals.conversions)}</div><div className="stat-label">Conversões</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon purple"><Icon name="target" size={18} /></div></div><div className="stat-value">{totals.conversions > 0 ? fmt.money(totals.spend / totals.conversions) : '-'}</div><div className="stat-label">CPA Médio</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon yellow"><Icon name="mousePointer" size={18} /></div></div><div className="stat-value">{totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : '0.00'}%</div><div className="stat-label">CTR Médio</div></div>
                </div>

                {campaigns.length > 0 && (
                  <div className="ai-summary">
                    <div className="ai-icon"><Icon name="sparkles" size={22} /></div>
                    <div className="ai-content">
                      <div className="ai-header"><span className="ai-title">Resumo Inteligente</span><span className="ai-badge">IA</span></div>
                      <p className="ai-text">
                        Você tem <strong>{campaigns.length} campanhas</strong> com {fmt.moneyCompact(totals.spend)} investidos.
                        {summary.critical > 0 && <> <strong className="danger">{summary.critical}</strong> precisam de atenção.</>}
                        {summary.scalable > 0 && <> <strong className="success">{summary.scalable}</strong> prontas para escalar.</>}
                        {totals.conversions > 0 && <> CPA médio de <strong>{fmt.money(totals.spend / totals.conversions)}</strong>.</>}
                      </p>
                      <div className="ai-actions">
                        <button className="btn btn-sm btn-secondary" onClick={() => setPage('insights')}><Icon name="sparkles" size={12} />Ver Insights</button>
                        {summary.critical > 0 && <button className="btn btn-sm btn-danger" onClick={() => { setPage('campaigns'); setFilter('critical'); }}><Icon name="alertTriangle" size={12} />Ver Problemas</button>}
                      </div>
                    </div>
                  </div>
                )}

                <div className="quick-actions">
                  <div className="quick-action" onClick={() => setPage('campaigns')}><div className="quick-action-icon" style={{ background: 'var(--accent-primary-muted)', color: 'var(--accent-primary)' }}><Icon name="target" size={22} /></div><div className="quick-action-title">Campanhas</div><div className="quick-action-desc">{filterCounts.active} ativas</div></div>
                  <div className="quick-action" onClick={() => setPage('creatives')}><div className="quick-action-icon" style={{ background: 'var(--accent-info-muted)', color: 'var(--accent-info)' }}><Icon name="image" size={22} /></div><div className="quick-action-title">Criativos</div><div className="quick-action-desc">{ads.length} anúncios</div></div>
                  <div className="quick-action" onClick={() => setPage('audience')}><div className="quick-action-icon" style={{ background: 'var(--accent-purple-muted)', color: 'var(--accent-purple)' }}><Icon name="users" size={22} /></div><div className="quick-action-title">Público</div><div className="quick-action-desc">Análise detalhada</div></div>
                  <div className="quick-action" onClick={() => setPage('insights')}><div className="quick-action-icon" style={{ background: 'var(--accent-warning-muted)', color: 'var(--accent-warning)' }}><Icon name="lightbulb" size={22} /></div><div className="quick-action-title">Insights</div><div className="quick-action-desc">{summary.scalable + summary.critical} ações</div></div>
                </div>

                <div className="audience-grid">
                  <div className="audience-card">
                    <div className="audience-title"><Icon name="target" size={18} />Campanhas</div>
                    <div className="audience-item"><div className="audience-info"><div className="audience-name">Total</div></div><div className="audience-value">{campaigns.length}</div></div>
                    <div className="audience-item"><div className="audience-info"><div className="audience-name">Ativas</div></div><div className="audience-value" style={{ color: 'var(--accent-primary)' }}>{filterCounts.active}</div></div>
                    <div className="audience-item"><div className="audience-info"><div className="audience-name">Críticas</div></div><div className="audience-value" style={{ color: 'var(--accent-danger)' }}>{summary.critical}</div></div>
                    <div className="audience-item"><div className="audience-info"><div className="audience-name">Para Escalar</div></div><div className="audience-value" style={{ color: 'var(--accent-primary)' }}>{summary.scalable}</div></div>
                  </div>
                  <div className="audience-card">
                    <div className="audience-title"><Icon name="activity" size={18} />Métricas</div>
                    <div className="audience-item"><div className="audience-info"><div className="audience-name">Impressões</div></div><div className="audience-value">{fmt.numCompact(totals.impressions)}</div></div>
                    <div className="audience-item"><div className="audience-info"><div className="audience-name">Cliques</div></div><div className="audience-value">{fmt.numCompact(totals.clicks)}</div></div>
                    <div className="audience-item"><div className="audience-info"><div className="audience-name">CTR</div></div><div className="audience-value">{totals.impressions > 0 ? ((totals.clicks / totals.impressions) * 100).toFixed(2) : '0'}%</div></div>
                    <div className="audience-item"><div className="audience-info"><div className="audience-name">Conversões</div></div><div className="audience-value" style={{ color: 'var(--accent-primary)' }}>{totals.conversions}</div></div>
                  </div>
                </div>
              </>
            ) : page === 'campaigns' ? (
              <>
                <div className="filter-bar">
                  <div className={`filter-chip ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Todas <span className="count">{filterCounts.all}</span></div>
                  <div className={`filter-chip ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>Ativas <span className="count">{filterCounts.active}</span></div>
                  <div className={`filter-chip ${filter === 'critical' ? 'active' : ''}`} onClick={() => setFilter('critical')}><Icon name="alertTriangle" size={12} />Críticas <span className="count">{filterCounts.critical}</span></div>
                  <div className={`filter-chip ${filter === 'scale' ? 'active' : ''}`} onClick={() => setFilter('scale')}><Icon name="rocket" size={12} />Escalar <span className="count">{filterCounts.scale}</span></div>
                  <div className="search-box"><Icon name="search" size={14} className="search-icon" /><input className="search-input" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} /></div>
                </div>
                <div className="campaigns-list">
                  {filteredCampaigns.length === 0 ? (
                    <div className="empty-state"><Icon name="target" size={48} className="empty-icon" /><h3 className="empty-title">Nenhuma campanha</h3><p className="empty-text">Ajuste os filtros</p></div>
                  ) : filteredCampaigns.map(c => (
                    <CampaignRow key={c.id} campaign={c} expanded={expandedId === c.id} onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)} onAction={handleAction} activeTab={activeTab} setActiveTab={setActiveTab} loading={loading} />
                  ))}
                </div>
              </>
            ) : page === 'creatives' ? (
              <>
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon blue"><Icon name="image" size={18} /></div></div><div className="stat-value">{ads.length}</div><div className="stat-label">Total</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon green"><Icon name="trophy" size={18} /></div></div><div className="stat-value">{ads.filter(a => (a.score || 0) >= 70).length}</div><div className="stat-label">Top Performers</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon yellow"><Icon name="alertTriangle" size={18} /></div></div><div className="stat-value">{ads.filter(a => (a.metrics?.frequency || 0) > 2.5).length}</div><div className="stat-label">Em Fadiga</div></div>
                  <div className="stat-card"><div className="stat-header"><div className="stat-icon red"><Icon name="flame" size={18} /></div></div><div className="stat-value">{ads.filter(a => (a.metrics?.frequency || 0) > 4).length}</div><div className="stat-label">Críticos</div></div>
                </div>
                {loadingAds ? (
                  <div className="empty-state"><Icon name="refreshCw" size={48} className="empty-icon animate-spin" /><h3 className="empty-title">Carregando...</h3></div>
                ) : ads.length === 0 ? (
                  <div className="empty-state"><Icon name="image" size={48} className="empty-icon" /><h3 className="empty-title">Nenhum anúncio</h3></div>
                ) : (
                  <>
                    <div className="section-header"><div className="section-title"><Icon name="trophy" size={18} style={{ color: 'var(--accent-warning)' }} />Top Performers</div></div>
                    <div className="cards-grid">{ads.filter(a => (a.score || 0) >= 50).slice(0, 6).map((ad, i) => <CreativeCard key={ad.id} ad={ad} rank={i + 1} />)}</div>
                  </>
                )}
              </>
            ) : page === 'audience' ? (
              <>
                {audienceInsights.length > 0 && (
                  <div className="insights-grid">
                    {audienceInsights.map((ins, i) => (
                      <div key={i} className={`insight-card ${ins.type}`}>
                        <div className="insight-icon"><Icon name={ins.icon} size={20} /></div>
                        <div className="insight-content"><div className="insight-title">{ins.title}</div><div className="insight-desc">{ins.desc}</div></div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="audience-grid">
                  <AudienceSection data={breakdown?.ageGender?.byGender || breakdown?.byGender} title="Por Gênero" icon="users" type="gender" />
                  <AudienceSection data={breakdown?.ageGender?.byAge || breakdown?.byAge} title="Por Idade" icon="calendar" type="age" />
                </div>
                <div className="audience-grid">
                  <AudienceSection data={breakdown?.devices} title="Por Dispositivo" icon="smartphone" type="device" />
                  <AudienceSection data={breakdown?.placements} title="Por Posicionamento" icon="layers" type="placement" />
                </div>
              </>
            ) : page === 'insights' ? (
              <>
                <div className="ai-summary">
                  <div className="ai-icon"><Icon name="sparkles" size={22} /></div>
                  <div className="ai-content">
                    <div className="ai-header"><span className="ai-title">Central de Inteligência</span><span className="ai-badge">IA</span></div>
                    <p className="ai-text">
                      Análise completa da sua conta.
                      {summary.critical > 0 && <> <strong className="danger">{summary.critical} campanhas</strong> precisam de ação.</>}
                      {summary.scalable > 0 && <> <strong className="success">{summary.scalable} campanhas</strong> podem escalar.</>}
                    </p>
                  </div>
                </div>

                <div className="section-header"><div className="section-title"><Icon name="alertTriangle" size={18} />Problemas</div></div>
                <div className="issues-grid" style={{ marginBottom: 24 }}>
                  {campaigns.flatMap(c => (c.analysis?.issues || []).map((issue, i) => (
                    <div key={`${c.id}-${i}`} className={`issue-card ${issue.severity}`}>
                      <div className="issue-icon"><Icon name={issue.icon} size={16} /></div>
                      <div className="issue-content"><div className="issue-title">{c.name}</div><div className="issue-desc">{issue.title}: {issue.desc}</div></div>
                    </div>
                  ))).slice(0, 6)}
                  {campaigns.every(c => !c.analysis?.issues?.length) && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}><Icon name="checkCircle" size={40} style={{ opacity: 0.5 }} /><div>Nenhum problema!</div></div>}
                </div>

                <div className="section-header"><div className="section-title"><Icon name="rocket" size={18} />Oportunidades</div></div>
                <div className="issues-grid">
                  {campaigns.flatMap(c => (c.analysis?.opportunities || []).map((opp, i) => (
                    <div key={`${c.id}-o-${i}`} className="issue-card opportunity">
                      <div className="issue-icon"><Icon name={opp.icon} size={16} /></div>
                      <div className="issue-content"><div className="issue-title">{c.name}</div><div className="issue-desc">{opp.title}: {opp.desc}</div></div>
                    </div>
                  ))).slice(0, 6)}
                  {campaigns.every(c => !c.analysis?.opportunities?.length) && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}><Icon name="lightbulb" size={40} style={{ opacity: 0.5 }} /><div>Melhore as campanhas para desbloquear</div></div>}
                </div>
              </>
            ) : page === 'settings' ? (
              <div className="settings-grid">
                <div className="settings-card">
                  <div className="settings-title"><Icon name="link" size={18} />Conexão Meta</div>
                  <div className="settings-row"><span className="settings-label">Status</span><span className={`connection-badge ${connected ? 'connected' : 'disconnected'}`}><span className="connection-dot"></span>{connected ? 'Conectado' : 'Desconectado'}</span></div>
                  {connected && selectedAccount && <div className="settings-row"><span className="settings-label">Conta</span><span className="settings-value">{accounts.find(a => a.id === selectedAccount)?.name || selectedAccount}</span></div>}
                  {connected && <div style={{ marginTop: 16 }}><button className="btn btn-danger" onClick={handleDisconnect}><Icon name="x" size={16} />Desconectar</button></div>}
                </div>
                <div className="settings-card">
                  <div className="settings-title"><Icon name="user" size={18} />Conta</div>
                  <div className="settings-row"><span className="settings-label">Usuário</span><span className="settings-value">{user?.name || '-'}</span></div>
                  <div className="settings-row"><span className="settings-label">Email</span><span className="settings-value">{user?.email || '-'}</span></div>
                  <div style={{ marginTop: 16 }}><button className="btn btn-secondary" onClick={handleLogout}><Icon name="logOut" size={16} />Sair</button></div>
                </div>
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </>
  );
}
