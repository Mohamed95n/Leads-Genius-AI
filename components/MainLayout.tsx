'use client';

import React, { useState } from 'react';
import { LayoutDashboard, MapPin, KanbanSquare, CreditCard, LogOut, Menu, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LeadProvider } from '@/lib/store';
import { useAuth } from '@/lib/auth';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'scraper' | 'crm' | 'billing' | 'settings'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scraper', label: 'Lead Scraper', icon: MapPin },
    { id: 'crm', label: 'Sales CRM', icon: KanbanSquare },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <LeadProvider>
      <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 flex flex-col",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-center h-16 border-b border-slate-200">
            <h1 className="text-xl font-bold text-indigo-600 flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              LeadGenius AI
            </h1>
          </div>
          <nav className="p-4 space-y-2 flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    activeTab === item.id
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-slate-200">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
            <button
              className="md:hidden p-2 text-slate-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="font-medium text-slate-800 capitalize">
              {activeTab.replace('-', ' ')}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-slate-600 hidden sm:block">
                {user?.email}
              </div>
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-sm">
                {user?.email?.[0].toUpperCase() || 'U'}
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-4 md:p-8">
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { activeTab } as any);
              }
              return child;
            })}
          </main>
        </div>
      </div>
    </LeadProvider>
  );
}
