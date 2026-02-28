'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import Dashboard from '@/components/Dashboard';
import LeadScraper from '@/components/LeadScraper';
import KanbanBoard from '@/components/KanbanBoard';
import LeadDetailsModal from '@/components/LeadDetailsModal';
import PricingPlans from '@/components/PricingPlans';
import Settings from '@/components/Settings';
import Login from '@/components/Login';
import { Lead } from '@/types';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

function AppContent({ activeTab }: { activeTab?: string }) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  return (
    <>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'scraper' && <LeadScraper />}
      {activeTab === 'crm' && <KanbanBoard onLeadClick={setSelectedLead} />}
      {activeTab === 'billing' && <PricingPlans />}
      {activeTab === 'settings' && <Settings />}

      {selectedLead && (
        <LeadDetailsModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </>
  );
}

export default function Page() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <MainLayout>
      <AppContent />
    </MainLayout>
  );
}
