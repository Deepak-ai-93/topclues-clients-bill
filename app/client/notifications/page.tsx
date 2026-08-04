'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Bell,
  CheckSquare,
  BarChart3,
  FileText,
  UserPlus,
  Tag,
  Video,
  HelpCircle,
  Package,
  ShieldCheck
} from 'lucide-react';
import { getClientNotifications, markNotificationRead, markAllNotificationsRead } from '../../../lib/actions';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  created_at: string;
  read: boolean;
  link: string;
}

const typeIcons: Record<string, any> = {
  content: CheckSquare,
  report: BarChart3,
  invoice: FileText,
  lead: UserPlus,
  offer: Tag,
  meeting: Video,
  support: HelpCircle,
  package: Package,
  security: ShieldCheck,
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} day${days > 1 ? 's' : ''} ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    async function load() {
      try {
        const data = await getClientNotifications();
        setNotifications(data.notifications as NotificationItem[]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    const res = await markAllNotificationsRead();
    if (res.success) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    }
  };

  const handleNotificationClick = async (item: NotificationItem) => {
    if (!item.read) {
      await markNotificationRead(item.id);
      setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    }
    if (item.link) router.push(item.link);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  if (loading) {
    return (
      <div className="p-8 text-center flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-neutral-400 uppercase">Doctor Hub</span>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-primary text-white">
                {unreadCount} UNREAD
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">System updates, content approvals, lead alerts, and invoice releases.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 border border-primary hover:bg-primary hover:text-white rounded-lg text-xs font-bold transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            filter === 'all' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            filter === 'unread' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
            filter === 'read' ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
          }`}
        >
          Read ({notifications.length - unreadCount})
        </button>
      </div>

      <div className="border border-primary rounded-xl bg-white divide-y divide-neutral-200 overflow-hidden shadow-sm">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 font-mono text-xs space-y-2">
            <Bell className="w-8 h-8 text-neutral-300 mx-auto" />
            <p>No notifications found in &quot;{filter}&quot; view.</p>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const Icon = typeIcons[item.type] || Bell;
            return (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  item.read ? 'bg-white hover:bg-neutral-50' : 'bg-neutral-50/80 hover:bg-neutral-100/80 font-medium'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-lg border shrink-0 mt-0.5 ${
                    item.read ? 'bg-neutral-100 border-neutral-200 text-neutral-500' : 'bg-primary text-white border-primary'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`text-sm font-bold text-neutral-900 ${!item.read ? 'font-black' : ''}`}>
                        {item.title}
                      </h3>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-600">{item.message}</p>
                    <span className="text-[10px] font-mono text-neutral-400 block pt-1">{timeAgo(item.created_at)}</span>
                  </div>
                </div>

                <div className="shrink-0 text-xs font-mono font-bold text-neutral-400 hover:text-primary">
                  {item.link ? 'View →' : ''}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}