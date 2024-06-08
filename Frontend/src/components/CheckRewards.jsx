import React, { useState } from 'react';
import { ethers } from 'ethers';
import WeMeet from './WeMeet.json';

const CheckRewards = () => {
  const [student, setStudent] = useState('');
  const [points, setPoints] = useState('');

  const checkRewards = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contractAddress = "0x9c122eDEc982C12b7ab78D468A3fB92cEC28B734";
      const contract = new ethers.Contract(contractAddress, WeMeet.abi, provider);
      const rewardPoints = await contract.getRewardPoints(student);
      setPoints(rewardPoints.toString());
    }
  };

  return (
    <div>
      <h2>Check Rewards</h2>
      <input
        type="text"
        placeholder="Student Address"
        value={student}
        onChange={(e) => setStudent(e.target.value)}
      />
      <button onClick={checkRewards}>Check Rewards</button>
      {points && <p>Reward Points: {points}</p>}
    </div>
  );
};

export default CheckRewards;
