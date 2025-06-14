
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import userLogo from "../assets/userLogo.jpg"

const PopularAuthors = () => {
    const [popularUser, setPopularUser] = useState([])
    const getAllUsers = async () => {
        try {
            const res = await axios.get(`https://blog-dqxu.onrender.com/user/all-users`)
            if (res.data.success) {
                setPopularUser(res.data.users)
            }
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        getAllUsers()
    }, [])
    return (
        <div>
            <div className='max-w-7xl mx-auto'>
                <div className='flex flex-col space-y-4 items-center'>
                    <h1 className='text-3xl md:text-4xl font-bold pt-10 '>Popular Authors</h1>
                    <hr className=' w-24 text-center border-2 border-red-500 rounded-full' />
                </div>
                <div className='flex items-center justify-around my-10 px-4 md:px-0'>
                    {
                        popularUser?.slice(0,3)?.map((user, index) => {
                            return <div key={index} className='flex flex-col gap-2 items-center'>
                                <img src={user.profilePicture || userLogo} alt=""  className='rounded-full h-16 w-16 md:w-32 md:h-32' />
                                <p className='font-semibold mb-3'>{user.fname} {user.lname}</p>
                            </div>

                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default PopularAuthors
