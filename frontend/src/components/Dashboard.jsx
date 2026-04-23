import { useState, useEffect } from 'react'
import axios from 'axios'
import './Dashboard.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function Dashboard({ token, onLogout }) {
  const [grievances, setGrievances] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Academic'
  })
  const [editingId, setEditingId] = useState(null)
  const [searchTitle, setSearchTitle] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [student, setStudent] = useState(null)

  useEffect(() => {
    const storedStudent = localStorage.getItem('student')
    if (storedStudent) {
      setStudent(JSON.parse(storedStudent))
    }
    fetchGrievances()
  }, [])

  const fetchGrievances = async () => {
    try {
      const response = await axios.get(`${API_URL}/grievances`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setGrievances(response.data)
    } catch (err) {
      setError('Failed to fetch grievances')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (editingId) {
        await axios.put(`${API_URL}/grievances/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSuccess('Grievance updated successfully!')
        setEditingId(null)
      } else {
        await axios.post(`${API_URL}/grievances`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSuccess('Grievance submitted successfully!')
      }
      setFormData({ title: '', description: '', category: 'Academic' })
      fetchGrievances()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save grievance')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this grievance?')) {
      try {
        await axios.delete(`${API_URL}/grievances/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setSuccess('Grievance deleted successfully!')
        fetchGrievances()
      } catch (err) {
        setError('Failed to delete grievance')
      }
    }
  }

  const handleEdit = (grievance) => {
    setFormData({
      title: grievance.title,
      description: grievance.description,
      category: grievance.category,
      status: grievance.status
    })
    setEditingId(grievance._id)
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTitle.trim()) {
      fetchGrievances()
      return
    }

    try {
      const response = await axios.get(`${API_URL}/grievances/search/byTitle?title=${searchTitle}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setGrievances(response.data)
    } catch (err) {
      setError('Search failed')
    }
  }

  const handleLogoutClick = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('student')
    onLogout()
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Student Grievance Management System</h1>
        <div className="user-info">
          <p>Welcome, {student?.name}</p>
          <button onClick={handleLogoutClick} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Form Section */}
        <div className="form-section">
          <h2>{editingId ? 'Update Grievance' : 'Submit New Grievance'}</h2>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="title"
              placeholder="Grievance Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Describe your grievance..."
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="Academic">Academic</option>
              <option value="Hostel">Hostel</option>
              <option value="Transport">Transport</option>
              <option value="Other">Other</option>
            </select>

            {editingId && (
              <select
                name="status"
                value={formData.status || 'Pending'}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
              </select>
            )}

            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editingId ? 'Update Grievance' : 'Submit Grievance'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setFormData({ title: '', description: '', category: 'Academic' })
                  setError('')
                  setSuccess('')
                }}
                className="cancel-btn"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search grievances by title..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
            />
            <button type="submit">Search</button>
            <button
              type="button"
              onClick={() => {
                setSearchTitle('')
                fetchGrievances()
              }}
              className="reset-btn"
            >
              Reset
            </button>
          </form>
        </div>

        {/* Grievances List */}
        <div className="grievances-section">
          <h2>Your Grievances ({grievances.length})</h2>
          {grievances.length === 0 ? (
            <p className="no-grievances">No grievances found</p>
          ) : (
            <div className="grievances-list">
              {grievances.map(grievance => (
                <div key={grievance._id} className="grievance-card">
                  <div className="grievance-header">
                    <h3>{grievance.title}</h3>
                    <span className={`status ${grievance.status.toLowerCase()}`}>
                      {grievance.status}
                    </span>
                  </div>
                  <p className="category">
                    <strong>Category:</strong> {grievance.category}
                  </p>
                  <p className="description">
                    <strong>Description:</strong> {grievance.description}
                  </p>
                  <p className="date">
                    <strong>Date:</strong> {new Date(grievance.date).toLocaleDateString()}
                  </p>
                  <div className="grievance-actions">
                    <button
                      onClick={() => handleEdit(grievance)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(grievance._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
