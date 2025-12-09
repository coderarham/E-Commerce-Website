import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const Privacy = () => {
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
          <h1 className="text-4xl font-bold text-main mb-8 text-center">Privacy Policy</h1>
          
          <div className="space-y-8 text-main">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">1. Information We Collect</h2>
              <p className="text-secondary leading-relaxed mb-4">
                At Shoe Collection, we collect information to provide better services to our customers:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li><strong>Personal Information:</strong> Name, email address, phone number, shipping address</li>
                <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely)</li>
                <li><strong>Account Information:</strong> Username, password, order history, wishlist</li>
                <li><strong>Usage Data:</strong> Website interactions, pages visited, time spent on site</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">2. How We Use Your Information</h2>
              <p className="text-secondary leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send order confirmations and shipping updates</li>
                <li>Improve our website and user experience</li>
                <li>Send promotional offers and newsletters (with your consent)</li>
                <li>Prevent fraud and ensure security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">3. Information Sharing</h2>
              <p className="text-secondary leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li><strong>Service Providers:</strong> Shipping companies, payment processors, email services</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly agree to share information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">4. Data Security</h2>
              <p className="text-secondary leading-relaxed mb-4">
                We implement robust security measures to protect your information:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li>SSL encryption for all data transmission</li>
                <li>Secure payment processing through trusted providers</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and employee training</li>
                <li>Secure data storage and backup systems</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">5. Cookies and Tracking</h2>
              <p className="text-secondary leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand website usage</li>
                <li><strong>Marketing Cookies:</strong> Used for personalized advertising</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              </ul>
              <p className="text-secondary leading-relaxed mt-4">
                You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">6. Your Rights</h2>
              <p className="text-secondary leading-relaxed mb-4">
                You have the following rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-secondary space-y-2 ml-4">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Receive your data in a structured format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">7. Data Retention</h2>
              <p className="text-secondary leading-relaxed">
                We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy, 
                comply with legal obligations, resolve disputes, and enforce our agreements. Account information is retained 
                until you request deletion or close your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">8. Children's Privacy</h2>
              <p className="text-secondary leading-relaxed">
                Our website is not intended for children under 13 years of age. We do not knowingly collect personal 
                information from children under 13. If you are a parent or guardian and believe your child has provided 
                us with personal information, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">9. International Transfers</h2>
              <p className="text-secondary leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure that 
                such transfers comply with applicable data protection laws and implement appropriate safeguards to 
                protect your information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-accent">10. Contact Us</h2>
              <p className="text-secondary leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-secondary"><strong>Email:</strong> shoecollection03@gmail.com</p>
                <p className="text-secondary"><strong>Phone:</strong> (+91) 82748 90517</p>
                <p className="text-secondary"><strong>Address:</strong> 4/1A, Watgunj Street, Kabitirtha Sarani, Khidirpur, Kolkata, West Bengal 700023, India </p>
              </div>
            </section>

            <section className="border-t border-main pt-6">
              <p className="text-secondary text-sm">
                <strong>Last Updated:</strong> January 2025
              </p>
              <p className="text-secondary text-sm mt-2">
                This Privacy Policy may be updated from time to time. We will notify you of any significant changes 
                by posting the new policy on this page and updating the "Last Updated" date.
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;