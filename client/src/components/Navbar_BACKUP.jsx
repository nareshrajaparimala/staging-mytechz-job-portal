//./components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import './Navbar.css'; 

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Jobs dropdown state
  const [jobsDropdownOpen, setJobsDropdownOpen] = useState(false);
  
  // Employers dropdown state
  const [employersDropdownOpen, setEmployersDropdownOpen] = useState(false);
  
  // Auth state - reactive to localStorage changes
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // Check auth status on mount and listen for storage changes
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!token);
      if (user) {
        try {
          setUserInfo(JSON.parse(user));
        } catch (err) {
          console.error('Error parsing user data', err);
          setUserInfo(null);
        }
      } else {
        setUserInfo(null);
      }
    };

    // Initial check
    checkAuthStatus();

    // Listen for storage changes (for multi-tab sync)
    window.addEventListener('storage', checkAuthStatus);
    
    // Custom event for same-tab auth changes
    window.addEventListener('authChange', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, []);
  
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const handleJobsDropdownToggle = () => {
    setJobsDropdownOpen(!jobsDropdownOpen);
  };

  const handleEmployersDropdownToggle = () => {
    setEmployersDropdownOpen(!employersDropdownOpen);
  };

  // Handle link click - close menu immediately and navigate
  const handleLinkClick = (e, path) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close menu immediately
    setMobileMenuOpen(false);
    
    // Navigate without delay
    navigate(path);
  };

  // Close mobile menu by clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (mobileMenuOpen && !event.target.closest('.menu') && !event.target.closest('.dropdown-content')) {
        handleMobileMenuClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserInfo(null);
    
    // Dispatch custom event for auth change
    window.dispatchEvent(new Event('authChange'));
    
    navigate('/login');
  };

  return (
    <nav>
      <div className="logo">
        {/* Mobile menu toggle */}
        <div className={`menu dropdown ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="menu-icondiv color-nav-box" onClick={handleMobileMenuToggle}>
            <i className="ri-menu-2-line"></i>
          </div>
          
          {/* Mobile dropdown menu */}
          <ul className={`dropdown-content ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <li className='color-subnav-box hamburger-item home-nav-h'>
              <button onClick={(e) => handleLinkClick(e, '/')} className="nav-link-btn">Home</button>
            </li>
            
            {/* Show different menu items based on user role */}
            {isLoggedIn && userInfo?.role === 'recruiter' ? (
              <>
                {/* Recruiter Mobile Menu */}
                <li className='color-subnav-box hamburger-item'>
                  <button onClick={(e) => handleLinkClick(e, '/recruiter/post-job')} className="nav-link-btn">Job Post</button>
                </li>
                <li className='color-subnav-box hamburger-item'>
                  <button onClick={(e) => handleLinkClick(e, '/recruiter/resume-database')} className="nav-link-btn">Resume Database</button>
                </li>
                <li className='color-subnav-box hamburger-item'>
                  <button onClick={(e) => handleLinkClick(e, '/recruiter/post-internship')} className="nav-link-btn">Internship Post</button>
                </li>
                <li className='color-subnav-box hamburger-item'>
                  <button onClick={(e) => handleLinkClick(e, '/recruiter/reports')} className="nav-link-btn">Get Report</button>
                </li>
              </>
            ) : (
              <>
                {/* Regular User Mobile Menu */}
                {/* Jobs with submenu */}
                <li className={`color-subnav-box hamburger-item job-nav-h dropdown-hidden ${jobsDropdownOpen ? 'jobs-open' : ''}`}>
                  <span onClick={handleJobsDropdownToggle} className="nav-link-btn dropbtn-hidden">
                    Jobs
                    <i className={`ri-arrow-${jobsDropdownOpen ? 'up' : 'down'}-s-line`}></i>
                  </span>
                  <ul className={`dropdown-content-hidden ${jobsDropdownOpen ? 'show' : ''}`}>
                    <li className='color-subnav-box'>
                      <button onClick={(e) => handleLinkClick(e, '/jobs/private')} className="nav-link-btn">Private Jobs</button>
                    </li>
                    <li className='color-subnav-box'>
                      <button onClick={(e) => handleLinkClick(e, '/jobs/government')} className="nav-link-btn">Government Jobs</button>
                    </li>
                  </ul>
                </li>
                
                <li className='color-subnav-box hamburger-item document-nav-h'>
                  <button onClick={(e) => handleLinkClick(e, '/documents')} className="nav-link-btn">Resume</button>
                </li>
                <li className='color-subnav-box hamburger-item admission-nav-h'>
                  <button onClick={(e) => handleLinkClick(e, '/admissions')} className="nav-link-btn">Admissions</button>
                </li>
                <li className='color-subnav-box hamburger-item webinar-nav-h'>
                  <button onClick={(e) => handleLinkClick(e, '/webinars')} className="nav-link-btn">Webinars</button>
                </li>
              </>
            )}
            
            {/* Show login only when NOT logged in */}
            {!isLoggedIn && (
              <li className="color-subnav-box hamburger-item login-nav-h">
                <button onClick={(e) => handleLinkClick(e, '/login')} className="nav-link-btn">Login</button>
              </li>
            )}
          </ul>
        </div>
        
        {/* Logo */}
        <div className="logo-img-div-nav">
          <img 
            src="../assets/logo2.png" 
            alt="MytechZ Logo" 
            className="logo-img"
          />
        </div>
      </div>

      {/* Desktop navigation */}
      <ul className="sector2">
        <li className={`color-nav-box home-nav ${location.pathname === '/' ? 'active' : ''}`}>
          <Link to="/">Home</Link>
        </li>
        
        {/* Show different nav items based on user role */}
        {isLoggedIn && userInfo?.role === 'recruiter' ? (
          <>
            {/* Recruiter Navigation */}
            <li className={`color-nav-box ${location.pathname === '/recruiter/post-job' ? 'active' : ''}`}>
              <Link to="/recruiter/post-job">Job Post</Link>
            </li>
            <li className={`color-nav-box ${location.pathname === '/recruiter/resume-database' ? 'active' : ''}`}>
              <Link to="/recruiter/resume-database">Resume Database</Link>
            </li>
            <li className={`color-nav-box ${location.pathname === '/recruiter/post-internship' ? 'active' : ''}`}>
              <Link to="/recruiter/post-internship">Internship Post</Link>
            </li>
            <li className={`color-nav-box ${location.pathname === '/recruiter/reports' ? 'active' : ''}`}>
              <Link to="/recruiter/reports">Get Report</Link>
            </li>
          </>
        ) : (
          <>
            {/* Regular User Navigation */}
            {/* Jobs with dropdown */}
            <li className={`color-nav-box job-nav dropdown ${location.pathname.startsWith('/jobs') ? 'active' : ''}`}>
              <Link to="/jobs">Jobs</Link>
              <ul className="dropdown-content jobs-dropdown">
                <li>
                  <Link to="/jobs/private">Private Jobs</Link>
                </li>
                <li>
                  <Link to="/jobs/government">Government Jobs</Link>
                </li>
              </ul>
            </li>
            
            <li className={`color-nav-box document-nav ${location.pathname === '/documents' ? 'active' : ''}`}>
              <Link to="/documents">Resume</Link>
            </li>
            <li className={`color-nav-box admission-nav ${location.pathname.startsWith('/admissions') ? 'active' : ''}`}>
              <Link to="/admissions">Admissions</Link>
            </li>
            <li className={`color-nav-box webinar-nav ${location.pathname === '/webinars' ? 'active' : ''}`}>
              <Link to="/webinars">Webinars</Link>
            </li>
          </>
        )}
      </ul>
      
      {/* Right side - Profile icon only */}
      <div className="log-div">
        {/* Profile icon/dropdown */}
        <div className="log-icon-div">
          {isLoggedIn ? (
            <ProfileDropdown 
              userInfo={userInfo}
              onLogout={handleLogout}
            />
          ) : (
            <Link to="/login" className="login-img">
              <i className="ri-user-line"></i>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;