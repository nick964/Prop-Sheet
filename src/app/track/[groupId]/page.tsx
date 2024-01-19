"use client"

// src/app/submit/[groupId].tsx
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import LiveTracking from '../../components/LiveTrackingComponent';
import { Spinner } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { TrackingResponse } from '@/app/models/tracking-response';

export default function Page() {
  const [liveTrackingData, setLiveTrackingData] = useState<TrackingResponse | null>(null);
  const { data: session, status } = useSession();
  const accessToken = session?.user?.accessToken;
  const [loading, setLoading] = useState(true);
  const pathName = usePathname()
  const groupId = pathName.split('/')[2];

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('calling this url for tracking data');
        const requestOptions = {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${accessToken}` }
        };
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}members/track?groupId=${groupId}`, requestOptions);
        const result: TrackingResponse = await response.json();
        console.log('logging result for tracking data');
        console.log(result);
        setLiveTrackingData(result);
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
        <LiveTracking data={liveTrackingData} />
      )}
    </div>
  );

}