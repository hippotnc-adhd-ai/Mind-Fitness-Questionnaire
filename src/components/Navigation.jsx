import './Navigation.css';

function Navigation({
  currentSection,
  totalSections,
  onPrev,
  onNext,
  canGoNext,
  isLastSection,
  onSubmit,
}) {
  return (
    <div className="navigation">
      <div className="progress">
        {currentSection + 1} / {totalSections}
      </div>
      <div className="nav-buttons">
        <button
          className="nav-btn prev"
          onClick={onPrev}
          disabled={currentSection === 0}
        >
          이전
        </button>
        {isLastSection ? (
          <button
            className="nav-btn submit"
            onClick={onSubmit}
            disabled={!canGoNext}
          >
            제출
          </button>
        ) : (
          <button
            className="nav-btn next"
            onClick={onNext}
            disabled={!canGoNext}
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
}

export default Navigation;
