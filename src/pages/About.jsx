import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

const About = () => {
  const location = useLocation();
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    rating: 5,
    message: ''
  });
  
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

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback:', feedbackForm);
    alert('Thank you for your feedback!');
    setFeedbackForm({ name: '', email: '', rating: 5, message: '' });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact:', contactForm);
    alert('Message sent successfully!');
    setContactForm({ name: '', email: '', phone: '', subject: '', message: '' });
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

        {/* Feedback and Contact Forms Side by Side */}
        <section className="mb-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Feedback Form */}
              <div>
                <h2 id="feedback" className="text-3xl font-bold text-center mb-8">Send us Feedback</h2>
                <div className="bg-card p-8 rounded-lg shadow-lg">
                  <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">Name</label>
                      <input
                        type="text"
                        value={feedbackForm.name}
                        onChange={(e) => setFeedbackForm({...feedbackForm, name: e.target.value})}
                        className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">Email</label>
                      <input
                        type="email"
                        value={feedbackForm.email}
                        onChange={(e) => setFeedbackForm({...feedbackForm, email: e.target.value})}
                        className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">Rating</label>
                      <select
                        value={feedbackForm.rating}
                        onChange={(e) => setFeedbackForm({...feedbackForm, rating: e.target.value})}
                        className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      >
                        <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                        <option value={4}>⭐⭐⭐⭐ Good</option>
                        <option value={3}>⭐⭐⭐ Average</option>
                        <option value={2}>⭐⭐ Poor</option>
                        <option value={1}>⭐ Very Poor</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">Message</label>
                      <textarea
                        value={feedbackForm.message}
                        onChange={(e) => setFeedbackForm({...feedbackForm, message: e.target.value})}
                        rows="4"
                        className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="Share your experience with us..."
                        required
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-accent text-btn py-3 rounded-lg hover:bg-accent-hover transition-colors font-semibold"
                    >
                      Submit Feedback
                    </button>
                  </form>
                </div>
              </div>

              {/* Contact Form */}
              <div id="contact">
                <h2 className="text-3xl font-bold text-center mb-8">Contact Us</h2>
                <div className="bg-card p-8 rounded-lg shadow-lg">
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">Name</label>
                      <input
                        type="text"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">Email</label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">Phone</label>
                      <input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">Subject</label>
                      <input
                        type="text"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                        className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-secondary mb-2">Message</label>
                      <textarea
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        rows="3"
                        className="w-full px-4 py-2 border border-main rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        placeholder="How can we help you?"
                        required
                      ></textarea>
                    </div>
                    
                    <button
                      type="submit"
                      className="w-full bg-accent text-btn py-3 rounded-lg hover:bg-accent-hover transition-colors font-semibold"
                    >
                      Send Message
                    </button>
                  </form>
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
                        Block A, Connaught Place<br />
                        Kolkata, West Bengal 700036<br />
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