import React, { createContext, useCallback, useState } from 'react';
import { v4 } from 'uuid';
import ToastContainer from '../components/ToastContainer/ToastContainer';

// tipando as info do desse contexto para compartilhar
interface ToastContextData {
  addToast({ type, title, description }: ToastMessage): void;
  removeToast(id: string): void;
}

export interface ToastMessage {
  id?: string;
  type?: 'error' | 'info' | 'success';
  title: string;
  description?: string;
}

export const ToastContext = createContext<ToastContextData>(
  {} as ToastContextData,
);

const ToastProvider: React.FC = ({ children }) => {
  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([]);

  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      const id = v4();

      const toast = {
        id,
        title,
        type,
        description,
      };

      setToastMessages([...toastMessages, toast]);
    },
    [toastMessages],
  );
  const removeToast = useCallback(
    (id: string) => {
      const newToastmessages = toastMessages.filter((message) => {
        return message.id !== id;
      });

      setToastMessages(newToastmessages);
    },
    [toastMessages],
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toastMessages={toastMessages} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
