import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import logo from '../assets/Mytechz.png';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [jobsDropdownOpen, setJobsDropdownOpen] = useState(false);
  const [resourcesDropdownOpen, setResourcesDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

    checkAuthStatus();
    window.addEventListener('storage', checkAuthStatus);
    window.addEventListener('authChange', checkAuthStatus);

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      window.removeEventListener('authChange', checkAuthStatus);
    };
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserInfo(null);
    window.dispatchEvent(new Event('authChange'));
    navigate('/login');
  };

  return (
    <div className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <img src={logo} alt="MytechZ Logo" className="logo-img" />
          </Link>

          {/* Desktop Menu */}
          <ul className="navbar-menu">
            <li className={location.pathname === '/' ? 'active' : ''}>
              <Link to="/">Home</Link>
            </li>

            {isLoggedIn && userInfo?.role === 'recruiter' ? (
              <>
                <li className={location.pathname === '/recruiter/post-job' ? 'active' : ''}>
                  <Link to="/recruiter/post-job">Job Post</Link>
                </li>
                <li className={location.pathname === '/recruiter/resume-database' ? 'active' : ''}>
                  <Link to="/recruiter/resume-database">Resume Database</Link>
                </li>
                <li className={location.pathname === '/recruiter/post-internship' ? 'active' : ''}>
                  <Link to="/recruiter/post-internship">Internship Post</Link>
                </li>
                <li className={location.pathname === '/recruiter/reports' ? 'active' : ''}>
                  <Link to="/recruiter/reports">Get Report</Link>
                </li>
              </>
            ) : (
              <>
                {/* Jobs Dropdown */}
                <li 
                  className={`dropdown ${location.pathname.startsWith('/jobs') ? 'active' : ''}`}
                  onMouseEnter={() => setJobsDropdownOpen(true)}
                  onMouseLeave={() => setJobsDropdownOpen(false)}
                >
                  <button className="dropdown-trigger">
                    Jobs <i className="ri-arrow-down-s-line"></i>
                  </button>
                  {jobsDropdownOpen && (
                    <ul className="dropdown-menu">
                      <li><Link to="/jobs/private">Private Jobs</Link></li>
                      <li><Link to="/jobs/government">Government Jobs</Link></li>
                      <li><Link to="/jobs/internships">Internships</Link></li>
                    </ul>
                  )}
                </li>

                {/* Resources Dropdown */}
                <li 
                  className={`dropdown ${location.pathname.startsWith('/webinars') || location.pathname.startsWith('/interview-prep') || location.pathname.startsWith('/career-guidance') ? 'active' : ''}`}
                  onMouseEnter={() => setResourcesDropdownOpen(true)}
                  onMouseLeave={() => setResourcesDropdownOpen(false)}
                >
                  <button className="dropdown-trigger">
                    Resources <i className="ri-arrow-down-s-line"></i>
                  </button>
                  {resourcesDropdownOpen && (
                    <ul className="dropdown-menu">
                      <li><Link to="/webinars">Webinars</Link></li>
                      <li><Link to="/interview-prep">Interview Prep</Link></li>
                      <li><Link to="/career-guidance">Career Guidance</Link></li>
                    </ul>
                  )}
                </li>

                <li className={location.pathname === '/documents' ? 'active' : ''}>
                  <Link to="/documents">Resume</Link>
                </li>
                <li className={location.pathname.startsWith('/admissions') ? 'active' : ''}>
                  <Link to="/admissions">Admissions</Link>
                </li>
              </>
            )}
          </ul>

          {/* Profile Icon / Login Button */}
          <div className="navbar-auth">
            {isLoggedIn ? (
              <ProfileDropdown userInfo={userInfo} onLogout={handleLogout} />
            ) : (
              <Link to="/login" className="login-button">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <i className="ri-menu-line"></i>
          </button>
        </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          
          {isLoggedIn && userInfo?.role === 'recruiter' ? (
            <>
              <Link to="/recruiter/post-job" onClick={() => setMobileMenuOpen(false)}>Job Post</Link>
              <Link to="/recruiter/resume-database" onClick={() => setMobileMenuOpen(false)}>Resume Database</Link>
              <Link to="/recruiter/post-internship" onClick={() => setMobileMenuOpen(false)}>Internship Post</Link>
              <Link to="/recruiter/reports" onClick={() => setMobileMenuOpen(false)}>Get Report</Link>
            </>
          ) : (
            <>
              <div className="mobile-dropdown">
                <button onClick={() => setJobsDropdownOpen(!jobsDropdownOpen)}>
                  Jobs <i className={`ri-arrow-${jobsDropdownOpen ? 'up' : 'down'}-s-line`}></i>
                </button>
                {jobsDropdownOpen && (
                  <div className="mobile-submenu">
                    <Link to="/jobs/private" onClick={() => setMobileMenuOpen(false)}>Private Jobs</Link>
                    <Link to="/jobs/government" onClick={() => setMobileMenuOpen(false)}>Government Jobs</Link>
                    <Link to="/jobs/internships" onClick={() => setMobileMenuOpen(false)}>Internships</Link>
                  </div>
                )}
              </div>

              <div className="mobile-dropdown">
                <button onClick={() => setResourcesDropdownOpen(!resourcesDropdownOpen)}>
                  Resources <i className={`ri-arrow-${resourcesDropdownOpen ? 'up' : 'down'}-s-line`}></i>
                </button>
                {resourcesDropdownOpen && (
                  <div className="mobile-submenu">
                    <Link to="/webinars" onClick={() => setMobileMenuOpen(false)}>Webinars</Link>
                    <Link to="/interview-prep" onClick={() => setMobileMenuOpen(false)}>Interview Prep</Link>
                    <Link to="/career-guidance" onClick={() => setMobileMenuOpen(false)}>Career Guidance</Link>
                  </div>
                )}
              </div>

              <Link to="/documents" onClick={() => setMobileMenuOpen(false)}>Resume</Link>
              <Link to="/admissions" onClick={() => setMobileMenuOpen(false)}>Admissions</Link>
            </>
          )}
        </div>
      )}
      </nav>
    </div>
  );
}

export default Navbar;
