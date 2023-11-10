import React, { useEffect, useState } from "react";
import { API_URL } from "../Globals";

export default function ProfilePage() {
    const [profileData, setProfileData] = useState({
      profile: [],
      inventory: []
    });

    useEffect(() => {
        const fetchData = async () => {
          const profileResponse = await fetch(`${API_URL}/profile`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            }
          });

          const inventoryResponse = await fetch(`${API_URL}/inventory`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("accessToken")}`
            }
          });
          const profileJSON = await profileResponse.json();
          const inventoryJSON = await inventoryResponse.json();
          setProfileData({
            profile: profileJSON,
            inventory: inventoryJSON
          });
        };
    
        fetchData();
      }, []);

    return [
        <h1>Hello {profileData.profile.username}!</h1>,
        <h1>Your balance is: {profileData.profile.balance}.</h1>,
        <div>
          <h2>Here is a list of all your inventory items: ({profileData.inventory.length} items)</h2>
          {profileData.inventory.map(item => {
            return [
            <div>

            </div>
            ]
          })}
        </div>
    ]
}