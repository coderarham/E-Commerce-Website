import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiMapPin, FiPhone, FiMail, FiClock, FiLock } from 'react-icons/fi';
import { emailService } from '../utils/emailService';
import { toast } from 'react-toastify';

const About = () => {
  const location = useLocation();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    rating: 5,
    message: ''
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [showContactSuccess, setShowContactSuccess] = useState(false);
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to send feedback');
      return;
    }
    
    setIsSubmittingFeedback(true);
    
    try {
      const success = await emailService.sendFeedback({
        name: feedbackForm.name,
        email: feedbackForm.email,
        rating: feedbackForm.rating,
        feedback: feedbackForm.message
      });
      
      if (success) {
        setShowFeedbackSuccess(true);
        toast.success('Feedback sent successfully!');
      } else {
        toast.error('Failed to send feedback. Please try again.');
      }
    } catch (error) {
      toast.error('Error sending feedback. Please try again.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const resetFeedbackForm = () => {
    setFeedbackForm({ name: '', email: '', rating: 5, message: '' });
    setShowFeedbackSuccess(false);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to send message');
      return;
    }
    
    setIsSubmittingContact(true);
    
    try {
      const success = await emailService.sendContactMessage({
        name: contactForm.name,
        email: contactForm.email,
        subject: contactForm.subject,
        message: contactForm.message
      });
      
      if (success) {
        setShowContactSuccess(true);
        toast.success('Message sent successfully!');
      } else {
        toast.error('Failed to send message. Please try again.');
      }
    } catch (error) {
      toast.error('Error sending message. Please try again.');
    } finally {
      setIsSubmittingContact(false);
    }
  };

  const resetContactForm = () => {
    setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setShowContactSuccess(false);
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-4">
        
        {/* About Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About Shoe Collection</h1>
            <p className="text-lg text-secondary">Premium footwear for every occasion</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-card p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Our Story</h2>
              <p className="text-secondary mb-4 leading-relaxed">
                Welcome to Shoe Collection, your premier destination for high-quality footwear since 1987. We are passionate about providing comfortable, stylish, and durable shoes for men, women, and children.
              </p>
              <p className="text-secondary mb-4 leading-relaxed">
                Our carefully curated collection features the latest trends and timeless classics from renowned brands worldwide. Whether you're looking for formal shoes for the office, athletic footwear for your workout, or casual sneakers for everyday wear, we have something for everyone.
              </p>
              <p className="text-secondary leading-relaxed">
                At Shoe Collection, we believe that the right pair of shoes can make all the difference. That's why we're committed to offering exceptional quality, competitive prices, and outstanding customer service to help you find your perfect fit.
              </p>
            </div>
          </div>
        </section>

        {/* Animated Feedback Section */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Animated Feedback Form */}
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-800 via-black to-gray-900 rounded-2xl p-1">
                  <div className="bg-white rounded-2xl p-8 relative overflow-hidden">
                    
                    {/* Floating Bubbles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute bg-blue-200 bg-opacity-30 rounded-full animate-pulse"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${10 + Math.random() * 30}px`,
                            height: `${10 + Math.random() * 30}px`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                          }}
                        />
                      ))}
                    </div>

                    {!showFeedbackSuccess ? (
                      <>
                        <h2 id="feedback" className="text-3xl font-bold text-center mb-2 relative z-10">Send us Feedback</h2>
                        <p className="text-center text-gray-500 mb-8 text-sm relative z-10">Let us know what you think of your experience.</p>
                        
                        {!isAuthenticated ? (
                          <div className="text-center relative z-10">
                            <FiLock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Login Required</h3>
                            <p className="text-gray-500 mb-6">Please login to send feedback</p>
                            <Link
                              to="/login"
                              className="bg-gradient-to-r from-gray-800 to-black text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 inline-block"
                            >
                              Login Now
                            </Link>
                          </div>
                        ) : (
                        <form onSubmit={handleFeedbackSubmit} className="space-y-6 relative z-10">
                      {/* Name Input with Floating Label */}
                      <div className="relative">
                        <input
                          type="text"
                          value={feedbackForm.name}
                          onChange={(e) => setFeedbackForm({...feedbackForm, name: e.target.value})}
                          className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-all duration-300 peer"
                          placeholder=""
                          required
                        />
                        <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                          feedbackForm.name ? '-top-2 text-xs text-black' : 'top-3 text-gray-500'
                        }`}>
                          Your Name
                        </label>
                      </div>

                      {/* Email Input with Floating Label */}
                      <div className="relative">
                        <input
                          type="email"
                          value={feedbackForm.email}
                          onChange={(e) => setFeedbackForm({...feedbackForm, email: e.target.value})}
                          className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-all duration-300 peer"
                          placeholder=""
                          required
                        />
                        <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                          feedbackForm.email ? '-top-2 text-xs text-black' : 'top-3 text-gray-500'
                        }`}>
                          Email Address
                        </label>
                      </div>
                      
                      {/* Star Rating */}
                      <div className="text-center">
                        <p className="text-gray-500 text-sm mb-4">How would you rate us?</p>
                        <div 
                          className="flex justify-center gap-2 mb-4"
                          onMouseLeave={() => setHoveredStar(0)}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFeedbackForm({...feedbackForm, rating: star})}
                              onMouseEnter={() => setHoveredStar(star)}
                              className={`text-2xl transition-all duration-200 ${
                                hoveredStar > 0 ? 
                                  (star <= hoveredStar ? 'text-yellow-400' : 'text-gray-300') :
                                  (star <= feedbackForm.rating ? 'text-yellow-400' : 'text-gray-300')
                              } ${
                                star === hoveredStar ? 'scale-125' : ''
                              }`}
                            >
                              ⭐
                            </button>
                          ))}
                        </div>
                        {(hoveredStar || feedbackForm.rating) > 0 && (
                          <div className="text-3xl animate-bounce">
                            {(hoveredStar || feedbackForm.rating) === 5 ? '🤩' : (hoveredStar || feedbackForm.rating) === 4 ? '🙂' : (hoveredStar || feedbackForm.rating) === 3 ? '😐' : (hoveredStar || feedbackForm.rating) === 2 ? '😞' : '😠'}
                          </div>
                        )}
                      </div>
                      
                      {/* Message Input with Floating Label */}
                      <div className="relative">
                        <textarea
                          value={feedbackForm.message}
                          onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
                          className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-all duration-300 resize-none"
                          rows="3"
                          placeholder=""
                          required
                        />
                        <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                          feedbackForm.message ? '-top-2 text-xs text-black' : 'top-3 text-gray-500'
                        }`}>
                          Your Message
                        </label>
                      </div>
                      
                          <button
                            type="submit"
                            disabled={isSubmittingFeedback}
                            className="w-full bg-gradient-to-r from-gray-800 to-black text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70"
                          >
                            {isSubmittingFeedback ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Sending...
                              </>
                            ) : (
                              <>
                                Send Feedback
                              </>
                            )}
                          </button>
                        </form>
                        )}
                      </>
                    ) : (
                      /* Success Message */
                      <div className="text-center relative z-10 animate-fadeIn">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                          <div className="text-white text-3xl">✓</div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
                        <p className="text-gray-500 mb-6">Your feedback has been sent successfully.</p>
                        <button
                          onClick={resetFeedbackForm}
                          className="text-black font-semibold hover:underline transition-colors"
                        >
                          Send another response
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Animated Contact Form */}
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-800 via-black to-gray-900 rounded-2xl p-1">
                  <div className="bg-white rounded-2xl p-8 relative overflow-hidden">
                    
                    {/* Floating Bubbles */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute bg-blue-200 bg-opacity-30 rounded-full animate-pulse"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            width: `${10 + Math.random() * 30}px`,
                            height: `${10 + Math.random() * 30}px`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${3 + Math.random() * 4}s`
                          }}
                        />
                      ))}
                    </div>

                    {!showContactSuccess ? (
                      <>
                        <h2 id="contact" className="text-3xl font-bold text-center mb-2 relative z-10">Contact Us</h2>
                        <p className="text-center text-gray-500 mb-8 text-sm relative z-10">We'd love to hear from you.</p>
                        
                        {!isAuthenticated ? (
                          <div className="text-center relative z-10">
                            <FiLock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Login Required</h3>
                            <p className="text-gray-500 mb-6">Please login to send message</p>
                            <Link
                              to="/login"
                              className="bg-gradient-to-r from-gray-800 to-black text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 inline-block"
                            >
                              Login Now
                            </Link>
                          </div>
                        ) : (
                        <form onSubmit={handleContactSubmit} className="space-y-6 relative z-10">
                          {/* Name Input */}
                          <div className="relative">
                            <input
                              type="text"
                              value={contactForm.name}
                              onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                              className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-all duration-300"
                              placeholder=""
                              required
                            />
                            <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                              contactForm.name ? '-top-2 text-xs text-black' : 'top-3 text-gray-500'
                            }`}>
                              Full Name
                            </label>
                          </div>

                          {/* Email Input */}
                          <div className="relative">
                            <input
                              type="email"
                              value={contactForm.email}
                              onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                              className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-all duration-300"
                              placeholder=""
                              required
                            />
                            <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                              contactForm.email ? '-top-2 text-xs text-black' : 'top-3 text-gray-500'
                            }`}>
                              Email Address
                            </label>
                          </div>
                          
                          {/* Phone Input */}
                          <div className="relative">
                            <input
                              type="tel"
                              value={contactForm.phone}
                              onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                              className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-all duration-300"
                              placeholder=""
                            />
                            <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                              contactForm.phone ? '-top-2 text-xs text-black' : 'top-3 text-gray-500'
                            }`}>
                              Phone Number
                            </label>
                          </div>

                          {/* Subject Input */}
                          <div className="relative">
                            <input
                              type="text"
                              value={contactForm.subject}
                              onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                              className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-all duration-300"
                              placeholder=""
                              required
                            />
                            <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                              contactForm.subject ? '-top-2 text-xs text-black' : 'top-3 text-gray-500'
                            }`}>
                              Subject
                            </label>
                          </div>
                          
                          {/* Message Input */}
                          <div className="relative">
                            <textarea
                              value={contactForm.message}
                              onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                              className="w-full px-4 py-3 bg-transparent border-b-2 border-gray-300 focus:border-black outline-none transition-all duration-300 resize-none"
                              rows="3"
                              placeholder=""
                              required
                            />
                            <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                              contactForm.message ? '-top-2 text-xs text-black' : 'top-3 text-gray-500'
                            }`}>
                              How can we help?
                            </label>
                          </div>
                          
                          <button
                            type="submit"
                            disabled={isSubmittingContact}
                            className="w-full bg-gradient-to-r from-gray-800 to-black text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 disabled:opacity-70"
                          >
                            {isSubmittingContact ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Sending...
                              </>
                            ) : (
                              <>
                                Send Message
                              </>
                            )}
                          </button>
                        </form>
                        )}
                      </>
                    ) : (
                      /* Success Message */
                      <div className="text-center relative z-10 animate-fadeIn">
                        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                          <div className="text-white text-3xl">✓</div>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                        <p className="text-gray-500 mb-6">We've received your message and will get back to you shortly.</p>
                        <button
                          onClick={resetContactForm}
                          className="text-black font-semibold hover:underline transition-colors"
                        >
                          Back to form
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Find Store & Address */}
        <section>
          <div className="max-w-4xl mx-auto">
            <h2 id="store" className="text-3xl font-bold text-center mb-8">Find Our Store</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Map */}
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Store Location</h3>
                <div className="aspect-w-16 aspect-h-12 mb-4">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.674665!2d77.209021!3d28.613939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd371e9e7c7d%3A0x8b8b8b8b8b8b8b8b!2sConnaught%20Place%2C%20New%20Delhi%2C%20Delhi!5e0!3m2!1sen!2sin!4v1234567890"
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg"
                  ></iframe>
                </div>
                <a
                  href="https://maps.google.com/?q=Connaught+Place+New+Delhi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-accent hover:text-accent-hover font-medium"
                >
                  <FiMapPin className="mr-2" />
                  View on Google Maps
                </a>
              </div>

              {/* Address & Contact Info */}
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-6">Store Information</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <FiMapPin className="text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Address</h4>
                      <p className="text-secondary">
                        Shoe Collection Store<br />
                        4/1A, Watgunj Street, Kabitirtha Sarani, Khidirpur,<br />
                        Kolkata, West Bengal 700023<br />
                        India
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FiPhone className="text-accent flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-secondary">+91 82748 890517</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <FiMail className="text-accent flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-secondary">shoecollection03@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <FiClock className="text-accent mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Store Hours</h4>
                      <div className="text-secondary">
                        <p>Monday - Saturday: 10:00 AM - 9:00 PM</p>
                        <p>Sunday: 11:00 AM - 8:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;