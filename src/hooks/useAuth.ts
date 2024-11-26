
import { useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred during login.");
        return { success: false, error: data.error || "An error occurred during login." };
      }

      // Store token and userId in local storage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userId", data.userId);

      // Set authenticated state and redirect
      setIsAuthenticated(true);
      

      return { success: true, message: "Login successful.", userId: data.userId, role: data.role };
    } catch (error) {
      setError("An error occurred during login.");
      console.error("Login error:", error);
      return { success: false, error: "An error occurred during login." };
    }
  };

  const signup = async (email: string, password: string, name: string, role: "USER" | "ADMIN") => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signup", email, password, name, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred during signup.");
        return { success: false, error: data.error || "An error occurred during signup." };
      }

      return { success: true, message: "Signup successful. Please sign in." };
    } catch (error) {
      setError("An error occurred during signup.");
      console.error("Signup error:", error);
      return { success: false, error: "An error occurred during signup." };
    }
  };

  const googleLogin = async (googleToken: string) => {
    try {
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred during Google login.");
        return { success: false, error: data.error || "An error occurred during Google login." };
      }


      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userId", data.userId);



      setIsAuthenticated(true);

      return { success: true, message: "Google login successful.", userId: data.userId, role: data.role };
    } catch (error) {
      setError("An error occurred during Google login.");
      console.error("Google login error:", error);
      return { success: false, error: "An error occurred during Google login." };
    }
  };



  const verifyToken = async () => {
    const token = localStorage.getItem("accessToken");
  
    if (!token) {
      setError("No token found.");
      return { success: false, error: "No token found." };
    }
  
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ action: "verify" }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.error || "Token verification failed.");
        return { success: false, error: data.error || "Token verification failed." };
      }
  
      return { success: true, message: "Token is valid.", userId: data.userId, role: data.role };
    } catch (error) {
      setError("An error occurred during token verification.");
      console.error("Token verification error:", error);
      return { success: false, error: "An error occurred during token verification." };
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "An error occurred during logout.");
        return { success: false, error: data.error || "An error occurred during logout." };
      }

      // Clear token and userId from local storage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      setIsAuthenticated(false);
      router.push("/signin");

      return { success: true, message: "Logged out successfully." };
    } catch (error) {
      setError("An error occurred during logout.");
      console.error("Logout error:", error);
      return { success: false, error: "An error occurred during logout." };
    }
  };



  return { login, signup, verifyToken, isAuthenticated,googleLogin, error, logout };
}
