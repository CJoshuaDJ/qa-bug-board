import { useState } from 'react'
import { getBugDragId, isBugDrag } from '../lib/dnd'
import type { Bug, BugStatus } from '../types'
import { STATUS_LABELS } from '../types'
import { BugCard } from './BugCard'

type BoardColumnProps = {
  status: BugStatus
  bugs: Bug[]
  draggingBugId: string | null
  onDragStart: (bugId: string) => void
  onDragEnd: () => void
  onEdit: (bug: Bug) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: BugStatus) => void
  showDivider?: boolean
  isFirst?: boolean
}

export function BoardColumn({
  status,
  bugs,
  draggingBugId,
  onDragStart,
  onDragEnd,
  onEdit,
  onDelete,
  onStatusChange,
  showDivider = false,
  isFirst = false,
}: BoardColumnProps) {
  const [dragOver, setDragOver] = useState(false)
  const isBoardDragging = draggingBugId !== null
  const isActiveDrop = dragOver && isBoardDragging

  return (
    <section
      className={`flex w-[300px] shrink-0 flex-col lg:w-auto lg:min-w-0 ${
        isFirst ? '' : 'pl-5 lg:pl-6'
      } ${showDivider ? 'border-r border-line pr-5 lg:pr-6' : ''}`}
      aria-labelledby={`column-${status}`}
      onDragOver={(event) => {
        if (!isBugDrag(event)) return
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
        setDragOver(true)
      }}
      onDragEnter={(event) => {
        if (!isBugDrag(event)) return
        event.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={(event) => {
        if (event.currentTarget.contains(event.relatedTarget as Node)) return
        setDragOver(false)
      }}
      onDrop={(event) => {
        event.preventDefault()
        setDragOver(false)
        const bugId = getBugDragId(event)
        if (!bugId) return
        onStatusChange(bugId, status)
        onDragEnd()
      }}
    >
      <header
        className={`mb-1 flex items-baseline justify-between gap-3 border-b pb-3 transition-colors ${
          isActiveDrop ? 'border-mark' : 'border-ink'
        }`}
      >
        <h3
          id={`column-${status}`}
          className="font-display text-xl leading-none tracking-tight text-ink"
        >
          {STATUS_LABELS[status]}
        </h3>
        <span
          className={`font-mono text-xs tabular-nums ${
            isActiveDrop ? 'font-medium text-mark' : 'text-mute'
          }`}
        >
          {isActiveDrop ? 'Drop' : String(bugs.length).padStart(2, '0')}
        </span>
      </header>

      <ul
        className={`flex min-h-48 flex-1 flex-col transition-colors ${
          isActiveDrop ? 'column-drop-active' : ''
        } ${isBoardDragging && !isActiveDrop ? 'opacity-80' : ''}`}
      >
        {isActiveDrop ? (
          <li className="border-b border-dashed border-ink/30 px-2 py-3 font-mono text-[11px] tracking-[0.14em] text-ink uppercase">
            Release to move here
          </li>
        ) : null}

        {bugs.length === 0 && !isActiveDrop ? (
          <li
            className={`py-10 text-sm ${
              isBoardDragging ? 'text-ink-soft' : 'text-mute'
            }`}
          >
            {isBoardDragging ? 'Drop here' : 'No bugs in this column'}
          </li>
        ) : (
          bugs.map((bug) => (
            <li key={bug.id}>
              <BugCard
                bug={bug}
                isDragging={draggingBugId === bug.id}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
              />
            </li>
          ))
        )}
      </ul>
    </section>
  )
}
