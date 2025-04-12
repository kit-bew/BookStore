// src/components/DashboardMetricCard.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DashboardMetricCard = ({ 
  title, 
  value, 
  color = "bg-primary"
}) => {
  // Map color names to theme-aware classes
  const colorClasses = {
    "bg-primary": "bg-primary hover:bg-primary/90 text-primary-foreground",
    "bg-success": "bg-success hover:bg-success/90 text-success-foreground",
    "bg-warning": "bg-warning hover:bg-warning/90 text-warning-foreground",
    "bg-info": "bg-info hover:bg-info/90 text-info-foreground",
  };

  const colorClass = colorClasses[color] || colorClasses["bg-primary"];

  return (
    <Card className={`${colorClass} transition-colors`}>
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