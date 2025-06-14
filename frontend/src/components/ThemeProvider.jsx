import React from 'react'
import { useSelector } from 'react-redux'

const ThemeProvider = ({children}) => {
    const {theme} = useSelector(state => state.theme)
  return (
    <div className={theme}>
      <div className='bg-gray-200 text-gray-800 dark:text-gray-200 dark:bg-[rgb(16,23,42)]'>
        {children}
      </div>
    </div>
  )
}

export default ThemeProvider