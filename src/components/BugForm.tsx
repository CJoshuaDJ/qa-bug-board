import { useEffect, useId, useState, type ReactNode } from 'react'
import type { Bug, BugInput } from '../types'
import {
  SEVERITIES,
  SEVERITY_LABELS,
  STATUS_LABELS,
  STATUSES,
} from '../types'
import { ModalShell } from './ModalShell'

type BugFormProps = {
  initial?: Bug | null
  onSubmit: (input: BugInput) => void
  onCancel: () => void
}

const emptyForm: BugInput = {
  title: '',
  description: '',
  stepsToReproduce: '',
  expectedResult: '',
  actualResult: '',
  severity: 'medium',
  status: 'open',
  environment: '',
  reporter: '',
}

export function BugForm({ initial, onSubmit, onCancel }: BugFormProps) {
  const formId = useId()
  const [form, setForm] = useState<BugInput>(emptyForm)

  useEffect(() => {
    if (initial) {
      setForm({
        title: initial.title,
        description: initial.description,
        stepsToReproduce: initial.stepsToReproduce,
        expectedResult: initial.expectedResult,
        actualResult: initial.actualResult,
        severity: initial.severity,
        status: initial.status,
        environment: initial.environment,
        reporter: initial.reporter,
      })
    } else {
      setForm(emptyForm)
    }
  }, [initial])

  const updateField = <K extends keyof BugInput>(
    key: K,
    value: BugInput[K],
  ) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = () => {
    if (!form.title.trim()) return
    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      stepsToReproduce: form.stepsToReproduce.trim(),
      expectedResult: form.expectedResult.trim(),
      actualResult: form.actualResult.trim(),
      environment: form.environment.trim(),
      reporter: form.reporter.trim(),
    })
  }

  return (
    <ModalShell
      title={initial ? 'Edit bug' : 'Report a bug'}
      description="Severity, steps, and expected vs actual — kept simple."
      titleId={`${formId}-title`}
      onClose={onCancel}
      footer={
        <div className="flex flex-wrap justify-end gap-3">
          <button type="button" onClick={onCancel} className="btn-ghost">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="btn-primary">
            {initial ? 'Save changes' : 'Add bug'}
          </button>
        </div>
      }
    >
      <form
        className="grid gap-10"
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit()
        }}
      >
        <section className="grid gap-5">
          <SectionLabel>Summary</SectionLabel>
          <Field label="Title" htmlFor={`${formId}-title`} required>
            <input
              id={`${formId}-title`}
              required
              value={form.title}
              onChange={(event) => updateField('title', event.target.value)}
              className="field-input"
              placeholder="Short, clear description of the issue"
              autoFocus
            />
          </Field>

          <Field label="Description" htmlFor={`${formId}-description`}>
            <textarea
              id={`${formId}-description`}
              value={form.description}
              onChange={(event) =>
                updateField('description', event.target.value)
              }
              className="field-input min-h-24 resize-y"
              placeholder="What went wrong and where?"
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Environment" htmlFor={`${formId}-environment`}>
              <input
                id={`${formId}-environment`}
                value={form.environment}
                onChange={(event) =>
                  updateField('environment', event.target.value)
                }
                className="field-input"
                placeholder="Browser / OS / device"
              />
            </Field>
            <Field label="Reporter" htmlFor={`${formId}-reporter`}>
              <input
                id={`${formId}-reporter`}
                value={form.reporter}
                onChange={(event) =>
                  updateField('reporter', event.target.value)
                }
                className="field-input"
                placeholder="Your name or QA"
              />
            </Field>
          </div>
        </section>

        <section className="grid gap-5">
          <SectionLabel>Triage</SectionLabel>
          <ChoiceRow
            label="Severity"
            options={SEVERITIES.map((severity) => ({
              value: severity,
              label: SEVERITY_LABELS[severity],
            }))}
            value={form.severity}
            onChange={(value) => updateField('severity', value)}
          />
          <ChoiceRow
            label="Status"
            options={STATUSES.map((status) => ({
              value: status,
              label: STATUS_LABELS[status],
            }))}
            value={form.status}
            onChange={(value) => updateField('status', value)}
          />
        </section>

        <section className="grid gap-5">
          <SectionLabel>Reproduction</SectionLabel>
          <Field label="Steps to reproduce" htmlFor={`${formId}-steps`}>
            <textarea
              id={`${formId}-steps`}
              value={form.stepsToReproduce}
              onChange={(event) =>
                updateField('stepsToReproduce', event.target.value)
              }
              className="field-input min-h-28 resize-y"
              placeholder={'1. ...\n2. ...\n3. ...'}
            />
          </Field>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Expected" htmlFor={`${formId}-expected`}>
              <textarea
                id={`${formId}-expected`}
                value={form.expectedResult}
                onChange={(event) =>
                  updateField('expectedResult', event.target.value)
                }
                className="field-input min-h-24 resize-y"
                placeholder="What should happen"
              />
            </Field>
            <Field label="Actual" htmlFor={`${formId}-actual`}>
              <textarea
                id={`${formId}-actual`}
                value={form.actualResult}
                onChange={(event) =>
                  updateField('actualResult', event.target.value)
                }
                className="field-input min-h-24 resize-y"
                placeholder="What actually happened"
              />
            </Field>
          </div>
        </section>
      </form>
    </ModalShell>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-2xl tracking-tight text-ink">{children}</p>
  )
}

function Field({
  label,
  htmlFor,
  required,
  children,
}: {
  label: string
  htmlFor: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-1 block font-mono text-[10px] tracking-[0.16em] text-mute uppercase">
        {label}
        {required ? <span className="text-mark"> *</span> : null}
      </span>
      {children}
    </label>
  )
}

function ChoiceRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.16em] text-mute uppercase">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
        {options.map((option) => {
          const active = value === option.value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`text-sm transition-colors ${
                active
                  ? 'font-medium text-ink underline decoration-ink underline-offset-4'
                  : 'text-mute hover:text-ink'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
