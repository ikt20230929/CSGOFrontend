import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function CasePage() {
  const { caseId } = useParams();
  const cases = useSelector((state) => state.data).cases;
  const [caseData, setCaseData] = useState({
      caseName: '',
      items: []
  });
  const [navigateAway, setNavigateAway] = useState(false);

  useEffect(() => {
      let item = cases.find((item) => item.caseId == caseId);

      if (!item) {
          setNavigateAway(true);
      }

      setCaseData(item);
  }, []);

  return (
    <div>
      {navigateAway ? <Navigate to="/" replace={true} /> : <>
      <h1>{caseData.caseName}</h1>
      <p>Items:</p>
      <ul>
        {caseData.items.map(item => (
          <li key={item.itemId}>
            {item.itemName} - {item.itemSkinName}
          </li>
        ))}
      </ul></>}
    </div>
  );
}

export default CasePage;
