'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { pilgrims, groupLeaders } from '@/lib/mockData';
import { AlertTriangle, Phone, MapPin, Clock, Plus, CheckCircle2, XCircle, ChevronDown, ChevronUp, Users, Heart, Shield, Siren } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


type Severity = 'critical' | 'high' | 'medium' | 'low';
type IncidentStatus = 'active' | 'monitoring' | 'resolved';

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: IncidentStatus;
  location: string;
  affectedCount: number;
  reportedAt: string;
  assignedTo: string;
  pilgrimIds: string[];
}

const initialIncidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Medical Emergency — Heat Exhaustion',
    description: 'Pilgrim collapsed near Masjid Al-Haram entrance. Ambulance dispatched. Vital signs stable.',
    severity: 'critical',
    status: 'active',
    location: 'Masjid Al-Haram, Gate 79',
    affectedCount: 1,
    reportedAt: '14 min ago',
    assignedTo: 'Sheikh Ahmed Al-Rashidi',
    pilgrimIds: ['PIL-003'],
  },
  {
    id: 'INC-002',
    title: 'Missing Pilgrim — Separated from Group',
    description: 'Elderly pilgrim separated from GRP-004 during Tawaf. Last seen at Zamzam well area.',
    severity: 'high',
    status: 'active',
    location: 'Masjid Al-Haram, Zamzam Area',
    affectedCount: 1,
    reportedAt: '32 min ago',
    assignedTo: 'Sheikh Faisal Al-Mutairi',
    pilgrimIds: ['PIL-005'],
  },
  {
    id: 'INC-003',
    title: 'Bus Breakdown — Route A',
    description: 'Bus #7 mechanical failure on Makkah Route A. 48 pilgrims stranded. Replacement bus en route.',
    severity: 'high',
    status: 'monitoring',
    location: 'King Fahd Road, KM 12',
    affectedCount: 48,
    reportedAt: '1 hr ago',
    assignedTo: 'Sheikh Tariq Hussain',
    pilgrimIds: [],
  },
  {
    id: 'INC-004',
    title: 'Passport Lost — Pilgrim PIL-008',
    description: 'Pilgrim reports passport lost at hotel. Embassy notified. Emergency travel document in process.',
    severity: 'medium',
    status: 'monitoring',
    location: 'Hilton Suites Makkah, Room 413',
    affectedCount: 1,
    reportedAt: '3 hr ago',
    assignedTo: 'Sheikh Rizal Hakim',
    pilgrimIds: ['PIL-008'],
  },
  {
    id: 'INC-005',
    title: 'Minor Injury — Crowd Incident',
    description: 'Pilgrim sustained minor ankle injury during crowd movement. First aid administered on site.',
    severity: 'low',
    status: 'resolved',
    location: 'Mina Tent City, Block C',
    affectedCount: 1,
    reportedAt: '5 hr ago',
    assignedTo: 'Sheikh Ibrahim Musa',
    pilgrimIds: ['PIL-006'],
  },
];

