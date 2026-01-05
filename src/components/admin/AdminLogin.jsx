import { useState } from 'react';
import './AdminLogin.css';

const ADMIN_ID = 'hippotnc';
const ADMIN_PW = 'mindfitness';

function AdminLogin({ onLogin }) {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (id === ADMIN_ID && password === ADMIN_PW) {
      sessionStorage.setItem('admin_auth', 'true');
      onLogin();
    } else {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h1 className="admin-login-title">관리자 로그인</h1>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="admin-id">아이디</label>
            <input
              type="text"
              id="admin-id"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디를 입력하세요"
              autoComplete="username"
            />
          </div>
          <div className="admin-form-group">
            <label htmlFor="admin-pw">비밀번호</label>
            <input
              type="password"
              id="admin-pw"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              autoComplete="current-password"
            />
          </div>
          {error && <p className="admin-error">{error}</p>}
          <button type="submit" className="admin-login-btn">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
