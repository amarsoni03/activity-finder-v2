import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Paperclip,
  Clock,
  MessageSquare,
  FileText,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowRight,
} from 'lucide-react';
import { Activity, ActivityConversation, ConversationMessage, MessageAttachment } from '../types';
import { useDialogFocus } from '../../../hooks/useDialogFocus';

export interface ActivityMessagingModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  conversations: ActivityConversation[];
  onSendMessage: (activityId: string, text: string, attachments: MessageAttachment[], quickTopic?: string) => void;
  initialThreadId?: string | null;
}

const QUICK_TOPICS = [
  { id: 'gear',  label: 'Gear & equipment', template: 'Hi! Could you please specify what equipment, attire, or gear I need to bring for this session?' },
  { id: 'level', label: 'Beginner friendly?', template: 'Hi! I am a complete beginner in this activity. Will the instructor adapt the pace for first-timers?' },
  { id: 'trial', label: 'Reschedule policy', template: 'Hi! If something comes up, what is the policy for rescheduling or transferring my spot to another date?' },
  { id: 'venue', label: 'Metro exit & parking', template: 'Hi! Which metro exit is closest to the studio, and is there free parking available on site?' },
  { id: 'dress', label: 'Dress code', template: 'Hi! What type of clothing or footwear is recommended for comfort and safety during this class?' },
];

export const MOCK_ATTACHMENT_SAMPLES: MessageAttachment[] = [
  { id: 'att-1', name: 'Course_Syllabus_2026.pdf', url: '#', type: 'pdf', size: '1.2 MB' },
  { id: 'att-2', name: 'Studio_Entrance_Map.png', url: 'https://images.unsplash.com/photo-1524863479829-916d8e77f114?auto=format&fit=crop&w=400&q=80', type: 'image', size: '450 KB' },
];

