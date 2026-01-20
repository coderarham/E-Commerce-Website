import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const ReturnPolicy = () => {
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
          <h1 className="text-4xl font-bold text-main mb-8 text-center">Return Policy</h1>
          
          <div className="space-y-8 text-main">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">1. Return Window</h2>
              <p className="text-secondary leading-relaxed">
                We offer a 30-day return window from the date of delivery. Items must be returned in their original condition with all tags attached.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">2. Return Conditions</h2>
              <p className="text-secondary leading-relaxed mb-4">
                To be eligible for a return, your item must meet the following conditions:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Items must be unworn and in original packaging</li>
                <li>All original tags and labels must be attached</li>
                <li>Shoes must not show signs of wear or damage</li>
                <li>Original receipt or proof of purchase required</li>
                <li>Items must be returned within 30 days of delivery</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">3. How to Return</h2>
              <p className="text-secondary leading-relaxed mb-4">
                Follow these simple steps to return your items:
              </p>
              <ol className="list-decimal list-inside text-secondary space-y-2 ml-4">
                <li>Contact our customer service team via email or phone</li>
                <li>Receive return authorization number and shipping label</li>
                <li>Package items securely in original box with all accessories</li>
                <li>Attach the provided return label to the package</li>
                <li>Drop off at any authorized shipping location</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">4. Refund Process</h2>
              <p className="text-secondary leading-relaxed mb-4">
                Our refund process is designed to be quick and hassle-free:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Refunds will be processed within 5-7 business days after we receive your returned items</li>
                <li>Refunds will be issued to the original payment method</li>
                <li>You will receive an email confirmation once the refund is processed</li>
                <li>Bank processing times may vary (3-5 additional business days)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">5. Exchanges</h2>
              <p className="text-secondary leading-relaxed mb-4">
                We offer convenient exchange options:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Free exchanges for different sizes within 30 days</li>
                <li>Color exchanges subject to availability</li>
                <li>Exchange shipping is free for defective items</li>
                <li>Contact us to arrange an exchange before returning</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">6. Non-Returnable Items</h2>
              <p className="text-secondary leading-relaxed mb-4">
                The following items cannot be returned:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Items damaged by misuse or normal wear</li>
                <li>Items without original packaging or tags</li>
                <li>Personalized or customized items</li>
                <li>Items returned after 30-day window</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">7. Contact Information</h2>
              <p className="text-secondary leading-relaxed mb-4">
                For returns, exchanges, or questions about our return policy, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-secondary"><strong>Email:</strong> shoecollection03@gmail.com</p>
                <p className="text-secondary"><strong>Phone:</strong> (+91) 82748 90517</p>
                <p className="text-secondary"><strong>Hours:</strong> Monday - Friday, 11 AM - 6 PM</p>
                <p className="text-secondary"><strong>Address:</strong> 4/1A, Watgunj Street, Kabitirtha Sarani, Khidirpur, Kolkata, West Bengal 700023, India</p>
              </div>
            </section>

            <section className="border-t border-main pt-6">
              <p className="text-secondary text-sm">
                <strong>Last Updated:</strong> January 2025
              </p>
              <p className="text-secondary text-sm mt-2">
                This return policy is subject to change without notice. Please review periodically for updates.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ReturnPolicy;