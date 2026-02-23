import { writable } from 'svelte/store';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  dismissible?: boolean;
}

// Create a store for notifications
const createNotificationStore = () => {
  const { subscribe, set, update } = writable<Notification[]>([]);
  
  let idCounter = 0;
  
  return {
    subscribe,
    add: (notification: Omit<Notification, 'id'>) => {
      const id = `notification-${idCounter++}`;
      const newNotification = { id, ...notification };
      
      update(notifications => [...notifications, newNotification]);
      
      // Auto-remove notification after duration
      if (notification.duration !== 0) {
        const duration = notification.duration || 5000;
        setTimeout(() => {
          notificationsStore.remove(id);
        }, duration);
      }
      
      return id;
    },
    remove: (id: string) => {
      update(notifications => notifications.filter(notification => notification.id !== id));
    },
    clear: () => set([])
  };
};

export const notificationsStore = createNotificationStore();

// Helper functions for common notifications
export const notify = {
  info: (message: string, duration?: number) => 
    notificationsStore.add({ message, type: 'info', duration }),
  success: (message: string, duration?: number) => 
    notificationsStore.add({ message, type: 'success', duration }),
  warning: (message: string, duration?: number) => 
    notificationsStore.add({ message, type: 'warning', duration }),
  error: (message: string, duration?: number) => 
    notificationsStore.add({ message, type: 'error', duration })
};