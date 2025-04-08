import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardMetricCard = ({ 
  title, 
  value, 
  color = "bg-blue-500"
}) => {
  // Map color names to tailwind classes
  const colorClasses = {
    "bg-blue-500": "bg-blue-500 hover:bg-blue-600",
    "bg-red-500": "bg-bookred hover:bg-red-600",
    "bg-green-500": "bg-bookgreen hover:bg-green-600",
    "bg-orange-500": "bg-bookorange hover:bg-orange-600",
  };

  const colorClass = colorClasses[color] || colorClasses["bg-blue-500"];

  return (
    <Card className={`${colorClass} text-white transition-colors`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl md:text-4xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
};

export default DashboardMetricCard;