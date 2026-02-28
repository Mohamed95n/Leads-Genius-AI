'use client';

import React from 'react';
import { useLeads } from '@/lib/store';
import { Users, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function Dashboard() {
  const { leads } = useLeads();

  const stats = [
    {
      label: 'Total Leads',
      value: leads.length,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-100',
    },
    {
      label: 'Contacted',
      value: leads.filter((l) => l.stage === 'Contacted').length,
      icon: Clock,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
    },
    {
      label: 'Closed Won',
      value: leads.filter((l) => l.stage === 'Closed Won').length,
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-100',
    },
    {
      label: 'Closed Lost',
      value: leads.filter((l) => l.stage === 'Closed Lost').length,
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-100',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Leads</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Score</th>
                <th className="pb-3 font-medium">Stage</th>
              </tr>
            </thead>
            <tbody>
              {leads.slice(0, 5).map((lead) => (
                <tr key={lead.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="py-4 text-sm font-medium text-slate-900">{lead.name}</td>
                  <td className="py-4 text-sm text-slate-500">{lead.location}</td>
                  <td className="py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lead.score >= 80 ? 'bg-green-100 text-green-800' :
                      lead.score >= 50 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {lead.score}
                    </span>
                  </td>
                  <td className="py-4 text-sm text-slate-500">{lead.stage}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500 text-sm">
                    No leads yet. Go to Lead Scraper to find some!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
