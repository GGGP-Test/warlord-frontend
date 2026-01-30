'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/LoadingSpinner';
import { getCompanyProfile } from '@/lib/api';

export default function VerifyingPage() {
  const router = useRouter();
  const [status, setStatus] = useState('Initializing verification...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const steps = [
      { message: 'Resolving domain...', delay: 1000 },
      { message: 'Searching company website...', delay: 2000 },
      { message: 'Extracting company information...', delay: 3000 },
      { message: 'Analyzing data...', delay: 2000 },
      { message: 'Finalizing profile...', delay: 1000 },
    ];

    let currentStep = 0;

    const runSteps = async () => {
      for (const step of steps) {
        setStatus(step.message);
        setProgress(((currentStep + 1) / steps.length) * 100);
        await new Promise((resolve) => setTimeout(resolve, step.delay));
        currentStep++;
      }

      // In production, this would poll the backend for actual status
      // For now, redirect to decision point after animation
      router.push('/choose-path');
    };

    runSteps();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Verifying Your Company</h1>
          <p className="text-gray-400">
            Our AI is analyzing your company's online presence...
          </p>
        </div>

        <div className="bg-warlord-secondary border border-gray-700 rounded-lg p-8 space-y-6">
          <LoadingSpinner message={status} />

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-warlord-accent h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500 text-center">
              {Math.round(progress)}% complete
            </p>
          </div>

          {/* Cost Cascade Info */}
          <div className="pt-4 border-t border-gray-700 text-sm space-y-2">
            <p className="text-gray-500 text-center">Cost Optimization Active</p>
            <div className="flex justify-center space-x-4 text-xs">
              <span className="text-green-400">✓ FREE</span>
              <span className="text-blue-400">→ CHEAP</span>
              <span className="text-purple-400">→ EXPENSIVE</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          This usually takes 10-30 seconds depending on data availability.
        </p>
      </div>
    </main>
  );
}
