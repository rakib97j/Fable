import { redirect } from 'next/navigation';

export default async function SuccessPage({ searchParams }) {
  const params = await searchParams;
  const queryString = new URLSearchParams(params).toString();
  redirect(`/payment-success${queryString ? `?${queryString}` : ''}`);
}
