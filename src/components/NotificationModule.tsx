import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

export const NotificationModule: React.FC = () => {
  return <Toaster position="top-right" />;
};

export const showNotification = (message: string) => {
  toast.success(message, {
    duration: 4000,
    style: {
      background: '#4F46E5',
      color: '#fff',
      padding: '16px',
      borderRadius: '8px'
    }
  });
}; 