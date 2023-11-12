'use client'

import Cookies from 'js-cookie';
import { createContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from 'next/navigation'
import { User } from '@/types';
import api from '@/api';
import { boolean } from 'yup';

interface Props {
  children?: ReactNode
}

export const AuthContext = createContext({
  currentUser: {} as User | null,
  setCurrentUser: (_user: User) => {},
  signOut: () => {},
  getAccessToken: () => {},
  getSessionId: () => {},
});

export const AuthProvider = ({ children }: Props) => {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const accessTokenKey = "access_token";
  const sessionIdKey = "session_id";

  useEffect(() => {
    if (Cookies.get(accessTokenKey)) {
      const userId = Cookies.get("user_id");
      const username = Cookies.get("username");
      const fullName = Cookies.get("full_name");
      if (userId && username && fullName) {
        const userInCookie = {
          id: parseInt(userId),
          username,
          full_name: fullName,
        }
        setCurrentUser(userInCookie);
      }
    } else {
      setCurrentUser(null);
    };
  }, []);


  const getAccessToken = () => {
    return Cookies.get(accessTokenKey);
  }

  const getSessionId = () => {
    return Cookies.get(sessionIdKey);
  }

  // As soon as setting the current user to null, 
  // the user will be redirected to the home page. 
  const signOut = async () => {
    await api.unauthorizeUser();
    setCurrentUser(null);
    router.push('/login');
  }

  const value = {
    currentUser,
    getAccessToken,
    getSessionId,
    setCurrentUser,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; 
}
