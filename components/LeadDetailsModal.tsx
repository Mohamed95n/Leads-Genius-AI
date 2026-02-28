'use client';

import React, { useState } from 'react';
import { Lead } from '@/types';
import { useLeads } from '@/lib/store';
import { useSettings } from '@/lib/settings';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Building2, MapPin, Phone, Globe, Star, Mail, Loader2, User, Send } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface LeadDetailsModalProps {
  lead: Lead;
  onClose: () => void;
}

export default function LeadDetailsModal({ lead, onClose }: LeadDetailsModalProps) {
  const { updateLead } = useLeads();
  const { getGeminiKey } = useSettings();
  const [activeTab, setActiveTab] = useState<'details' | 'ai' | 'email'>('details');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isFindingDM, setIsFindingDM] = useState(false);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
  const [emailTone, setEmailTone] = useState<'Formal' | 'Friendly' | 'Direct' | 'Consultative'>('Formal');

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const apiKey = getGeminiKey();
      if (!apiKey) {
        alert('Gemini API Key is missing. Please add it in Settings.');
        setIsAnalyzing(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Analyze the following business to identify potential pain points and a sales entry angle.
        Business Name: ${lead.name}
        Location: ${lead.location}
        Rating: ${lead.rating} (${lead.reviewsCount} reviews)
        Website: ${lead.website || 'N/A'}
        
        Return the response EXACTLY as a JSON object inside a markdown code block.
        Example:
        \`\`\`json
        {
          "problems": ["Problem 1", "Problem 2", "Problem 3"],
          "entryAngle": "A smart way to start the conversation..."
        }
        \`\`\`
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const text = response.text || '';
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsed = JSON.parse(jsonMatch[1]);
        updateLead(lead.id, { aiInsights: parsed });
      }
    } catch (error) {
      console.error('Error analyzing lead:', error);
      alert('Failed to analyze lead.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFindDecisionMaker = async () => {
    setIsFindingDM(true);
    try {
      const apiKey = getGeminiKey();
      if (!apiKey) {
        alert('Gemini API Key is missing. Please add it in Settings.');
        setIsFindingDM(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Find the key decision makers (CEO, Founder, Marketing Director, etc.) for the following business.
        Business Name: ${lead.name}
        Location: ${lead.location}
        
        Use the googleSearch tool to find their names and LinkedIn profiles if possible. Avoid customer service contacts.
        
        Return the response EXACTLY as a JSON array of objects inside a markdown code block.
        Example:
        \`\`\`json
        [
          {
            "name": "John Doe",
            "role": "CEO",
            "linkedin": "https://linkedin.com/in/johndoe"
          }
        ]
        \`\`\`
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || '';
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        const parsed = JSON.parse(jsonMatch[1]);
        updateLead(lead.id, { decisionMakers: parsed });
      }
    } catch (error) {
      console.error('Error finding decision maker:', error);
      alert('Failed to find decision makers.');
    } finally {
      setIsFindingDM(false);
    }
  };

  const handleGenerateEmail = async () => {
    setIsGeneratingEmail(true);
    try {
      const apiKey = getGeminiKey();
      if (!apiKey) {
        alert('Gemini API Key is missing. Please add it in Settings.');
        setIsGeneratingEmail(false);
        return;
      }
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `
        Write a highly personalized cold sales email for the following business.
        Business Name: ${lead.name}
        Location: ${lead.location}
        Identified Problems: ${lead.aiInsights?.problems?.join(', ') || 'General growth challenges'}
        Suggested Entry Angle: ${lead.aiInsights?.entryAngle || 'Offering a solution to improve their business'}
        Decision Maker: ${lead.decisionMakers?.[0]?.name || 'Decision Maker'}
        
        Tone: ${emailTone}
        
        The email should be concise, compelling, and end with a clear call to action. Do not include placeholders like [Your Name], just write the email body.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      updateLead(lead.id, { generatedEmail: response.text });
    } catch (error) {
      console.error('Error generating email:', error);
      alert('Failed to generate email.');
    } finally {
      setIsGeneratingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{lead.name}</h2>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Badge variant={lead.score >= 80 ? 'default' : lead.score >= 50 ? 'secondary' : 'destructive'}>
                  Score: {lead.score}
                </Badge>
                <span>•</span>
                <span>{lead.stage}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 border-b border-slate-100">
          {['details', 'ai', 'email'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              {tab === 'ai' ? 'AI Insights' : tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {activeTab === 'details' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Contact Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                      <span className="text-slate-700">{lead.location || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span className="text-slate-700">{lead.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Globe className="w-4 h-4 text-slate-400" />
                      {lead.website ? (
                        <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                          {lead.website}
                        </a>
                      ) : (
                        <span className="text-slate-500">Not provided</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-slate-700 font-medium">{lead.rating > 0 ? lead.rating : 'N/A'}</span>
                      <span className="text-slate-500">({lead.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-8">
              {/* Business Analysis */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Business Analysis</h3>
                  {!lead.aiInsights && (
                    <Button onClick={handleAnalyze} disabled={isAnalyzing} size="sm">
                      {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Star className="w-4 h-4 mr-2" />}
                      Analyze Business
                    </Button>
                  )}
                </div>
                
                {lead.aiInsights ? (
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-2">Potential Problems</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                        {lead.aiInsights.problems.map((prob, i) => (
                          <li key={i}>{prob}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-slate-900 mb-2">Entry Angle</h4>
                      <p className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                        {lead.aiInsights.entryAngle}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                    Click &quot;Analyze Business&quot; to generate AI insights.
                  </div>
                )}
              </div>

              {/* Decision Makers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">Decision Makers</h3>
                  {!lead.decisionMakers && (
                    <Button onClick={handleFindDecisionMaker} disabled={isFindingDM} size="sm" variant="outline">
                      {isFindingDM ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <User className="w-4 h-4 mr-2" />}
                      Find Contacts
                    </Button>
                  )}
                </div>

                {lead.decisionMakers ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {lead.decisionMakers.map((dm, i) => (
                      <div key={i} className="bg-white border border-slate-200 rounded-lg p-4 flex items-start gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{dm.name}</p>
                          <p className="text-xs text-slate-500 mb-1">{dm.role}</p>
                          {dm.linkedin && (
                            <a href={dm.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">
                              LinkedIn Profile
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                    Click &quot;Find Contacts&quot; to search for key personnel.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'email' && (
            <div className="space-y-6 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-slate-700">Tone:</label>
                  <select 
                    value={emailTone}
                    onChange={(e) => setEmailTone(e.target.value as any)}
                    className="text-sm border-slate-200 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Formal">Formal</option>
                    <option value="Friendly">Friendly</option>
                    <option value="Direct">Direct</option>
                    <option value="Consultative">Consultative</option>
                  </select>
                </div>
                <Button onClick={handleGenerateEmail} disabled={isGeneratingEmail} size="sm">
                  {isGeneratingEmail ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                  Generate Email
                </Button>
              </div>

              <div className="flex-1 min-h-[300px] bg-slate-50 rounded-xl border border-slate-200 p-4 relative">
                {lead.generatedEmail ? (
                  <div className="whitespace-pre-wrap text-sm text-slate-700 font-sans">
                    {lead.generatedEmail}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                    No email generated yet.
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
