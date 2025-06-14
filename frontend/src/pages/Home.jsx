import RecentBlogs from '@/components/RecentBlogs'
import Hero from '../components/Hero'
import { Button } from '../components/ui/button'
import React from 'react'
import PopularAuthors from '@/components/PopularAuthors'


export default function Home() {
  return (
    <>
      <div className=''>
        <Hero />
        <RecentBlogs />
        <PopularAuthors />

      </div>


    </>
  )
}
