import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  // State for form fields and UI control
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('candidate');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  // Handle role change - clear form fields
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setEmail('');
    setPassword('');
    setEmailFocused(false);
    setPasswordFocused(false);
    setShowPassword(false);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Demo mode for recruiters - bypass API call
    if (role === 'recruiter' && email === 'demo@recruiter.com' && password === 'demo123') {
      const demoUser = {
        name: 'Demo Recruiter',
        email: 'demo@recruiter.com',
        role: 'recruiter',
        companyName: 'TechCorp Solutions',
        profilePhoto: null
      };
      
      localStorage.setItem('token', 'demo-recruiter-token');
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('authChange'));
      
      window.location.href = '/recruiter';
      return;
    }
    
    // Demo mode for candidates - bypass API call
    if (role === 'candidate' && email === 'demo@candidate.com' && password === 'demo123') {
      const demoUser = {
        name: 'Demo Candidate',
        email: 'demo@candidate.com',
        role: 'candidate',
        profilePhoto: null,
        phone: '+91 9876543210',
        location: 'Mumbai, Maharashtra'
      };
      
      localStorage.setItem('token', 'demo-candidate-token');
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('authChange'));
      
      window.location.href = '/candidate/home';
      return;
    }
    
    // Demo mode for admin - bypass API call
    if (role === 'admin' && email === 'demo@admin.com' && password === 'admin123') {
      const demoUser = {
        name: 'Demo Admin',
        email: 'demo@admin.com',
        role: 'admin',
        profilePhoto: null
      };
      
      localStorage.setItem('token', 'demo-admin-token');
      localStorage.setItem('user', JSON.stringify(demoUser));
      
      // Dispatch auth change event
      window.dispatchEvent(new Event('authChange'));
      
      window.location.href = '/dashboard/admin';
      return;
    }
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
        email,
        password,
        role
      });

      // alert(response.data.message);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Dispatch auth change event
        window.dispatchEvent(new Event('authChange'));
        
        // Redirect based on role
        if (response.data.user.role === 'admin') {
          window.location.href = '/dashboard/admin';
        } else if (response.data.user.role === 'recruiter') {
          window.location.href = '/recruiter';
        } else {
          window.location.href = '/candidate/home';
        }
      }

    } catch (error) {
      // Extract detailed error message from backend
      let errorMessage = 'Login failed';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Show error using popup notification if available
      if (window.showPopup) {
        window.showPopup(errorMessage, 'error');
      } else {
        alert(errorMessage);
      }
    }
  };

  // Click outside modal to go back
  const handlePageClick = (e) => {
    if (!e.target.closest('.inbox-div')) {
      window.history.back();
    }
  };

  return (
    <div className="login-page" onClick={handlePageClick}>
      <div className="back-box">
        <div className="inbox-div" onClick={(e) => e.stopPropagation()}>

          {/* Close button */}
          <button 
            className="form-close-btn" 
            onClick={() => window.history.back()}
            aria-label="Close"
          >
            <i className="ri-close-line"></i>
          </button>

          {/* Left section image */}
          <div className="sector1">
            <div className="sector1-job-img" />
          </div>

          {/* Right section - login form */}
          <div className="sector2-login">
            <div className="sector2-job-img-div">
              <div className="logo-img" />
              <h3 id="logo-text">MytechZ</h3>
            </div>

            <form className="sector2-job-text" onSubmit={handleSubmit}>
              <h1 id="login-text">Log in</h1>

              {/* Role selection */}
              <div className="role-selection">
                <label className="role-label">Login as:</label>
                <div className="role-options">
                  <label className={`role-option ${role === 'candidate' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      value="candidate"
                      checked={role === 'candidate'}
                      onChange={(e) => handleRoleChange(e.target.value)}
                    />
                    <span>Candidate</span>
                  </label>
                  <label className={`role-option ${role === 'recruiter' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      value="recruiter"
                      checked={role === 'recruiter'}
                      onChange={(e) => handleRoleChange(e.target.value)}
                    />
                    <span>Recruiter</span>
                  </label>
                  <label className={`role-option ${role === 'admin' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      value="admin"
                      checked={role === 'admin'}
                      onChange={(e) => handleRoleChange(e.target.value)}
                    />
                    <span>Admin</span>
                  </label>
                </div>
              </div>

              {/* Email input */}
              <div className={`input-group ${emailFocused ? 'focused' : ''}`}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={(e) => setEmailFocused(!!e.target.value)}
                />
                <label>Email</label>
              </div>

              {/* Password input */}
              <div className={`input-group ${passwordFocused ? 'focused' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={(e) => setPasswordFocused(!!e.target.value)}
                />
                <label>Password</label>

                <button
                  type="button"
                  className="eye-btn"
                  tabIndex={-1}
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <i className="ri-eye-off-line"></i>
                  ) : (
                    <i className="ri-eye-line"></i>
                  )}
                </button>
              </div>

              {/* Forgot password link */}
              <div className="login-actions">
                <a href="/forgot-password" className="forgot-link">Forgot password?</a>
              </div>

              {/* Submit button */}
              <button className="login-btn-s2" type="submit">Log In</button>

              {/* Sign-up option */}
              <div className="signup-text">
                Don’t have an account? <a href="/register">Sign up</a>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;