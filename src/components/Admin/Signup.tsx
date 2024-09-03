"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export default function Signup() {
  const [currentTab, setCurrentTab] = useState<"login" | "signup">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN">("ADMIN");
  const { login, signup, error } = useAuth();

  const handleLogin = async () => {
    await login(loginEmail, loginPassword);
  };

  const handleSignup = async () => {
    await signup(signupEmail, signupPassword, signupName, role);
    setCurrentTab("login");
  };

  return (
    <Tabs defaultValue="login" value={currentTab} onValueChange={setCurrentTab} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle>Login for Admin</CardTitle>
            <CardDescription>Login to your account to manage your events.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="login-email">Email</Label>
              <Input id="login-email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="login-password">Password</Label>
              <Input id="login-password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleLogin}>Login</Button>
            {error && <p className="text-red-500">{error}</p>}
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="signup">
        <Card>
          <CardHeader>
            <CardTitle>Sign Up</CardTitle>
            <CardDescription>Create your account to List your event.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="signup-name">Name</Label>
              <Input id="signup-name" value={signupName} onChange={(e) => setSignupName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="signup-password">Password</Label>
              <Input id="signup-password" type="password" value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSignup}>Create Account</Button>
            {error && <p className="text-red-500">{error}</p>}
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
