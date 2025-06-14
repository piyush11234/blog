import React from 'react';
import hero_img from '../assets/blog2.png';
import { Button } from './ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import store from '@/redux/store';
import { toast } from 'sonner';

export default function Hero() {
  const {user}=useSelector(store=>store.auth)
  const navigate =useNavigate();

  const handleGetStarted = () => {
    if (!user) {
        toast.error('Please login first')
      navigate('/login')
    } else {
      navigate('dashboard/write-blog')
    }
  }
  return (
    <>
      <div className='mx-4 md:mx-0 bg-gray-100 dark:bg-gray-900 py-15'>
        <div className='max-w-7xl mx-auto flex flex-col md:flex-row items-center h-[600px] my-10 md:my-0'>
          {/* text */}
          <div className='flex-1 text-center md:text-left'>
            <h1 className='text-4xl md:text-6xl font-bold mb-4 text-gray-900 dark:text-white'>
              Welcome to Our Website
            </h1>
            <p className='text-lg md:text-xl mb-6 text-gray-700 dark:text-gray-300'>
              Discover amazing content and connect with our community.
            </p>
            <Button onClick={handleGetStarted} className='text-lg cursor-pointer'>Get Started</Button>
            <Link to={'/about'}><Button className='text-lg ml-4 border-white px-6 py-3 cursor-pointer' variant="outline">
              Learn More
            </Button></Link>
          </div>

          {/* image */}
          <div className='flex-1 mt-10 md:mt-0'>
            <img src={hero_img} alt="Hero" className='w-full h-auto' />
          </div>
        </div>
      </div>
    </>
  );
}
