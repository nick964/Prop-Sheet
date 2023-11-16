import  GroupForm  from '../components/group-form';
import { useSession } from 'next-auth/react';

export const metadata = {
    title: 'Create a group',
  }

export default async function Page() {
  const { data: session, status } = useSession();
  return (
    <div className="d-flex flex-column align-items-center">
      <h1>Create a new group</h1>
      <GroupForm>{/* pass props here */}</GroupForm>
    </div>
  );
}