"use client"

// src/app/submit/[groupId].tsx
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import LiveTracking from '../../components/LiveTrackingComponent';
import { Spinner } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

export default function Page() {
  const [liveTrackingData, setLiveTrackingData] = useState({
    position: 0,
    totalScore: 0,
    responses: [],
  });
  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;
  const [loading, setLoading] = useState(true);
  const pathName = usePathname()
  const groupId = pathName.split('/')[2];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const requestOptions = {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}members/track?groupId=${groupId}`, requestOptions);
        const data = await response.json();
        setLiveTrackingData(data);
      } catch (error) {
        console.error('Error fetching tracking data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up a timer to call fetchData every 60 seconds (60000 milliseconds)
    const intervalId = setInterval(fetchData, 60000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [groupId]);


  return (
    <div>
      {loading ? (
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <LiveTracking {...liveTrackingData} />
      )}
    </div>
  );

}