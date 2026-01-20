import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-lg shadow-lg p-8"
        >
          <h1 className="text-4xl font-bold text-main mb-8 text-center">Terms & Conditions</h1>
          
          <div className="space-y-8 text-main">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">1. Acceptance of Terms</h2>
              <p className="text-secondary leading-relaxed">
                By accessing and using Shoe Collection website, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">2. Products and Services</h2>
              <p className="text-secondary leading-relaxed mb-4">
                Shoe Collection provides premium footwear for men, women, and kids. We strive to ensure:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>High-quality products from trusted brands</li>
                <li>Accurate product descriptions and images</li>
                <li>Competitive pricing and regular offers</li>
                <li>Secure payment processing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">3. Orders and Payment</h2>
              <p className="text-secondary leading-relaxed mb-4">
                When placing an order with Shoe Collection:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>All prices are listed in Indian Rupees (₹)</li>
                <li>Payment must be completed before order processing</li>
                <li>We accept major credit cards, debit cards, and digital wallets</li>
                <li>Order confirmation will be sent via email</li>
                <li>We reserve the right to cancel orders due to pricing errors or stock unavailability</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">4. Shipping and Delivery</h2>
              <p className="text-secondary leading-relaxed mb-4">
                Our shipping policy includes:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Standard delivery within 3-7 business days</li>
                <li>Express delivery available for select locations</li>
                <li>Free shipping on orders above ₹999</li>
                <li>Delivery charges apply for orders below minimum amount</li>
                <li>Tracking information provided for all orders</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">5. Returns and Exchanges</h2>
              <p className="text-secondary leading-relaxed mb-4">
                We offer hassle-free returns and exchanges:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>30-day return policy from date of delivery</li>
                <li>Products must be in original condition with tags</li>
                <li>Free return pickup for defective items</li>
                <li>Exchange available for size and color variations</li>
                <li>Refund processed within 5-7 business days</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">6. User Account</h2>
              <p className="text-secondary leading-relaxed mb-4">
                When creating an account:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your password</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>You are responsible for all activities under your account</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">7. Intellectual Property</h2>
              <p className="text-secondary leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software, is the property of 
                Shoe Collection and is protected by copyright and trademark laws. Unauthorized use is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">8. Privacy and Data Protection</h2>
              <p className="text-secondary leading-relaxed">
                We are committed to protecting your privacy. Please review our Privacy Policy to understand how we 
                collect, use, and protect your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">9. Limitation of Liability</h2>
              <p className="text-secondary leading-relaxed">
                Shoe Collection shall not be liable for any indirect, incidental, special, or consequential damages 
                resulting from the use or inability to use our products or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">10. Contact Information</h2>
              <p className="text-secondary leading-relaxed mb-4">
                For questions about these Terms & Conditions, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-secondary"><strong>Email:</strong> shoecollection03@gmail.com</p>
                <p className="text-secondary"><strong>Phone:</strong> (+91) 82748 90517</p>
                <p className="text-secondary"><strong>Address:</strong> 4/1A, Watgunj Street, Kabitirtha Sarani, Khidirpur, Kolkata, West Bengal 700023, India</p>
              </div>
            </section>

            <section className="border-t border-main pt-6">
              <p className="text-secondary text-sm">
                <strong>Last Updated:</strong> January 2025
              </p>
              <p className="text-secondary text-sm mt-2">
                These terms and conditions are subject to change without notice. Please review periodically for updates.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;