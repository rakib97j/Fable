import React, { Suspense } from 'react';
import SignUpPage from './SignUpPage';

export const metadata = {
  title: 'Sign UP',
  description: 'join now on best ebook learning platfrom',
}

const page = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SignUpPage/>
        </Suspense>
    );
};

export default page;