import LikertScale from './LikertScale';
import './Question.css';

function Question({ question, value, onChange }) {
  const isSlider = question.scale.max - question.scale.min >= 10;

  const handleChange = (val) => {
    onChange(val, isSlider);
  };

  return (
    <div className="question">
      <p className="question-text">{question.text}</p>
      <LikertScale
        scale={question.scale}
        value={value}
        onChange={handleChange}
        questionId={question.id}
      />
    </div>
  );
}

export default Question;
