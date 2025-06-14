import React from 'react';
import aboutImg from "../assets/About-blog.avif";

const About = () => {
  return (
    <div className="min-h-screen pt-28 px-4 md:px-0 mb-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
            About ThinkStack
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Empowering minds through stories, insights, and inspiration.
          </p>
        </div>

        {/* Image + Text Section */}
        <div className="mt-12 grid md:grid-cols-2 gap-10 items-center">
          <img
            src={aboutImg}
            alt="Creative blogging illustration"
            className="w-full h-72 object-cover rounded-2xl shadow-md"
          />
          <div>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Welcome to <span className="font-semibold">ThinkStack</span> — a space where ideas thrive. Whether you're a writer looking to share your journey, or a curious reader exploring fresh perspectives, you've found your home.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              We believe in the power of words to connect people and build communities. Our platform makes it easy to write, publish, and engage with content that matters to you.
            </p>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Join us in shaping a vibrant space for creative expression, thoughtful discussion, and continuous learning.
            </p>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="mt-16 text-center">
          <blockquote className="text-2xl italic text-gray-500 dark:text-gray-400">
            "Your story could be the spark that ignites someone else’s journey."
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default About;
