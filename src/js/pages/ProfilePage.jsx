import React, { useEffect, useState } from "react";
import { API_URL } from "../Globals";

export default function ProfilePage() {
    const [profileData, setProfileData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          const response = await fetch(`${API_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            }
          });
          const json = await response.json();
          setProfileData(json);
        };
    
        fetchData();
      }, []);

    return [
        <h1>Hello {profileData.username}!</h1>,
        <h1>Your balance is: {profileData.balance}.</h1>
    ]
}