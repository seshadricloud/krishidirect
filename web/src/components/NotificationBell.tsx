import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function fetchUnreadCount() {
    try {
      const response = await api.get('/notifications/unread-count');
      setUnreadCount(response.data.count);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }

  async function fetchNotifications() {
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(notificationId: string) {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  }

  function handleNotificationClick(notification: Notification) {
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
      setIsOpen(false);
    }
  }

  function handleToggle() {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'order': return '📦';
      case 'message': return '💬';
      case 'price_update': return '💰';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  }

  function getTimeAgo(date: string) {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return new Date(date).toLocaleDateString();
  }

  return (
    <div ref={dropdownRef} style={{ position: 'relative' }}>
      {/* Bell Icon Button */}
      <button
        onClick={handleToggle}
        style={{
          position: 'relative',
          padding: '8px 12px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: 24,
          transition: 'transform 0.2s',
          transform: isOpen ? 'scale(1.1)' : 'scale(1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = isOpen ? 'scale(1.1)' : 'scale(1)'}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: 4,
              right: 4,
              background: '#ef4444',
              color: 'white',
              borderRadius: '50%',
              width: 20,
              height: 20,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 11,
              fontWeight: 600,
              animation: 'pulse 2s infinite'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 8,
            width: 380,
            maxHeight: 500,
            background: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: 12,
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            zIndex: 1000,
            overflow: 'hidden',
            animation: 'slideDown 0.2s ease-out'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '2px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f9fafb'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Notifications</h3>
              {unreadCount > 0 && (
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>
                  {unreadCount} unread
                </div>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#10b981',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 8px',
                  borderRadius: 6
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f0fdf4'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>
                Loading...
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🔕</div>
                <div style={{ color: '#6b7280', fontSize: 14 }}>No notifications yet</div>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f3f4f6',
                    background: notification.isRead ? 'white' : '#eff6ff',
                    cursor: notification.link ? 'pointer' : 'default',
                    transition: 'background 0.2s',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'start'
                  }}
                  onMouseEnter={(e) => {
                    if (notification.link) {
                      e.currentTarget.style.background = notification.isRead ? '#f9fafb' : '#dbeafe';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = notification.isRead ? 'white' : '#eff6ff';
                  }}
                >
                  <div style={{ fontSize: 24, flexShrink: 0 }}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: 600,
                      fontSize: 14,
                      marginBottom: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      {notification.title}
                      {!notification.isRead && (
                        <span style={{
                          width: 8,
                          height: 8,
                          background: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0
                        }} />
                      )}
                    </div>
                    <div style={{
                      fontSize: 13,
                      color: '#6b7280',
                      marginBottom: 6,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {notification.message}
                    </div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>
                      {getTimeAgo(notification.createdAt)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div
              style={{
                padding: '12px 20px',
                borderTop: '2px solid #e5e7eb',
                textAlign: 'center',
                background: '#f9fafb'
              }}
            >
              <button
                onClick={() => {
                  navigate('/notifications');
                  setIsOpen(false);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#10b981',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '4px 8px'
                }}
              >
                View all notifications →
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
