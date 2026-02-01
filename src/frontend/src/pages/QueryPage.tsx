import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QueryInput } from '@/components/query/QueryInput';
import { SuggestedQueries } from '@/components/query/SuggestedQueries';
import { MessageBubble } from '@/components/query/MessageBubble';
import { useQueryStore } from '@/lib/stores/useQueryStore';
import { mcpAPI } from '@/lib/api/endpoints';
import { Trash2, AlertCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';

export function QueryPage() {
  const {
    messages,
    isLoading,
    error,
    addUserMessage,
    addAssistantMessage,
    setLoading,
    setError,
    clearMessages,
  } = useQueryStore();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleQuery = async (query: string) => {
    try {
      // Add user message
      addUserMessage(query);
      setLoading(true);
      setError(null);

      // Call MCP API
      const response = await mcpAPI.query(query);
      
      // Add assistant response
      addAssistantMessage(response.data);
    } catch (err: any) {
      console.error('Query error:', err);
      let errorMessage = 'Failed to process query';
      
      if (err.response) {
        // Server responded with error status
        errorMessage = `Server error (${err.response.status}): ${err.response.data?.detail || err.response.statusText}`;
      } else if (err.request) {
        // Request made but no response
        errorMessage = 'Cannot connect to backend server. Make sure the backend is running at http://localhost:8000';
      } else {
        // Error in request configuration
        errorMessage = err.message || 'Unknown error occurred';
      }
      
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Natural Language Query</h1>
          <p className="text-muted-foreground mt-2">
            Ask questions about publications, authors, and research trends
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearMessages}>
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Error</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Conversation Area */}
      <Card>
        <CardHeader>
          <CardTitle>Conversation</CardTitle>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="space-y-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Start by asking a question or try one of the suggested queries below
                </p>
              </div>
              <SuggestedQueries onSelectQuery={handleQuery} />
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  type={message.type}
                  content={message.content}
                  timestamp={message.timestamp}
                  queryResponse={message.queryResponse}
                  onFollowUpClick={handleQuery}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Query Input */}
      <Card>
        <CardContent className="p-4">
          <QueryInput onSubmit={handleQuery} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}
