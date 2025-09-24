'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../_components/language-provider';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isRateLimit?: boolean;
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [messageId, setMessageId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

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

  return (
    <div className="flex min-h-screen flex-col">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2">
          {t.chatbotTitle}
        </h1>
        <p className="text-subtitle">
          {t.askQuestionsAboutWedding}
        </p>
      </div>

      <div className="flex-grow bg-white">
        <div className="mx-auto max-w-4xl px-6 py-8">
          {/* Chat Messages */}
          <div className="mb-6 h-96 overflow-y-auto rounded-lg border border-gray-200 bg-white p-4">
            {messages.length === 0 ? (
              <div className="flex h-full items-center justify-center text-gray-500">
                <div className="text-center max-w-md">
                  <p className="text-body mb-4">{t.startConversation}</p>
                  <p className="text-body-sm mb-6">{t.askMeAnything}</p>
                  <div className="space-y-2">
                    <p className="text-caption-sm text-gray-400 mb-2">{t.tryAsking}</p>
                    <button
                      onClick={() => setInputText(t.whatShouldIWearToWedding)}
                      className="text-button-sm block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {t.whatShouldIWearToWedding}
                    </button>
                    <button
                      onClick={() => setInputText(t.whenAndWhereIsWedding)}
                      className="text-button-sm block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {t.whenAndWhereIsWedding}
                    </button>
                    <button
                      onClick={() => setInputText(t.doINeedVisaForVietnam)}
                      className="text-button-sm block w-full text-left px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {t.doINeedVisaForVietnam}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs rounded-lg px-4 py-2 ${
                        message.isUser
                          ? 'bg-blue-500 text-white'
                          : message.isRateLimit
                          ? 'bg-red-100 border border-red-300 text-red-800'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-chat-message whitespace-pre-wrap">{message.text}</p>
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
                    <div className="max-w-xs rounded-lg px-4 py-2 bg-gray-200 text-gray-800">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <p className="text-chat-message text-gray-600">{t.thinking}</p>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.askMeAnythingPlaceholder}
              disabled={isLoading}
              className="text-input text-placeholder flex-grow rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="text-button rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? t.sending : t.send}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
