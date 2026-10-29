import type { Bug } from '../types'

const STORAGE_KEY = 'bugboard-bugs-v1'

export function loadBugs(): Bug[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as Bug[]) : []
  } catch {
    return []
  }
}

export function saveBugs(bugs: Bug[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bugs))
}

export function createId() {
  return crypto.randomUUID()
}
