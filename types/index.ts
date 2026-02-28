export type LeadStage = 'New Leads' | 'Contacted' | 'Follow-up' | 'Closed Won' | 'Closed Lost';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  location: string;
  website: string;
  email: string;
  rating: number;
  reviewsCount: number;
  score: number;
  stage: LeadStage;
  aiInsights?: {
    problems: string[];
    entryAngle: string;
  };
  decisionMakers?: {
    name: string;
    role: string;
    linkedin: string;
  }[];
  generatedEmail?: string;
}
