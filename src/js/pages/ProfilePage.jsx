import React, { useEffect, useState } from "react";
import { fetchEndpoint } from "../Globals";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [profileData, setProfileData] = useState({
    profile: [],
    inventory: []
  });
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const profileResponse = (await fetchEndpoint("profile")).data;
      if (profileResponse == null) {
        navigate("/login");
        return;
      }

      const inventoryResponse = (await fetchEndpoint("inventory")).data;
      if (inventoryResponse == null) {
        navigate("/login");
        return;
      }

      const casesResponse = (await fetchEndpoint("cases")).data;
      if (casesResponse == null) {
        navigate("/login");
        return;
      }
      
      setProfileData({
        profile: profileResponse,
        inventory: inventoryResponse
      });

      setCaseData(casesResponse);
    }
    fetchData();
  }, []);

  return (
    <>
      <h1>Hello {profileData.profile.username}!</h1>
      <h1>Your balance is: {profileData.profile.balance}.</h1>
      <>
        <h2>Here is a list of all your inventory items: ({profileData.inventory.length} items)</h2>
        {profileData.inventory.map(item => {
          return [
            <div key={item.id}>

            </div>
          ]
        })}
      </>

      <>
        <h2>Here is a list of all cases: ({caseData.length} cases)</h2>
        {caseData.map(_case => {
          return (
            <div key={_case.caseId}>
              <h1>{_case.caseName} (has {_case.items.length} items)</h1>
            </div>
          )
        })}
      </>
    </>
  )
}