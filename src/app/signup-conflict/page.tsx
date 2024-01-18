import  SignUpProviderError from '../components/SignUpProviderError';

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
      const msg = typeof searchParams?.message === 'string' 
      ? searchParams.message 
      : '';

      console.log(msg);

    return (
        <SignUpProviderError errorMessage={msg}/>
    )
    
}