"use client"
import './globals.css'

import { ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 

import Nav from '@/components/Navigation'
import AuthContextProvider from '@/lib/store/auth-context';

import FinanceContextProvider from '@/lib/store/finance-context';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head/>
      <body>
        <AuthContextProvider>
          <FinanceContextProvider>
            <ToastContainer />
              <Nav />{children}
          </FinanceContextProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
