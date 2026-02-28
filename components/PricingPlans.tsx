'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { useSettings } from '@/lib/settings';

export default function PricingPlans() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { getStripeKey } = useSettings();

  const handleSubscribe = async (planId: string) => {
    setIsLoading(planId);
    try {
      const stripeKey = getStripeKey();
      if (!stripeKey) {
        alert('Stripe Publishable Key is missing. Please add it in Settings.');
        setIsLoading(null);
        return;
      }
      
      // Load stripe dynamically with the key from settings
      const stripe = await loadStripe(stripeKey);
      
      // In a real app, you would call an API route to create a Stripe Checkout Session
      // and then redirect to the URL returned.
      // For this demo, we'll just simulate a delay and show an alert.
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert(`Successfully subscribed to ${planId} plan! (Simulated)`);
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to subscribe.');
    } finally {
      setIsLoading(null);
    }
  };

  const plans = [
    {
      id: 'starter',
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for individuals and small teams getting started.',
      features: [
        'Up to 500 leads/month',
        'Basic AI Insights',
        'Export to CSV',
        'Standard Email Generation',
      ],
      buttonText: 'Get Started',
      popular: false,
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$79',
      period: '/month',
      description: 'Advanced features for growing sales teams.',
      features: [
        'Unlimited leads',
        'Advanced AI Insights & Entry Angles',
        'Decision Maker Finder (LinkedIn)',
        'Custom Email Tones',
        'Priority Support',
      ],
      buttonText: 'Upgrade to Pro',
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      description: 'Custom solutions for large organizations.',
      features: [
        'Everything in Pro',
        'Custom API Access',
        'Dedicated Account Manager',
        'Team Collaboration',
        'Custom Integrations',
      ],
      buttonText: 'Contact Sales',
      popular: false,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Pricing Plans
        </h2>
        <p className="mt-4 text-lg text-slate-500">
          Choose the perfect plan for your sales team. Upgrade or downgrade at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col bg-white rounded-2xl shadow-sm border ${
              plan.popular ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-slate-200'
            } p-8`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-6 transform -translate-y-1/2">
                <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="text-sm text-slate-500 mt-2">{plan.description}</p>
            </div>
            
            <div className="mb-6 flex items-baseline text-slate-900">
              <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
              <span className="text-slate-500 ml-1 font-medium">{plan.period}</span>
            </div>
            
            <ul className="flex-1 space-y-4 mb-8">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-indigo-500" />
                  </div>
                  <p className="ml-3 text-sm text-slate-700">{feature}</p>
                </li>
              ))}
            </ul>
            
            <Button
              variant={plan.popular ? 'default' : 'outline'}
              className="w-full"
              onClick={() => handleSubscribe(plan.id)}
              disabled={isLoading === plan.id}
            >
              {isLoading === plan.id ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                plan.buttonText
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
