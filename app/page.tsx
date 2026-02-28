'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import Dashboard from '@/components/Dashboard';
import LeadScraper from '@/components/LeadScraper';
import KanbanBoard from '@/components/KanbanBoard';
import LeadDetailsModal from '@/components/LeadDetailsModal';
import { Lead } from '@/types';

function AppContent({ activeTab }: { activeTab?: string }) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  return (
    <>
      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'scraper' && <LeadScraper />}
      {activeTab === 'crm' && <KanbanBoard onLeadClick={setSelectedLead} />}

      {selectedLead && (
        <LeadDetailsModal lead={selectedLead} onClose={() => setSelectedLead(null)} />
      )}
    </>
  );
}

export default function Page() {
  return (
    <MainLayout>
      <AppContent />
    </MainLayout>
  );
}
