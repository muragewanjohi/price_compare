'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

const supabase = createClient();

// Rate limiting configuration
const RATE_LIMIT = {
  maxAttempts: 5,
  windowMs: 60000, // 1 minute
  cooldownMs: 60000, // 1 minute cooldown
};

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    const timeElapsed = now - lastAttemptTime;

    // Reset attempts if window has passed
    if (timeElapsed > RATE_LIMIT.windowMs) {
      setLoginAttempts(0);
      return true;
    }

    // Check if we're in cooldown
    if (loginAttempts >= RATE_LIMIT.maxAttempts) {
      const cooldownRemaining = Math.ceil((RATE_LIMIT.cooldownMs - timeElapsed) / 1000);
      throw new Error(`Too many login attempts. Please wait ${cooldownRemaining} seconds.`);
    }

    return true;
  }, [lastAttemptTime, loginAttempts]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Check rate limiting
      checkRateLimit();

      setIsLoading(true);
      setError(null);

      // Update attempt counter
      setLoginAttempts(prev => prev + 1);
      setLastAttemptTime(Date.now());

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        if (signInError.message.includes('rate_limit')) {
          throw new Error('Too many login attempts. Please wait a minute and try again.');
        }
        throw signInError;
      }

      // Success - reset attempts and redirect
      setLoginAttempts(0);
      toast.success('Successfully logged in!');
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err.message);
      console.error('Error signing in:', err.message);
      
      if (err.message.includes('rate_limit')) {
        toast.error('Too many attempts. Please wait a minute before trying again.');
      } else {
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate remaining cooldown time
  const getCooldownMessage = useCallback(() => {
    if (loginAttempts >= RATE_LIMIT.maxAttempts) {
      const now = Date.now();
      const timeElapsed = now - lastAttemptTime;
      const cooldownRemaining = Math.ceil((RATE_LIMIT.cooldownMs - timeElapsed) / 1000);
      if (cooldownRemaining > 0) {
        return `Please wait ${cooldownRemaining} seconds before trying again.`;
      }
    }
    return null;
  }, [loginAttempts, lastAttemptTime]);

  const cooldownMessage = getCooldownMessage();
  const isDisabled = isLoading || (loginAttempts >= RATE_LIMIT.maxAttempts && !!cooldownMessage);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          {cooldownMessage && (
            <div className="text-orange-500 text-sm text-center">{cooldownMessage}</div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                disabled={isDisabled}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                disabled={isDisabled}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isDisabled}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 