
import SignedUpForm from '../components/SignedUpForm';

export const metadata = {
    title: 'Signed up',
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
      <SignedUpForm groupId={groupId}/>
    )
    
}