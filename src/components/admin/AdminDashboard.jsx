import { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ onLogout }) {
  const [contacts, setContacts] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('contacts');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [contactsRes, responsesRes] = await Promise.all([
        fetch('/api/admin/contacts'),
        fetch('/api/admin/responses'),
      ]);
      const contactsData = await contactsRes.json();
      const responsesData = await responsesRes.json();
      setContacts(contactsData);
      setResponses(responsesData);
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    onLogout();
  };

  const exportToCSV = (data, filename, headers) => {
    if (data.length === 0) return;

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...data.map((row) => headers.map((h) => row[h.key] ?? '').join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const contactHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'session_id', label: 'session_id' },
    { key: 'phone', label: 'phone' },
    { key: 'email', label: 'email' },
    { key: 'sms_agreed', label: 'sms_agreed' },
    { key: 'email_agreed', label: 'email_agreed' },
    { key: 'created_at', label: 'created_at' },
  ];

  const responseHeaders = [
    { key: 'id', label: 'ID' },
    { key: 'session_id', label: 'session_id' },
    { key: 'question_id', label: 'question_id' },
    { key: 'answer', label: 'answer' },
    { key: 'created_at', label: 'created_at' },
  ];

  if (loading) {
    return <div className="admin-loading">로딩 중...</div>;
  }

  const currentData = activeTab === 'contacts' ? contacts : responses;
  const currentHeaders = activeTab === 'contacts' ? contactHeaders : responseHeaders;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Admin</h1>
        <button className="logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </header>

      <div className="admin-toolbar">
        <div className="tab-buttons">
          <button
            className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            contacts ({contacts.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'responses' ? 'active' : ''}`}
            onClick={() => setActiveTab('responses')}
          >
            responses ({responses.length})
          </button>
        </div>
        <button
          className="export-btn"
          onClick={() =>
            exportToCSV(currentData, activeTab, currentHeaders)
          }
        >
          CSV 다운로드
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {currentHeaders.map((h) => (
                <th key={h.key}>{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, idx) => (
              <tr key={row.id || idx}>
                {currentHeaders.map((h) => (
                  <td key={h.key}>{row[h.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
