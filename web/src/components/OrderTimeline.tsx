import React from 'react';

interface StatusHistoryItem {
  id: string;
  status: string;
  notes?: string;
  createdAt: string;
}

interface OrderTimelineProps {
  currentStatus: string;
  statusHistory?: StatusHistoryItem[];
}

const STATUS_STEPS = [
  { key: 'pending', label: 'Order Placed', icon: '📝', color: '#6b7280' },
  { key: 'confirmed', label: 'Confirmed', icon: '✅', color: '#10b981' },
  { key: 'shipped', label: 'Shipped', icon: '📦', color: '#3b82f6' },
  { key: 'delivered', label: 'Delivered', icon: '🎉', color: '#8b5cf6' },
];

const CANCELLED_STATUS = { key: 'cancelled', label: 'Cancelled', icon: '❌', color: '#ef4444' };

export default function OrderTimeline({ currentStatus, statusHistory }: OrderTimelineProps) {
  const isCancelled = currentStatus === 'cancelled';
  const steps = isCancelled ? [STATUS_STEPS[0], CANCELLED_STATUS] : STATUS_STEPS;
  
  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.key === currentStatus);
  };

  const currentStepIndex = getCurrentStepIndex();

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {steps.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.key} style={{ position: 'relative', paddingBottom: isLast ? 0 : 32 }}>
              {/* Connector Line */}
              {!isLast && (
                <div
                  style={{
                    position: 'absolute',
                    left: 20,
                    top: 48,
                    width: 3,
                    height: 'calc(100% - 16px)',
                    background: isCompleted ? step.color : '#e5e7eb',
                    transition: 'background 0.3s'
                  }}
                />
              )}

              {/* Step */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, position: 'relative' }}>
                {/* Icon Circle */}
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    background: isCompleted ? step.color : '#f3f4f6',
                    border: `3px solid ${isCompleted ? step.color : '#e5e7eb'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    flexShrink: 0,
                    transition: 'all 0.3s',
                    transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                    boxShadow: isCurrent ? `0 4px 12px ${step.color}40` : 'none'
                  }}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: 16,
                    color: isCompleted ? '#111827' : '#9ca3af',
                    marginBottom: 4
                  }}>
                    {step.label}
                  </div>
                  
                  {statusHistory && statusHistory.length > 0 && (
                    <>
                      {statusHistory
                        .filter(h => h.status === step.key)
                        .map(history => (
                          <div key={history.id}>
                            <div style={{ fontSize: 13, color: '#6b7280' }}>
                              {new Date(history.createdAt).toLocaleString('en-IN', {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              })}
                            </div>
                            {history.notes && (
                              <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>
                                {history.notes}
                              </div>
                            )}
                          </div>
                        ))}
                    </>
                  )}

                  {!statusHistory && isCurrent && (
                    <div style={{ fontSize: 13, color: '#6b7280' }}>
                      Current status
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status Badge */}
      <div style={{
        marginTop: 24,
        padding: '12px 20px',
        background: isCancelled ? '#fee2e2' : currentStepIndex === steps.length - 1 ? '#f0fdf4' : '#eff6ff',
        border: `2px solid ${isCancelled ? '#fecaca' : currentStepIndex === steps.length - 1 ? '#bbf7d0' : '#bfdbfe'}`,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        <span style={{ fontSize: 24 }}>
          {isCancelled ? '❌' : currentStepIndex === steps.length - 1 ? '🎉' : '⏳'}
        </span>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14, color: '#111827' }}>
            {isCancelled ? 'Order Cancelled' : currentStepIndex === steps.length - 1 ? 'Order Completed' : 'In Progress'}
          </div>
          <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>
            {isCancelled
              ? 'This order has been cancelled'
              : currentStepIndex === steps.length - 1
              ? 'Your order has been successfully delivered'
              : `Current status: ${steps[currentStepIndex].label}`}
          </div>
        </div>
      </div>
    </div>
  );
}
