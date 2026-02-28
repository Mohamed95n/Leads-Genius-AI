'use client';

import React, { useState } from 'react';
import { useLeads } from '@/lib/store';
import { useSettings } from '@/lib/settings';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2, Download, Plus } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import Papa from 'papaparse';

export default function LeadScraper() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const { addLeads } = useLeads();
  const { getGeminiKey } = useSettings();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResults([]);

    try {
      const apiKey = getGeminiKey();
      if (!apiKey) {
        alert('Gemini API Key is missing. Please add it in Settings.');
        setIsLoading(false);
        return;
      }
      
      const ai = new GoogleGenAI({ apiKey });
      
      const systemInstruction = `
        You are an expert lead generation assistant. The user will give you a query to find businesses.
        Use the googleMaps tool to find the businesses.
        Then, extract the following details for EACH business found:
        - name (string)
        - phone (string, if available, otherwise empty string)
        - location (string, address or city)
        - website (string, if available, otherwise empty string)
        - rating (number, if available, otherwise 0)
        - reviewsCount (number, if available, otherwise 0)
        
        Return the result EXACTLY as a JSON array of objects inside a markdown code block.
        Example:
        \`\`\`json
        [
          {
            "name": "Business Name",
            "phone": "+123456789",
            "location": "City, Country",
            "website": "https://example.com",
            "rating": 4.5,
            "reviewsCount": 120
          }
        ]
        \`\`\`
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction,
          tools: [{ googleMaps: {} }],
        },
      });

      const text = response.text || '';
      
      // Extract JSON from markdown
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsed = JSON.parse(jsonMatch[1]);
        setResults(parsed);
      } else {
        // Fallback parsing if no markdown block
        try {
           const parsed = JSON.parse(text);
           setResults(parsed);
        } catch (err) {
           console.error("Failed to parse JSON", text);
           alert("Failed to parse results from AI. Please try a different prompt.");
        }
      }

    } catch (error) {
      console.error('Error fetching leads:', error);
      alert('An error occurred while fetching leads.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToCRM = () => {
    if (results.length === 0) return;
    
    const formattedLeads = results.map(r => ({
      name: r.name || 'Unknown',
      phone: r.phone || '',
      location: r.location || '',
      website: r.website || '',
      email: r.email || '', // Might not be available from maps directly
      rating: Number(r.rating) || 0,
      reviewsCount: Number(r.reviewsCount) || 0,
    }));

    addLeads(formattedLeads);
    alert(`Successfully added ${formattedLeads.length} leads to CRM!`);
    setResults([]);
    setPrompt('');
  };

  const handleExportCSV = () => {
    if (results.length === 0) return;
    const csv = Papa.unparse(results);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'leads.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Lead Scraper</h2>
        <p className="text-slate-500 mb-6">
          Describe the businesses you want to find. Example: &quot;Luxury restaurants in Riyadh with rating under 4 stars&quot;
        </p>

        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt..."
              className="pl-10 h-12 text-base"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" disabled={isLoading || !prompt.trim()} className="h-12 px-8">
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Scraping...
              </>
            ) : (
              'Find Leads'
            )}
          </Button>
        </form>
      </div>

      {results.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">
              Found {results.length} Leads
            </h3>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button onClick={handleSaveToCRM}>
                <Plus className="w-4 h-4 mr-2" />
                Save to CRM
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-sm text-slate-500">
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Phone</th>
                  <th className="pb-3 font-medium">Location</th>
                  <th className="pb-3 font-medium">Rating</th>
                  <th className="pb-3 font-medium">Website</th>
                </tr>
              </thead>
              <tbody>
                {results.map((lead, i) => (
                  <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="py-4 text-sm font-medium text-slate-900">{lead.name}</td>
                    <td className="py-4 text-sm text-slate-500">{lead.phone || '-'}</td>
                    <td className="py-4 text-sm text-slate-500">{lead.location}</td>
                    <td className="py-4 text-sm text-slate-500 flex items-center gap-1">
                      {lead.rating > 0 ? (
                        <>
                          <span className="text-yellow-500">★</span>
                          {lead.rating} ({lead.reviewsCount})
                        </>
                      ) : '-'}
                    </td>
                    <td className="py-4 text-sm text-indigo-600">
                      {lead.website ? (
                        <a href={lead.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Link
                        </a>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
