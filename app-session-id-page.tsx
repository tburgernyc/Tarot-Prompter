// app/session/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader, CardFooter } from '@/components/ui/Card';

export default function SessionPage() {
  const params = useParams();
  const sessionId = params.id as string;

  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [part1Status, setPart1Status] = useState<'idle' | 'generating' | 'complete'>('idle');
  const [part2Status, setPart2Status] = useState<'idle' | 'generating' | 'complete'>('idle');

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/session/${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data);
        } else {
          setError('Failed to load session');
        }
      } catch (err) {
        setError('An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  const handleGeneratePart1 = async () => {
    setPart1Status('generating');
    try {
      const res = await fetch(`/api/session/${sessionId}/generate-part1`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        setSession((prev: any) => ({
          ...prev,
          part1Script: data.part1Script,
        }));
        setPart1Status('complete');
      } else {
        setError('Failed to generate Part 1');
        setPart1Status('idle');
      }
    } catch (err) {
      setError('An error occurred');
      setPart1Status('idle');
    }
  };

  const handleGeneratePart2 = async () => {
    setPart2Status('generating');
    try {
      const res = await fetch(`/api/session/${sessionId}/generate-part2`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        setSession((prev: any) => ({
          ...prev,
          part2Script: data.part2Script,
          fullScript: data.fullScript,
        }));
        setPart2Status('complete');
      } else {
        setError('Failed to generate Part 2');
        setPart2Status('idle');
      }
    } catch (err) {
      setError('An error occurred');
      setPart2Status('idle');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-slate-600">Loading session...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-4xl mx-auto">
        <p className="text-slate-600">Session not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Reading Session</h1>

      {/* Session Info */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-xl font-semibold">Session Information</h2>
        </CardHeader>
        <CardBody className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-slate-600">Topic</p>
            <p className="font-medium">{session.topic}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Length</p>
            <p className="font-medium capitalize">{session.length}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Date</p>
            <p className="font-medium">{session.readingDate}</p>
          </div>
          <div>
            <p className="text-sm text-slate-600">Status</p>
            <p className="font-medium">{session.status || 'In Progress'}</p>
          </div>
        </CardBody>
      </Card>

      {/* Part 1 */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-lg font-semibold">Part 1: Cold Open + Intro + Grounding</h2>
        </CardHeader>
        <CardBody>
          {session.part1Script ? (
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap text-sm text-slate-900">
              {session.part1Script}
            </div>
          ) : (
            <p className="text-slate-600">Click "Generate Part 1" to create the opening section of your reading script.</p>
          )}
        </CardBody>
        <CardFooter>
          <Button
            variant={session.part1Script ? 'secondary' : 'primary'}
            onClick={handleGeneratePart1}
            isLoading={part1Status === 'generating'}
          >
            {session.part1Script ? 'Regenerate Part 1' : 'Generate Part 1'}
          </Button>
        </CardFooter>
      </Card>

      {/* Spread Recording Section */}
      {session.part1Script && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Record Your Spread</h2>
          </CardHeader>
          <CardBody>
            <p className="text-slate-600 mb-4">
              Record yourself reading the 12-card spread (plus bottom card). The app will transcribe your reading and extract the card names.
            </p>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> Recording feature coming soon. You can manually enter card names below.
              </p>
            </div>
            {session.spreadJson ? (
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Cards Recorded:</p>
                <div className="grid grid-cols-3 gap-2">
                  {session.spreadJson.map((card: string, idx: number) => (
                    <div key={idx} className="bg-white p-2 rounded border border-slate-300 text-sm text-center">
                      {card || `Card ${idx + 1}`}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-slate-600 text-sm">Spread will appear here once recorded.</p>
            )}
          </CardBody>
        </Card>
      )}

      {/* Part 2 */}
      {session.spreadJson && (
        <Card className="mb-6">
          <CardHeader>
            <h2 className="text-lg font-semibold">Part 2: Spread Walkthrough + Actions + Outro</h2>
          </CardHeader>
          <CardBody>
            {session.part2Script ? (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 whitespace-pre-wrap text-sm text-slate-900">
                {session.part2Script}
              </div>
            ) : (
              <p className="text-slate-600">Click "Generate Part 2" to create the spread analysis section.</p>
            )}
          </CardBody>
          <CardFooter>
            <Button
              variant={session.part2Script ? 'secondary' : 'primary'}
              onClick={handleGeneratePart2}
              isLoading={part2Status === 'generating'}
            >
              {session.part2Script ? 'Regenerate Part 2' : 'Generate Part 2'}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Full Script Export */}
      {session.fullScript && (
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Full Script (Ready to Export)</h2>
          </CardHeader>
          <CardBody>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 max-h-96 overflow-y-auto whitespace-pre-wrap text-sm text-slate-900">
              {session.fullScript}
            </div>
          </CardBody>
          <CardFooter>
            <Button
              variant="primary"
              onClick={() => {
                const element = document.createElement('a');
                element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(session.fullScript)}`);
                element.setAttribute('download', `reading-${session.id}.txt`);
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
              }}
            >
              Download Script
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
