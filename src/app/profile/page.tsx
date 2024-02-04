"use client"

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useEffect, useState, FunctionComponent } from 'react';
import { ProfileResponse } from '../models/profile-response';
import {  Alert } from "react-bootstrap";
import ProfileComponent from '../components/ProfileComponent';
import NotLoggedInComponent from '../components/NotLoggedInComponent';
import { signOut } from 'next-auth/react';

const Page: FunctionComponent = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [error, setError] = useState<string>('');
  console.log('logging session details');
  console.log(JSON.stringify(session));

  const [profileResponse, setProfileResponse] = useState<ProfileResponse | null>(null);
  console.log('profile response');
  console.log(profileResponse);

  const accessToken: string | undefined = session?.user?.accessToken;
  console.log('access token');
  console.log(accessToken);
  console.log('pathname');
  console.log(pathname);

  const fetchProfileData = async () => {
    console.log('fetching profile data in fetch profile data CALL!!!');
    try {
      if (accessToken) {
        const requestOptions = {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        };
        console.log('calling this url for profile data');
        console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}users/profile`);
        console.log(requestOptions);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}users/profile`, requestOptions);

        if (response.ok) {
          const gameStartedResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}config/started`, requestOptions);
          const result: ProfileResponse = await response.json();
          result.gameStarted = await gameStartedResponse.json();
          setProfileResponse(result);
        } else {
          if(response.status === 401) {
            signOut({ callbackUrl: '/profile', redirect:true });
          }
          console.log(JSON.stringify(response));
          setError('Failed to fetch data from the API');
          console.error('Failed to fetch data from the API');
        }
      }
    } catch (error) {
      setError('Error fetching data');
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [pathname]);

  useEffect(() => {
    fetchProfileData();
  }, []); // Empty array ensures that effect is only run on mount


  if (session) {
    return (
      <div>
        {error && (
          <Alert key="danger" variant="danger">
            {error}
          </Alert>
        )}

        {!error && profileResponse != null ? (
          <ProfileComponent profileData={profileResponse} />
        ) : (
          <div>Loading... where is this spinner</div>
        )}
      </div>
    )
  }

  return (
    <NotLoggedInComponent />
  );
};

export default Page;
