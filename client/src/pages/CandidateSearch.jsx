import React, { useState, useEffect } from 'react';
import CandidateCard from '../components/Recruiter/CandidateCard';
import CandidateFilters from '../components/Recruiter/CandidateFilters';
import './CandidateSearch.css';

function ResumeDatabase() {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    skills: [],
    experience: '',
    location: '',
    salaryRange: '',
    education: '',
    jobRole: '',
    keyword: '',
    availability: '',
    lastActive: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const candidatesPerPage = 12;

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [candidates, filters, searchQuery, sortBy]);

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/resume-database`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCandidates(data.candidates || []);
      } else {
        setCandidates([]);
        if (window.showPopup) {
          window.showPopup('Unable to load candidates. Please try again later.', 'error');
        }
      }
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setCandidates([]);
      if (window.showPopup) {
        window.showPopup('Failed to connect to server. Please check your connection.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...candidates];

    if (searchQuery) {
      filtered = filtered.filter(candidate =>
        candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        candidate.jobRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.currentCompany.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    Object.keys(filters).forEach(filterKey => {
      const filterValue = filters[filterKey];
      if (!filterValue || (Array.isArray(filterValue) && filterValue.length === 0)) return;

      switch (filterKey) {
        case 'skills':
          if (filterValue.length > 0) {
            filtered = filtered.filter(candidate =>
              filterValue.some(skill =>
                candidate.skills.some(candidateSkill =>
                  candidateSkill.toLowerCase().includes(skill.toLowerCase())
                )
              )
            );
          }
          break;
        case 'experience':
          filtered = filtered.filter(candidate => {
            const exp = parseInt(candidate.experience);
            switch (filterValue) {
              case '0-1': return exp <= 1;
              case '1-3': return exp >= 1 && exp <= 3;
              case '3-5': return exp >= 3 && exp <= 5;
              case '5-8': return exp >= 5 && exp <= 8;
              case '8+': return exp >= 8;
              default: return true;
            }
          });
          break;
        case 'location':
          filtered = filtered.filter(candidate =>
            candidate.location.toLowerCase().includes(filterValue.toLowerCase())
          );
          break;
        case 'jobRole':
          filtered = filtered.filter(candidate =>
            candidate.jobRole.toLowerCase().includes(filterValue.toLowerCase())
          );
          break;
        case 'availability':
          filtered = filtered.filter(candidate =>
            candidate.availability.toLowerCase().includes(filterValue.toLowerCase())
          );
          break;
        case 'lastActive':
          filtered = filtered.filter(candidate => {
            const lastActive = candidate.lastActive;
            switch (filterValue) {
              case '24h':
                return lastActive.includes('hour') || lastActive.includes('minute');
              case '7d':
                return lastActive.includes('day') && parseInt(lastActive) <= 7;
              case '30d':
                return lastActive.includes('day') && parseInt(lastActive) <= 30;
              default:
                return true;
            }
          });
          break;
      }
    });

    switch (sortBy) {
      case 'relevance':
        filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
        break;
      case 'experience':
        filtered.sort((a, b) => parseFloat(b.totalExperience) - parseFloat(a.totalExperience));
        break;
      case 'salary':
        filtered.sort((a, b) => {
          const aSalary = parseInt(a.expectedSalary.split('-')[1]) || 0;
          const bSalary = parseInt(b.expectedSalary.split('-')[1]) || 0;
          return bSalary - aSalary;
        });
        break;
      case 'lastActive':
        filtered.sort((a, b) => {
          const aActive = a.lastActive.includes('hour') ? 1 : a.lastActive.includes('day') ? parseInt(a.lastActive) : 999;
          const bActive = b.lastActive.includes('hour') ? 1 : b.lastActive.includes('day') ? parseInt(b.lastActive) : 999;
          return aActive - bActive;
        });
        break;
      case 'profileCompletion':
        filtered.sort((a, b) => b.profileCompletion - a.profileCompletion);
        break;
    }

    setFilteredCandidates(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSaveProfile = async (candidateId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5010'}/api/recruiter/save-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ candidateId })
      });

      if (response.ok) {
        if (window.showPopup) {
          window.showPopup('Profile saved successfully!', 'success');
        }
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      if (window.showPopup) {
        window.showPopup('Error saving profile', 'error');
      }
    }
  };

  const handleViewProfile = (candidate) => {
    window.location.href = `/recruiter/candidate/${candidate.id}`;
  };

  const handleContactCandidate = (candidate) => {
    window.location.href = `/recruiter/contact/${candidate.id}`;
  };

  const indexOfLastCandidate = currentPage * candidatesPerPage;
  const indexOfFirstCandidate = indexOfLastCandidate - candidatesPerPage;
  const currentCandidates = filteredCandidates.slice(indexOfFirstCandidate, indexOfLastCandidate);
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);

  if (loading) {
    return (
      <div className="resume-database-page">
        <div className="loading">
          <i className="ri-loader-line"></i>
          <p>Loading resume database...</p>
        </div>
      </div>
    );
  }

  const totalCandidates = candidates.length;
  const activeCandidates = candidates.filter(c => c.lastActive.includes('hour') || (c.lastActive.includes('day') && parseInt(c.lastActive) <= 7)).length;
  const newCandidates = candidates.filter(c => c.lastActive.includes('hour') || (c.lastActive.includes('day') && parseInt(c.lastActive) <= 3)).length;
  const savedCandidates = 0;

  return (
    <div className="resume-database-page">
      <div className="resume-database-container">
        <div className="database-header">
          <div className="header-content">
            <h1>Resume Database</h1>
            <p>Search and discover talented candidates for your job openings</p>
          </div>
          
          <div className="database-search-section">
            <div className="database-search-bar">
              <i className="ri-search-line"></i>
              <input
                type="text"
                placeholder="Search by name, skills, company, or job role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="database-stats">
            <div className="stat-badge">
              <i className="ri-user-line"></i>
              <span>{totalCandidates} Total</span>
            </div>
            <div className="stat-badge">
              <i className="ri-user-star-line"></i>
              <span>{activeCandidates} Active</span>
            </div>
            <div className="stat-badge">
              <i className="ri-user-add-line"></i>
              <span>{newCandidates} New</span>
            </div>
            <div className="stat-badge">
              <i className="ri-bookmark-line"></i>
              <span>{savedCandidates} Saved</span>
            </div>
          </div>
        </div>

        <div className="database-controls">
          <div className="results-info">
            <span className="results-count">
              {filteredCandidates.length} candidate{filteredCandidates.length !== 1 ? 's' : ''} found
            </span>
          </div>
          
          <div className="controls-right">
            <div className="sort-controls">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="relevance">Relevance</option>
                <option value="experience">Experience</option>
                <option value="salary">Expected Salary</option>
                <option value="lastActive">Last Active</option>
                <option value="profileCompletion">Profile Completion</option>
              </select>
            </div>
            
            <div className="view-controls">
              <button
                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <i className="ri-grid-line"></i>
              </button>
              <button
                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <i className="ri-list-check"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Filters at the top - horizontal layout */}
        <div className="filters-horizontal">
          <CandidateFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="database-content">
          <div className="database-main">
            {currentCandidates.length > 0 ? (
              <>
                <div className={`candidates-container ${viewMode}`}>
                  {currentCandidates.map(candidate => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      onSave={() => handleSaveProfile(candidate.id)}
                      onView={() => handleViewProfile(candidate)}
                      onContact={() => handleContactCandidate(candidate)}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="pagination-btn"
                    >
                      <i className="ri-arrow-left-line"></i>
                      Previous
                    </button>
                    
                    <div className="pagination-info">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="pagination-btn"
                    >
                      Next
                      <i className="ri-arrow-right-line"></i>
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-results">
                <i className="ri-search-line"></i>
                <h3>No candidates found</h3>
                <p>Try adjusting your search criteria or filters</p>
                <button 
                  className="reset-filters-btn"
                  onClick={() => {
                    setFilters({
                      skills: [],
                      experience: '',
                      location: '',
                      salaryRange: '',
                      education: '',
                      jobRole: '',
                      keyword: '',
                      availability: '',
                      lastActive: ''
                    });
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeDatabase;
