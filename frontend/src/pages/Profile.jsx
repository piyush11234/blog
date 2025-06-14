import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Card } from '../components/ui/card'
import React, { useState } from 'react'
import userLogo from '../assets/userLogo.jpg'
import { Link } from 'react-router-dom'
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from "@/components/ui/textarea"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from 'react-redux'
import store from '@/redux/store'
import { setLoading, setUser } from '@/redux/authSlice'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import TotalProperty from '@/components/TotalProperty'




export default function Profile() {
    axios.defaults.withCredentials = true;

    const [open, setOpen] = useState(false);

    const user = useSelector(store => store.auth.user);
    const loading = useSelector(store => store.auth);


    const dispatch = useDispatch();
    const [input, setInput] = useState({
        fname: user?.fname,
        lname: user?.lname,
        occupation: user?.occupation,
        bio: user?.bio,
        facebook: user?.facebook,
        instagram: user?.instagram,
        linkedin: user?.linkedin,
        github: user?.github,
        file: user?.profilePicture
    })

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append("fname", input.fname);
        formData.append('lname', input.lname);
        formData.append("bio", input.bio);
        formData.append('occupation', input.occupation);
        formData.append("facebook", input.facebook);
        formData.append('linkedin', input.linkedin);
        formData.append("github", input.github);
        formData.append('instagram', input.instagram);
        if (input?.file) {
            formData.append("file", input?.file)
        }
        // console.log(input);
        try {
            dispatch(setLoading(true))

            const res = await axios.put('http://localhost:8080/api/user/profile/update', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })
            if (res.data.success) {
                setOpen(false)
                toast.success(res.data.message)
                dispatch(setUser(res.data.user))
            }
        }
        catch (err) {
            console.log(err);
        }
        finally {
            dispatch(setLoading(false));
        }
    }

    console.log(user);
    // console.log(input);

    return (
        <div className='pt-20  md:ml-[320px] md:h-screen'>
            <div className='max-w-6xl mt-8 mx-auto'>
                <Card className='flex md:flex-row flex-col p-6 md:p-10 gap-10 dark:bg-gray-800 mx-4 md:mx-0 bg-white'>
                    {/* image section  */}
                    <div className='flex flex-col items-center justify-center md:w-[400px]'>
                        <Avatar className='w-40 h-40 border-2'>
                            <AvatarImage src={user?.profilePicture || userLogo} />
                        </Avatar>
                        <h1 className='my-3 text-center text-gray-700 dark:text-gray-300 font-semibold text-xl'>{user.occupation} </h1>
                        <div className='flex gap-4 items-center'>
                            <Link to={user.facebook}><FaFacebook className=' mt-3 w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
                            <Link to={user.linkedin}><FaLinkedin className=' mt-3 w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
                            <Link to={user.github}><FaGithub className=' mt-3 w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
                            <Link to={user.instagram}><FaInstagram className=' mt-3 w-6 h-6 text-gray-800 dark:text-gray-300' /></Link>
                        </div>
                    </div>
                    {/* info section  */}
                    <div className=''>
                        <h1 className='font-bold text-4xl text-center md:text-start mb-7'>
                            Welcome {user?.fname || 'Guest'}!
                        </h1>

                        <p><span className='font-semibold'>Email: </span>{user.email} </p>
                        <div className='flex flex-col items-start justify-start my-5 gap-2'>
                            <Label>About Me</Label>
                            <p className='border dark:border-gray-600 p-6 rounded-lg'>
                                {user?.bio || 'No bio available'}
                            </p>
                            <Dialog open={open} onOpenChange={setOpen} >

                                <DialogTrigger asChild>
                                    <Button onClick={() => setOpen(true)} className='cursor-pointer'>Edit profile</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[450px]">
                                    <DialogHeader>
                                        <DialogTitle className='text-center text-xl'>Edit profile</DialogTitle>
                                        <DialogDescription>
                                            Make changes to your profile here. Click save when you&apos;re
                                            done.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className='flex gap-3 mt-2'>
                                        <div>
                                            <Label className='font-bold mb-2'>First Name</Label>
                                            <Input

                                                type="text"
                                                placeholder="First name"
                                                name="fname"
                                                id='fname'
                                                className='dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                onChange={changeEventHandler}
                                                value={input.fname}
                                            />
                                        </div>
                                        <div>
                                            <Label className='font-bold mb-2'>Last Name</Label>
                                            <Input
                                                type="text"
                                                placeholder="Last name"
                                                name="lname"
                                                id='lname'
                                                className='dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                onChange={changeEventHandler}
                                                value={input.lname}
                                            />
                                        </div>

                                    </div>

                                    <div className='flex gap-3 mt-6'>
                                        <div>
                                            <Label className='font-bold mb-2'>Facebook</Label>
                                            <Input

                                                type="text"
                                                placeholder="facebook.com"
                                                name="facebook"
                                                id='facebook'
                                                className='dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                onChange={changeEventHandler}
                                                value={input.facebook}
                                            />
                                        </div>
                                        <div>
                                            <Label className='font-bold mb-2'>Linkdin</Label>
                                            <Input
                                                type="text"
                                                placeholder="linkedin.com"
                                                name="linkedin"
                                                id='linkedin'
                                                className='dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                onChange={changeEventHandler}
                                                value={input.linkedin}
                                            />
                                        </div>

                                    </div>

                                    <div className='flex gap-3 mt-6'>
                                        <div>
                                            <Label className='font-bold mb-2'>Git Hub</Label>
                                            <Input

                                                type="text"
                                                placeholder="github.com"
                                                name="github"
                                                id='github'
                                                className='dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                onChange={changeEventHandler}
                                                value={input.github}
                                            />
                                        </div>
                                        <div>
                                            <Label className='font-bold mb-2'>Instagram</Label>
                                            <Input
                                                type="text"
                                                placeholder="instagram.com"
                                                name="instagram"
                                                id='instagram'
                                                className='dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                onChange={changeEventHandler}
                                                value={input.instagram}
                                            />
                                        </div>

                                    </div>

                                    <div>
                                            <Label className='font-bold mb-2 mt-2'>Occupation</Label>
                                            <Input
                                                type="text"
                                                placeholder="write your occupation"
                                                name="occupation"
                                                id='occupation'
                                                className='dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                                onChange={changeEventHandler}
                                                value={input.occupation}
                                            />
                                        </div>

                                    <div>
                                        <Label className='font-bold mb-2  mt-6'>Description</Label>
                                        <Textarea placeholder="Type your description."
                                            className='dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            id='bio'
                                            name='bio'
                                            onChange={changeEventHandler}
                                            value={input.bio}
                                        />
                                    </div>
                                    <div>
                                        <Label className='font-bold mb-2  mt-6'>Image</Label>
                                        <Input
                                            type='file'
                                            id='file'
                                            name='file'
                                            accept='image/*'
                                            className='w-[277px] dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                                            onChange={changeFileHandler}

                                        />
                                    </div>


                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" className='cursor-pointer'>Cancel</Button>
                                        </DialogClose>
                                        <Button onClick={submitHandler} type="submit" className='cursor-pointer'>
                                            {
                                                loading ? (
                                                    <>
                                                        <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                        Please Wait
                                                    </>
                                                ) : "Save Changes"
                                            }
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>

                            </Dialog>
                        </div>



                    </div>

                </Card>
            </div>

            <TotalProperty/>


        </div>
    )
}
