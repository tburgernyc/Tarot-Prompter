// app/new/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';

const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const TOPICS = ['General', 'Love', 'Money', 'Career', 'Health', 'Spiritual'];
const LENGTHS = [
  { value: 'short', label: 'Short (~350 words)', duration: '2-3 min read' },
  { value: 'medium', label: 'Medium (~1500 words)', duration: '5-7 min read' },
  { value: 'deep', label: 'Deep (~3000 words)', duration: '10-15 min read' },
];

export default function NewReadingPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    mode: 'collective',
    sign: 'Scorpio',
    querentName: '',
    querentSun: 'Scorpio',
    querentRising: '',
    topic: 'General',
    length: 'medium',
    readingDate: new Date().toISOString().split('T')[0],
    timezone: 'America/New_York',
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const session = await res.json();
        router.push(`/session/${session.id}`);
      } else {
        alert('Failed to create session');
      }
    } catch (error) {
      console.error('Error creating session:', error);
      alert('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create New Reading</h1>
        <p className="text-slate-600">Step {step} of 4</p>
      </div>

      <Card>
        <CardBody className="space-y-6">
          {/* Step 1: Reading Mode */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Reading Mode</h2>
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer" style={{borderColor: formData.mode === 'collective' ? '#208d8e' : '#e2e8f0'}}>
                  <input
                    type="radio"
                    value="collective"
                    checked={formData.mode === 'collective'}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold">Collective Reading</p>
                    <p className="text-sm text-slate-600">For a specific zodiac sign</p>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer" style={{borderColor: formData.mode === 'querent' ? '#208d8e' : '#e2e8f0'}}>
                  <input
                    type="radio"
                    value="querent"
                    checked={formData.mode === 'querent'}
                    onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-semibold">Specific Querent</p>
                    <p className="text-sm text-slate-600">For a named individual</p>
                  </div>
                </label>
              </div>

              {formData.mode === 'collective' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Zodiac Sign</label>
                  <select
                    value={formData.sign}
                    onChange={(e) => setFormData({ ...formData, sign: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    {SIGNS.map((sign) => (
                      <option key={sign} value={sign}>{sign}</option>
                    ))}
                  </select>
                </div>
              )}

              {formData.mode === 'querent' && (
                <div className="space-y-3">
                  <Input
                    label="Querent Name"
                    value={formData.querentName}
                    onChange={(e) => setFormData({ ...formData, querentName: e.target.value })}
                    placeholder="First name"
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">Sun Sign</label>
                    <select
                      value={formData.querentSun}
                      onChange={(e) => setFormData({ ...formData, querentSun: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      {SIGNS.map((sign) => (
                        <option key={sign} value={sign}>{sign}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Rising Sign (Optional)</label>
                    <select
                      value={formData.querentRising}
                      onChange={(e) => setFormData({ ...formData, querentRising: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    >
                      <option value="">None</option>
                      {SIGNS.map((sign) => (
                        <option key={sign} value={sign}>{sign}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Topic & Length */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Topic & Length</h2>
              <div>
                <label className="block text-sm font-medium mb-2">Topic</label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Reading Length</label>
                <div className="space-y-2">
                  {LENGTHS.map((len) => (
                    <label key={len.value} className="flex items-center p-3 border-2 rounded-lg cursor-pointer" style={{borderColor: formData.length === len.value ? '#208d8e' : '#e2e8f0'}}>
                      <input
                        type="radio"
                        value={len.value}
                        checked={formData.length === len.value}
                        onChange={(e) => setFormData({ ...formData, length: e.target.value })}
                        className="mr-3"
                      />
                      <div>
                        <p className="font-medium">{len.label}</p>
                        <p className="text-xs text-slate-600">{len.duration}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Date & Timezone */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Date & Timezone</h2>
              <Input
                label="Reading Date"
                type="date"
                value={formData.readingDate}
                onChange={(e) => setFormData({ ...formData, readingDate: e.target.value })}
              />
              <div>
                <label className="block text-sm font-medium mb-2">Timezone</label>
                <select
                  value={formData.timezone}
                  onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="America/New_York">America/New_York (Eastern)</option>
                  <option value="America/Chicago">America/Chicago (Central)</option>
                  <option value="America/Denver">America/Denver (Mountain)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (Pacific)</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Review & Confirm</h2>
              <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                <p><strong>Mode:</strong> {formData.mode === 'collective' ? `Collective (${formData.sign})` : `Querent (${formData.querentName})`}</p>
                <p><strong>Topic:</strong> {formData.topic}</p>
                <p><strong>Length:</strong> {formData.length}</p>
                <p><strong>Date:</strong> {formData.readingDate}</p>
                <p><strong>Timezone:</strong> {formData.timezone}</p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={step === 1}
        >
          ← Back
        </Button>

        {step < 4 ? (
          <Button variant="primary" onClick={handleNext}>
            Next →
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
            Create Reading
          </Button>
        )}
      </div>
    </div>
  );
}
