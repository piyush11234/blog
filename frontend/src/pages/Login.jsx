import React, { useState } from 'react'
import auth from '../assets/auth.jpg'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
// import { toaste, ToastContainer } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading} from '../redux/authSlice.js';
import axios from 'axios'
import {toast} from 'sonner'
import { setUser } from '@/redux/authSlice'
export default function Login() {
  const [agree, setAgree] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({ email: '', password: ''});
  const {loading} = useSelector(store=>store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agree) {
      toast.error("Please agree to the terms and conditions");
      return; // stop further execution
    }

    const { email, password} = input;
    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }
    

    // try {
    //   dispatch(setLoading(true));
    //   const url = 'https://blog-dqxu.onrender.com/input/login';
    //   const response = await fetch(url, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(input)
    //   });
    //   const data = await response.json();
    //   if (data.success ) {
    //     toast.success("Login successful");
    //     localStorage.setItem('token', data.token);
    //     localStorage.setItem('input', JSON.stringify({ name: data.name, email }));
    //     setInput({ email: '', password: '',fname,lname });
    //     setTimeout(() => { navigate('/'); }, 2000)
    //     // dispatch(setInput(data.input));
    //   } else {
    //     toast.error(data.message || "Login failed");
    //   }
    // } catch (error) {
    //   toast.error("An error occurred. Please try again.");
    // }

    try{
      dispatch(setLoading(true));
      const res=await axios.post('https://blog-dqxu.onrender.com/user/login',input,{
        headers:{
          'Content-Type': 'application/json'
        },
        withCredentials:true
      })
      if(res.data.success){
        
        navigate('/')
        dispatch(setUser(res.data.user))
        toast.success(res.data.message)
      }else{
        toast.error(res.data.message)
      }

    }
    catch(err){
      console.log(err);
      toast.error(err.response?.data?.message || "Invalid credentials or server error");
    }
    finally{
      dispatch(setLoading(false));
    }
  };


  return (
    <>
      {/* <ToastContainer /> */}
      <div className="flex h-screen md:pt-14 md:h-[760px] bg-white dark:bg-gray-900">
        <div className="hidden md:block flex-1">
          <img src={auth} alt="Auth" className="h-[700px] w-full object-cover" />
        </div>
        <div className="flex justify-center items-center flex-1 px-4 md:px-0">
          <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl dark:bg-gray-800 bg-white dark:text-white dark:border-gray-700 border-gray-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Login into your account</CardTitle>
              <CardDescription className="text-sm text-gray-500 mt-2 dark:text-gray-300">
                Enter your details below to login your account
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-4">
              <form className="space-y-6" onSubmit={handleSubmit}>

                <div>
                  <Label className="font-bold mb-2 block text-gray-900 dark:text-gray-100">Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    name="email"
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full"
                    value={input.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="relative">
                  <Label className="font-bold mb-2 block text-gray-900 dark:text-gray-100">Password</Label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    className="dark:bg-gray-700 dark:text-white dark:border-gray-600 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full pr-10"
                    value={input.password}
                    onChange={handleChange}
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

                <div className="flex items-center gap-2">
                  <Input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />

                  <Label htmlFor="terms" className="text-sm text-gray-900 dark:text-gray-300">
                    I agree to the <Link to="/terms-and-conditions" className="text-sm text-blue-500 hover:underline">Terms & Conditions</Link>

                  
                  </Label>
                </div>

                <Button
                  type="submit"
                  className='w-full mt-4 bg-gray-700 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-md text-white dark:text-gray-300 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 cursor-pointer'

                >
                 {
                  loading ? (
                    <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Please Wait
                    </>
                   ) : "Login"
                 }
                </Button>

                <div className="text-center text-sm text-gray-500 dark:text-gray-300">
                  Don't have an account? <a href="/signup" className="text-blue-600 hover:underline">SignUp</a>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
