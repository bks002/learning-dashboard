import { Icon, type IconName } from './Icon'
import './dashboardCard.css'

interface DashboardCardProps {
  label: string
  value: number
  variant?: 'default' | 'accent' | 'warning' | 'success' | 'info'
  icon?: IconName
}

const variantIcons: Record<NonNullable<DashboardCardProps['variant']>, IconName> = {
  default: 'total',
  accent: 'progress',
  warning: 'overdue',
  success: 'completed',
  info: 'priority',
}

export function DashboardCard({
  label,
  value,
  variant = 'default',
  icon,
}: DashboardCardProps) {
  const iconName = icon ?? variantIcons[variant]

  return (
    <article className={`dashboard-card dashboard-card--${variant}`}>
      <div className="dashboard-card__icon-wrap" aria-hidden="true">
        <Icon name={iconName} className="dashboard-card__icon" />
      </div>
      <div className="dashboard-card__content">
        <p className="dashboard-card__label">{label}</p>
        <p className="dashboard-card__value" aria-label={`${label}: ${value}`}>
          {value}
        </p>
      </div>
    </article>
  )
}
