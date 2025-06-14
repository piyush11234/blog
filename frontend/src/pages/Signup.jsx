import React, { useState } from 'react'
import auth from '../assets/auth.jpg'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import { toast, ToastContainer } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom';


export default function Signup() {
  const [agree, setAgree] = useState(false);
  // State to manage password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({
    fname: '',
    lname: '',
    email: '',
    password: ''
  })
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {

    e.preventDefault();
    if (!agree) {
      toast.error("Please agree to the terms and conditions");
      return; // stop further execution
    }

    const { fname, lname, email, password } = user;
    if (!fname || !lname || !email || !password) {
      toast.error("Please fill all the fields");
    }
    console.log(user);
    try {
      const url = 'https://blog-dqxu.onrender.com/api/user/register';
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      })
      const data = await response.json();
      console.log(data);
      // const success=data;
      if (data.success) {
        toast.success("Account created successfully");
        setUser({
          fname: '',
          lname: '',
          email: '',
          password: ''
        });
        setTimeout(() => {
          navigate('/login');
        }, 2000);

      } else {
        toast.error(data.message || "Signup failed, please try again");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong, please try again later");
    }



  }

  return (
    <>
      <ToastContainer />
      <div className='flex h-screen md:pt-14 md:h-[760px]'>
        <div className='hidden md:block'>
          <img src={auth} alt="Signup" className='h-[700px] w-full object-cover' />
        </div>
        <div className='flex justify-center items-center flex-1 px-4 md:px-0'>
          <Card className='w-full md:w-md pd-6 shadow-lg rounded-2xl dark:bg-gray-800 bg-white dark:text-white dark:border-gray-700 border-gray-200'>
            <CardHeader className='text-center'>
              <CardTitle className='text-2xl font-bold'>Create an Account</CardTitle>
              <CardDescription className='text-sm text-gray-500 mt-2 dark:text-gray-300'>Enter your details below to create your account</CardDescription>

            </CardHeader>
            <CardContent className='mt-4'>
              <form className='space-y-4' onSubmit={handleSubmit}>
                <div className='flex gap-3'>
                  <div>
                    <Label className='font-bold mb-2'>First Name</Label>
                    <Input

                      type="text"
                      placeholder="First name"
                      name="fname"
                      className='dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      onChange={handleChange}
                      value={user.fname}
                    />
                  </div>
                  <div>
                    <Label className='font-bold mb-2'>Last Name</Label>
                    <Input
                      type="text"
                      placeholder="Last name"
                      name="lname"
                      className='dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      onChange={handleChange}
                      value={user.lname}
                    />
                  </div>

                </div>

                <div className=''>
                  <Label className='font-bold mb-2'>Email</Label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    name="email"
                    className='dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    onChange={handleChange}
                    value={user.email}
                  />

                </div>
                <div className='relative'>
                  <Label className='font-bold mb-2'>Password</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    name="password"
                    className='dark:bg-gray-700 dark:text-white dark:border-gray-600 border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    onChange={handleChange}
                    value={user.password}

                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                    className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {!showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className='flex items-center gap-2'>
                  <Input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <Label htmlFor="terms" className='text-sm'>I agree to the <Link to="/terms-and-conditions" className="text-sm text-blue-500 hover:underline">Terms & Conditions</Link></Label>
                </div>
                <Button type="submit" className='w-full mt-4 text-white bg-gray-700 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-md dark:text-gray-300 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer'>
                  Sign Up
                </Button>
                <div className='text-center text-sm text-gray-500 dark:text-gray-300'>
                  Already have an account? <a href="/login" className='text-blue-600 hover:underline'>Login</a>
                </div>
                <Button variant="outline" className='w-full mt-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'>
                  <span className='text-gray-700 dark:text-gray-300'>Sign up with Google</span>
                </Button>



              </form>

            </CardContent>

          </Card>
        </div>


      </div>

    </>
  )
}
