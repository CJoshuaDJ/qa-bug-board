export const STATUSES = [
  'open',
  'in_progress',
  'fixed',
  'wont_fix',
  'closed',
] as const

export type BugStatus = (typeof STATUSES)[number]

export const SEVERITIES = ['critical', 'high', 'medium', 'low'] as const

export type BugSeverity = (typeof SEVERITIES)[number]

export type Bug = {
  id: string
  title: string
  description: string
  stepsToReproduce: string
  expectedResult: string
  actualResult: string
  severity: BugSeverity
  status: BugStatus
  environment: string
  reporter: string
  createdAt: string
  updatedAt: string
}

export type BugInput = Omit<Bug, 'id' | 'createdAt' | 'updatedAt'>

export const STATUS_LABELS: Record<BugStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  fixed: 'Fixed',
  wont_fix: "Won't fix",
  closed: 'Closed',
}

export const SEVERITY_LABELS: Record<BugSeverity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

/** Columns shown on the kanban board (won't fix nests under closed filter UX via board). */
export const BOARD_STATUSES: BugStatus[] = [
  'open',
  'in_progress',
  'fixed',
  'wont_fix',
  'closed',
]
