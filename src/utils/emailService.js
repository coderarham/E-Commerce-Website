const API_BASE_URL = 'http://localhost:5002/api';

export const emailService = {
  sendContactMessage: async (contactData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/email/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      return response.ok;
    } catch (error) {
      console.error('Error sending contact message:', error);
      return false;
    }
  },

  sendFeedback: async (feedbackData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/email/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData)
      });
      return response.ok;
    } catch (error) {
      console.error('Error sending feedback:', error);
      return false;
    }
  }
};