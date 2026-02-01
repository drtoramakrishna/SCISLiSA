import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PieChartVizProps {
  data: any[];
  config: {
    title?: string;
    label_field?: string;
    value_field?: string;
  };
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a78bfa', '#f59e0b', '#10b981', '#6366f1'];

export function PieChartViz({ data, config }: PieChartVizProps) {
  const { title, label_field, value_field } = config;

  // Transform data for pie chart
  const pieData = data.map((item) => ({
    name: item[label_field || 'name'],
    value: item[value_field || 'value'],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Pie Chart'}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => entry.name}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
