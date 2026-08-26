import React from 'react';
import WriterDetailsClient from './WriterDetailsClient';

export const metadata = {
  title: 'Writer Profile | Fable',
  description: 'View writer profile, author info, and published e-books on Fable.',
};

export default async function Page({ params }) {
  const { id } = await params;
  return <WriterDetailsClient writerId={id} />;
}
