import { useEffect, type ReactNode } from 'react'

type ModalShellProps = {
  title: string
  description?: string
  titleId: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'md' | 'lg'
}

export function ModalShell({
  title,
  description,
  titleId,
  onClose,
  children,
  footer,
  size = 'lg',
}: ModalShellProps) {
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`animate-rise relative z-10 flex max-h-[92vh] w-full flex-col overflow-hidden border border-line bg-paper sm:rounded-none ${
          size === 'lg' ? 'sm:max-w-2xl' : 'sm:max-w-md'
        }`}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.2em] text-mute uppercase">
              BugBoard
            </p>
            <h2
              id={titleId}
              className="mt-2 font-display text-3xl tracking-tight text-ink"
            >
              {title}
            </h2>
            {description ? (
              <p className="mt-2 max-w-md text-sm text-mute">{description}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="font-mono text-[11px] tracking-wide text-mute uppercase hover:text-ink"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-6 sm:px-8">{children}</div>

        {footer ? (
          <div className="border-t border-line px-5 py-4 sm:px-8">{footer}</div>
        ) : null}
      </div>
    </div>
  )
}
