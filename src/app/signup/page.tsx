import  SignupForm from '../components/SignUpForm';

export const metadata = {
    title: 'Signup',
  }

export default async function Page({
    params,
    searchParams,
  }: {
    params: { slug: string };
    searchParams?: { [key: string]: string | string[] | undefined };
  }) {
      // Handle groupId as a string, default to empty string if undefined
      const groupId = typeof searchParams?.groupid === 'string' 
      ? searchParams.groupid 
      : '';

      console.log(groupId);

    return (
        <SignupForm groupId={groupId}/>
    )
    
}