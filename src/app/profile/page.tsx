'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import  { useEffect, useState } from 'react';
import { ProfileResponse } from '../models/profile-response';
import { Container, Alert, Button} from "react-bootstrap";
import ProfileComponent from '../components/ProfileComponent';
import NotLoggedInComponent from '../components/NotLoggedInComponent';

export default  function Page() {

const { data: session, status } = useSession();
const router = useRouter();
console.log('loggin session details');
console.log(JSON.stringify(session));

const [profileResponse, setProfileResponse] = useState<ProfileResponse | null>(null);


const accessToken = session?.user?.accessToken;

console.log(status);
useEffect(() => {
    const fetchData = async () => {
      try {
        if (accessToken) {
          // Assuming you have an API endpoint that requires authentication
        const requestOptions = {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}`}
        };
        console.log('calling this url for profile data');
        console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}users/profile`);
        console.log(requestOptions);
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}users/profile`, requestOptions);

          if (response.ok) {
            const result: ProfileResponse = await response.json();
            setProfileResponse(result);
          } else {
            console.error('Failed to fetch data from the API');
          }
        } 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    console.log('why cant this work');

    fetchData();
    }, []);



if(session) {
    return (
        <div>
                {profileResponse ? (
                  <ProfileComponent profileData={profileResponse} />
                ) : (
                <div>Loading..</div>)}


        </div>

    )
}

return (
  <NotLoggedInComponent />
)

}