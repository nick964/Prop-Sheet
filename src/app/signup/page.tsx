import  SignupForm from '../components/signup-form';

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
    const groupId = await searchParams?.groupid;
    console.log(groupId);

    return (
        <SignupForm groupId={groupId}/>
    )
    
}