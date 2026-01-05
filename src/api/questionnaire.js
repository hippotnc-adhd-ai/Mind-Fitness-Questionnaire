export async function fetchQuestions() {
  const response = await fetch('/api/questions');
  if (!response.ok) {
    throw new Error('Failed to fetch questions');
  }
  return response.json();
}

export async function submitResponses(sessionId, responses, contactInfo) {
  const response = await fetch('/api/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session_id: sessionId,
      responses: responses,
      contact: contactInfo,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to submit responses');
  }
  return response.json();
}
