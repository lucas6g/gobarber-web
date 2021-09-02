import React, { useContext, useEffect } from 'react';
import {
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';

import { animated } from 'react-spring';

import './Toast.css';
import { ToastContext } from '../../context/ToastContext';

interface ToastProps {
  id: string;
  type?: 'error' | 'info' | 'success';
  title: string;
  description?: string;
  style: object;
}

// criando um obejeto para renderizar componentes

const icons = {
  info: <FiInfo size={20} />,
  error: <FiAlertCircle size={20} />,
  success: <FiCheckCircle size={20} />,
};

const Toast: React.FC<ToastProps> = ({
  type,
  description,
  title,
  id,
  style,
}) => {
  const { removeToast } = useContext(ToastContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(id);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [id, removeToast]);

  return (
    <>
      <animated.div style={style} className={`toast-info-container ${type}`}>
        {icons[type || 'info']}

        <div className="toast-info">
          <strong>{title}</strong>
          <p>{description}</p>
        </div>
        <FiXCircle
          onClick={() => {
            removeToast(id);
          }}
          className="toast-button"
          size={18}
        />
      </animated.div>
    </>
  );
};

export default Toast;
