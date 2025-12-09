import React, { useState } from 'react';
import { FaStar, FaPaperPlane, FaSpinner } from 'react-icons/fa';

const AnimatedFeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const emojis = {
    1: "😠", 2: "😞", 3: "😐", 4: "🙂", 5: "🤩"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1500);
  };

  const resetForm = () => {
    setFormData({ name: '', email: '', rating: 0, message: '' });
    setShowSuccess(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 overflow-hidden">
      
      {/* Floating Bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white bg-opacity-20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 100}px`,
              height: `${20 + Math.random() * 100}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-md p-8 bg-white bg-opacity-95 backdrop-blur-lg rounded-2xl shadow-2xl transform transition-all duration-700 hover:scale-105">
        
        {!showSuccess ? (
          <div>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">Send us Feedback</h2>
            <p className="text-center text-gray-500 mb-8 text-sm">Let us know what you think of your experience.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Name Input */}
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors peer"
                  placeholder=" "
                  required
                />
                <label className="absolute left-4 top-3 text-gray-500 transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-500">
                  Your Name
                </label>
              </div>

              {/* Email Input */}
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors peer"
                  placeholder=" "
                  required
                />
                <label className="absolute left-4 top-3 text-gray-500 transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-500">
                  Email Address
                </label>
              </div>

              {/* Star Rating */}
              <div className="text-center">
                <p className="text-gray-500 text-sm mb-4">How would you rate us?</p>
                <div className="flex justify-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                      className={`text-3xl transition-all duration-200 hover:scale-125 ${
                        star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
                {formData.rating > 0 && (
                  <div className="text-4xl animate-bounce">
                    {emojis[formData.rating]}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="relative">
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-blue-500 outline-none transition-colors resize-none peer"
                  rows="3"
                  placeholder=" "
                  required
                />
                <label className="absolute left-4 top-3 text-gray-500 transition-all duration-300 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500 peer-valid:-top-2 peer-valid:text-xs peer-valid:text-blue-500">
                  Your Message
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    Send Feedback
                    <FaPaperPlane />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          
          /* Success Message */
          <div className="text-center animate-fadeIn">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <div className="text-white text-2xl">✓</div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
            <p className="text-gray-500 mb-6">Your feedback has been sent successfully.</p>
            <button
              onClick={resetForm}
              className="text-blue-500 font-semibold hover:underline transition-colors"
            >
              Send another response
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default AnimatedFeedbackForm;