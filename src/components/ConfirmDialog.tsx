import { useId } from 'react'
import { ModalShell } from './ModalShell'

type ConfirmDialogProps = {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  tone?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId()

  return (
    <ModalShell
      title={title}
      titleId={titleId}
      onClose={onCancel}
      size="md"
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onCancel} className="btn-ghost">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              tone === 'danger'
                ? 'inline-flex items-center justify-center bg-danger px-5 py-2.5 text-sm font-medium text-white hover:bg-danger/90'
                : 'btn-primary'
            }
          >
            {confirmLabel}
          </button>
        </div>
      }
    >
      <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
        {message}
      </p>
    </ModalShell>
  )
}
