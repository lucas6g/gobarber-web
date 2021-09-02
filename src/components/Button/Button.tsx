import React, { ButtonHTMLAttributes } from 'react';

import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  ...buttonProps
}) => {
  return (
    <button type="submit" {...buttonProps}>
      {isLoading ? 'Carregando...' : children}
    </button>
  );
};

export default Button;
