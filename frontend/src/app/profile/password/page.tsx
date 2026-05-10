import { redirect } from 'next/navigation';

export default function PasswordRedirectPage() {
  redirect('/change-password');
}
