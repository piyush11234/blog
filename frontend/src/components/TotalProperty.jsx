import { BarChart3, Eye, MessageSquare, ThumbsUp } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { setBlog } from '@/redux/blogSlice'

const TotalProperty = () => {
  // Access the blog state from Redux store
  const { blog } = useSelector(store => store.blog)

  // Local state to store total comments and total likes counts
  const [totalComments, setTotalComments] = useState(0)
  const [totalLikes, setTotalLikes] = useState(0)

  // Redux dispatch function to dispatch actions
  const dispatch = useDispatch()

  // Fetch blogs owned by the logged-in user and store in Redux state
  const getOwnBlog = async () => {
    try {
      const res = await axios.get(`https://blog-dqxu.onrender.com/blog/get-own-blogs`, { withCredentials: true })
      if (res.data.success) {
        // Dispatch the blogs data to Redux store
        dispatch(setBlog(res.data.blogs))
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch total number of comments across user's blogs
  const getTotalComments = async () => {
    try {
      const res = await axios.get(`https://blog-dqxu.onrender.com/comment/my-blogs/comments`, { withCredentials: true })
      if (res.data.success) {
        // Set total comments count in local state
        setTotalComments(res.data.totalComments)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // Fetch total number of likes across user's blogs
  const getTotalLikes = async () => {
    try {
      const res = await axios.get(`https://blog-dqxu.onrender.com/blog/my-blog-likes`, { withCredentials: true })
      if (res.data.success) {
        // Set total likes count in local state
        setTotalLikes(res.data.totalLikes)
      }
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect to run once on component mount to fetch all required data
  useEffect(() => {
    getOwnBlog()
    getTotalComments()
    getTotalLikes()
  }, [])

  // Prepare an array of stats to display in cards
  const stats = [
    {
      title: "Total Views",
      value: "24.8K", // Hardcoded; you can fetch dynamically if available
      icon: Eye,
      change: "+12%",
      trend: "up",
    },
    {
      title: "Total Blogs",
      value: blog.length, // Count from Redux state
      icon: BarChart3,
      change: "+4%",
      trend: "up",
    },
    {
      title: "Comments",
      value: totalComments, // From local state
      icon: MessageSquare,
      change: "+18%",
      trend: "up",
    },
    {
      title: "Likes",
      value: totalLikes, // From local state
      icon: ThumbsUp,
      change: "+7%",
      trend: "up",
    },
  ]

  return (
    <div className='md:p-10 p-4'>
      <div className='flex flex-col md:flex-row justify-around gap-3 md:gap-7'>

        {/* Map through each stat and create a Card */}
        {stats.map((stat) => (
          <Card key={stat.title} className="w-full dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {/* Stat title */}
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>

              {/* Icon component */}
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              {/* Stat value (number) */}
              <div className="text-2xl font-bold">{stat.value}</div>

              {/* Percentage change with color depending on trend */}
              <p className={`text-xs ${stat.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}

      </div>
    </div>
  )
}

export default TotalProperty
