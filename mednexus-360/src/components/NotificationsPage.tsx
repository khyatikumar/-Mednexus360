import { useEffect, useMemo, useState } from 'react';
import { notificationsApi } from '../services/api';
import type { Notification } from '../types';

export default function NotificationsPage({ userId }: { userId: number }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const unreadCount = useMemo(() => notifications.filter((item) => !item.is_read).length, [notifications]);

  const load = async () => {
    setLoading(true);
    try {
      setNotifications(await notificationsApi.byUser(userId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [userId]);

  const markRead = async (id: number) => {
    try {
      await notificationsApi.markRead(id);
      setNotice('Notification marked as read.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update notification.');
    }
  };

  const markAll = async () => {
    try {
      await notificationsApi.markAllRead(userId);
      setNotice('All notifications marked as read.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update notifications.');
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-3xl font-bold">Notifications</h2>
          <p className="text-sm text-[#45464d]">{unreadCount} unread notifications for user #{userId}.</p>
        </div>
        <button onClick={markAll} disabled={!unreadCount} className="h-10 px-4 bg-[#0051d5] text-white rounded-lg text-xs font-bold disabled:opacity-40">Mark All Read</button>
      </header>
      {(error || notice) && <div className={`p-3 rounded-lg border text-sm font-semibold ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-800'}`}>{error ?? notice}</div>}
      <section className="space-y-3">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 rounded-lg bg-[#eff4ff] animate-pulse" />)
          : notifications.map((notification) => (
              <article key={notification.id} className="bg-white border border-[#c6c6cd] rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    {!notification.is_read && <span className="w-2 h-2 rounded-full bg-red-500" />}
                    <h3 className="font-bold">{notification.title}</h3>
                  </div>
                  <p className="text-sm text-[#45464d] mt-1">{notification.message}</p>
                </div>
                <button disabled={notification.is_read} onClick={() => markRead(notification.id)} className="h-9 px-3 rounded-lg border border-[#c6c6cd] text-xs font-bold disabled:opacity-40">Mark Read</button>
              </article>
            ))}
      </section>
    </div>
  );
}
