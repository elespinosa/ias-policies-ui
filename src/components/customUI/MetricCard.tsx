
import React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Icons } from './Icons';

interface MetricCardConfig {
  bg: string;
  border: string;
  iconBg: string;
  icon: string;
  text: string;
  gradient?: string;
  labelText?: string;
  valueText?: string;
  iconSize?: string;
  iconPadding?: string;
}

interface MetricCardProps {
  title: string; // e.g. 'total_policies', 'active_policies', etc.
  value: React.ReactNode;
  description?: React.ReactNode;
  // The translated label for the title (e.g. 'Total Policies')
  label: React.ReactNode;
  className?: string;
  cardConfig?: MetricCardConfig;
}

// Color and icon mapping for each metric type
const metricCardConfig: Record<string, MetricCardConfig> = {
  default: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950',
    border: 'border border-blue-200 dark:border-blue-700',
    iconBg: 'bg-blue-500 dark:bg-blue-700',
    icon: 'file-text',
    text: 'text-blue-900 dark:text-blue-100',
    labelText: 'text-blue-700/80 dark:text-blue-200/80 tracking-wide',
    valueText: 'text-3xl font-bold text-blue-900 dark:text-blue-100',
    iconSize: 'h-6 w-6',
    iconPadding: 'p-3',
  },
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description, label, className, cardConfig }) => {
  const config = cardConfig || metricCardConfig['default'];
  return (
    <Card
      className={cn(
        'overflow-hidden hover:shadow-lg transition-all duration-300',
        config.bg,
        config.border,
        className
      )}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className={cn('text-sm font-medium', config.labelText || config.text)}>{label}</p>
            <h3 className={cn('mt-2', config.valueText || config.text)}>{value}</h3>
            {description}
          </div>
          <div className={cn('rounded-full', config.iconPadding || 'p-2.5', config.iconBg)}>
            {Icons(config.icon, `${config.iconSize || 'h-5 w-5'} text-white`)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
