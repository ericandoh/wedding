'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '../_components/language-provider';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Message {
  message: string;
  by: string;
  date: string;
}

export default function MessageBoard() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[][]>([]);
  const [rowIndices, setRowIndices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [showRSVPDialog, setShowRSVPDialog] = useState(false);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<number | null>(null);
  const [selectedReplyIndex, setSelectedReplyIndex] = useState<number | null>(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [replyText, setReplyText] = useState('');
  const [editText, setEditText] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Get user email from localStorage (set during RSVP)
  useEffect(() => {
    const email = localStorage.getItem('rsvp-email');
    if (email) {
      // Normalize email: trim and lowercase to match how it's stored in messages
      setUserEmail(email.trim().toLowerCase());
    }
  }, []);

  // Load messages
  const loadMessages = async (loadOffset = 0) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/messages?limit=100&offset=${loadOffset}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log('Messages loaded:', data.messages?.length, 'Row indices:', data.rowIndices);
        if (loadOffset === 0) {
          setMessages(data.messages || []);
          setRowIndices(data.rowIndices || []);
        } else {
          setMessages(prev => [...prev, ...(data.messages || [])]);
          setRowIndices(prev => [...prev, ...(data.rowIndices || [])]);
        }
        setHasMore(data.hasMore || false);
        setOffset(loadOffset + (data.messages?.length || 0));
      } else {
        console.error('Error loading messages:', data.error);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Check if user has RSVP'd
  const checkRSVP = async (): Promise<boolean> => {
    if (!userEmail) return false;
    
    try {
      const response = await fetch('/api/messages/check-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      const data = await response.json();
      return data.hasRSVP || false;
    } catch (error) {
      console.error('Error checking RSVP:', error);
      return false;
    }
  };

  // Handle new message button click
  const handleNewMessageClick = async () => {
    if (!userEmail) {
      setShowRSVPDialog(true);
      return;
    }

    const hasRSVP = await checkRSVP();
    if (!hasRSVP) {
      setShowRSVPDialog(true);
      return;
    }

    setShowNewMessageDialog(true);
  };

  // Submit new message
  const handleSubmitNewMessage = async () => {
    if (!newMessageText.trim() || !userEmail) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          message: newMessageText,
        }),
      });

      if (response.ok) {
        setNewMessageText('');
        setShowNewMessageDialog(false);
        // Small delay to ensure Google Sheets has updated
        setTimeout(() => {
          loadMessages(0); // Reload from beginning
        }, 500);
      } else {
        const errorData = await response.json();
        console.error('Error submitting message:', errorData);
        alert(errorData.error || 'Failed to submit message');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle reply button click
  const handleReplyClick = async (messageIndex: number) => {
    if (!userEmail) {
      setShowRSVPDialog(true);
      return;
    }

    const hasRSVP = await checkRSVP();
    if (!hasRSVP) {
      setShowRSVPDialog(true);
      return;
    }

    // Use the row index from Google Sheets, not the array index
    const rowIndex = rowIndices[messageIndex];
    console.log('Reply clicked - array index:', messageIndex, 'row index:', rowIndex, 'all rowIndices:', rowIndices);
    setSelectedMessageIndex(rowIndex);
    setReplyText('');
    setShowReplyDialog(true);
  };

  // Submit reply
  const handleSubmitReply = async () => {
    if (!replyText.trim() || selectedMessageIndex === null || !userEmail) return;

    console.log('Submitting reply with messageIndex:', selectedMessageIndex);
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          message: replyText,
          messageIndex: selectedMessageIndex, // This is the row index from Google Sheets
        }),
      });

      if (response.ok) {
        setReplyText('');
        setShowReplyDialog(false);
        setSelectedMessageIndex(null);
        // Small delay to ensure Google Sheets has updated
        setTimeout(() => {
          loadMessages(0); // Reload from beginning
        }, 500);
      } else {
        const errorData = await response.json();
        console.error('Error submitting reply:', errorData);
        alert(errorData.error || 'Failed to submit reply');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle edit button click
  const handleEditClick = (messageIndex: number, replyIndex: number | null, currentText: string) => {
    // Use the row index from Google Sheets, not the array index
    const rowIndex = rowIndices[messageIndex];
    setSelectedMessageIndex(rowIndex);
    setSelectedReplyIndex(replyIndex);
    setEditText(currentText);
    setShowEditDialog(true);
  };

  // Submit edit
  const handleSubmitEdit = async () => {
    if (!editText.trim() || selectedMessageIndex === null || !userEmail) return;

    console.log('Submitting edit - messageIndex:', selectedMessageIndex, 'replyIndex:', selectedReplyIndex, 'userEmail:', userEmail);
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          messageIndex: selectedMessageIndex,
          replyIndex: selectedReplyIndex,
          newMessage: editText,
        }),
      });

      if (response.ok) {
        setEditText('');
        setShowEditDialog(false);
        setSelectedMessageIndex(null);
        setSelectedReplyIndex(null);
        // Small delay to ensure Google Sheets has updated
        setTimeout(() => {
          loadMessages(0); // Reload from beginning
        }, 500);
      } else {
        const errorData = await response.json();
        console.error('Error editing message:', errorData);
        alert(errorData.error || 'Failed to edit message');
      }
    } catch (error) {
      console.error('Error editing message:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  // Check if user is the author
  const isAuthor = (email: string) => {
    return userEmail && userEmail.toLowerCase() === email.toLowerCase();
  };

  return (
    <div className="flex min-h-screen flex-col bg-white page-fade-in">
      <div className="bg-white py-8 text-center">
        <h1 className="text-title mb-2 text-5xl font-bold text-gray-800">
          {t.messageBoard}
        </h1>
        <p className="text-body text-xl text-gray-600">
          {t.postANote} {t.notesVisibleToEveryone}
        </p>
        <div className="mt-6">
          <button 
            onClick={handleNewMessageClick}
            className="text-button-lg inline-block border-2 border-gray-800 px-8 py-3 text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white"
          >
            {t.writeANewNote}
          </button>
        </div>
      </div>

      <div className="flex-grow bg-white py-12">
        <div className="mx-auto max-w-4xl px-6">
          {loading && messages.length === 0 ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-600 py-12">
              {t.noMessagesYet}
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((messageArray, messageIndex) => {
                const mainMessage = messageArray[0];
                const replies = messageArray.slice(1);
                
                return (
                  <div key={messageIndex} className="bg-gray-50 p-6 rounded-lg">
                    {/* Main Message */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-body text-gray-700 flex-1">{mainMessage.message}</p>
                        {isAuthor(mainMessage.by) && (
                          <button
                            onClick={() => handleEditClick(messageIndex, null, mainMessage.message)}
                            className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                            title={t.edit}
                          >
                            <PencilIcon className="w-4 h-4 text-gray-600" />
                          </button>
                        )}
                      </div>
                      <p className="text-body-sm text-gray-500 text-sm">{formatDate(mainMessage.date)}</p>
                    </div>

                    {/* Replies */}
                    {replies.length > 0 && (
                      <div className="ml-6 mt-4 space-y-3 border-l-2 border-gray-300 pl-4">
                        {replies.map((reply, replyIndex) => (
                          <div key={replyIndex}>
                            <div className="flex items-start justify-between mb-1">
                              <p className="text-body text-gray-700 flex-1">{reply.message}</p>
                              {isAuthor(reply.by) && (
                                <button
                                  onClick={() => handleEditClick(messageIndex, replyIndex + 1, reply.message)}
                                  className="ml-2 p-1 hover:bg-gray-200 rounded transition-colors"
                                  title={t.edit}
                                >
                                  <PencilIcon className="w-4 h-4 text-gray-600" />
                                </button>
                              )}
                            </div>
                            <p className="text-body-sm text-gray-500 text-sm">{formatDate(reply.date)}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Button */}
                    <button
                      onClick={() => handleReplyClick(messageIndex)}
                      className="mt-4 text-body-sm text-gray-600 hover:text-gray-800 underline"
                    >
                      {t.reply}
                    </button>
                  </div>
                );
              })}

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-8">
                  <button
                    onClick={() => loadMessages(offset)}
                    className="text-button-lg inline-block border-2 border-gray-800 px-8 py-3 text-gray-800 transition-all duration-300 hover:bg-gray-800 hover:text-white"
                  >
                    {t.loadMore}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* New Message Dialog */}
      {showNewMessageDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-title text-2xl font-bold text-gray-800">{t.writeMessage}</h2>
              <button
                onClick={() => {
                  setShowNewMessageDialog(false);
                  setNewMessageText('');
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <textarea
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg text-body resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder={t.message}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowNewMessageDialog(false);
                  setNewMessageText('');
                }}
                className="px-4 py-2 text-body text-gray-600 hover:text-gray-800"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSubmitNewMessage}
                disabled={!newMessageText.trim() || submitting}
                className="px-4 py-2 text-body bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '...' : t.submit}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Dialog */}
      {showReplyDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-title text-2xl font-bold text-gray-800">{t.reply}</h2>
              <button
                onClick={() => {
                  setShowReplyDialog(false);
                  setReplyText('');
                  setSelectedMessageIndex(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg text-body resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder={t.message}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowReplyDialog(false);
                  setReplyText('');
                  setSelectedMessageIndex(null);
                }}
                className="px-4 py-2 text-body text-gray-600 hover:text-gray-800"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSubmitReply}
                disabled={!replyText.trim() || submitting}
                className="px-4 py-2 text-body bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '...' : t.submit}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      {showEditDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-title text-2xl font-bold text-gray-800">{t.edit}</h2>
              <button
                onClick={() => {
                  setShowEditDialog(false);
                  setEditText('');
                  setSelectedMessageIndex(null);
                  setSelectedReplyIndex(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded-lg text-body resize-none focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder={t.message}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowEditDialog(false);
                  setEditText('');
                  setSelectedMessageIndex(null);
                  setSelectedReplyIndex(null);
                }}
                className="px-4 py-2 text-body text-gray-600 hover:text-gray-800"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSubmitEdit}
                disabled={!editText.trim() || submitting}
                className="px-4 py-2 text-body bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? '...' : t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RSVP Required Dialog */}
      {showRSVPDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-title text-2xl font-bold text-gray-800">{t.pleaseRSVPFirst}</h2>
              <button
                onClick={() => setShowRSVPDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            <p className="text-body text-gray-700 mb-6">
              {t.youMustRSVPToPost}
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRSVPDialog(false)}
                className="px-4 py-2 text-body text-gray-600 hover:text-gray-800"
              >
                {t.cancel}
              </button>
              <Link
                href="/rsvp"
                className="px-4 py-2 text-body bg-gray-800 text-white rounded hover:bg-gray-700"
              >
                {t.rsvp}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

