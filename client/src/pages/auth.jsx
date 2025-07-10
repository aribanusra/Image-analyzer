import {  Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import React, { useState } from 'react'
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Auth = () => {

  const [signup, setSignup] = useState({ username: "", mobile: "", email: "", password: "" });
  const [login, setlogin] = useState({ email: "", password: "" });
  const [registerisLoading, setRegisterIsLoading] = useState(false);
  const [loginisLoading, setLoginIsLoading] = useState(false);
  const [tab, setTab] = useState("signup");
  const navigate = useNavigate();



  const registerUser = async (data) => {
    try {
      setRegisterIsLoading(true);
      const res = await axios.post("http://localhost:2222/api/register", data);
      const result = res.data;
      console.log("Register Response:", result);
  
      toast.success(result.message);
      setTab("login");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Registration failed");
    } finally {
      setRegisterIsLoading(false);
    }
  };
  
  const loginUser = async (data) => {
    try {
      setLoginIsLoading(true);
      const res = await axios.post("http://localhost:2222/api/login", data);
      const result = res.data;
      console.log(result);
      toast.success("Login successful");
      localStorage.setItem('token', result.token);
    
      const userRes = await axios.get("http://localhost:2222/api/me", {
        headers: { Authorization: `Bearer ${result.token}` },
      });
  
      const userResult = userRes.data;
      localStorage.setItem('user', JSON.stringify(userResult.user));
      navigate("/home");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Login failed");
    } finally {
      setLoginIsLoading(false);
    }
  };
  
  
  function inputchangehandler(e, type) {
    const { name, value } = e.target;
    if (type === "signup") {
      setSignup((prev) => ({ ...prev, [name]: value }));
    } else {
      setlogin((prev) => ({ ...prev, [name]: value }));
    }
  }
const handleregisteration= async(type) =>{
    const data = type === "signup" ? signup : login;
    const action = type === "signup" ? registerUser : loginUser;
    await action(data)
  }

  return (
   <>
                 <div className="flex justify-center items-center w-full  ">
    <div className="flex  w-full max-w-md flex-col gap-6">
      <Tabs defaultValue="signup"  value={tab} onValueChange={setTab}>
      
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Create an Account
              </CardTitle>
              <CardDescription>
                Enter your details to create your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="signup-name">Username</Label>
                <Input
                  id="signup-name"
                  type="text"
                  name="username"
                  placeholder="yourname"
                  value={signup.username}
                  onChange={(e) => inputchangehandler(e, "signup")}
                  required={true}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-name">Phone Number</Label>
                <Input
                  id="signup-mobile"
                  type="text"
                  name="mobile"
                  placeholder="xx-xxxx-xxxx"
                  value={signup.mobile}
                  onChange={(e) => inputchangehandler(e, "signup")}
                  required={true}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  name="email"
                  value={signup.email}
                  onChange={(e) => inputchangehandler(e, "signup")}
                  placeholder="you@example.com"
                  required={true}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  name="password"
                  value={signup.password}
                  onChange={(e) => inputchangehandler(e, "signup")}
                  placeholder="********"
                  required={true}
                />
              </div>
              </CardContent>
            
           
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => handleregisteration("signup")}
              >
                {registerisLoading ? (
                  <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>Please wait
                  </>
                ): "Register"}
              </Button>
            </CardFooter>
            </Card>
            </TabsContent>











        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Login to Your Account
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  name="email"
                  value={login.email}
                  onChange={(e) => inputchangehandler(e, "login")}
                  placeholder="you@example.com"
                  required={true}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  name="password"
                  value={login.password}
                  onChange={(e) => inputchangehandler(e, "login")}
                  placeholder="********"
                  required={true}
                />
              </div>
            </CardContent>
           
            <CardFooter>
              <Button
               className="w-full"
               onClick={() => handleregisteration("login")}
              >
              {loginisLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : "Login"}
              </Button>
            </CardFooter>
            </Card>
            </TabsContent>
        </Tabs>
        </div>
        </div>
        </>
  )
}

export default Auth