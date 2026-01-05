import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Questionnaire from './components/Questionnaire';
import AdminPage from './components/admin/AdminPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app">
              <Questionnaire />
            </div>
          }
        />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
