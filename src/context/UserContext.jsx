// UserContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get('token');
        if (token) {
          const response = await axios.get('http://localhost:5000/user/log', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setUser(null);
        }
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  console.log('User state:', user);

  return (
    <UserContext.Provider value={{ user, setUser }}> {/* Include setUser in the context value */}
      {children}
    </UserContext.Provider>
  );
};
