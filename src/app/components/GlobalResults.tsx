import React, { useState, useEffect } from 'react';
import GroupResults from '../components/GroupResultsComponent';
import NotLoggedInComponent from '../components/NotLoggedInComponent';
import { Spinner, Container, Image } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Member } from '../models/profile-response';

type ResultsResponse = {
    success: boolean;
    gameOver: boolean;
    members: Member[];
};

const GlobalResultsPage: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();
    const accessToken = session?.user?.accessToken;
    const router = useRouter();

    useEffect(() => {
        const fetchMembers = async () => {
            setLoading(true);
            try {
                if (accessToken) {
                  const requestOptions = {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${accessToken}` }
                  };
                  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/leaderboard`, requestOptions);
        
                  if (response.ok) {
                    const result: ResultsResponse = await response.json();
                    setMembers(result.members);
                  } else {
                    console.error('Failed to fetch data from the API');
                  }
                }
              } catch (error) {
                console.error('Error fetching data:', error);
              }
            setLoading(false);
        };
        fetchMembers();
    }, []); // Fetch data when groupId changes

    if(session?.user?.accessToken == null) {
      return (
          <NotLoggedInComponent />
      )
  }

    if (loading) {
        return (
            <div className="text-center mt-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
          );
    }

    return (
      <div className="live-tracking-container">
        <div className="live-tracking-image-header">
          <Image 
                    src={"/images/SuperBowl_Header2.png"} 
                    alt="Group Icon"
                    fluid
                    
            />
        </div>

        <h2 className="live-tracking-header tracking">Global Leaderboard</h2>
            <GroupResults members={members} isGlobal={true} />
      </div>
    );
};

export default GlobalResultsPage;
