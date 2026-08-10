import React, { useState } from 'react';
import { X, Send, CheckCircle2, MessageSquare, User, Mail } from 'lucide-react';
import { Activity } from '../types';

interface ContactInstructorModalProps {
  activity: Activity | null;
  isOpen: boolean;
  onClose: () => void;
  onSendInquiry: (inquiry: {
    activityId: string;
    activityTitle: string;
    teacherName: string;
    userName: string;
    userEmail: string;
    message: string;
  }) => void;
}

export const ContactInstructorModal: React.FC<ContactInstructorModalProps> = ({
  activity,
  isOpen,
  onClose,
  onSendInquiry,
}) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !activity) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !message) return;

    onSendInquiry({
      activityId: activity.id,
      activityTitle: activity.title,
      teacherName: activity.teacher.name,
      userName,
      userEmail,
      message,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setUserName('');
      setUserEmail('');
      setMessage('');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5">
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <img
              src={activity.teacher.avatar}
              alt={activity.teacher.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-green-500 shadow-sm"
            />
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Message {activity.teacher.name}
              </h3>
              <p className="text-xs text-slate-500">{activity.teacher.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3 animate-fade-in">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-base">Inquiry Sent!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {activity.teacher.name} will review your message and reply to {userEmail} soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs text-slate-600">
              Inquiring regarding: <span className="font-bold text-slate-900">{activity.title}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-400/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-400/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about gear required, level suitabilities, or private options..."
                className="w-full p-3 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-400/50"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Send className="w-3.5 h-3.5 text-green-400" />
              <span>Send Direct Inquiry</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
