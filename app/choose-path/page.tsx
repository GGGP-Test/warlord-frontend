'use client';

import { useState, useEffect } from 'react';
import CompanyProfile from '@/components/CompanyProfile';
import { CompanyProfile as CompanyProfileType } from '@/lib/types';

export default function ChoosePathPage() {
  // Mock data - in production, fetch from Firestore
  const [profile] = useState<CompanyProfileType>({
    name: 'Example Manufacturing Co.',
    industry: 'Industrial Manufacturing',
    size: 'Medium',
    location: 'Detroit, MI',
    products: ['CNC Machining', 'Metal Fabrication', 'Quality Inspection'],
    confidence: 0.87,
    extraction_method: 'CHEAP',
    extraction_cost: 0.05,
    extraction_time_ms: 3420,
  });

  const [selectedPath, setSelectedPath] = useState<'ai' | 'founder' | null>(null);

  const handlePathSelection = (path: 'ai' | 'founder') => {
    setSelectedPath(path);
    
    if (path === 'ai') {
      // Redirect to Onboarding AI flow
      window.location.href = '/onboarding';
    } else {
      // Open Calendly or scheduling interface
      window.open('https://calendly.com/your-link', '_blank');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center">
          <div className="inline-block px-4 py-2 bg-warlord-success bg-opacity-10 border border-warlord-success rounded-full mb-4">
            <span className="text-warlord-success text-sm font-semibold">
              ✓ Email Verified
            </span>
          </div>
          <h1 className="text-4xl font-bold mb-4">We Found Your Company!</h1>
          <p className="text-gray-400">
            Here's what our AI extracted about your business.
          </p>
        </div>

        {/* Company Profile Display */}
        <div className="flex justify-center">
          <CompanyProfile profile={profile} />
        </div>

        {/* Path Selection */}
        <div className="bg-warlord-secondary border border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            Choose Your Onboarding Path
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Option A: AI Onboarding */}
            <button
              onClick={() => handlePathSelection('ai')}
              className="group relative bg-gradient-to-br from-warlord-accent to-sky-600 p-8 rounded-lg text-left hover:scale-105 transition-transform"
            >
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-semibold">
                  RECOMMENDED
                </span>
              </div>
              
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-3">Continue with AI</h3>
              <p className="text-sm text-white text-opacity-90 mb-4">
                Let our AI guide you through the rest of the onboarding process.
                Fast, automated, and intelligent.
              </p>
              
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Complete in 5-10 minutes
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Automated supplier matching
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Instant market insights
                </li>
              </ul>
            </button>

            {/* Option B: Founder Call */}
            <button
              onClick={() => handlePathSelection('founder')}
              className="group relative bg-warlord-secondary border-2 border-gray-600 hover:border-warlord-accent p-8 rounded-lg text-left hover:scale-105 transition-all"
            >
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold mb-3">Talk to Founder</h3>
              <p className="text-sm text-gray-400 mb-4">
                Schedule a personalized onboarding call with our founder.
                Perfect for complex needs.
              </p>
              
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  30-minute consultation
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Custom solution design
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  Priority support
                </li>
              </ul>
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-xs text-gray-500 text-center">
          You can always schedule a call later from your dashboard.
        </p>
      </div>
    </main>
  );
}
