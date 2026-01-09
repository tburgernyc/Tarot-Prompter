// app/page.tsx (Dashboard)
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Session {
  id: string;
  topic: string;
  sign: string;
  length: string;
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch('/api/check-auth');
      if (!res.ok) {
        router.push('/unlock');
        return;
      }
      fetchSessions();
    };

    const fetchSessions = async () => {
      try {
        const res = await fetch('/api/sessions');
        if (res.ok) {
          const data = await res.json();
          setSessions(data);
        }
      } catch (error) {
        console.error('Failed to fetch sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Recent Readings</h2>
          <p className="text-slate-600 mt-1">
            Manage and create your tarot script readings
          </p>
        </div>
        <Link href="/new" className="btn-primary">
          + Create New Reading
        </Link>
      </div>

      {sessions.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-slate-600 mb-4">No readings yet. Create one to get started!</p>
          <Link href="/new" className="btn-primary inline-block">
            Create Your First Reading
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {sessions.map((session) => (
            <Link
              key={session.id}
              href={`/session/${session.id}`}
              className="card p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {session.sign} — {session.topic}
                  </h3>
                  <div className="flex gap-4 text-sm text-slate-500 mt-2">
                    <span>{session.length}</span>
                    <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      session.status === 'complete'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <button className="text-primary hover:underline text-sm">
                    Open →
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
