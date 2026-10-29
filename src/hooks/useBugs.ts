import { useEffect, useMemo, useState } from 'react'
import { createSeedBugs } from '../lib/seed'
import { createId, loadBugs, saveBugs } from '../lib/storage'
import type { Bug, BugInput, BugSeverity, BugStatus } from '../types'

export type StatusFilter = BugStatus | 'all'
export type SeverityFilter = BugSeverity | 'all'

export function useBugs() {
  const [bugs, setBugs] = useState<Bug[]>(() => {
    const stored = loadBugs()
    if (stored.length > 0) return stored
    return createSeedBugs()
  })
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [severityFilter, setSeverityFilter] = useState<SeverityFilter>('all')

  useEffect(() => {
    saveBugs(bugs)
  }, [bugs])

  const addBug = (input: BugInput) => {
    const now = new Date().toISOString()
    const next: Bug = {
      ...input,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    }
    setBugs((current) => [next, ...current])
  }

  const updateBug = (id: string, input: BugInput) => {
    setBugs((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, ...input, updatedAt: new Date().toISOString() }
          : item,
      ),
    )
  }

  const updateBugStatus = (id: string, status: BugStatus) => {
    setBugs((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item,
      ),
    )
  }

  const deleteBug = (id: string) => {
    setBugs((current) => current.filter((item) => item.id !== id))
  }

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return bugs.filter((item) => {
      const matchesStatus =
        statusFilter === 'all' ? true : item.status === statusFilter
      const matchesSeverity =
        severityFilter === 'all' ? true : item.severity === severityFilter
      const matchesQuery =
        normalized.length === 0 ||
        item.title.toLowerCase().includes(normalized) ||
        item.description.toLowerCase().includes(normalized) ||
        item.environment.toLowerCase().includes(normalized) ||
        item.reporter.toLowerCase().includes(normalized)
      return matchesStatus && matchesSeverity && matchesQuery
    })
  }, [bugs, query, statusFilter, severityFilter])

  const stats = useMemo(() => {
    return bugs.reduce(
      (acc, item) => {
        acc.total += 1
        acc[item.status] += 1
        return acc
      },
      {
        total: 0,
        open: 0,
        in_progress: 0,
        fixed: 0,
        wont_fix: 0,
        closed: 0,
      },
    )
  }, [bugs])

  return {
    bugs,
    filtered,
    stats,
    query,
    setQuery,
    statusFilter,
    setStatusFilter,
    severityFilter,
    setSeverityFilter,
    addBug,
    updateBug,
    updateBugStatus,
    deleteBug,
  }
}
