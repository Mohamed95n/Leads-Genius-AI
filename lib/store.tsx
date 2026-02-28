'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Lead, LeadStage } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface LeadContextType {
  leads: Lead[];
  addLeads: (newLeads: Omit<Lead, 'id' | 'stage' | 'score'>[]) => void;
  updateLeadStage: (id: string, stage: LeadStage) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  clearLeads: () => void;
}

const LeadContext = createContext<LeadContextType | undefined>(undefined);

export function LeadProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('leadgenius_leads');
    if (saved) {
      try {
        setLeads(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse leads from local storage', e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('leadgenius_leads', JSON.stringify(leads));
  }, [leads]);

  const calculateScore = (lead: Omit<Lead, 'id' | 'stage' | 'score'>): number => {
    let score = 0;
    if (lead.name) score += 10;
    if (lead.phone) score += 15;
    if (lead.location) score += 10;
    if (lead.website) score += 20;
    if (lead.email) score += 20;
    if (lead.rating >= 4.0) score += 15;
    else if (lead.rating > 0) score += 5;
    if (lead.reviewsCount > 50) score += 10;
    else if (lead.reviewsCount > 0) score += 5;
    return Math.min(100, score);
  };

  const addLeads = (newLeads: Omit<Lead, 'id' | 'stage' | 'score'>[]) => {
    const leadsWithMeta: Lead[] = newLeads.map((lead) => ({
      ...lead,
      id: uuidv4(),
      stage: 'New Leads',
      score: calculateScore(lead),
    }));
    setLeads((prev) => [...leadsWithMeta, ...prev]);
  };

  const updateLeadStage = (id: string, stage: LeadStage) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, stage } : lead))
    );
  };

  const updateLead = (id: string, updates: Partial<Lead>) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
    );
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const clearLeads = () => {
    setLeads([]);
  };

  return (
    <LeadContext.Provider
      value={{ leads, addLeads, updateLeadStage, updateLead, deleteLead, clearLeads }}
    >
      {children}
    </LeadContext.Provider>
  );
}

export function useLeads() {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error('useLeads must be used within a LeadProvider');
  }
  return context;
}