export const ActivityMessagingModal: React.FC<ActivityMessagingModalProps> = ({
  activity,
  isOpen,
  onClose,
  conversations,
  onSendMessage,
  initialThreadId = null,
}) => {
  const [view, setView] = useState<'inbox' | 'thread'>(initialThreadId ? 'thread' : (activity ? 'thread' : 'inbox'));
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(initialThreadId);
  const [messageText, setMessageText] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [attachments, setAttachments] = useState<MessageAttachment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dialogRef = useDialogFocus(isOpen, onClose);

  useEffect(() => {
    if (isOpen) {
      if (initialThreadId) {
        setSelectedThreadId(initialThreadId);
        setView('thread');
      } else if (activity) {
        setSelectedThreadId(null);
        setView('thread');
      } else {
        setSelectedThreadId(null);
        setView(conversations.length > 0 ? 'inbox' : 'thread');
      }
    }
  }, [isOpen, activity, initialThreadId, conversations.length]);

  useEffect(() => {
    if (isOpen && view === 'thread') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, selectedThreadId, isOpen, view]);

  if (!isOpen) return null;

  const selectedThread = conversations.find(c => c.id === selectedThreadId) ||
    (activity ? conversations.find(c => c.activityId === activity.id) : null);

  const filteredConversations = conversations.filter(c =>
    c.activityTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.providerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openThread = (threadId: string) => {
    setSelectedThreadId(threadId);
    setView('thread');
  };

  const goToInbox = () => {
    setSelectedThreadId(null);
    setView('inbox');
  };

  const handleTopicClick = (topic: typeof QUICK_TOPICS[0]) => {
    setMessageText(topic.template);
    setSelectedTopic(topic.id);
  };

  const handleAddAttachment = () => {
    const newAtt: MessageAttachment = {
      id: `att-${Date.now()}`,
      name: `Attachment_${attachments.length + 1}.pdf`,
      url: '#',
      type: 'pdf',
      size: '850 KB',
    };
    setAttachments(prev => [...prev, newAtt]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && attachments.length === 0) return;

    const targetActId = activity?.id || selectedThread?.activityId || 'act-1';
    const topicLabel = QUICK_TOPICS.find(t => t.id === selectedTopic)?.label;
    setIsSubmitting(true);

    setTimeout(() => {
      onSendMessage(targetActId, messageText, attachments, topicLabel || undefined);
      setMessageText('');
      setAttachments([]);
      setSelectedTopic(null);
      setIsSubmitting(false);
    }, 400);
  };

  /* ───────────────────────────── INBOX VIEW ───────────────────────────── */
  const renderInbox = () => (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Search */}
      {conversations.length > 3 && (
        <div className="px-5 pt-4 pb-2 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#074213]/10 transition-all"
            />
          </div>
        </div>
      )}

      {/* Thread List */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-3 space-y-1">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 space-y-3 text-center">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-700">No conversations yet</p>
            <p className="text-xs text-slate-500 max-w-[260px] leading-relaxed">
              Open any activity and tap "Ask Question" to start a conversation with the instructor.
            </p>
          </div>
        ) : (
          filteredConversations.map((thread) => (
            <button
              key={thread.id}
              onClick={() => openThread(thread.id)}
              className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group cursor-pointer"
            >
              <img
                src={thread.activityImage}
                alt=""
                className="w-10 h-10 rounded-xl object-cover border border-slate-200/80 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 truncate pr-2 group-hover:text-[#074213] transition-colors">
                    {thread.activityTitle}
                  </h4>
                  <span className="text-[10px] text-slate-400 shrink-0">{thread.lastUpdated}</span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {thread.providerName} · {thread.lastMessage}
                </p>
              </div>
              <div className="shrink-0 flex items-center space-x-2">
                {thread.status === 'answered' ? (
                  <span className="w-2 h-2 rounded-full bg-[#A2FF00]" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                )}
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  /* ──────────────────────────── THREAD VIEW ───────────────────────────── */
  const renderThread = () => {
    const contextTitle = activity?.title || selectedThread?.activityTitle || 'Activity';
    const contextImage = activity?.image || selectedThread?.activityImage;
    const contextCategory = activity?.category || '';
    const contextInstructor = activity?.instructorName || activity?.teacher?.name || selectedThread?.providerName || 'Instructor';
    const contextPrice = activity ? `${activity.price} ₽` : selectedThread?.price || '';
    const messages = selectedThread?.messages || [];

    return (
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Activity Context Strip */}
        <div className="px-4 sm:px-5 py-3 bg-white border-b border-slate-100 shrink-0 flex items-center space-x-3">
          {contextImage && (
            <img src={contextImage} alt="" className="w-9 h-9 rounded-lg object-cover border border-slate-200/80 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{contextTitle}</h4>
            <p className="text-[11px] text-slate-500 truncate">
              {contextInstructor}{contextCategory ? ` · ${contextCategory}` : ''}
            </p>
          </div>
          {contextPrice && (
            <span className="text-xs font-bold text-[#074213] shrink-0">{contextPrice}</span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 space-y-4 text-center">
              <div className="w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-slate-300" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-800">Ask {contextInstructor} a question</p>
                <p className="text-xs text-slate-500 max-w-[280px] leading-relaxed">
                  Get quick answers about gear, schedule, skill level, or venue access.
                </p>
              </div>

              {/* Quick topic buttons — only shown in empty state for clean UX */}
              <div className="flex flex-wrap justify-center gap-2 pt-2 max-w-sm">
                {QUICK_TOPICS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTopicClick(t)}
                    className={`px-3 py-1.5 text-[11px] font-semibold rounded-full border transition-all cursor-pointer ${
                      selectedTopic === t.id
                        ? 'bg-[#074213] text-white border-[#074213]'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] sm:max-w-[70%] space-y-1`}>
                      {/* Bubble */}
                      <div
                        className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                          isUser
                            ? 'bg-[#074213] text-white rounded-br-md'
                            : 'bg-slate-100 text-slate-900 rounded-bl-md'
                        }`}
                      >
                        {msg.quickTopic && (
                          <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md mb-1.5 ${
                            isUser ? 'bg-white/15 text-[#A2FF00]' : 'bg-[#A2FF00]/20 text-[#074213]'
                          }`}>
                            {msg.quickTopic}
                          </span>
                        )}
                        <p className="whitespace-pre-wrap">{msg.text}</p>

                        {/* Attachments inline */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-white/10">
                            {msg.attachments.map((att) => (
                              <span
                                key={att.id}
                                className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-[10px] font-semibold ${
                                  isUser
                                    ? 'bg-white/10 text-white/80'
                                    : 'bg-white border border-slate-200 text-slate-600'
                                }`}
                              >
                                {att.type === 'image' ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                                <span className="truncate max-w-[100px]">{att.name}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <p className={`text-[10px] text-slate-400 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                        {msg.senderName} · {msg.timestamp}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Composer */}
        <div className="px-4 sm:px-5 py-3 bg-white border-t border-slate-100 shrink-0 space-y-2">
          {/* Quick topics — compact row when messages already exist */}
          {messages.length > 0 && (
            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1">
              {QUICK_TOPICS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTopicClick(t)}
                  className={`px-2.5 py-1 text-[10px] font-semibold rounded-full border shrink-0 transition-all cursor-pointer ${
                    selectedTopic === t.id
                      ? 'bg-[#074213] text-white border-[#074213]'
                      : 'text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* Attachment chips */}
          {attachments.length > 0 && (
            <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
              {attachments.map((att) => (
                <span key={att.id} className="inline-flex items-center space-x-1 px-2 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-semibold shrink-0">
                  <FileText className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[100px]">{att.name}</span>
                  <button type="button" onClick={() => setAttachments(prev => prev.filter(a => a.id !== att.id))} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Input row */}
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleAddAttachment}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Attach file"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              required={attachments.length === 0}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Ask about schedule, gear, prerequisites..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#074213]/10 focus:border-transparent transition-all min-h-[40px]"
            />

            <button
              type="submit"
              disabled={isSubmitting || (!messageText.trim() && attachments.length === 0)}
              className="p-2.5 bg-[#A2FF00] hover:bg-[#91E600] text-[#074213] rounded-xl transition-all disabled:opacity-30 cursor-pointer shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  };

  /* ────────────────────────────── MODAL SHELL ─────────────────────────── */
  const showBackButton = view === 'thread' && conversations.length > 0 && !activity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/40 backdrop-blur-xs" style={{ animation: 'fadeIn .15s ease-out' }}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="messaging-modal-title"
        tabIndex={-1}
        className="bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200/70 overflow-hidden flex flex-col h-[85vh] sm:h-[75vh] focus:outline-none"
      >

        {/* ── Header ── */}
        <div className="px-4 sm:px-5 py-3 flex items-center justify-between shrink-0 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            {showBackButton && (
              <button onClick={goToInbox} aria-label="Back to inbox" className="p-1 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer -ml-1">
                <ChevronLeft className="w-4.5 h-4.5" />
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-[#A2FF00] text-[#074213] flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 id="messaging-modal-title" className="text-sm font-bold text-slate-900 leading-tight">Messages</h3>
              <p className="text-[10px] text-slate-500 font-medium flex items-center space-x-1">
                <Clock className="w-2.5 h-2.5" />
                <span>Usually replies in 15 min</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            {/* Inbox / Thread toggle — only when navigating from inbox */}
            {conversations.length > 0 && !activity && (
              <div className="bg-slate-100 p-0.5 rounded-lg flex items-center text-[11px]">
                <button
                  type="button"
                  onClick={goToInbox}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    view === 'inbox' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Inbox{conversations.length > 0 ? ` (${conversations.length})` : ''}
                </button>
                <button
                  type="button"
                  onClick={() => setView('thread')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                    view === 'thread' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  New
                </button>
              </div>
            )}

            <button onClick={onClose} aria-label="Close messages" className="p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        {view === 'inbox' ? renderInbox() : renderThread()}

      </div>
    </div>
  );
};
