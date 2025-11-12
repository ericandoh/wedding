'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from './language-provider';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isRateLimit?: boolean;
}

interface ChatbotBubbleProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotBubble({ isOpen, onClose }: ChatbotBubbleProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [messageId, setMessageId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  // Function to parse **text** to bold text and * item to lists
  const parseMessageText = (text: string) => {
    // First check if the text contains list items
    const lines = text.split('\n');
    const hasListItems = lines.some(line => line.trim().startsWith('* '));
    
    if (hasListItems) {
      // Process each line
      const processedLines = lines.map((line, lineIndex) => {
        const trimmedLine = line.trim();
        if (trimmedLine.startsWith('* ')) {
          // This is a list item
          const itemText = trimmedLine.slice(2); // Remove '* '
          return <li key={lineIndex}>{parseBoldText(itemText)}</li>;
        } else if (trimmedLine === '') {
          // Empty line - add a break
          return <br key={lineIndex} />;
        } else {
          // Regular text line
          return <div key={lineIndex}>{parseBoldText(line)}</div>;
        }
      });
      
      // Group consecutive list items into a ul
      const result = [];
      let currentList = [];
      
      for (let i = 0; i < processedLines.length; i++) {
        const element = processedLines[i];
        
        if (element.type === 'li') {
          currentList.push(element);
        } else {
          if (currentList.length > 0) {
            result.push(<ul key={`list-${i}`} className="list-disc list-inside ml-2 space-y-1">{currentList}</ul>);
            currentList = [];
          }
          result.push(element);
        }
      }
      
      // Add any remaining list items
      if (currentList.length > 0) {
        result.push(<ul key="list-final" className="list-disc list-inside ml-2 space-y-1">{currentList}</ul>);
      }
      
      return result;
    } else {
      // No list items, just parse bold text
      return parseBoldText(text);
    }
  };

  // Function to parse **text** to bold text
  const parseBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessageText = inputText.trim();
    
    // Add user message
    const userMessage: Message = {
      id: messageId,
      text: userMessageText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setMessageId(prev => prev + 1);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessageText }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit exceeded
          const botMessage: Message = {
            id: messageId + 1,
            text: data.message || 'Sorry, we can only answer 1000 questions a day because we are cheap and on a free model. Please try again tomorrow!',
            isUser: false,
            timestamp: new Date(),
            isRateLimit: true,
          };
          setMessages(prev => [...prev, botMessage]);
          setMessageId(prev => prev + 2);
          return;
        }
        throw new Error('Failed to get response');
      }
      
      const botMessage: Message = {
        id: messageId + 1,
        text: data.response || 'Sorry, I couldn\'t process your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botMessage]);
      setMessageId(prev => prev + 2);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: messageId + 1,
        text: 'Sorry, I\'m having trouble connecting right now. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setMessageId(prev => prev + 2);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 min-w-[25vw] max-w-[75vw] max-h-[calc(100vh-2rem)] h-[28rem] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <div>
          <h3 className="text-body font-semibold text-gray-800">{t.chatbotTitle}</h3>
          <p className="text-caption text-gray-600">{t.askQuestionsAboutWedding}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/chatbot"
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Expand to full page"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </Link>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            aria-label="Close chatbot"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            <div className="text-center">
              <p className="text-body-sm mb-4">{t.startConversation}</p>
              <p className="text-caption mb-4">{t.askMeAnything}</p>
              <div className="space-y-2">
                <p className="text-caption-sm text-gray-400 mb-2">{t.tryAsking}</p>
                <button
                  onClick={() => setInputText(t.whatShouldIWearToWedding)}
                  className="text-caption block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {t.whatShouldIWearToWedding}
                </button>
                <button
                  onClick={() => setInputText(t.whenAndWhereIsWedding)}
                  className="text-caption block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {t.whenAndWhereIsWedding}
                </button>
                <button
                  onClick={() => setInputText(t.doINeedVisaForVietnam)}
                  className="text-caption block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  {t.doINeedVisaForVietnam}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-3 py-2 ${
                    message.isUser
                      ? 'bg-blue-500 text-white'
                      : message.isRateLimit
                      ? 'bg-red-100 border border-red-300 text-red-800'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  <div className={`text-caption ${
                    message.isUser ? 'text-white' : ''
                  }`}>{parseMessageText(message.text)}</div>
                  <p className={`mt-1 text-xs ${
                    message.isUser 
                      ? 'text-blue-100' 
                      : message.isRateLimit 
                      ? 'text-red-600' 
                      : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs rounded-lg px-3 py-2 bg-gray-200 text-gray-800">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <p className="text-caption text-gray-600">{t.thinking}</p>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={t.askMeAnythingPlaceholder}
            disabled={isLoading}
            className="text-caption flex-grow rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="text-caption rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? t.sending : t.send}
          </button>
        </form>
      </div>
    </div>
  );
}
