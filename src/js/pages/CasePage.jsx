import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEndpoint } from '../Globals';

function CasePage() {
  const { caseId } = useParams();
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
     let ddata = await fetchEndpoint(`cases/${caseId}`).data;
  setCaseData(ddata);
    };
    fetchData();
  }, [caseId]);

  if (!caseData) {
    return <div>Loading...</div>;
  }
   
  return (
    <div>
      <h1>{caseData.caseName}</h1>
      <p>Items:</p>
      <ul>
        {caseData.items.map(item => (
          <li key={item.itemId}>
            {item.itemName} - {item.itemSkinName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CasePage;
