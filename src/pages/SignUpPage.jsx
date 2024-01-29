import React, { useState } from 'react'
import Header from '../components/common/header'
import '../App.css'
import SignUpForm from '../components/signUpForm/signUp';
import LoginForm from '../components/signUpForm/LoginForm';


function SignUpPage() {
  
  const [isLogin, setIsLogin] = useState(false)

  return (
    <div className='signup__page'>
        <Header />

        {(!isLogin) ? (
          <SignUpForm />
        ) : (
          <LoginForm />
        )}

        {
          (!isLogin ? (
            <p className='statement' onClick={() => setIsLogin(!isLogin)}>Already have an Account? Login</p>
          ) : (
            <p className='statement' onClick={() => setIsLogin(!isLogin)}>Don't have an Account? Sign up</p>
          ))
        }
    </div>
  )
}

export default SignUpPage