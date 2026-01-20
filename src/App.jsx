import { useState, useMemo, useEffect } from 'react'
import './index.css'

function App() {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('goclass_students')
    return saved ? JSON.parse(saved) : [
      { id: 1, name: 'Aditya Pratama', class: 'XII-RPL-1' },
      { id: 2, name: 'Budi Santoso', class: 'XI-TKJ-2' },
      { id: 3, name: 'Citra Lestari', class: 'XII-RPL-1' },
      { id: 4, name: 'Dewi Anggraeni', class: 'X-MM-3' },
      { id: 5, name: 'Eko Wahyudi', class: 'XI-TKJ-2' },
    ]
  })

  // Data structure for sessions: { '2026-01-20': { studentId: { rajin: 80, ... } } }
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('goclass_sessions')
    const today = new Date().toISOString().split('T')[0]
    return saved ? JSON.parse(saved) : {
      [today]: {
        1: { rajin: 85, sopan: 90, disiplin: 88, attendance: 'present' },
        2: { rajin: 70, sopan: 75, disiplin: 80, attendance: 'present' },
        3: { rajin: 95, sopan: 98, disiplin: 92, attendance: 'absent' },
      }
    }
  })

  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0])

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('goclass_students', JSON.stringify(students))
  }, [students])

  useEffect(() => {
    localStorage.setItem('goclass_sessions', JSON.stringify(sessions))
  }, [sessions])

  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newStudent, setNewStudent] = useState({ name: '', class: '' })

  const filteredStudents = useMemo(() => {
    return students.filter(s =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.class.toLowerCase().includes(search.toLowerCase())
    )
  }, [students, search])

  const stats = useMemo(() => {
    const sessionData = sessions[currentDate] || {}
    const activeStudentIds = Object.keys(sessionData)
    const count = activeStudentIds.length || 1

    return {
      total: students.length,
      avgRajin: Math.round(Object.values(sessionData).reduce((acc, s) => acc + (s.rajin || 0), 0) / count),
      avgSopan: Math.round(Object.values(sessionData).reduce((acc, s) => acc + (s.sopan || 0), 0) / count),
      avgDisiplin: Math.round(Object.values(sessionData).reduce((acc, s) => acc + (s.disiplin || 0), 0) / count),
      present: Object.values(sessionData).filter(s => s.attendance === 'present').length
    }
  }, [students, sessions, currentDate])

  const currentSession = useMemo(() => sessions[currentDate] || {}, [sessions, currentDate])

  const handleAddStudent = (e) => {
    e.preventDefault()
    if (!newStudent.name || !newStudent.class) return
    const id = Date.now()
    setStudents([...students, { id, ...newStudent }])

    // Auto-create session entry for new student in current session
    setSessions(prev => ({
      ...prev,
      [currentDate]: {
        ...prev[currentDate],
        [id]: { rajin: 0, sopan: 0, disiplin: 0, attendance: 'absent' }
      }
    }))

    setNewStudent({ name: '', class: '' })
    setIsModalOpen(false)
  }

  const toggleAttendance = (id) => {
    setSessions(prev => {
      const session = prev[currentDate] || {}
      const studentData = session[id] || { rajin: 0, sopan: 0, disiplin: 0, attendance: 'absent' }
      return {
        ...prev,
        [currentDate]: {
          ...session,
          [id]: { ...studentData, attendance: studentData.attendance === 'present' ? 'absent' : 'present' }
        }
      }
    })
  }

  const deleteStudent = (id) => {
    if (window.confirm('Hapus data siswa ini?')) {
      setStudents(students.filter(s => s.id !== id))
    }
  }

  const updatePoints = (id, field, delta) => {
    setSessions(prev => {
      const session = prev[currentDate] || {}
      const studentData = session[id] || { rajin: 0, sopan: 0, disiplin: 0, attendance: 'absent' }
      return {
        ...prev,
        [currentDate]: {
          ...session,
          [id]: { ...studentData, [field]: Math.max(0, (studentData[field] || 0) + delta) }
        }
      }
    })
  }

  return (
    <div className="app-container">
      <header>
        <div className="logo">
          <h1>🚀 Go Class</h1>
        </div>
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Cari nama atau kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
          <span>+</span> Tambah Siswa
        </button>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Siswa</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Rajin</div>
          <div className="stat-value text-rajin">{stats.avgRajin}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Sopan</div>
          <div className="stat-value text-sopan">{stats.avgSopan}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Disiplin</div>
          <div className="stat-value text-disiplin">{stats.avgDisiplin}%</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Presensi ({currentDate})</div>
          <div className="stat-value">{stats.present} / {stats.total}</div>
        </div>
      </div>

      <div className="session-selector">
        <label>Pertemuan Tanggal: </label>
        <input
          type="date"
          value={currentDate}
          onChange={(e) => setCurrentDate(e.target.value)}
          className="date-input"
        />
      </div>

      <div className="student-list">
        <div className="table-header">
          <span>Nama Siswa</span>
          <span>Kelas</span>
          <span>Rajin</span>
          <span>Sopan</span>
          <span>Disiplin</span>
          <span>Aksi & Absen</span>
        </div>

        {filteredStudents.length > 0 ? filteredStudents.map(student => {
          const data = currentSession[student.id] || { rajin: 0, sopan: 0, disiplin: 0, attendance: 'absent' }
          return (
            <div key={student.id} className="student-row">
              <span style={{ fontWeight: 600 }}>{student.name}</span>
              <span style={{ color: 'var(--text-muted)' }}>{student.class}</span>
              <div className="point-controls">
                <span className="mobile-label">Rajin:</span>
                <span className="points-badge badge-rajin">{data.rajin}</span>
                <div className="point-btns">
                  <button onClick={() => updatePoints(student.id, 'rajin', 5)}>+</button>
                  <button onClick={() => updatePoints(student.id, 'rajin', -5)}>-</button>
                </div>
              </div>
              <div className="point-controls">
                <span className="mobile-label">Sopan:</span>
                <span className="points-badge badge-sopan">{data.sopan}</span>
                <div className="point-btns">
                  <button onClick={() => updatePoints(student.id, 'sopan', 5)}>+</button>
                  <button onClick={() => updatePoints(student.id, 'sopan', -5)}>-</button>
                </div>
              </div>
              <div className="point-controls">
                <span className="mobile-label">Disiplin:</span>
                <span className="points-badge badge-disiplin">{data.disiplin}</span>
                <div className="point-btns">
                  <button onClick={() => updatePoints(student.id, 'disiplin', 5)}>+</button>
                  <button onClick={() => updatePoints(student.id, 'disiplin', -5)}>-</button>
                </div>
              </div>
              <div className="action-buttons">
                <div
                  className={`attendance-mark ${data.attendance}`}
                  onClick={() => toggleAttendance(student.id)}
                  title={data.attendance === 'present' ? 'Hadir' : 'Alpa'}
                >
                  {data.attendance === 'present' ? '✓' : '✕'}
                </div>
                <button
                  className="btn-icon btn-delete"
                  onClick={() => deleteStudent(student.id)}
                  title="Hapus Siswa"
                >
                  🗑️
                </button>
              </div>
            </div>
          )
        }) : (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Tidak ada siswa ditemukan
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h2 style={{ marginBottom: '1.5rem' }}>Tambah Siswa Baru</h2>
            <form onSubmit={handleAddStudent}>
              <div className="form-group">
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  className="form-input"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  placeholder="Contoh: Andi Wijaya"
                />
              </div>
              <div className="form-group">
                <label>Kelas</label>
                <input
                  type="text"
                  className="form-input"
                  value={newStudent.class}
                  onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                  placeholder="Contoh: XII-RPL-1"
                />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Simpan</button>
                <button
                  type="button"
                  className="btn"
                  style={{ background: '#f1f5f9', flex: 1 }}
                  onClick={() => setIsModalOpen(false)}
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
