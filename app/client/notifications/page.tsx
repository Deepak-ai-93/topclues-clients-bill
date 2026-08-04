'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
  Check,
  Circle
} from 'lucide-react';

interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  link: string;
}

const initialNotifications: NotificationItem[] = [
  { id: "n1", type: "content_approval", title: "New content ready for review", message: "Your July Week 3 Instagram post is awaiting approval.", time: "2 hours ago", read: false, link: "/client/content" },
  { id: "n2", type: "report_available", title: "July 2026 Report Available", message: "Your monthly performance report for July 2026 has been uploaded.", time: "1 day ago", read: false, link: "/client/reports" },
  { id: "n3", type: "invoice_generated", title: "Invoice #INV-2026-007 Generated", message: "Your July 2026 invoice of ₹15,000 is ready for download.", time: "3 days ago", read: true, link: "/client/invoices" },
  { id: "n4", type: "new_lead", title: "3 New Leads Received", message: "You have 3 new patient leads from your Meta Ads campaign.", time: "4 days ago", read: true, link: "/client/leads" },
  { id: "n5", type: "offer_available", title: "Special Offer: Annual Contract Discount", message: "Switch to annual billing and save ₹30,000. Offer expires Sept 30.", time: "5 days ago", read: true, link: "/client/offers" }
];

const typeIcons: Record<string, any> = {
  content_approval: CheckSquare,
  report_available: BarChart3,
  invoice_generated: FileText,
  new_lead: UserPlus,
  offer_available: Tag,
  meeting: Video,
  support: HelpCircle,
};

export default function NotificationsPage() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));
    router.push(item.link);
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto font-sans">
      {/* Header */}
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

      {/* Filter Tabs */}
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

      {/* List */}
      <div className="border border-primary rounded-xl bg-white divide-y divide-neutral-200 overflow-hidden shadow-sm">
        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 font-mono text-xs space-y-2">
            <Bell className="w-8 h-8 text-neutral-300 mx-auto" />
            <p>No notifications found in "{filter}" view.</p>
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
                    <span className="text-[10px] font-mono text-neutral-400 block pt-1">{item.time}</span>
                  </div>
                </div>

                <div className="shrink-0 text-xs font-mono font-bold text-neutral-400 hover:text-primary">
                  View &rarr;
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
