import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DivideIcon as LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function KpiCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  className 
}: KpiCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-yellow-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className={cn(
            "text-xs mt-2 flex items-center gap-1",
            trend.isPositive ? "text-green-600" : "text-red-600"
          )}>
            <span>{trend.isPositive ? "↗" : "↘"}</span>
            <span>{Math.abs(trend.value)}% vs mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}