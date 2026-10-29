import type { DragEvent } from 'react'
import type { BugSeverity } from '../types'
import { SEVERITY_LABELS } from '../types'

/** Custom type + text/plain for broader browser dragover support. */
export const BUG_DRAG_TYPE = 'application/x-bugboard-id'

const GHOST_ID = 'bugboard-drag-ghost'

export function setBugDragData(event: DragEvent, bugId: string) {
  event.dataTransfer.setData(BUG_DRAG_TYPE, bugId)
  event.dataTransfer.setData('text/plain', bugId)
  event.dataTransfer.effectAllowed = 'move'
}

export function isBugDrag(event: DragEvent): boolean {
  const types = [...event.dataTransfer.types]
  return types.includes(BUG_DRAG_TYPE) || types.includes('text/plain')
}

export function getBugDragId(event: DragEvent): string | null {
  const custom = event.dataTransfer.getData(BUG_DRAG_TYPE)
  if (custom) return custom
  const plain = event.dataTransfer.getData('text/plain')
  return plain.length > 0 ? plain : null
}

export function attachBugDragPreview(
  event: DragEvent,
  bug: { title: string; severity: BugSeverity },
) {
  clearBugDragPreview()

  const ghost = document.createElement('div')
  ghost.id = GHOST_ID
  ghost.className = 'bug-drag-ghost'
  ghost.innerHTML = `
    <p class="bug-drag-ghost__severity">${SEVERITY_LABELS[bug.severity]}</p>
    <p class="bug-drag-ghost__title"></p>
    <p class="bug-drag-ghost__hint">Drop on a column</p>
  `
  const title = ghost.querySelector('.bug-drag-ghost__title')
  if (title) title.textContent = bug.title

  document.body.appendChild(ghost)

  const rect = ghost.getBoundingClientRect()
  event.dataTransfer.setDragImage(ghost, Math.min(40, rect.width / 4), 24)
}

export function clearBugDragPreview() {
  document.getElementById(GHOST_ID)?.remove()
}
