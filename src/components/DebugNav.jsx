import './DebugNav.css';

const DEBUG_MODE = true; // 배포 시 false로 변경

function DebugNav({
  currentPage, // 'start' | 'section' | 'consent' | 'complete'
  currentSection,
  totalSections,
  onGoToStart,
  onGoToSection,
  onGoToConsent,
  onGoToComplete,
  onPrevSection,
  onNextSection,
}) {
  if (!DEBUG_MODE) return null;

  const isInSection = currentPage === 'section' || currentPage === 'consent';

  return (
    <div className="debug-nav">
      <span className="debug-label">DEBUG</span>
      <div className="debug-buttons">
        <button
          className={`debug-btn ${currentPage === 'start' ? 'active' : ''}`}
          onClick={onGoToStart}
        >
          시작
        </button>
        <button
          className="debug-btn"
          onClick={onPrevSection}
          disabled={!isInSection || currentSection === 0}
        >
          ◀
        </button>
        <span className="debug-section-info">
          {isInSection ? `${currentSection + 1}/${totalSections}` : '-'}
        </span>
        <button
          className="debug-btn"
          onClick={onNextSection}
          disabled={!isInSection || currentSection === totalSections - 1}
        >
          ▶
        </button>
        <button
          className={`debug-btn ${currentPage === 'consent' ? 'active' : ''}`}
          onClick={onGoToConsent}
        >
          동의
        </button>
        <button
          className={`debug-btn ${currentPage === 'complete' ? 'active' : ''}`}
          onClick={onGoToComplete}
        >
          완료
        </button>
      </div>
    </div>
  );
}

export default DebugNav;
