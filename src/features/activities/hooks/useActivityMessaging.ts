import { useState, useEffect, useCallback } from 'react';
import { Activity, ActivityConversation, MessageAttachment } from '../types';
import { loadStoredConversations, saveStoredConversations } from '../services/activityStorage';

export function useActivityMessaging(onNewReply?: (instructorName: string) => void) {
  const [conversations, setConversations] = useState<ActivityConversation[]>(() => loadStoredConversations());

  useEffect(() => {
    saveStoredConversations(conversations);
  }, [conversations]);

  const getConversationForActivity = useCallback(
    (activityId: string): ActivityConversation | undefined => {
      return conversations.find((c) => c.activityId === activityId);
    },
    [conversations]
  );

  const sendMessage = useCallback(
    (
      activityOrId: Activity | string,
      text: string,
      attachments?: MessageAttachment[],
      quickTopic?: string
    ) => {
      const targetActId = typeof activityOrId === 'string' ? activityOrId : activityOrId.id;
      const actObj = typeof activityOrId === 'string' ? null : activityOrId;
      const existingThread = conversations.find((c) => c.activityId === targetActId);

      const userMessage = {
        id: `msg-${Date.now()}`,
        sender: 'user' as const,
        senderName: 'Alex Morgan',
        text: text || (quickTopic ? `Inquiring about ${quickTopic}` : 'Sent an attachment'),
        timestamp: 'Just now',
        attachments: attachments && attachments.length > 0 ? attachments : undefined,
        quickTopic,
      };

      let updatedThreads: ActivityConversation[];

      if (existingThread) {
        updatedThreads = conversations.map((c) => {
          if (c.id === existingThread.id) {
            return {
              ...c,
              lastMessage: userMessage.text,
              lastUpdated: 'Just now',
              status: 'awaiting_reply' as const,
              messages: [...c.messages, userMessage],
            };
          }
          return c;
        });
      } else {
        const newThread: ActivityConversation = {
          id: `thread-${Date.now()}`,
          activityId: targetActId,
          activityTitle: actObj?.title || 'Activity Inquiry',
          activityImage: actObj?.image || '',
          metroStation: actObj?.metroStationName || actObj?.metroStation || 'Moscow Central',
          price: actObj ? `${actObj.price} ₽ / ${actObj.priceUnit}` : '',
          providerName: actObj?.instructorName || actObj?.teacher?.name || 'Instructor',
          providerAvatar:
            actObj?.teacher?.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          responseTimeText: actObj?.responseTimeText || '⚡ Usually replies in 15 mins',
          lastUpdated: 'Just now',
          status: 'awaiting_reply',
          messages: [userMessage],
        };
        updatedThreads = [newThread, ...conversations];
      }

      setConversations(updatedThreads);

      // Simulate provider auto-reply after 2.5 seconds
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.activityId === targetActId) {
              const providerReply = {
                id: `msg-reply-${Date.now()}`,
                sender: 'provider' as const,
                senderName: c.providerName,
                senderAvatar: c.providerAvatar,
                text: `Hi Alex! Thank you for inquiring about ${c.activityTitle}. Regarding your question: all prerequisites and preparation details are confirmed for your session. Feel free to ask if you need anything else!`,
                timestamp: 'Just now',
              };
              return {
                ...c,
                lastMessage: providerReply.text,
                lastUpdated: 'Just now',
                status: 'answered' as const,
                messages: [...c.messages, providerReply],
              };
            }
            return c;
          })
        );
        if (onNewReply) {
          onNewReply(actObj?.instructorName || 'Instructor');
        }
      }, 2500);
    },
    [conversations, onNewReply]
  );

  return {
    conversations,
    getConversationForActivity,
    sendMessage,
  };
}
