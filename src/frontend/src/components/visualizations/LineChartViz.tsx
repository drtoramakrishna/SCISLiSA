import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LineChartVizProps {
  data: any[];
  config: {
    title?: string;
    x_axis?: string;
    y_axis?: string;
    lines?: Array<{ field: string; label: string; color?: string }>;
  };
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a78bfa'];

export function LineChartViz({ data, config }: LineChartVizProps) {
  const { title, x_axis, y_axis, lines } = config;

  // If multiple lines are specified, use them; otherwise use y_axis
  const lineFields = lines || (y_axis ? [{ field: y_axis, label: y_axis }] : []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || 'Line Chart'}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={x_axis} />
            <YAxis />
            <Tooltip />
            <Legend />
            {lineFields.map((line, index) => (
              <Line
                key={line.field}
                type="monotone"
                dataKey={line.field}
                name={line.label}
                stroke={line.color || COLORS[index % COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
