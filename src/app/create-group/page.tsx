import  GroupForm  from '../components/group-form';

export const metadata = {
    title: 'Create a group',
  }

export default async function Page() {


  return (
    <div className="d-flex flex-column align-items-center">
      <GroupForm />
    </div>
  );
}