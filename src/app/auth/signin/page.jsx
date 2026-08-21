import React from 'react';
import SignInPage from './SignInPage';



export const metadata = {
  title: 'Sign In',
  description: 'Welcome Back to Fable',
}

const page = () => {
    return (
        <div>
            <SignInPage/>
        </div>
    );
};

export default page;