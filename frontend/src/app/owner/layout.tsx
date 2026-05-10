import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import './owner.css';

async function getUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('session')?.value;
  if (!sessionToken) return null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/users/profile`, {
      headers: { Cookie: `session=${sessionToken}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user;
  } catch {
    return null;
  }
}

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  
  // Redirect non-owners away
  if (!user || user.roleId !== 2) {
    redirect('/');
  }

  return <>{children}</>;
}
