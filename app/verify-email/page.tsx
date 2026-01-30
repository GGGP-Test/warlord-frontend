'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { verifyEmailToken } from '@/lib/api';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If token is present in URL, verify immediately
    if (token) {
      handleTokenVerification(token);
    }
  }, [token]);

  const handleTokenVerification = async (token: string) => {
    setVerifying(true);
    setError(null);

    const result = await verifyEmailToken(token);

    if (result.success) {
      // Email verified, trigger domain verification
      router.push('/verifying');
    } else {
      setError(result.error || 'Invalid or expired token');
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-warlord-accent border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-400">Verifying your email...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Check Your Email</h1>
          <p className="text-gray-400">
            We've sent a magic link to
          </p>
          {email && (
            <p className="text-warlord-accent font-semibold mt-2">{email}</p>
          )}
        </div>

        <div className="bg-warlord-secondary border border-gray-700 rounded-lg p-6 space-y-4">
          <div className="text-6xl mb-4">📧</div>
          
          <div className="space-y-2 text-sm text-gray-400">
            <p>Click the link in the email to verify your address.</p>
            <p className="text-xs">The link expires in 24 hours.</p>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-warlord-error bg-opacity-10 border border-warlord-error rounded-lg">
              <p className="text-warlord-error text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="pt-8 space-y-2">
          <p className="text-sm text-gray-500">Didn't receive the email?</p>
          <button
            className="text-warlord-accent hover:underline text-sm"
            onClick={() => router.push('/')}
          >
            Try again with a different email
          </button>
        </div>
      </div>
    </main>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-warlord-accent border-t-transparent rounded-full mx-auto" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </main>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
