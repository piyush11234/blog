import BlogCard from '@/components/BlogCard';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const SearchList = () => {
  // Get the current URL location
  const location = useLocation();

  // Extract query string from URL
  const params = new URLSearchParams(location.search);
  const query = params.get('q')?.toLowerCase(); // Normalize to lowercase

  // Get blogs from Redux store
  const { blog } = useSelector(store => store.blog);

  // Log blogs for debugging
  console.log(blog);

  // Filter blogs based on title, subtitle, or category
  const filteredBlogs = blog.filter((blog) =>
    blog.title.toLowerCase().includes(query) ||
    blog.subtitle.toLowerCase().includes(query) ||
    blog.category.toLowerCase() === query
  );

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='pt-32'>
      <div className='max-w-6xl mx-auto px-4'>
        {/* Show the query string being searched */}
        <h2 className='mb-5 text-xl font-semibold'>
          Search Results for: "<span className='text-blue-600'>{query}</span>"
        </h2>

        {/* Show filtered blog cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 my-10'>
          {
            filteredBlogs.length > 0 ? (
              filteredBlogs.map((blogItem, index) => (
                <BlogCard key={blogItem._id || index} blog={blogItem} />
              ))
            ) : (
              <p className="text-gray-500 col-span-3">No results found for "{query}".</p>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default SearchList;
