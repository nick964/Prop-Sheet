
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
    const groupId = await searchParams?.groupid;
    console.log(groupId);

    return (
      <SignedUpForm groupId={groupId}/>
    )
    
}