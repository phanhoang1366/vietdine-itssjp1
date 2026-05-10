import { redirect } from 'next/navigation';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams;
  const q = params.q;

  if (q) {
    // If there is a query, redirect to map for results
    redirect(`/map?q=${encodeURIComponent(q as string)}`);
  } else {
    // If no query, just go to home
    redirect('/');
  }
}

