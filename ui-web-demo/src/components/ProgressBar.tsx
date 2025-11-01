import React from 'react'

type Props = {
  value: number
  max?: number
}

export default function ProgressBar({ value, max = 100 }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)))
  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-label={`Progress ${pct} percent`}
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="progress-fill" style={{ width: `${pct}%` }} />
      <div className="progress-percent">{pct}%</div>
    </div>
  )
}
