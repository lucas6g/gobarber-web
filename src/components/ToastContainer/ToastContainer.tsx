import React from 'react';

import './ToastContainer.css';

import { useTransition } from 'react-spring';
import { ToastMessage } from '../../context/ToastContext';
import Toast from '../Toast/Toast';

interface ToastContainerProps {
  toastMessages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toastMessages }) => {
  const toastMessagesWhitTransition = useTransition(
    toastMessages,
    (message) => message.id || '',
    {
      from: { right: '-120%' },
      enter: { right: '0%' },
      leave: { right: '-120%' },
    },
  );

  return (
    <div className="toast-container">
      {toastMessagesWhitTransition.map(({ item, key, props }) => {
        return (
          <Toast
            style={props}
            key={key}
            title={item.title}
            description={item.description}
            type={item.type}
            id={item.id ? item.id : ''}
          />
        );
      })}
    </div>
  );
};

export default ToastContainer;
