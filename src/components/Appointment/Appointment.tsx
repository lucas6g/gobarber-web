import React from 'react';
import { FiClock } from 'react-icons/fi';

import './Appointment.css';

interface IAppoitntmentProps {
  name: string;
  schedule: string;
  avatar_url: string;
}

const Appointment: React.FC<IAppoitntmentProps> = ({
  avatar_url,
  schedule,
  name,
}) => {
  return (
    <div className="appointment">
      <span>
        <FiClock />
        {schedule}
      </span>
      <div>
        <img src={avatar_url} alt="" />
        <strong>{name}</strong>
      </div>
    </div>
  );
};

export default Appointment;
