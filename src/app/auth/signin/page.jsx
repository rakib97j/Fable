import React, { Suspense } from 'react';
import SignInPage from './SignInPage';

export const metadata = {
  title: 'Sign In',
  description: 'Welcome Back to Fable',
}

const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignInPage/>
        </Suspense>
    );
};

export default page;