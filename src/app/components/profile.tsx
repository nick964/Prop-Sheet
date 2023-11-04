"use client"
import { useSession } from "next-auth/react"
import React, { useState } from "react"
import { Alert } from  "react-bootstrap";


export default function ProfileDisplay() {

    const { data: session, status } = useSession();

    if(session) {  
        return (
            <div className="d-flex flex-column align-items-center">
                <Alert variant="primary">Profile</Alert>
                <Alert variant="primary">Email: {session?.user?.email}</Alert>
            </div>
        )
    } else {
        return (
            <div>
                <Alert variant="primary">You are not signed in</Alert>
            </div>
        )
    
    }
}