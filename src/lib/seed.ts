import type { Bug } from '../types'
import { createId } from './storage'

export function createSeedBugs(): Bug[] {
  const now = new Date().toISOString()
  const day = (offset: number) => {
    const date = new Date()
    date.setDate(date.getDate() - offset)
    return date.toISOString()
  }

  const samples: Array<Omit<Bug, 'id'>> = [
    {
      title: 'Login button does nothing on mobile Safari',
      description:
        'Tapping Sign in on iPhone Safari never submits the form. Desktop Chrome works.',
      stepsToReproduce:
        '1. Open the login page on iPhone Safari\n2. Enter valid credentials\n3. Tap Sign in',
      expectedResult: 'User is authenticated and redirected to the dashboard.',
      actualResult: 'Button briefly highlights; form never submits; no error shown.',
      severity: 'critical',
      status: 'open',
      environment: 'iOS 18 / Safari 18',
      reporter: 'QA',
      createdAt: day(2),
      updatedAt: day(2),
    },
    {
      title: 'CSV export truncates long notes',
      description:
        'Exported application notes cut off after ~120 characters.',
      stepsToReproduce:
        '1. Open an application with a long notes field\n2. Export CSV\n3. Open the file in a spreadsheet',
      expectedResult: 'Full notes text appears in the Notes column.',
      actualResult: 'Notes are truncated mid-sentence.',
      severity: 'high',
      status: 'in_progress',
      environment: 'Chrome 131 / Windows 11',
      reporter: 'Carl',
      createdAt: day(5),
      updatedAt: day(1),
    },
    {
      title: 'Filter chips scroll off-screen on narrow viewports',
      description: 'Status filters overflow without a clear scroll affordance.',
      stepsToReproduce:
        '1. Resize the browser to 360px width\n2. Open the filter bar\n3. Try to reach the last status chip',
      expectedResult: 'All filters are reachable with horizontal scroll.',
      actualResult: 'Last chips are clipped; no scrollbar hint.',
      severity: 'medium',
      status: 'fixed',
      environment: 'Firefox 134 / Android',
      reporter: 'QA',
      createdAt: day(8),
      updatedAt: now,
    },
    {
      title: 'Dark theme flash on first paint',
      description:
        'Brief light flash before theme preference is applied from localStorage.',
      stepsToReproduce:
        '1. Set theme to dark\n2. Hard refresh the page\n3. Watch the first paint',
      expectedResult: 'Page loads already in dark theme.',
      actualResult: 'White flash for ~100ms before dark styles apply.',
      severity: 'low',
      status: 'wont_fix',
      environment: 'Edge 132',
      reporter: 'Carl',
      createdAt: day(12),
      updatedAt: day(3),
    },
  ]

  return samples.map((item) => ({ ...item, id: createId() }))
}
