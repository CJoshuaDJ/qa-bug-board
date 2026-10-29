import { STATUS_LABELS, type BugStatus } from '../types'

type Stats = {
  total: number
  open: number
  in_progress: number
  fixed: number
  wont_fix: number
  closed: number
}

type StatsBarProps = {
  stats: Stats
}

const items: Array<{ key: keyof Stats; label: string }> = [
  { key: 'total', label: 'Total' },
  ...(Object.keys(STATUS_LABELS) as BugStatus[]).map((status) => ({
    key: status as keyof Stats,
    label: STATUS_LABELS[status],
  })),
]

export function StatsBar({ stats }: StatsBarProps) {
  return (
    <ul className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-6">
      {items.map((item) => (
        <li key={item.key}>
          <p className="text-xs font-medium text-mute">{item.label}</p>
          <p className="mt-1 font-display text-4xl leading-none tracking-tight text-ink tabular-nums sm:text-5xl">
            {stats[item.key]}
          </p>
        </li>
      ))}
    </ul>
  )
}
