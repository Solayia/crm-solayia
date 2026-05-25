import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  trend?: { value: string; direction: 'up' | 'down' | 'neutral' };
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'amber' | 'purple';
}

const colorMap = {
  blue: { bg: 'bg-blue-50', icon: 'bg-blue-100 text-blue-600', trend: 'text-blue-600' },
  green: { bg: 'bg-green-50', icon: 'bg-green-100 text-green-600', trend: 'text-green-600' },
  amber: { bg: 'bg-amber-50', icon: 'bg-amber-100 text-amber-600', trend: 'text-amber-600' },
  purple: { bg: 'bg-purple-50', icon: 'bg-purple-100 text-purple-600', trend: 'text-purple-600' },
};

export default function KpiCard({ title, value, trend, icon, color }: KpiCardProps) {
  const colors = colorMap[color];

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              {trend.direction === 'up' && <TrendingUp className="w-3.5 h-3.5 text-green-500" />}
              {trend.direction === 'down' && <TrendingDown className="w-3.5 h-3.5 text-red-500" />}
              {trend.direction === 'neutral' && <Minus className="w-3.5 h-3.5 text-gray-400" />}
              <span className={cn(
                'text-xs font-medium',
                trend.direction === 'up' && 'text-green-600',
                trend.direction === 'down' && 'text-red-600',
                trend.direction === 'neutral' && 'text-gray-500',
              )}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', colors.icon)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
