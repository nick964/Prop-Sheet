"use client";

import { usePathname } from 'next/navigation';
import ResetPasswordForm from "../../components/ResetPasswordForm";

export default function Page() {
  const pathname = usePathname();
  const token = pathname.split('/')[2];
  
  return <ResetPasswordForm token={token} />;
}