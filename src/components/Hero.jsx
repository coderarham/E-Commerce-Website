import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="pt-16 pb-8">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-8">
          <div className={`flex flex-wrap justify-center items-baseline gap-x-3 ${animate ? 'animate-pop-in' : 'opacity-0'}`}>
            <h1 className="text-4xl md:text-6xl font-bold">
              <span className="hero-shoe">Shoe </span>
              <span className="hero-collection">Collection</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary underline">
              Where every shoe tells a story.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;