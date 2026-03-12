import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProfileDropdown.css';

function ProfileDropdown({ userInfo, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
      setIsOpen(false);
    }
  };

  // Calculate profile completion (mock data for now)
  const profileCompletion = 75;

  return (
    <div className="profile-dropdown-container" ref={dropdownRef}>
      {/* Avatar Button */}
      <button 
        className="profile-avatar-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Profile menu"
      >
        <div className="profile-avatar-placeholder">
          <i className="ri-user-line"></i>
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="profile-dropdown-panel">
          {/* Top Section - Profile Info */}
          <div className="dropdown-profile-section">
            <div className="dropdown-avatar-wrapper">
              <div className="completion-ring-wrapper">
                <svg className="completion-ring" viewBox="0 0 80 80">
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="36" 
                    fill="none" 
                    stroke="#e0e0e0" 
                    strokeWidth="4"
                  />
                  <circle 
                    cx="40" 
                    cy="40" 
                    r="36" 
                    fill="none" 
                    stroke="#4caf50" 
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - profileCompletion / 100)}`}
                    strokeLinecap="round"
                    transform="rotate(-90 40 40)"
                  />
                </svg>
                <div className="dropdown-avatar-placeholder">
                  <i className="ri-user-line"></i>
                </div>
              </div>
              <div className="completion-percent">{profileCompletion}%</div>
            </div>

            <div className="dropdown-profile-info">
              <h3 className="dropdown-profile-name">{userInfo?.name || 'User'}</h3>
              <p className="dropdown-profile-role">
                {userInfo?.role === 'recruiter' ? 'Recruiter' : 
                 userInfo?.role === 'admin' ? 'Administrator' : 'Job Seeker'}
              </p>
              <Link 
                to={userInfo?.role === 'recruiter' ? '/recruiter/company-profile' : '/profile'} 
                className="view-profile-link"
                onClick={() => setIsOpen(false)}
              >
                View & Update Profile <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </div>

          {/* Performance Card (for candidates only) */}
          {userInfo?.role === 'user' && (
            <div className="dropdown-performance-card">
              <div className="performance-item">
                <div className="performance-number">247</div>
                <div className="performance-label">Search Appearances</div>
              </div>
              <div className="performance-divider"></div>
              <div className="performance-item">
                <div className="performance-number">
                  89
                  <span className="performance-badge"></span>
                </div>
                <div className="performance-label">Recruiter Actions</div>
              </div>
            </div>
          )}

          {/* Menu List */}
          <div className="dropdown-menu-list">
            {userInfo?.role === 'user' && (
              <>
                <Link 
                  to="/dashboard/user" 
                  className="dropdown-menu-item"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/applications" 
                  className="dropdown-menu-item"
                  onClick={() => setIsOpen(false)}
                >
                  My Applications
                </Link>
              </>
            )}
            
            {userInfo?.role === 'recruiter' && (
              <>
                <Link 
                  to="/recruiter" 
                  className="dropdown-menu-item"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
              </>
            )}

            {userInfo?.role === 'admin' && (
              <>
                <Link 
                  to="/dashboard/admin" 
                  className="dropdown-menu-item"
                  onClick={() => setIsOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/jobs" 
                  className="dropdown-menu-item"
                  onClick={() => setIsOpen(false)}
                >
                  Manage Jobs
                </Link>
                <Link 
                  to="/admin/users" 
                  className="dropdown-menu-item"
                  onClick={() => setIsOpen(false)}
                >
                  Manage Users
                </Link>
              </>
            )}

            <div className="dropdown-divider"></div>

            <button 
              className="dropdown-menu-item dropdown-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
