'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useSettings } from '@/lib/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Save, User, Key, Bell, Database } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  
  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  
  const [geminiKey, setGeminiKey] = useState(settings.geminiApiKey);
  const [stripeKey, setStripeKey] = useState(settings.stripePublishableKey);
  const [firebaseConfig, setFirebaseConfig] = useState(settings.firebaseConfig);
  
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Profile updated successfully!');
  };

  const handleSaveApi = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    updateSettings({
      geminiApiKey: geminiKey,
      stripePublishableKey: stripeKey,
      firebaseConfig: firebaseConfig,
    });
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsSaving(false);
    alert('API keys updated successfully! You may need to refresh the page for Firebase changes to take effect.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-500">Manage your account settings and preferences.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Profile Information</h3>
              <p className="text-sm text-slate-500">Update your personal details.</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                disabled // Usually email changes require verification
              />
            </div>
            <Button type="submit" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </form>
        </div>

        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">API Integrations</h3>
              <p className="text-sm text-slate-500">Connect external services.</p>
            </div>
          </div>

          <form onSubmit={handleSaveApi} className="space-y-6 max-w-xl">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Custom Gemini API Key</label>
              <Input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy..."
              />
              <p className="text-xs text-slate-500 mt-1">
                Leave blank to use the default platform key.
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Stripe Publishable Key</label>
              <Input
                type="password"
                value={stripeKey}
                onChange={(e) => setStripeKey(e.target.value)}
                placeholder="pk_test_..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Firebase Config (JSON)</label>
              <Textarea
                value={firebaseConfig}
                onChange={(e) => setFirebaseConfig(e.target.value)}
                placeholder='{"apiKey": "...", "authDomain": "..."}'
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1">
                Paste your entire Firebase config object here.
              </p>
            </div>

            <Button type="submit" variant="outline" disabled={isSaving}>
              <Save className="w-4 h-4 mr-2" />
              Save API Keys
            </Button>
          </form>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
              <p className="text-sm text-slate-500">Manage your email alerts.</p>
            </div>
          </div>

          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 text-sm">New Lead Alerts</p>
                <p className="text-sm text-slate-500">Get notified when new leads are found.</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle1" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" defaultChecked />
                <label htmlFor="toggle1" className="toggle-label block overflow-hidden h-5 rounded-full bg-indigo-500 cursor-pointer"></label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-slate-900 text-sm">Weekly Report</p>
                <p className="text-sm text-slate-500">Receive a summary of your sales pipeline.</p>
              </div>
              <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle2" className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                <label htmlFor="toggle2" className="toggle-label block overflow-hidden h-5 rounded-full bg-slate-300 cursor-pointer"></label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
