import React, { useState, useEffect } from 'react';
import GroupResults from '../components/GroupResultsComponent';
import { Spinner } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Member } from '../models/profile-response';

type Props = {
    groupId: number;
    isGlobal: boolean;
};

type ResultsResponse = {
    success: boolean;
    gameOver: boolean;
    members: Member[];
};

const ResultsPage: React.FC<Props> = ({ groupId, isGlobal }) => {
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
                  console.log('calling this url for results data');
                  console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/results?groupId=${groupId}`);
                  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/results?groupId=${groupId}`, requestOptions);
        
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

        if (groupId) {
            fetchMembers();
        }
    }, [groupId]); // Fetch data when groupId changes

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
        <div>
            <GroupResults members={members} isGlobal={isGlobal} />
        </div>
    );
};

export default ResultsPage;
