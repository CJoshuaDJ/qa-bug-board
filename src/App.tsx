import { useState } from 'react'
import { BoardColumn } from './components/BoardColumn'
import { BugForm } from './components/BugForm'
import { ConfirmDialog } from './components/ConfirmDialog'
import { FilterBar } from './components/FilterBar'
import { StatsBar } from './components/StatsBar'
import { useBugs } from './hooks/useBugs'
import type { Bug as BugType, BugInput } from './types'
import { BOARD_STATUSES } from './types'

function App() {
  const {
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
  } = useBugs()

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<BugType | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)
  const [draggingBugId, setDraggingBugId] = useState<string | null>(null)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (bug: BugType) => {
    setEditing(bug)
    setFormOpen(true)
  }

  const handleSubmit = (input: BugInput) => {
    if (editing) {
      updateBug(editing.id, input)
    } else {
      addBug(input)
    }
    setFormOpen(false)
    setEditing(null)
  }

  return (
    <div className="min-h-screen">
      <header className="animate-rise border-b border-line">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:items-end lg:justify-between lg:px-10 lg:py-12">
          <div className="max-w-xl">
            <p className="font-mono text-[11px] tracking-[0.22em] text-mute uppercase">
              QA / Issue tracker
            </p>
            <h1 className="mt-3 font-display text-5xl leading-[0.92] tracking-tight text-ink sm:text-6xl lg:text-7xl">
              BugBoard
            </h1>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-mute sm:text-[15px]">
              Capture defects, triage severity, and move work from open to
              closed — saved locally in your browser.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreate}
            className="btn-primary w-fit shrink-0"
          >
            Report bug
          </button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1500px] flex-col gap-12 px-5 py-10 sm:px-8 lg:gap-14 lg:px-10 lg:py-12">
        <section className="animate-fade" style={{ animationDelay: '80ms' }}>
          <StatsBar stats={stats} />
        </section>

        <section
          className="animate-fade"
          style={{ animationDelay: '140ms' }}
        >
          <FilterBar
            query={query}
            onQueryChange={setQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            severityFilter={severityFilter}
            onSeverityChange={setSeverityFilter}
          />
        </section>

        <section
          className="animate-fade"
          style={{ animationDelay: '200ms' }}
        >
          <div className="mb-8 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-3xl tracking-tight text-ink">
                Board
              </h2>
              <p className="mt-1 text-sm text-mute">
                Drag cards between columns, or use Move to.
              </p>
            </div>
            <p className="font-mono text-xs tracking-wide text-mute tabular-nums">
              {filtered.length} shown
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="border border-dashed border-line py-20 text-center">
              <p className="font-display text-3xl tracking-tight text-ink">
                Nothing here
              </p>
              <p className="mx-auto mt-3 max-w-sm text-sm text-mute">
                Clear filters or report a new issue to start the board.
              </p>
              <button
                type="button"
                onClick={openCreate}
                className="btn-text mt-6"
              >
                Report a bug
              </button>
            </div>
          ) : (
            <div className="flex gap-5 overflow-x-auto pb-4 lg:grid lg:grid-cols-5 lg:gap-0 lg:overflow-visible lg:pb-0">
              {BOARD_STATUSES.map((status, index) => (
                <BoardColumn
                  key={status}
                  status={status}
                  bugs={filtered.filter((bug) => bug.status === status)}
                  draggingBugId={draggingBugId}
                  onDragStart={setDraggingBugId}
                  onDragEnd={() => setDraggingBugId(null)}
                  onEdit={openEdit}
                  onDelete={setPendingDeleteId}
                  onStatusChange={updateBugStatus}
                  showDivider={index < BOARD_STATUSES.length - 1}
                  isFirst={index === 0}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {formOpen ? (
        <BugForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => {
            setFormOpen(false)
            setEditing(null)
          }}
        />
      ) : null}

      {pendingDeleteId ? (
        <ConfirmDialog
          title="Delete bug?"
          message="This will permanently remove the bug report from your board. This action cannot be undone."
          confirmLabel="Delete"
          tone="danger"
          onCancel={() => setPendingDeleteId(null)}
          onConfirm={() => {
            deleteBug(pendingDeleteId)
            setPendingDeleteId(null)
          }}
        />
      ) : null}
    </div>
  )
}

export default App
