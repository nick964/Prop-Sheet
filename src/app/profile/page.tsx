'use client'

import  ProfileDisplay from '../components/profile';

import { useSession } from 'next-auth/react';
import React, { use, useEffect, useState } from 'react';
import { ProfileResponse } from '../models/profile-response';
import { profile } from 'console';


export default  function Page() {

const { data: session, status } = useSession();
console.log('loggin session details');
console.log(JSON.stringify(session));

const [profileResponse, setProfileResponse] = useState<ProfileResponse | null>(null);
const [forceFire, setForceFire] = useState(false);
const [isLoading, setLoading] = useState(true);


const accessToken = session?.user?.accessToken;

console.log(status);

useEffect(() => {
    console.log('inside use effect');
    const fetchData = async () => {
      try {
        console.log('inside try');
        if (session) {
          // Assuming you have an API endpoint that requires authentication
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`}
        };
        console.log('calling this url for profile data');
        console.log(`${process.env.BACKEND_URL}users/profile`);
        const response = await fetch(`${process.env.BACKEND_URL}users/profile`, requestOptions);

          if (response.ok) {
            const result: ProfileResponse = await response.json();
            console.log('logigng result');
            console.log(result);
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

console.log('loggin profile response');
console.log(profileResponse);
console.log('Logging all of this after my declaration of use efefct');

if (typeof window !== 'undefined') {
    // Client-side code
    console.log('Running on the client');
  } else {
    // Server-side code
    console.log('Running on the server');
  }

if(session) {
    return (
        <div>
            <div>
                Logged in as {session?.user?.name}
            </div>
            <div>
                Access token is {session?.user?.accessToken}
            </div>
            <div>
                Access token is {profileResponse?.members}
            </div>
            
            <div>
                {profileResponse ? (
               <h2>Got data</h2>
                ) : (
                <div>Loading..</div>)}
            </div>

        </div>

    )
}

return (
    <div>
        <button >Sign In</button>
    </div>
)

}