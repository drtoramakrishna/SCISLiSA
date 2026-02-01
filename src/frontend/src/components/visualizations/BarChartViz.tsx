import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BarChartVizProps {
  data: any[];
  config: {
    title?: string;
    x_axis?: string;
    y_axis?: string;
  };
}

export function BarChartViz({ data, config }: BarChartVizProps) {
  const { title, x_axis, y_axis } = config;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Bar Chart'}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={x_axis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={y_axis} fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
