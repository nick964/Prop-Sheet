import React, { useState, useEffect } from 'react';
import { Spinner, Container, Image, Card, Row, Col } from 'react-bootstrap';
import { useSession } from 'next-auth/react';
import { Member } from '../models/profile-response';
import { ConfigResponse } from '../models/tracking-response';
import styles from './GlobalResults.module.css';

type ResultsResponse = {
    success: boolean;
    gameOver: boolean;
    members: Member[];
};

const GlobalResultsPage: React.FC = () => {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const { data: session, status } = useSession();
    const accessToken = session?.user?.accessToken;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (accessToken) {
                    const requestOptions = {
                        method: 'GET',
                        headers: { 'Authorization': `Bearer ${accessToken}` }
                    };

                    // First fetch config rules
                    const configResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}config/all`, requestOptions);
                    if (configResponse.ok) {
                        const configRules: ConfigResponse[] = await configResponse.json();
                        const gameStartedRule = configRules.find(rule => rule.rule === 'game_started');
                        setGameStarted(gameStartedRule?.enabled || false);

                        // Only fetch leaderboard data if game has started
                        if (gameStartedRule?.enabled) {
                            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}groups/leaderboard`, requestOptions);
                            if (response.ok) {
                                const result: ResultsResponse = await response.json();
                                result.members.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
                                setMembers(result.members);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (!gameStarted) {
        return (
            <div className={styles.leaderboardContainer}>
                <div className={styles.headerSection}>
                    <div className={styles.imageHeader}>
                        <Image 
                            src="/images/SuperBowl_Header3.png"
                            alt="Super Bowl Header"
                            fluid
                        />
                    </div>
                    <h1 className={`${styles.leaderboardTitle} tracking`}>Global Leaderboard</h1>
                </div>
                <div className={styles.gameNotStartedContainer}>
                    <div className={styles.messageCard}>
                        <div className={styles.messageIcon}>🏈</div>
                        <h2 className={`${styles.messageTitle} tracking`}>Kickoff Countdown</h2>
                        <p className={styles.messageText}>
                            The big game hasn't started yet! Get ready for an exciting matchup and 
                            watch this space to see how your predictions stack up against others.
                        </p>
                        <div className={styles.messageTip}>
                            Make sure you've submitted your predictions before kickoff!
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const topThree = members.slice(0, 3);
    const restOfMembers = members.slice(3);

    const showDefaultIcon = (icon: string | null) => {
        return icon || "/images/DefaultUserIcon.png";
    };

    return (
        <div className={styles.leaderboardContainer}>
            <div className={styles.headerSection}>
                <div className={styles.imageHeader}>
                    <Image 
                        src="/images/SuperBowl_Header3.png"
                        alt="Super Bowl Header"
                        fluid
                    />
                </div>
                <h1 className={`${styles.leaderboardTitle} tracking`}>Global Leaderboard</h1>
            </div>

            {topThree.length > 0 && (
                <div className={styles.podiumSection}>
                    <Row className={styles.podiumRow}>
                        {/* Second Place */}
                        {topThree[1] && (
                            <Col xs={12} md={4} className={styles.podiumCol}>
                                <div className={`${styles.podiumCard} ${styles.secondPlace}`}>
                                    <div className={styles.medalIcon}>🥈</div>
                                    <Image
                                        src={showDefaultIcon(topThree[1].icon)}
                                        alt={topThree[1].name}
                                        className={styles.podiumAvatar}
                                        roundedCircle
                                    />
                                    <h3 className={styles.podiumName}>{topThree[1].name}</h3>
                                    <p className={styles.podiumScore}>{topThree[1].score} pts</p>
                                    <p className={styles.podiumGroup}>{topThree[1].groupDto?.name}</p>
                                </div>
                            </Col>
                        )}

                        {/* First Place */}
                        {topThree[0] && (
                            <Col xs={12} md={4} className={styles.podiumCol}>
                                <div className={`${styles.podiumCard} ${styles.firstPlace}`}>
                                    <div className={styles.medalIcon}>👑</div>
                                    <Image
                                        src={showDefaultIcon(topThree[0].icon)}
                                        alt={topThree[0].name}
                                        className={styles.podiumAvatar}
                                        roundedCircle
                                    />
                                    <h3 className={styles.podiumName}>{topThree[0].name}</h3>
                                    <p className={styles.podiumScore}>{topThree[0].score} pts</p>
                                    <p className={styles.podiumGroup}>{topThree[0].groupDto?.name}</p>
                                </div>
                            </Col>
                        )}

                        {/* Third Place */}
                        {topThree[2] && (
                            <Col xs={12} md={4} className={styles.podiumCol}>
                                <div className={`${styles.podiumCard} ${styles.thirdPlace}`}>
                                    <div className={styles.medalIcon}>🥉</div>
                                    <Image
                                        src={showDefaultIcon(topThree[2].icon)}
                                        alt={topThree[2].name}
                                        className={styles.podiumAvatar}
                                        roundedCircle
                                    />
                                    <h3 className={styles.podiumName}>{topThree[2].name}</h3>
                                    <p className={styles.podiumScore}>{topThree[2].score} pts</p>
                                    <p className={styles.podiumGroup}>{topThree[2].groupDto?.name}</p>
                                </div>
                            </Col>
                        )}
                    </Row>
                </div>
            )}

            <div className={styles.leaderboardList}>
                {restOfMembers.map((member, index) => (
                    <div key={index} className={styles.leaderboardItem}>
                        <div className={styles.rank}>#{index + 4}</div>
                        <div className={styles.memberInfo}>
                            <Image
                                src={showDefaultIcon(member.icon)}
                                alt={member.name}
                                className={styles.memberAvatar}
                                roundedCircle
                            />
                            <div className={styles.memberDetails}>
                                <h4 className={styles.memberName}>{member.name}</h4>
                                <p className={styles.memberGroup}>{member.groupDto?.name}</p>
                            </div>
                        </div>
                        <div className={styles.score}>{member.score} pts</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GlobalResultsPage;