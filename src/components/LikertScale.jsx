import './LikertScale.css';

function LikertScale({ scale, value, onChange, questionId }) {
  const options = [];
  for (let i = scale.min; i <= scale.max; i++) {
    options.push(i);
  }

  const isWideScale = scale.max - scale.min >= 10;

  if (isWideScale) {
    return (
      <div className="likert-scale">
        <div className="slider-container">
          <input
            type="range"
            min={scale.min}
            max={scale.max}
            value={value ?? scale.min}
            onChange={(e) => onChange(parseInt(e.target.value))}
            className="likert-slider"
          />
          <div className="slider-labels">
            {options.map((option) => (
              <span
                key={option}
                className={`slider-label ${value === option ? 'active' : ''}`}
              >
                {option}
              </span>
            ))}
          </div>
        </div>
        <div className="likert-scale-labels slider-scale-labels">
          <span>{scale.leftLabel || '전혀 그렇지 않다'}</span>
          <span>{scale.rightLabel || '매우 그렇다'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="likert-scale">
      <div className="likert-options">
        {options.map((option) => (
          <label key={option} className="likert-option">
            <input
              type="radio"
              name={`likert-${questionId}`}
              value={option}
              checked={value === option}
              onChange={() => onChange(option)}
            />
            <span className="likert-circle">{option}</span>
          </label>
        ))}
      </div>
      <div className="likert-scale-labels">
        {options.map((option, index) => (
          <span key={option}>
            {index === 0 ? (scale.leftLabel || '전혀 그렇지 않다') : ''}
            {index === options.length - 1 ? (scale.rightLabel || '매우 그렇다') : ''}
          </span>
        ))}
      </div>
    </div>
  );
}

export default LikertScale;
