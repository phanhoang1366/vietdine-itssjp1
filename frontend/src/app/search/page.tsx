import { redirect } from 'next/navigation';

export default function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const q = searchParams.q;

  if (q) {
    // If there is a query, redirect to map for results
    redirect(`/map?q=${encodeURIComponent(q as string)}`);
  } else {
    // If no query, just go to home
    redirect('/');
  }
}
