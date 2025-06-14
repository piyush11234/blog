import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/logo.png';
import { FaFacebook, FaInstagram, FaPinterest, FaTwitterSquare } from 'react-icons/fa';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className='bg-gray-800 text-gray-200 py-10 '>
      <div className='max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8 '>

        {/* Info */}
        <div>
          <Link to='/' className='flex items-center gap-3'>
            <img src={Logo} alt="ThinkStack logo" className='invert w-12 h-12' />
            <h1 className='text-3xl font-bold'>ThinkStack</h1>
          </Link>
          <p className='mt-2 text-sm'>Sharing insights, tutorials, and ideas on web development and tech.</p>
          <address className='mt-2 text-sm not-italic'>
            123 Blog St, Style City, NY 10001<br />
            Email: <a href="mailto:support@blog.com" className='text-red-400'>support@blog.com</a><br />
            Phone: (123) 456-7890
          </address>
        </div>

        {/* Quick Links */}
        <nav>
          <h3 className='text-xl font-semibold'>Quick Links</h3>
          <ul className='mt-2 text-sm space-y-2'>
            <li><Link to='/' className='hover:underline'>Home</Link></li>
            <li><Link to='/blogs' className='hover:underline'>Blogs</Link></li>
            <li><Link to='/about' className='hover:underline'>About Us</Link></li>
            {/* <li><Link to='/faq' className='hover:underline'>FAQs</Link></li> */}
          </ul>
        </nav>

        {/* Social Media */}
        <div>
          <h3 className='text-xl font-semibold'>Follow Us</h3>
          <div className='flex space-x-4 mt-2 text-2xl'>
            <a href="https://www.facebook.com/" aria-label="Facebook" className='hover:text-red-400'><FaFacebook /></a>
            <a href="https://www.instagram.com/p.iyush.522/" aria-label="Instagram" className='hover:text-red-400'><FaInstagram /></a>
            <a href="https://www.linkedin.com/in/piyush-shakya-a555852a2/" className='hover:text-red-400'><FaLinkedinIn /></a>
            <a href="https://github.com/piyush11234" aria-label="Pinterest" className='hover:text-red-400'><FaGithub /></a>
          </div>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className='text-xl font-semibold'>Stay in the Loop</h3>
          <p className='mt-2 text-sm'>Subscribe to get special offers, free giveaways, and more</p>
          <form className='mt-4 flex max-w-sm'>
            <input
              type="email"
              placeholder='Your email address'
              aria-label="Email Address"
              className='w-full p-2 rounded-l-md bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500'
            />
            <button type='submit' className='bg-red-600 text-white px-4 rounded-r-md hover:bg-red-700'>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Footer bottom */}
      <div className='mt-8 border-t border-gray-700 pt-6 text-center text-sm'>
        <p>&copy; {new Date().getFullYear()} <span className='text-red-500'>ThinkStack</span>. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
