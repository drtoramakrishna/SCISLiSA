import { Card, CardContent } from '@/components/ui/card';
import { User, Bot, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QueryResponse } from '@/types';
import { ChartRenderer } from '@/components/visualizations/ChartRenderer';
import { SuggestedFollowUps } from './SuggestedFollowUps';

interface MessageBubbleProps {
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  queryResponse?: QueryResponse;
  onFollowUpClick?: (question: string) => void;
}

export function MessageBubble({
  type,
  content,
  timestamp,
  queryResponse,
  onFollowUpClick,
}: MessageBubbleProps) {
  const isUser = type === 'user';

  return (
    <div className={cn('flex gap-3', isUser && 'flex-row-reverse')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={cn('flex-1 space-y-2', isUser && 'flex flex-col items-end')}>
        <Card className={cn(isUser && 'bg-primary text-primary-foreground')}>
          <CardContent className="p-3">
            <p className="text-sm whitespace-pre-wrap">{content}</p>
          </CardContent>
        </Card>

        {queryResponse && (
          <div className="space-y-2 w-full">
            {/* SQL Query */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Code2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Generated SQL
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {queryResponse.row_count} rows • {Math.round(queryResponse.confidence * 100)}% confidence
                  </span>
                </div>
                <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                  <code>{queryResponse.sql}</code>
                </pre>
              </CardContent>
            </Card>

            {/* Visualization */}
            <ChartRenderer 
              data={queryResponse.data} 
              config={queryResponse.visualization} 
            />

            {/* Suggested Follow-up Questions */}
            {queryResponse.suggested_questions && queryResponse.suggested_questions.length > 0 && (
              <SuggestedFollowUps
                questions={queryResponse.suggested_questions}
                onQuestionClick={onFollowUpClick || (() => {})}
              />
            )}
          </div>
        )}

        <span className="text-xs text-muted-foreground px-1">
          {timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
