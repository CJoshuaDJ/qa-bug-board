import type { SeverityFilter, StatusFilter } from '../hooks/useBugs'
import {
  SEVERITIES,
  SEVERITY_LABELS,
  STATUS_LABELS,
  STATUSES,
} from '../types'

type FilterBarProps = {
  query: string
  onQueryChange: (value: string) => void
  statusFilter: StatusFilter
  onStatusChange: (value: StatusFilter) => void
  severityFilter: SeverityFilter
  onSeverityChange: (value: SeverityFilter) => void
}

export function FilterBar({
  query,
  onQueryChange,
  statusFilter,
  onStatusChange,
  severityFilter,
  onSeverityChange,
}: FilterBarProps) {
  const statusFilters: Array<{ value: StatusFilter; label: string }> = [
    { value: 'all', label: 'All' },
    ...STATUSES.map((status) => ({
      value: status,
      label: STATUS_LABELS[status],
    })),
  ]

  const severityFilters: Array<{ value: SeverityFilter; label: string }> = [
    { value: 'all', label: 'All' },
    ...SEVERITIES.map((severity) => ({
      value: severity,
      label: SEVERITY_LABELS[severity],
    })),
  ]

  return (
    <div className="grid gap-8 border-y border-line py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-12 lg:py-10">
      <label className="block">
        <span className="mb-2 block text-xs font-medium text-ink-soft">
          Search
        </span>
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Title, environment, reporter"
          className="field-input text-base"
          aria-label="Search bugs"
        />
      </label>

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
        <FilterRow
          label="Status"
          filters={statusFilters}
          active={statusFilter}
          onChange={onStatusChange}
        />
        <FilterRow
          label="Severity"
          filters={severityFilters}
          active={severityFilter}
          onChange={onSeverityChange}
        />
      </div>
    </div>
  )
}

function FilterRow<T extends string>({
  label,
  filters,
  active,
  onChange,
}: {
  label: string
  filters: Array<{ value: T; label: string }>
  active: T
  onChange: (value: T) => void
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium text-ink-soft">{label}</p>
      <div
        className="flex flex-wrap gap-x-4 gap-y-2"
        role="tablist"
        aria-label={`Filter by ${label.toLowerCase()}`}
      >
        {filters.map((filter) => {
          const isActive = active === filter.value
          return (
            <button
              key={filter.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(filter.value)}
              className={`text-sm transition-colors ${
                isActive
                  ? 'font-medium text-ink underline decoration-ink underline-offset-[5px]'
                  : 'text-mute hover:text-ink'
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
