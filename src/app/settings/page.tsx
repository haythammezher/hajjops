'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Settings, User, Bell, Shield, Globe, Palette, Database, Save, ChevronRight, Check, Moon, Sun, Monitor, Phone, Lock, Eye, EyeOff, Upload, Trash2 } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


type SettingsTab = 'campaign' | 'notifications' | 'account' | 'security' | 'appearance' | 'system';

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'campaign', label: 'Campaign', icon: Globe },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'account', label: 'Account', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'system', label: 'System', icon: Database },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5.5 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-primary' : 'bg-muted-foreground/30'}`}
      style={{ height: '22px', width: '40px' }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`}
      />
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0 pr-4">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {desc && <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('campaign');
  const [saved, setSaved] = useState(false);

  // Campaign settings
  const [campaignName, setCampaignName] = useState('Hajj 2027');
  const [campaignYear, setCampaignYear] = useState('2027');
  const [totalCapacity, setTotalCapacity] = useState('850');
  const [defaultCurrency, setDefaultCurrency] = useState('SAR');
  const [timezone, setTimezone] = useState('Asia/Riyadh');
  const [language, setLanguage] = useState('en');

  // Notification settings
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [whatsappNotifs, setWhatsappNotifs] = useState(true);
  const [visaAlerts, setVisaAlerts] = useState(true);
  const [paymentAlerts, setPaymentAlerts] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [flightAlerts, setFlightAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [dailyReport, setDailyReport] = useState(false);

  // Account settings
  const [displayName, setDisplayName] = useState('Omar Mahmoud');
  const [email, setEmail] = useState('omar.mahmoud@hajjops.com');
  const [phone, setPhone] = useState('+966-55-123-4567');
  const [role, setRole] = useState('Campaign Manager');

  // Security settings
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('60');
  const [showPassword, setShowPassword] = useState(false);

  // Appearance settings
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [compactMode, setCompactMode] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // System settings
  const [autoBackup, setAutoBackup] = useState(true);
  const [backupFrequency, setBackupFrequency] = useState('daily');
  const [dataRetention, setDataRetention] = useState('365');
  const [debugMode, setDebugMode] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-card">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Settings &amp; Configuration</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Hajj 2027 · Manage campaign and system preferences</p>
        </div>
        <button
          onClick={handleSave}
          className={`btn-primary gap-2 text-xs transition-all ${saved ? 'bg-[#16A34A] border-[#16A34A]' : ''}`}
        >
          {saved ? <><Check size={13} /> Saved!</> : <><Save size={13} /> Save Changes</>}
        </button>
      </div>

      <div className="p-6">
        <div className="flex gap-6">
          {/* Sidebar Tabs */}
          <div className="w-48 flex-shrink-0">
            <nav className="space-y-0.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left ${
                      activeTab === tab.id
                        ? 'bg-primary/10 text-primary' :'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon size={14} />
                    {tab.label}
                    {activeTab === tab.id && <ChevronRight size={12} className="ml-auto" />}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {activeTab === 'campaign' && (
              <div className="space-y-5">
                <div className="card-base">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Campaign Details</h3>
                  <p className="text-xs text-muted-foreground mb-4">Core campaign configuration for Hajj 2027</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Campaign Name', value: campaignName, setter: setCampaignName, type: 'text' },
                      { label: 'Campaign Year', value: campaignYear, setter: setCampaignYear, type: 'text' },
                      { label: 'Total Capacity (Pilgrims)', value: totalCapacity, setter: setTotalCapacity, type: 'number' },
                      { label: 'Default Currency', value: defaultCurrency, setter: setDefaultCurrency, type: 'select', options: ['SAR', 'USD', 'EUR', 'GBP', 'AED', 'EGP'] },
                      { label: 'Timezone', value: timezone, setter: setTimezone, type: 'select', options: ['Asia/Riyadh', 'Africa/Cairo', 'Europe/London', 'America/New_York'] },
                      { label: 'Language', value: language, setter: setLanguage, type: 'select', options: [{ v: 'en', l: 'English' }, { v: 'ar', l: 'Arabic' }, { v: 'fr', l: 'French' }] },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">{field.label}</label>
                        {field.type === 'select' ? (
                          <select
                            value={field.value}
                            onChange={(e) => field.setter(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                          >
                            {(field.options as (string | { v: string; l: string })[]).map((opt) =>
                              typeof opt === 'string'
                                ? <option key={opt} value={opt}>{opt}</option>
                                : <option key={opt.v} value={opt.v}>{opt.l}</option>
                            )}
                          </select>
                        ) : (
                          <input
                            type={field.type}
                            value={field.value}
                            onChange={(e) => field.setter(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card-base">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Campaign Status</h3>
                  <p className="text-xs text-muted-foreground mb-4">Current campaign phase and milestones</p>
                  <div className="space-y-2">
                    {[
                      { label: 'Registration Phase', status: 'complete', date: 'Closed Oct 2026' },
                      { label: 'Document Collection', status: 'active', date: 'In Progress' },
                      { label: 'Visa Processing', status: 'active', date: 'In Progress' },
                      { label: 'Travel Preparation', status: 'upcoming', date: 'Starts Jun 2027' },
                      { label: 'Hajj Journey', status: 'upcoming', date: 'Sep–Oct 2027' },
                    ].map((phase) => (
                      <div key={phase.label} className="flex items-center justify-between px-3 py-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-2 h-2 rounded-full ${phase.status === 'complete' ? 'bg-[#16A34A]' : phase.status === 'active' ? 'bg-primary' : 'bg-muted-foreground/40'}`} />
                          <span className="text-xs font-medium text-foreground">{phase.label}</span>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          phase.status === 'complete' ? 'bg-[#F0FDF4] text-[#16A34A]' :
                          phase.status === 'active'? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>{phase.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-5">
                <div className="card-base">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Delivery Channels</h3>
                  <p className="text-xs text-muted-foreground mb-4">Choose how you receive notifications</p>
                  <SettingRow label="Email Notifications" desc="Receive alerts via email">
                    <Toggle checked={emailNotifs} onChange={setEmailNotifs} />
                  </SettingRow>
                  <SettingRow label="SMS Notifications" desc="Receive alerts via SMS">
                    <Toggle checked={smsNotifs} onChange={setSmsNotifs} />
                  </SettingRow>
                  <SettingRow label="WhatsApp Notifications" desc="Receive alerts via WhatsApp">
                    <Toggle checked={whatsappNotifs} onChange={setWhatsappNotifs} />
                  </SettingRow>
                </div>

                <div className="card-base">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Alert Types</h3>
                  <p className="text-xs text-muted-foreground mb-4">Configure which events trigger notifications</p>
                  <SettingRow label="Visa Status Alerts" desc="Approvals, rejections, and processing updates">
                    <Toggle checked={visaAlerts} onChange={setVisaAlerts} />
                  </SettingRow>
                  <SettingRow label="Payment Alerts" desc="Overdue payments and new receipts">
                    <Toggle checked={paymentAlerts} onChange={setPaymentAlerts} />
                  </SettingRow>
                  <SettingRow label="Emergency Alerts" desc="Medical and safety emergencies (always on)">
                    <Toggle checked={emergencyAlerts} onChange={setEmergencyAlerts} />
                  </SettingRow>
                  <SettingRow label="Flight Change Alerts" desc="Schedule changes and manifest updates">
                    <Toggle checked={flightAlerts} onChange={setFlightAlerts} />
                  </SettingRow>
                </div>

                <div className="card-base">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Digest & Reports</h3>
                  <p className="text-xs text-muted-foreground mb-4">Scheduled summary emails</p>
                  <SettingRow label="Weekly Digest" desc="Summary every Monday at 08:00 AST">
                    <Toggle checked={weeklyDigest} onChange={setWeeklyDigest} />
                  </SettingRow>
                  <SettingRow label="Daily Operations Report" desc="End-of-day summary at 18:00 AST">
                    <Toggle checked={dailyReport} onChange={setDailyReport} />
                  </SettingRow>
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <div className="space-y-5">
                <div className="card-base">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Profile Information</h3>
                  <p className="text-xs text-muted-foreground mb-4">Update your personal details</p>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-xl font-bold text-primary-foreground">OM</span>
                    </div>
                    <div>
                      <button className="btn-secondary text-xs gap-1.5">
                        <Upload size={12} /> Upload Photo
                      </button>
                      <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG up to 2MB</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Display Name', value: displayName, setter: setDisplayName },
                      { label: 'Role', value: role, setter: setRole },
                      { label: 'Email Address', value: email, setter: setEmail },
                      { label: 'Phone Number', value: phone, setter: setPhone },
                    ].map((f) => (
                      <div key={f.label}>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">{f.label}</label>
                        <input
                          type="text"
                          value={f.value}
                          onChange={(e) => f.setter(e.target.value)}
                          className="w-full px-3 py-2 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-5">
                <div className="card-base">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Authentication</h3>
                  <p className="text-xs text-muted-foreground mb-4">Manage login and access security</p>
                  <SettingRow label="Two-Factor Authentication" desc="Add an extra layer of security to your account">
                    <Toggle checked={twoFactor} onChange={setTwoFactor} />
                  </SettingRow>
                  <SettingRow label="Session Timeout" desc="Auto-logout after inactivity (minutes)">
                    <select
                      value={sessionTimeout}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      className="px-2 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none"
                    >
                      <option value="15">15 min</option>
                      <option value="30">30 min</option>
                      <option value="60">60 min</option>
                      <option value="120">2 hours</option>
                      <option value="0">Never</option>
                    </select>
                  </SettingRow>
                </div>

                <div className="card-base">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Change Password</h3>
                  <p className="text-xs text-muted-foreground mb-4">Update your account password</p>
                  <div className="space-y-3">
                    {['Current Password', 'New Password', 'Confirm New Password'].map((label) => (
                      <div key={label}>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">{label}</label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            className="w-full px-3 py-2 pr-9 text-xs bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                          >
                            {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="btn-primary text-xs gap-1.5 mt-1">
                      <Lock size={12} /> Update Password
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-5">
                <div className="card-base">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Theme</h3>
                  <p className="text-xs text-muted-foreground mb-4">Choose your preferred color scheme</p>
                  <div className="flex gap-3">
                    {([
                      { id: 'light', label: 'Light', icon: Sun },
                      { id: 'dark', label: 'Dark', icon: Moon },
                      { id: 'system', label: 'System', icon: Monitor },
                    ] as const).map((t) => {
                      const Icon = t.icon;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className={`flex-1 flex flex-col items-center gap-2 py-4 rounded-xl border-2 transition-colors ${
                            theme === t.id ? 'border-primary bg-primary/10' : 'border-border bg-muted hover:border-primary/40'
                          }`}
                        >
                          <Icon size={20} className={theme === t.id ? 'text-primary' : 'text-muted-foreground'} />
                          <span className={`text-xs font-medium ${theme === t.id ? 'text-primary' : 'text-muted-foreground'}`}>{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="card-base">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Display Preferences</h3>
                  <p className="text-xs text-muted-foreground mb-4">Customize the interface layout</p>
                  <SettingRow label="Compact Mode" desc="Reduce spacing for denser information display">
                    <Toggle checked={compactMode} onChange={setCompactMode} />
                  </SettingRow>
                  <SettingRow label="Animations" desc="Enable UI transitions and micro-interactions">
                    <Toggle checked={animationsEnabled} onChange={setAnimationsEnabled} />
                  </SettingRow>
                  <SettingRow label="Sidebar Collapsed by Default" desc="Start with sidebar in collapsed state">
                    <Toggle checked={sidebarCollapsed} onChange={setSidebarCollapsed} />
                  </SettingRow>
                </div>
              </div>
            )}

            {activeTab === 'system' && (
              <div className="space-y-5">
                <div className="card-base">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Data Management</h3>
                  <p className="text-xs text-muted-foreground mb-4">Backup and retention settings</p>
                  <SettingRow label="Automatic Backups" desc="Daily automated data backup">
                    <Toggle checked={autoBackup} onChange={setAutoBackup} />
                  </SettingRow>
                  <SettingRow label="Backup Frequency" desc="How often to create backups">
                    <select
                      value={backupFrequency}
                      onChange={(e) => setBackupFrequency(e.target.value)}
                      className="px-2 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none"
                    >
                      <option value="hourly">Hourly</option>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </SettingRow>
                  <SettingRow label="Data Retention (days)" desc="How long to keep archived data">
                    <input
                      type="number"
                      value={dataRetention}
                      onChange={(e) => setDataRetention(e.target.value)}
                      className="w-20 px-2 py-1.5 text-xs bg-muted border border-border rounded-lg focus:outline-none text-center"
                    />
                  </SettingRow>
                </div>

                <div className="card-base">
                  <h3 className="text-sm font-semibold text-foreground mb-1">Advanced</h3>
                  <p className="text-xs text-muted-foreground mb-4">Developer and maintenance options</p>
                  <SettingRow label="Debug Mode" desc="Enable verbose logging for troubleshooting">
                    <Toggle checked={debugMode} onChange={setDebugMode} />
                  </SettingRow>
                  <SettingRow label="Maintenance Mode" desc="Temporarily disable access for all users">
                    <Toggle checked={maintenanceMode} onChange={setMaintenanceMode} />
                  </SettingRow>
                </div>

                <div className="card-base border-[#DC2626]/20">
                  <h3 className="text-sm font-semibold text-[#DC2626] mb-1">Danger Zone</h3>
                  <p className="text-xs text-muted-foreground mb-4">Irreversible actions — proceed with caution</p>
                  <div className="flex flex-col gap-2">
                    <button className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-[#DC2626]/20 hover:bg-[#FEF2F2] transition-colors group">
                      <div>
                        <p className="text-xs font-medium text-foreground group-hover:text-[#DC2626]">Reset Campaign Data</p>
                        <p className="text-xs text-muted-foreground">Clear all pilgrim and operational data</p>
                      </div>
                      <Trash2 size={14} className="text-muted-foreground group-hover:text-[#DC2626]" />
                    </button>
                    <button className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-[#DC2626]/20 hover:bg-[#FEF2F2] transition-colors group">
                      <div>
                        <p className="text-xs font-medium text-foreground group-hover:text-[#DC2626]">Export & Delete Account</p>
                        <p className="text-xs text-muted-foreground">Download all data then permanently delete</p>
                      </div>
                      <Trash2 size={14} className="text-muted-foreground group-hover:text-[#DC2626]" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
