import { useState } from 'react';
import './ConsentForm.css';

function ConsentForm({ onSubmit, onPrev }) {
  const [agreed, setAgreed] = useState(false);
  const [smsAgreed, setSmsAgreed] = useState(false);
  const [emailAgreed, setEmailAgreed] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [privacyExpanded, setPrivacyExpanded] = useState(false);
  const [marketingExpanded, setMarketingExpanded] = useState(false);

  const formatPhone = (value) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    if (errors.phone) {
      setErrors((prev) => ({ ...prev, phone: null }));
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!agreed) {
      newErrors.agreed = '개인정보 수집·이용에 동의해 주세요.';
    }

    const phoneNumbers = phone.replace(/[^\d]/g, '');
    if (!phoneNumbers) {
      newErrors.phone = '휴대전화 번호를 입력해 주세요.';
    } else if (phoneNumbers.length < 10 || phoneNumbers.length > 11) {
      newErrors.phone = '올바른 휴대전화 번호를 입력해 주세요.';
    }

    if (!email) {
      newErrors.email = '이메일 주소를 입력해 주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = '올바른 이메일 형식을 입력해 주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const doSubmit = (withMarketing = false) => {
    onSubmit({
      phone: phone.replace(/[^\d]/g, ''),
      email,
      sms_agreed: withMarketing ? true : smsAgreed,
      email_agreed: withMarketing ? true : emailAgreed,
    });
  };

  const handleSubmit = () => {
    if (validateForm()) {
      if (!smsAgreed && !emailAgreed) {
        setShowModal(true);
      } else {
        doSubmit();
      }
    }
  };

  const handleAgreeAndSubmit = () => {
    setSmsAgreed(true);
    setEmailAgreed(true);
    setShowModal(false);
    doSubmit(true);
  };

  const handleJustSubmit = () => {
    setShowModal(false);
    doSubmit();
  };

  return (
    <div className="consent-form">
      <div className="consent-section">
        <button
          className="consent-header"
          onClick={() => setPrivacyExpanded(!privacyExpanded)}
        >
          <span className="consent-title">개인정보 수집·이용 동의 (필수)</span>
          <span className={`consent-arrow ${privacyExpanded ? 'expanded' : ''}`}>▼</span>
        </button>

        {privacyExpanded && (
          <div className="consent-box">
            <p className="consent-intro">
              (주)히포티앤씨는 설문 참여 사례비 지급을 위해 아래와 같이 개인정보를 수집·이용합니다.
            </p>
            <ul className="consent-list">
              <li><strong>수집 항목:</strong> 휴대전화 번호, 이메일 주소</li>
              <li><strong>수집 목적:</strong> 사례비 지급 및 관련 안내</li>
              <li><strong>보유 기간:</strong> 사례비 지급 완료 후 3개월 이내 파기</li>
            </ul>
            <p className="consent-notice">
              귀하는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다.<br />
              다만, 동의 거부 시 사례비 지급이 어렵습니다.
            </p>
          </div>
        )}

        <label className="consent-checkbox">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (errors.agreed) {
                setErrors((prev) => ({ ...prev, agreed: null }));
              }
            }}
          />
          <span className="checkmark"></span>
          <span className="checkbox-label">동의합니다</span>
        </label>
        {errors.agreed && <p className="error-message">{errors.agreed}</p>}
      </div>

      <div className="consent-section">
        <button
          className="consent-header"
          onClick={() => setMarketingExpanded(!marketingExpanded)}
        >
          <span className="consent-title">마케팅 정보 수신 동의 (선택)</span>
          <span className={`consent-arrow ${marketingExpanded ? 'expanded' : ''}`}>▼</span>
        </button>

        {marketingExpanded && (
          <div className="consent-box">
            <p className="consent-intro">
              (주)히포티앤씨의 제품·서비스 소식, 이벤트, 혜택 정보를 받아보시겠습니까?
            </p>
            <ul className="consent-list">
              <li><strong>수집 항목:</strong> 휴대전화 번호, 이메일 주소</li>
              <li><strong>이용 목적:</strong> 신제품 안내, 이벤트·프로모션 정보 발송</li>
              <li><strong>보유 기간:</strong> 동의 철회 시까지</li>
            </ul>
            <p className="consent-notice">
              ※ 동의하지 않으셔도 사례비 지급에는 영향이 없습니다.<br />
              ※ 동의 후에도 언제든 수신을 거부할 수 있습니다.
            </p>
          </div>
        )}

        <div className="marketing-benefit">
          <span className="benefit-icon">🎁</span>
          <div className="benefit-content">
            <span className="benefit-text">방금 응답하신 84문항, 리포트로 받아보시겠어요?</span>
            <span className="benefit-subtext">
              지금 동의하시면 귀하의 응답을 분석한<br />
              '나만의 마음건강 리포트'를 무료로 보내드립니다.
            </span>
            <span className="benefit-warning">⚠️ 지금 동의하지 않으시면 리포트를 받으실 수 없습니다.</span>
            <span className="benefit-note">※ 1~2개월 내 이메일로 발송</span>
          </div>
        </div>

        <div className="marketing-checkboxes">
          <label className="consent-checkbox">
            <input
              type="checkbox"
              checked={smsAgreed}
              onChange={(e) => setSmsAgreed(e.target.checked)}
            />
            <span className="checkmark"></span>
            <span className="checkbox-label">SMS 수신 동의</span>
          </label>

          <label className="consent-checkbox">
            <input
              type="checkbox"
              checked={emailAgreed}
              onChange={(e) => setEmailAgreed(e.target.checked)}
            />
            <span className="checkmark"></span>
            <span className="checkbox-label">이메일 수신 동의</span>
          </label>
        </div>
      </div>

      <div className="info-form">
        <h2 className="info-title">연락처 정보</h2>

        <div className="form-group">
          <label htmlFor="phone">휴대전화 번호</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="010-0000-0000"
            maxLength={13}
          />
          {errors.phone && <p className="error-message">{errors.phone}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email">이메일 주소</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="example@email.com"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>
      </div>

      <div className="consent-navigation">
        <button className="prev-btn" onClick={onPrev}>
          이전
        </button>
        <button className="submit-btn" onClick={handleSubmit}>
          제출하기
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">🎁</div>
            <p className="modal-text">마케팅 동의하시면<br />마음건강 리포트를 드려요!</p>
            <p className="modal-subtext">정말 동의 없이 제출하시겠어요?</p>
            <div className="modal-buttons">
              <button className="modal-btn primary" onClick={handleAgreeAndSubmit}>
                동의하고 제출
              </button>
              <button className="modal-btn secondary" onClick={handleJustSubmit}>
                그냥 제출
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ConsentForm;
