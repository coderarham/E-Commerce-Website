import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedCreditCard = ({ formData, setFormData }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const formatCardNumber = (value) => {
    const v = value.replace(/[^0-9]/g, '');
    const truncatedV = v.substring(0, 16);
    const parts = [];
    for (let i = 0; i < truncatedV.length; i += 4) {
      parts.push(truncatedV.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const getMaskedCardNumber = (value) => {
    const v = value.replace(/[^0-9]/g, '');
    let masked = '';
    for (let i = 0; i < v.length; i++) {
      if (i >= 4 && i < 12) {
        masked += '#';
      } else {
        masked += v[i];
      }
    }
    const parts = [];
    for (let i = 0, len = masked.length; i < len; i += 4) {
      parts.push(masked.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const handleCardNumberChange = (e) => {
    const inputVal = e.target.value;
    if (/[^0-9\s]/.test(inputVal)) {
      e.target.value = inputVal.replace(/[^0-9\s]/g, '');
    }
    const formatted = formatCardNumber(e.target.value);
    setFormData({ ...formData, cardNumber: formatted });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Generate month and year options
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    return { value: month, label: month };
  });

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    return { value: year.toString().slice(-2), label: year.toString() };
  });

  return (
    <div className="w-full">
      {/* Animated Credit Card */}
      <div className="perspective-1000 w-80 h-48 mx-auto mb-8 relative">
        <motion.div
          className="card-inner w-full h-full relative"
          style={{
            transformStyle: 'preserve-3d',
            transition: 'transform 0.6s'
          }}
          animate={{ rotateY: isFlipped ? 180 : 0 }}
        >
          {/* Front Face */}
          <div className="card-front absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl"
               style={{
                 backfaceVisibility: 'hidden',
                 background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
               }}>
            {/* Gradient Blobs */}
            <div className="absolute top-[-50px] left-[-50px] w-60 h-60 rounded-full opacity-60 blur-[40px]"
                 style={{ background: 'radial-gradient(circle, #4c1d95, #2563eb)' }}></div>
            <div className="absolute bottom-[-60px] right-[-60px] w-60 h-60 rounded-full opacity-50 blur-[45px]"
                 style={{ background: 'radial-gradient(circle, #db2777, #f59e0b)' }}></div>
            
            <div className="relative z-10 h-full flex flex-col justify-between p-6 text-white">
              <div className="flex justify-between items-start">
                {/* Chip */}
                <div className="w-12 h-9 bg-gradient-to-br from-yellow-400 via-orange-600 to-yellow-400 rounded-md relative overflow-hidden shadow-inner">
                  <div className="absolute top-1/2 left-0 w-full h-px bg-black opacity-30"></div>
                  <div className="absolute left-1/2 top-0 w-px h-full bg-black opacity-30"></div>
                </div>
                {/* Visa Logo */}
                <div className="text-2xl font-bold opacity-90">VISA</div>
              </div>

              {/* Card Number */}
              <div className="mt-4">
                <div className="text-xs uppercase text-gray-300 tracking-widest mb-1">Card Number</div>
                <div className="font-mono text-xl tracking-widest">
                  {formData.cardNumber ? getMaskedCardNumber(formData.cardNumber) : '#### #### #### ####'}
                </div>
              </div>

              <div className="flex justify-between items-end mt-4">
                {/* Card Holder */}
                <div className="w-3/4">
                  <div className="text-xs uppercase text-gray-300 tracking-widest mb-1">Card Holder</div>
                  <div className="font-mono text-sm uppercase truncate tracking-wider">
                    {formData.nameOnCard || 'FULL NAME'}
                  </div>
                </div>
                {/* Expiry */}
                <div className="w-1/4 text-right">
                  <div className="text-xs uppercase text-gray-300 tracking-widest mb-1">Expires</div>
                  <div className="font-mono text-sm tracking-wider">
                    {formData.expiryDate || 'MM/YY'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Face */}
          <div className="card-back absolute w-full h-full rounded-2xl overflow-hidden shadow-2xl"
               style={{
                 backfaceVisibility: 'hidden',
                 transform: 'rotateY(180deg)',
                 background: 'linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%)'
               }}>
            {/* Magnetic Strip */}
            <div className="bg-gray-800 w-full h-11 absolute top-6"></div>
            
            {/* CVV Strip */}
            <div className="bg-white w-[90%] h-10 absolute top-20 left-[5%] rounded flex items-center justify-end pr-3">
              <span className="text-black font-bold font-mono text-lg">
                {formData.cvv ? formData.cvv.replace(/./g, '*') : ''}
              </span>
            </div>

            <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
              <div className="text-right pr-4 mb-16">
                <div className="text-xs uppercase text-gray-300 tracking-widest mb-1">CVV</div>
              </div>
              <div className="flex justify-between items-center opacity-80">
                <p className="text-xs text-gray-400 w-2/3 leading-tight">
                  This card is property of the bank. If found, please return to the nearest branch.
                </p>
                <div className="text-lg font-bold opacity-60">VISA</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            maxLength="19"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="#### #### #### ####"
            required
          />
        </div>

        {/* Card Holder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
          <input
            type="text"
            name="nameOnCard"
            value={formData.nameOnCard}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Full Name"
            required
          />
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month</label>
            <select
              name="expMonth"
              value={formData.expMonth || ''}
              onChange={(e) => {
                handleChange(e);
                setFormData({
                  ...formData,
                  expMonth: e.target.value,
                  expiryDate: `${e.target.value}/${formData.expYear || 'YY'}`
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">MM</option>
              {months.map(month => (
                <option key={month.value} value={month.value}>{month.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              name="expYear"
              value={formData.expYear || ''}
              onChange={(e) => {
                handleChange(e);
                setFormData({
                  ...formData,
                  expYear: e.target.value,
                  expiryDate: `${formData.expMonth || 'MM'}/${e.target.value}`
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">YY</option>
              {years.map(year => (
                <option key={year.value} value={year.value}>{year.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
            <input
              type="text"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              onFocus={() => setIsFlipped(true)}
              onBlur={() => setIsFlipped(false)}
              maxLength="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="123"
              required
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export default AnimatedCreditCard;