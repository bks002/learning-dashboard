interface DashboardCardProps {
  label: string
  value: number
  variant?: 'default' | 'accent' | 'warning'
}

export function DashboardCard({
  label,
  value,
  variant = 'default',
}: DashboardCardProps) {
  return (
    <article
      className={`dashboard-card${variant !== 'default' ? ` dashboard-card--${variant}` : ''}`}
    >
      <p className="dashboard-card__label">{label}</p>
      <p className="dashboard-card__value" aria-label={`${label}: ${value}`}>
        {value}
      </p>
    </article>
  )
}
