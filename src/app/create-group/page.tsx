import  GroupForm  from '../components/group-form';
import { useSession } from 'next-auth/react';

export const metadata = {
    title: 'Create a group',
  }

export default async function Page() {
  const { data: session, status } = useSession();

  const handleFormSubmit = (values : any, selectedImage: any) => {
    // Do something with the form values and the selected image
    console.log('Form values:', values);
    console.log('Selected image:', selectedImage);

    // Call any other function or update state in the parent component
};
  return (
    <div className="d-flex flex-column align-items-center">
      <h1>Create a new group</h1>
      <GroupForm>{/* pass props here */}</GroupForm>
    </div>
  );
}