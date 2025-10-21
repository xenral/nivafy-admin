'use client';

import Image from 'next/image';
import { Suspense } from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="bg-background min-h-screen">
      <div className="container relative min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left side - Branding/Image */}
        <div className="relative hidden h-full flex-col overflow-hidden px-10 pb-10 pt-14 text-white lg:flex dark:border-r">
          <div 
          className="absolute inset-0 z-10 bg-black/20 "
          />
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#111827] to-[#020617]" />
            <div className="absolute -left-28 top-24 h-72 w-72 rounded-full bg-primary/20 blur-[200px]" />
            <div className="absolute bottom-10 right-[-6rem] h-80 w-80 rounded-full bg-blue-500/20 blur-[200px]" />
            <div className="absolute inset-10 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg" />
          </div>
          <div className="relative z-20 flex flex-1 flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/50 px-10 pb-12 pt-12 backdrop-blur">
            <div className="flex justify-center">
              <div className="flex h-22 w-38 items-center justify-center rounded-2xl border border-white/10 bg-white/10 p-3 shadow-lg backdrop-blur">
                <Image src="/logo.png" alt="Nivafy" width={100} height={100} priority />
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">Admin Intelligence</p>
                <h2 className="text-3xl font-semibold leading-tight">
                  Transform operations with real-time insight dashboards.
                </h2>
                <p className="text-sm text-white/70">
                  Nivafy unifies your microservices into one decision layer. Monitor, orchestrate, and act with confidence.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-white/60">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                  <Image src="/logo.png" alt="Nivafy" width={20} height={20} />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-white/80">Nivafy Platform</p>
                  <p>Powering secure communications, media, search, and finance at scale.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth forms */}
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
