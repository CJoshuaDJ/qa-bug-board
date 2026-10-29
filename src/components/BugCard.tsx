import { ChevronDown, GripVertical } from 'lucide-react'
import {
  attachBugDragPreview,
  clearBugDragPreview,
  setBugDragData,
} from '../lib/dnd'
import type { Bug, BugStatus } from '../types'
import { SEVERITY_LABELS, STATUS_LABELS, STATUSES } from '../types'

type BugCardProps = {
  bug: Bug
  isDragging: boolean
  onDragStart: (bugId: string) => void
  onDragEnd: () => void
  onEdit: (bug: Bug) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: BugStatus) => void
}

const severityTone: Record<Bug['severity'], string> = {
  critical: 'text-danger',
  high: 'text-mark',
  medium: 'text-ink-soft',
  low: 'text-mute',
}

export function BugCard({
  bug,
  isDragging,
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
  onStatusChange,
}: BugCardProps) {
  if (isDragging) {
    return (
      <div
        className="bug-card-placeholder flex min-h-[7.5rem] items-center px-1 py-5"
        aria-hidden
      >
        <p className="font-mono text-[11px] tracking-[0.14em] text-mute uppercase">
          Moving · {bug.title}
        </p>
      </div>
    )
  }

  return (
    <article
      draggable
      onDragStart={(event) => {
        setBugDragData(event, bug.id)
        attachBugDragPreview(event, bug)
        onDragStart(bug.id)
      }}
      onDragEnd={() => {
        clearBugDragPreview()
        onDragEnd()
      }}
      className="group cursor-grab border-t border-line py-5 active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span
            className="text-ink-soft"
            title="Drag to another column"
            aria-hidden
          >
            <GripVertical size={16} />
          </span>
          <p
            className={`font-mono text-[11px] tracking-[0.14em] uppercase ${severityTone[bug.severity]}`}
          >
            {SEVERITY_LABELS[bug.severity]}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => onEdit(bug)}
            className="text-xs font-medium text-ink-soft underline decoration-line underline-offset-2 hover:text-ink hover:decoration-ink"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(bug.id)}
            className="text-xs font-medium text-mute underline decoration-transparent underline-offset-2 hover:text-danger hover:decoration-danger"
          >
            Delete
          </button>
        </div>
      </div>

      <h3 className="mt-2.5 text-base leading-snug font-medium text-ink">
        {bug.title}
      </h3>

      {bug.description ? (
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-mute">
          {bug.description}
        </p>
      ) : null}

      {(bug.environment || bug.reporter) && (
        <p className="mt-3 text-xs leading-relaxed text-mute">
          {[bug.environment, bug.reporter].filter(Boolean).join(' · ')}
        </p>
      )}

      <label
        className="mt-4 block"
        onPointerDown={(event) => event.stopPropagation()}
      >
        <span className="mb-1.5 block text-xs font-medium text-ink-soft">
          Move to
        </span>
        <span className="relative block">
          <select
            value={bug.status}
            onChange={(event) =>
              onStatusChange(bug.id, event.target.value as BugStatus)
            }
            onMouseDown={(event) => event.stopPropagation()}
            className="select-control"
            aria-label={`Status for ${bug.title}`}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-soft"
            aria-hidden
          />
        </span>
      </label>
    </article>
  )
}
