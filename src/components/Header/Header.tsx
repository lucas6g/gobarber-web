import { FiLogOut } from 'react-icons/fi';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../context/AuthContext';

import logoImg from '../../assets/logo.svg';
import './Header.css';

const Header: React.FC = () => {
  const { signOut, user } = useContext(AuthContext);

  return (
    <div className="dashboard-header">
      <div className="header-content">
        <img src={logoImg} alt="goBarber" />

        <div className="profile">
          <img
            src="https://i.pinimg.com/736x/64/01/f9/6401f990d444f01143bfcd01a28d7cb6.jpg"
            alt=""
          />
          <div className="profile-content">
            <span>Seja bem vindo </span>
            <Link to="/profile">
              <strong>{user.name}</strong>
            </Link>
          </div>
        </div>
        <button
          onClick={signOut}
          className="header-content-button"
          type="button"
        >
          <FiLogOut />
        </button>
      </div>
    </div>
  );
};

export default Header;
