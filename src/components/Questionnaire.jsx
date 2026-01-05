import { useState, useEffect } from 'react';
import Section from './Section';
import Navigation from './Navigation';
import DebugNav from './DebugNav';
import ConsentForm from './ConsentForm';
import { fetchQuestions, submitResponses } from '../api/questionnaire';
import './Questionnaire.css';

const STORAGE_KEY = 'questionnaire_progress';

function getSessionId() {
  let sessionId = localStorage.getItem('questionnaire_session_id');
  if (!sessionId) {
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('questionnaire_session_id', sessionId);
  }
  return sessionId;
}

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load progress:', e);
  }
  return null;
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save progress:', e);
  }
}

function clearProgress() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('questionnaire_session_id');
}

function Questionnaire() {
  const [questionnaire, setQuestionnaire] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);

  // 초기 로드: 질문 불러오기 + 저장된 진행상황 복원
  useEffect(() => {
    fetchQuestions()
      .then((data) => {
        setQuestionnaire(data);

        const saved = loadProgress();
        if (saved) {
          setAnswers(saved.answers || {});
          setCurrentSectionIndex(saved.currentSectionIndex || 0);
          setStarted(saved.started || false);
          setSubmitted(saved.submitted || false);
        }

        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // 진행상황 저장
  useEffect(() => {
    if (!loading && !submitted) {
      saveProgress({
        answers,
        currentSectionIndex,
        started,
        submitted,
      });
    }
  }, [answers, currentSectionIndex, started, submitted, loading]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const currentSection = questionnaire?.sections[currentSectionIndex];

  const isCurrentSectionComplete = () => {
    if (!currentSection) return false;
    return currentSection.questions.every((q) => answers[q.id] !== undefined);
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentSectionIndex < questionnaire.sections.length) {
      setCurrentSectionIndex((prev) => prev + 1);
    }
  };

  const handleSubmit = async (contactInfo) => {
    const sessionId = getSessionId();
    const responseList = Object.entries(answers).map(([questionId, answer]) => ({
      question_id: questionId,
      answer: answer,
    }));

    try {
      await submitResponses(sessionId, responseList, contactInfo);
      setSubmitted(true);
      clearProgress();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoToConsent = () => {
    setCurrentSectionIndex(questionnaire.sections.length);
  };

  const handleRestart = () => {
    clearProgress();
    setAnswers({});
    setCurrentSectionIndex(0);
    setStarted(false);
    setSubmitted(false);
  };

  // 동의 페이지인지 확인
  const isConsentPage = currentSectionIndex >= questionnaire?.sections.length;

  // 현재 페이지 상태
  const getCurrentPage = () => {
    if (!started) return 'start';
    if (submitted) return 'complete';
    if (isConsentPage) return 'consent';
    return 'section';
  };

  // 디버그 네비게이션 핸들러
  const debugGoToStart = () => {
    setStarted(false);
    setSubmitted(false);
  };

  const debugGoToComplete = () => {
    setStarted(true);
    setSubmitted(true);
  };

  const debugGoToSection = () => {
    setStarted(true);
    setSubmitted(false);
    if (currentSectionIndex >= questionnaire.sections.length) {
      setCurrentSectionIndex(0);
    }
  };

  const debugGoToConsent = () => {
    setStarted(true);
    setSubmitted(false);
    setCurrentSectionIndex(questionnaire.sections.length);
  };

  // 디버그 네비게이션 컴포넌트
  const renderDebugNav = () => {
    if (!questionnaire) return null;

    return (
      <DebugNav
        currentPage={getCurrentPage()}
        currentSection={currentSectionIndex}
        totalSections={questionnaire.sections.length + 1}
        onGoToStart={debugGoToStart}
        onGoToSection={debugGoToSection}
        onGoToConsent={debugGoToConsent}
        onGoToComplete={debugGoToComplete}
        onPrevSection={handlePrev}
        onNextSection={handleNext}
      />
    );
  };

  if (loading) {
    return <div className="questionnaire-loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="questionnaire-error">오류: {error}</div>;
  }

  if (submitted) {
    return (
      <>
        <div className="questionnaire-complete">
          <h2>수고하셨습니다</h2>
          <div className="complete-description">
            <p>
              설문에 참여해 주셔서 진심으로 감사드립니다. 귀하의 소중한 응답은 직장인의 마음건강 증진을 위한 연구에 큰 도움이 됩니다.
            </p>
            <p>
              응답하신 내용은 연구 목적으로만 활용되며, 개인정보는 철저히 보호됩니다.
            </p>
            <p>
              문의사항이 있으시면 아래 연락처로 연락 주시기 바랍니다.
            </p>
            <p>감사합니다.</p>
          </div>
          <div className="complete-footer">
            <img src="/hippotnc_logo_color.svg" alt="히포티앤씨 로고" className="company-logo" />
            <div className="company-info">
              <span className="company-name">㈜히포티앤씨</span>
              <span className="company-email">이메일: contact@hippotnc.com</span>
            </div>
          </div>
          <button className="restart-btn" onClick={handleRestart}>
            다시 시작하기
          </button>
        </div>
        {renderDebugNav()}
      </>
    );
  }

  if (!started) {
    return (
      <>
        <div className="questionnaire-start">
          <h1>{questionnaire.title}</h1>
          <div className="start-description">
            <p>
              안녕하세요. 본 설문은 직장인의 마음건강 상태를 파악하고, 더 나은 근무환경 조성을 위한 기초자료를 수집하기 위해 진행됩니다. 설문은 총 84문항으로 구성되어 있으며, 예상 소요시간은 약 10분입니다.
            </p>
            <p>
              응답하신 내용은 연구 및 통계 목적으로만 활용되며, 개인정보는 철저히 보호됩니다. 응답 내용이 외부에 공개되거나 개인을 식별하는 데 사용되지 않으니 안심하시고 참여해 주시기 바랍니다.
            </p>
            <p>
              본 설문에는 정답이 없습니다. 평소 느끼시는 대로 솔직하게 응답해 주시면 됩니다. 성실하게 응답을 완료해 주신 분께는 소정의 사례를 지급해 드립니다.
            </p>
            <p>설문에 참여해 주셔서 감사합니다.</p>
          </div>
          <div className="start-footer">
            <img src="/hippotnc_logo_color.svg" alt="히포티앤씨 로고" className="company-logo" />
            <span className="company-name">㈜히포티앤씨 드림</span>
          </div>
          <button className="start-btn" onClick={() => setStarted(true)}>
            {Object.keys(answers).length > 0 ? '이어서 하기' : '시작하기'}
          </button>
        </div>
        {renderDebugNav()}
      </>
    );
  }

  // 동의 페이지 렌더링
  if (isConsentPage) {
    return (
      <>
        <div className="questionnaire">
          <h1 className="questionnaire-title">{questionnaire.title}</h1>
          <ConsentForm
            onSubmit={handleSubmit}
            onPrev={handlePrev}
          />
        </div>
        {renderDebugNav()}
      </>
    );
  }

  return (
    <>
      <div className="questionnaire">
        <h1 className="questionnaire-title">{questionnaire.title}</h1>
        <Section
          section={currentSection}
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
        <Navigation
          currentSection={currentSectionIndex}
          totalSections={questionnaire.sections.length + 1}
          onPrev={handlePrev}
          onNext={handleNext}
          canGoNext={isCurrentSectionComplete()}
          isLastSection={false}
        />
      </div>
      {renderDebugNav()}
    </>
  );
}

export default Questionnaire;
