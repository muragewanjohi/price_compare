'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setEmail(session.user.email);
      }
    };
    checkSession();
  }, [supabase.auth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Check your email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We've sent a verification link to{' '}
            <span className="font-medium text-indigo-600">{email}</span>
          </p>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please check your email and click the verification link to continue.
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <div className="text-sm text-center">
            <button
              onClick={() => router.push('/auth/login')}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Return to login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 