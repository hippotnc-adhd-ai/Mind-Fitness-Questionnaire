import { useRef } from 'react';
import Question from './Question';
import './Section.css';

function Section({ section, answers, onAnswerChange }) {
  const questionRefs = useRef({});

  const handleAnswerChange = (questionId, value, index, isSlider) => {
    onAnswerChange(questionId, value);

    // 슬라이더는 자동스크롤 안 함
    if (isSlider) return;

    // 다음 질문으로 스크롤
    const nextIndex = index + 1;
    if (nextIndex < section.questions.length) {
      const nextQuestionId = section.questions[nextIndex].id;
      setTimeout(() => {
        questionRefs.current[nextQuestionId]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 150);
    }
  };

  return (
    <div className="section">
      <h2 className="section-title">{section.title}</h2>
      {section.description && (
        <p className="section-description">{section.description}</p>
      )}
      <div className="section-questions">
        {section.questions.map((question, index) => (
          <div
            key={question.id}
            ref={(el) => (questionRefs.current[question.id] = el)}
          >
            {question.subtitle && (
              <h3 className="subsection-title">{question.subtitle}</h3>
            )}
            <Question
              question={question}
              value={answers[question.id]}
              onChange={(value, isSlider) => handleAnswerChange(question.id, value, index, isSlider)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Section;
