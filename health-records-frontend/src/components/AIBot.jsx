import { useState, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { MessageCircle, Bot, Send, Loader2, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const AI_ANALYSIS_QUERY = gql`
  query AIAnalysis($patientId: ID!) {
    aiAnalysis(patientId: $patientId) {
      summary
      recommendation
      nextSteps
      recordsCount
      lastRecordDate
    }
  }
`;

const AI_QUESTION_QUERY = gql`
  query AIQuestion($patientId: ID!, $question: String!) {
    aiQuestion(patientId: $patientId, question: $question) {
      answer
      timestamp
    }
  }
`;

const AIBot = ({ patientId, patientName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [hasAnalysis, setHasAnalysis] = useState(false);

  const [getAnalysis, { loading: analysisLoading, data: analysisData, error: analysisError }] = useLazyQuery(AI_ANALYSIS_QUERY);
  const [askQuestion, { loading: questionLoading }] = useLazyQuery(AI_QUESTION_QUERY);

  // Load initial analysis when component mounts or patientId changes
  useEffect(() => {
    if (patientId && isOpen && !hasAnalysis) {
      handleGetAnalysis();
    }
  }, [patientId, isOpen]);

  const handleGetAnalysis = async () => {
    try {
      const result = await getAnalysis({ variables: { patientId } });
      if (result.data) {
        const analysis = result.data.aiAnalysis;
        const analysisMessage = {
          id: Date.now(),
          type: 'analysis',
          content: analysis,
          timestamp: new Date().toISOString()
        };
        setChatHistory([analysisMessage]);
        setHasAnalysis(true);
      }
    } catch (error) {
      console.error('Error getting AI analysis:', error);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Add user question to chat
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: question,
      timestamp: new Date().toISOString()
    };
    setChatHistory(prev => [...prev, userMessage]);
    setQuestion('');

    try {
      const result = await askQuestion({ 
        variables: { 
          patientId, 
          question: question.trim() 
        } 
      });
      
      if (result.data) {
        const aiResponse = result.data.aiQuestion;
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          content: aiResponse.answer,
          timestamp: aiResponse.timestamp
        };
        setChatHistory(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, I encountered an error while processing your question. Please try again.',
        timestamp: new Date().toISOString()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!patientId) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* AI Bot Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 flex items-center gap-2"
        title="AI Medical Assistant"
      >
        <Bot className="w-6 h-6" />
        {!isOpen && <span className="hidden sm:inline">AI Assistant</span>}
      </button>

      {/* AI Bot Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 max-w-[90vw] bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <div>
                <h3 className="font-semibold">AI Medical Assistant</h3>
                <p className="text-sm text-blue-100">
                  Analyzing records for {patientName || 'Patient'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              ×
            </button>
          </div>

          {/* Chat Area */}
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {/* Initial Loading */}
            {analysisLoading && chatHistory.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Analyzing medical records...</span>
              </div>
            )}

            {/* Error State */}
            {analysisError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="font-medium">Analysis Error</span>
                </div>
                <p className="text-red-600 text-sm mt-1">
                  {analysisError.message || 'Unable to analyze records. Please try again.'}
                </p>
              </div>
            )}

            {/* Chat Messages */}
            {chatHistory.map((message) => (
              <div key={message.id} className="mb-4">
                {message.type === 'analysis' && (
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 mb-3 text-blue-600">
                      <Bot className="w-4 h-4" />
                      <span className="font-medium">Medical Records Analysis</span>
                      <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                    </div>
                    
                    {/* Summary */}
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-800 mb-1">Summary</h4>
                      <p className="text-gray-600 text-sm">{message.content.summary}</p>
                    </div>

                    {/* Recommendation */}
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-800 mb-1">Recommendation</h4>
                      <p className="text-gray-600 text-sm">{message.content.recommendation}</p>
                    </div>

                    {/* Next Steps */}
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-800 mb-1">Suggested Next Steps</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {message.content.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-500 mt-1 flex-shrink-0" />
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Metadata */}
                    <div className="text-xs text-gray-400 border-t pt-2 mt-3">
                      <div className="flex justify-between">
                        <span>Records analyzed: {message.content.recordsCount}</span>
                        {message.content.lastRecordDate && (
                          <span>Last record: {message.content.lastRecordDate}</span>
                        )}
                      </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-3">
                      <div className="flex items-center gap-1 text-yellow-700 text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="font-medium">Medical Disclaimer</span>
                      </div>
                      <p className="text-yellow-600 text-xs mt-1">
                        This analysis is for informational purposes only and does not replace professional medical advice.
                      </p>
                    </div>
                  </div>
                )}

                {message.type === 'user' && (
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white rounded-lg px-3 py-2 max-w-xs">
                      <p className="text-sm">{message.content}</p>
                      <span className="text-xs text-blue-200">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                )}

                {message.type === 'ai' && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 max-w-xs">
                      <div className="flex items-center gap-1 mb-1">
                        <Bot className="w-3 h-3 text-blue-600" />
                        <span className="text-xs text-gray-500">AI Assistant</span>
                      </div>
                      <p className="text-sm text-gray-700">{message.content}</p>
                      <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                )}

                {message.type === 'error' && (
                  <div className="flex justify-start">
                    <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 max-w-xs">
                      <div className="flex items-center gap-1 mb-1">
                        <AlertTriangle className="w-3 h-3 text-red-600" />
                        <span className="text-xs text-red-600">Error</span>
                      </div>
                      <p className="text-sm text-red-700">{message.content}</p>
                      <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Question Loading */}
            {questionLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white">
            <form onSubmit={handleAskQuestion} className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about the medical records..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={questionLoading}
              />
              <button
                type="submit"
                disabled={!question.trim() || questionLoading}
                className="bg-blue-600 text-white rounded-lg px-3 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            
            {/* Refresh Analysis Button */}
            <button
              onClick={handleGetAnalysis}
              disabled={analysisLoading}
              className="w-full mt-2 text-xs text-blue-600 hover:text-blue-700 disabled:opacity-50 flex items-center justify-center gap-1"
            >
              {analysisLoading ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  Refresh Analysis
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIBot;