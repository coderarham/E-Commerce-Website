import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedin, FaFacebook, FaInstagram } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <footer className="bg-footer border-t border-main pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-main">Support</h3>
            <Link to="/about#store" className="block text-secondary hover:text-accent transition-colors">Find Our Store</Link>
            <Link to="/about#feedback" className="block text-secondary hover:text-accent transition-colors">Send us Feedback</Link>
            <Link to="/about#contact" className="block text-secondary hover:text-accent transition-colors">Contact Us</Link>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-main">About Shoe Collection</h3>
            <Link to="/news" className="block text-secondary hover:text-accent transition-colors">News</Link>
            <Link to="/track" className="block text-secondary hover:text-accent transition-colors">Track Order</Link>
            <Link to="/careers" className="block text-secondary hover:text-accent transition-colors">Careers</Link>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-main">Legal</h3>
            <Link to="/terms" className="block text-secondary hover:text-accent transition-colors">Terms & Conditions</Link>
            <Link to="/privacy" className="block text-secondary hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/return-policy" className="block text-secondary hover:text-accent transition-colors">Return Policy</Link>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-main">Stay Up To Date</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-secondary hover:text-accent transition-colors">
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a href="#" className="text-secondary hover:text-accent transition-colors">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="#" className="text-secondary hover:text-accent transition-colors">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="mailto:einstein@example.com" className="text-secondary hover:text-accent transition-colors">
                <FiMail className="w-6 h-6" />
              </a>
            </div>
            <div className="mt-4 text-secondary text-sm">
              <p className="font-semibold text-base">
                <span className="hero-shoe">Shoe </span>
                <span className="hero-collection">Collection</span>
              </p>
              <p>Arham Einstein</p>
              <p>(+91) 8274890517</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-main mt-8 pt-8 text-center text-secondary text-sm">
          <p>&copy; 2025 Shoe Collection. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;