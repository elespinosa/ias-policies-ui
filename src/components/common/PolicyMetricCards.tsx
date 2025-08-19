import MetricCard from "@/components/customUI/MetricCard";
import { formatNumberShortLocalized } from "@/functions/actions";
import { cn, getDefaultCurrency } from "@/lib/utils";
import { t } from "i18next";
import {
  CircleSlash,
  LucideIcon,
  MoveHorizontalIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React from "react";

interface MetricItem {
  type: string;
  value: number | null;
  icon: LucideIcon;
  percent_change: number | null;
  className?: string;
}

interface MetricCardsProps {
  metrics: MetricItem[];
  namespace?: string;
}

const currency = getDefaultCurrency(); // TODO: make this dynamic

const cardConfig = {
  total_policies: {
    bg: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950",
    border: "border border-blue-200 dark:border-blue-700",
    iconBg: "bg-blue-500 dark:bg-blue-700",
    icon: "file-text",
    text: "text-blue-900 dark:text-blue-100",
    labelText: "text-blue-700/80 dark:text-blue-200/80 tracking-wide",
    valueText: "text-3xl font-bold text-blue-900 dark:text-blue-100",
    iconSize: "h-6 w-6",
    iconPadding: "p-3",
  },
  active_policies: {
    bg: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-950",
    border: "border border-green-200 dark:border-green-700",
    iconBg: "bg-green-500 dark:bg-green-700",
    icon: "shield",
    text: "text-green-900 dark:text-green-100",
    labelText: "text-green-700/80 dark:text-green-200/80 tracking-wide",
    valueText: "text-3xl font-bold text-green-900 dark:text-green-100",
    iconSize: "h-6 w-6",
    iconPadding: "p-3",
  },
  for_renewal: {
    bg: "bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900 dark:to-orange-950",
    border: "border border-orange-200 dark:border-orange-700",
    iconBg: "bg-orange-500 dark:bg-orange-700",
    icon: "refresh-cw",
    text: "text-orange-900 dark:text-orange-100",
    labelText: "text-orange-700/80 dark:text-orange-200/80 tracking-wide",
    valueText: "text-3xl font-bold text-orange-900 dark:text-orange-100",
    iconSize: "h-6 w-6",
    iconPadding: "p-3",
  },
  premium_month: {
    bg: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-950",
    border: "border border-purple-200 dark:border-purple-700",
    iconBg: "bg-purple-500 dark:bg-purple-700",
    icon: currency.icon,
    text: "text-purple-900 dark:text-purple-100",
    labelText: "text-purple-700/80 dark:text-purple-200/80 tracking-wide",
    valueText: "text-3xl font-bold text-purple-900 dark:text-purple-100",
    iconSize: "h-6 w-6",
    iconPadding: "p-3",
  },
};

const PolicyMetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  namespace = "common",
}) => {
  const getDescription = (percent_change: number | null) => {
    let colorClass = "";
    let Icon = null;
    if (percent_change === null) {
      colorClass = "text-muted-foreground";
      Icon = <CircleSlash className="h-4 w-4" />; // or use a neutral icon if you prefer
    } else if (percent_change > 0) {
      colorClass = "text-green-600 dark:text-green-400";
      Icon = <TrendingUp className="h-4 w-4" />;
    } else if (percent_change < 0) {
      colorClass = "text-destructive dark:text-red-400";
      Icon = <TrendingDown className="h-4 w-4" />;
    } else {
      colorClass = "text-muted-foreground";
      Icon = <MoveHorizontalIcon className="h-4 w-4" />; // or use a neutral icon if you prefer
    }
    return (
      <p
        className={cn(
          "mt-2 text-xs font-medium flex items-center gap-1",
          colorClass
        )}
      >
        {Icon}
        {percent_change !== null
          ? `${t(`${namespace}:from_last_month`, {
              percentChange: (percent_change > 0 ? "+" : "") + percent_change,
            })}`
          : t(`${namespace}:not_enough_data_yet`)}
      </p>
    );
  };

  const getValue = (item: MetricItem) => {
    if (item.type === "premium_month") {
      return (
        <>
          {currency.symbol}
          {formatNumberShortLocalized(item.value ?? 0)}
        </>
      );
    }
    return Number(item.value ?? 0).toLocaleString();
  };

  return (
    <div className="grid w-full gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((item, index) => (
        <MetricCard
          key={index}
          title={item.type}
          label={t(`${namespace}:${item.type}`)}
          value={getValue(item)}
          description={getDescription(item.percent_change)}
          cardConfig={cardConfig[item.type]}
        />
      ))}
    </div>
  );
};

export default PolicyMetricCards;
