"use client"

import React from 'react';
import { Table, Badge, Container, Image } from 'react-bootstrap';

import { Member } from '../models/profile-response';

type Props = {
    members: Member[];
    isGlobal: boolean;
};

const GroupResults: React.FC<Props> = ({ members, isGlobal }) => {
    // Sort members by score in descending order
    const sortedMembers = [...members].sort((a, b) => {
        // Treat null scores as 0
        const scoreA = a.score != null ? a.score : 0;
        const scoreB = b.score != null ? b.score : 0;
        return scoreB - scoreA;
    });

    return (
            <div className="member-list">
                <Table responsive="sm">
                    <thead>
                        <tr>
                            <th>Member</th>
                            <th>Score</th>
                            {isGlobal && <th>Group Name</th>}
                            {(!isGlobal) && <th>Status</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedMembers.map((member, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        {member.icon ? (
                                            <img
                                                src={member.icon}
                                                alt={`${member.name}'s icon`}
                                                style={{ width: '30px', height: '30px', marginRight: '10px', borderRadius: '50%' }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    marginRight: '10px',
                                                    borderRadius: '50%',
                                                    background: '#ccc',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                ?
                                            </div>
                                        )}
                                        {member.name}
                                    </div>
                                </td>
                                <td>{member.score}</td>
                                {isGlobal && <td>{member.groupDto?.name}</td>}
                                {!isGlobal && <td>
                                    {member.submission_status === 1 ? (
                                        <Badge bg="success">Submitted</Badge>
                                    ) : (
                                        <Badge bg="secondary">Not Submitted</Badge>
                                    )}</td>
                                }
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
    );
};

export default GroupResults;