const severityConfig: Record<Severity, { label: string; color: string; bg: string; border: string; dot: string }> = {
  critical: { label: 'Critical', color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]', border: 'border-[#DC2626]/30', dot: 'bg-[#DC2626]' },
  high: { label: 'High', color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', border: 'border-[#D97706]/30', dot: 'bg-[#D97706]' },
  medium: { label: 'Medium', color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]', border: 'border-[#2563EB]/30', dot: 'bg-[#2563EB]' },
  low: { label: 'Low', color: 'text-[#16A34A]', bg: 'bg-[#F0FDF4]', border: 'border-[#16A34A]/30', dot: 'bg-[#16A34A]' },
};

const statusConfig: Record<IncidentStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Active', color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]' },
  monitoring: { label: 'Monitoring', color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]' },
  resolved: { label: 'Resolved', color: 'text-[#16A34A]', bg: 'bg-[#F0FDF4]' },
};

export default function EmergencyManagementPage() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [expandedId, setExpandedId] = useState<string | null>('INC-001');
  const [filterSeverity, setFilterSeverity] = useState<Severity | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<IncidentStatus | 'all'>('all');
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newSeverity, setNewSeverity] = useState<Severity>('medium');

  const activeCount = incidents.filter((i) => i.status === 'active').length;
  const criticalCount = incidents.filter((i) => i.severity === 'critical' && i.status !== 'resolved').length;
  const resolvedCount = incidents.filter((i) => i.status === 'resolved').length;
  const totalAffected = incidents.filter((i) => i.status !== 'resolved').reduce((sum, i) => sum + i.affectedCount, 0);

  const filtered = incidents.filter((inc) => {
    if (filterSeverity !== 'all' && inc.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && inc.status !== filterStatus) return false;
    return true;
  });

  const resolveIncident = (id: string) => {
    setIncidents((prev) => prev.map((inc) => inc.id === id ? { ...inc, status: 'resolved' } : inc));
  };

  const escalateIncident = (id: string) => {
    setIncidents((prev) => prev.map((inc) => {
      if (inc.id !== id) return inc;
      const order: Severity[] = ['low', 'medium', 'high', 'critical'];
      const idx = order.indexOf(inc.severity);
      return { ...inc, severity: order[Math.min(idx + 1, 3)] as Severity };
    }));
  };

  const submitNewIncident = () => {
    if (!newTitle.trim()) return;
    const newInc: Incident = {
      id: `INC-${String(incidents.length + 1).padStart(3, '0')}`,
      title: newTitle,
      description: newDesc,
      severity: newSeverity,
      status: 'active',
      location: newLocation || 'Location TBD',
      affectedCount: 1,
      reportedAt: 'Just now',
      assignedTo: 'Unassigned',
      pilgrimIds: [],
    };
    setIncidents((prev) => [newInc, ...prev]);
    setNewTitle(''); setNewDesc(''); setNewLocation(''); setNewSeverity('medium');
    setShowNewForm(false);
  };

  const emergencyContacts = [
    { name: 'Saudi Red Crescent', role: 'Medical Emergency', phone: '911', icon: Heart, color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]' },
    { name: 'Hajj Security Forces', role: 'Security & Safety', phone: '920001234', icon: Shield, color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]' },
    { name: 'Makkah Civil Defense', role: 'Fire & Rescue', phone: '998', icon: Siren, color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]' },
    { name: 'Hajj Ministry Hotline', role: 'Pilgrim Affairs', phone: '920002814', icon: Users, color: 'text-primary', bg: 'bg-secondary' },
  ];

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {activeCount > 0 && (
              <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#DC2626] text-white uppercase tracking-wider animate-pulse">
                {activeCount} Active
              </span>
            )}
            <span className="text-muted-foreground text-sm">Hajj 2027 · Emergency Operations</span>
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Emergency Management</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage incidents, emergencies, and critical alerts</p>
        </div>
        <button onClick={() => setShowNewForm(true)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} />
          Report Incident
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="card-base border border-[#DC2626]/30 bg-[#FEF2F2]">
          <p className="text-xs font-500 uppercase tracking-wide text-[#DC2626] mb-2">Active Incidents</p>
          <p className="text-3xl font-bold text-[#DC2626] tabular-nums">{activeCount}</p>
          <p className="text-xs text-[#DC2626]/70 mt-1">Require action</p>
        </div>
        <div className="card-base border border-[#DC2626]/20">
          <p className="text-xs font-500 uppercase tracking-wide text-muted-foreground mb-2">Critical</p>
          <p className="text-3xl font-bold text-foreground tabular-nums">{criticalCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Highest priority</p>
        </div>
        <div className="card-base">
          <p className="text-xs font-500 uppercase tracking-wide text-muted-foreground mb-2">Pilgrims Affected</p>
          <p className="text-3xl font-bold text-foreground tabular-nums">{totalAffected}</p>
          <p className="text-xs text-muted-foreground mt-1">Open incidents</p>
        </div>
        <div className="card-base border-l-4 border-l-[#16A34A]">
          <p className="text-xs font-500 uppercase tracking-wide text-muted-foreground mb-2">Resolved Today</p>
          <p className="text-3xl font-bold text-[#16A34A] tabular-nums">{resolvedCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Closed incidents</p>
        </div>
      </div>

      {/* New Incident Form */}
      {showNewForm && (
        <div className="card-base mb-6 border-2 border-[#DC2626]/30">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle size={15} className="text-[#DC2626]" />
              Report New Incident
            </h3>
            <button onClick={() => setShowNewForm(false)} className="text-muted-foreground hover:text-foreground">
              <XCircle size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Incident title *"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="text"
              placeholder="Location"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <textarea
            placeholder="Description…"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={2}
            className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 mb-3 resize-none"
          />
          <div className="flex items-center gap-3">
            <select
              value={newSeverity}
              onChange={(e) => setNewSeverity(e.target.value as Severity)}
              className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <button onClick={submitNewIncident} className="btn-primary text-sm">Submit Incident</button>
            <button onClick={() => setShowNewForm(false)} className="btn-secondary text-sm">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Incidents List */}
        <div className="xl:col-span-2 space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'critical', 'high', 'medium', 'low'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterSeverity(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filterSeverity === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary/30'}`}
              >
                {s === 'all' ? 'All Severity' : severityConfig[s].label}
              </button>
            ))}
            <div className="w-px bg-border mx-1" />
            {(['all', 'active', 'monitoring', 'resolved'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filterStatus === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary/30'}`}
              >
                {s === 'all' ? 'All Status' : statusConfig[s].label}
              </button>
            ))}
          </div>

          {/* Incident Cards */}
          <div className="space-y-3">
            {filtered.map((inc) => {
              const sev = severityConfig[inc.severity];
              const sta = statusConfig[inc.status];
              const isExpanded = expandedId === inc.id;
              const affectedPilgrims = pilgrims.filter((p) => inc.pilgrimIds.includes(p.id));

              return (
                <div key={inc.id} className={`card-base border-l-4 ${inc.status === 'resolved' ? 'opacity-70' : ''}`} style={{ borderLeftColor: inc.severity === 'critical' ? '#DC2626' : inc.severity === 'high' ? '#D97706' : inc.severity === 'medium' ? '#2563EB' : '#16A34A' }}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${sev.bg}`}>
                      <AlertTriangle size={15} className={sev.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${sev.bg} ${sev.color}`}>{sev.label}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sta.bg} ${sta.color}`}>{sta.label}</span>
                            <span className="text-xs text-muted-foreground">{inc.id}</span>
                          </div>
                          <p className="text-sm font-semibold text-foreground mt-1">{inc.title}</p>
                        </div>
                        <button onClick={() => setExpandedId(isExpanded ? null : inc.id)} className="text-muted-foreground hover:text-foreground flex-shrink-0 mt-1">
                          {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                        </button>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin size={11} />{inc.location}</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{inc.reportedAt}</span>
                        <span className="flex items-center gap-1"><Users size={11} />{inc.affectedCount} affected</span>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border space-y-3">
                      <p className="text-sm text-muted-foreground">{inc.description}</p>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Assigned to:</span>
                        <span className="font-medium text-foreground">{inc.assignedTo}</span>
                      </div>
                      {affectedPilgrims.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">Affected Pilgrims:</p>
                          <div className="space-y-1.5">
                            {affectedPilgrims.map((p) => (
                              <div key={p.id} className="flex items-center gap-2 text-xs bg-muted rounded-lg px-3 py-2">
                                <span className="font-medium text-foreground">{p.name}</span>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-muted-foreground">{p.id}</span>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-muted-foreground">{p.phone}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {inc.status !== 'resolved' && (
                        <div className="flex gap-2 pt-1">
                          <button onClick={() => resolveIncident(inc.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F0FDF4] text-[#16A34A] text-xs font-medium border border-[#16A34A]/20 hover:bg-[#DCFCE7] transition-colors">
                            <CheckCircle2 size={12} />
                            Mark Resolved
                          </button>
                          {inc.severity !== 'critical' && (
                            <button onClick={() => escalateIncident(inc.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEF2F2] text-[#DC2626] text-xs font-medium border border-[#DC2626]/20 hover:bg-[#FEE2E2] transition-colors">
                              <AlertTriangle size={12} />
                              Escalate
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          {/* Emergency Contacts */}
          <div className="card-base">
            <h3 className="text-sm font-semibold text-foreground mb-4">Emergency Contacts</h3>
            <div className="space-y-3">
              {emergencyContacts.map((ec) => {
                const Icon = ec.icon;
                return (
                  <div key={ec.name} className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/20 transition-colors">
                    <div className={`p-2 rounded-lg flex-shrink-0 ${ec.bg}`}>
                      <Icon size={15} className={ec.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground">{ec.name}</p>
                      <p className="text-xs text-muted-foreground">{ec.role}</p>
                    </div>
                    <a href={`tel:${ec.phone}`} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-[#155a3e] transition-colors">
                      <Phone size={11} />
                      {ec.phone}
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Group Leader Contacts */}
          <div className="card-base">
            <h3 className="text-sm font-semibold text-foreground mb-4">Group Leader Contacts</h3>
            <div className="space-y-2.5">
              {groupLeaders.slice(0, 5).map((gl) => (
                <div key={gl.id} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-semibold text-primary">{gl.name.split(' ')[1]?.charAt(0) ?? 'G'}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{gl.name.replace('Sheikh ', '')}</p>
                    <p className="text-xs text-muted-foreground">{gl.groupId} · {gl.pilgrimCount} pilgrims</p>
                  </div>
                  <a href={`tel:${gl.phone}`} className="p-1.5 rounded-lg bg-muted hover:bg-secondary text-muted-foreground hover:text-primary transition-colors">
                    <Phone size={12} />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-base">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'Send Mass Alert to All Groups', color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]', border: 'border-[#DC2626]/20' },
                { label: 'Generate Emergency Report', color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]', border: 'border-[#2563EB]/20' },
                { label: 'Export Pilgrim Emergency List', color: 'text-primary', bg: 'bg-secondary', border: 'border-primary/20' },
              ].map((action) => (
                <button key={action.label} className={`w-full text-left px-3 py-2.5 rounded-lg border text-xs font-medium ${action.bg} ${action.color} ${action.border} hover:opacity-80 transition-opacity`}>
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
