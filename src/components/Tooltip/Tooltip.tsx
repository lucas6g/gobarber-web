import React from 'react';

import './Tooltip.css';

interface TooltipProps {
  title: string;
}

const Tooltip: React.FC<TooltipProps> = ({ title, children }) => {
  return (
    <div className="tooltip-container">
      {children}
      <span>{title}</span>
    </div>
  );
};

export default Tooltip;
