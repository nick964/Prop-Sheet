"use client"

// src/app/submit/[groupId].tsx
import { usePathname, useRouter } from 'next/navigation';
import ExampleComponent from '../../components/ExampleComponent';

export default function Page() {
    const pathName = usePathname()
    const groupId = pathName.split('/')[2];
    return <ExampleComponent groupId={groupId} />
  }