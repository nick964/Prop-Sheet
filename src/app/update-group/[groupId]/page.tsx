"use client";

import { usePathname } from 'next/navigation';
import UpdateGroupForm from '../../components/UpdateGroupForm';

export default function Page() {
  const pathname = usePathname();
  const groupId = pathname.split('/')[2];
  return <UpdateGroupForm groupId={groupId} />;
}