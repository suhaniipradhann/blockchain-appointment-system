import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import WeMeet from './WeMeet.json';

const MarkAttendance = () => {
  const [appointmentId, setAppointmentId] = useState('');
  const [appointmentCounter, setAppointmentCounter] = useState(null);

  useEffect(() => {
    const fetchAppointmentCounter = async () => {
      if (window.ethereum) {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contractAddress = "0x9c122eDEc982C12b7ab78D468A3fB92cEC28B734"; // Ensure this is the correct contract address
        const contract = new ethers.Contract(contractAddress, WeMeet.abi, provider);

        const counter = await contract.getAppointmentCounter();
        setAppointmentCounter(counter.toString());
      }
    };

    fetchAppointmentCounter();
  }, []);

  const markAttendance = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = "0x9c122eDEc982C12b7ab78D468A3fB92cEC28B734"; // Ensure this is the correct contract address
      const contract = new ethers.Contract(contractAddress, WeMeet.abi, signer);

      try {
        const transaction = await contract.markAsAttended(appointmentId);
        await transaction.wait();
        alert('Attendance Marked');
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div>
      <h2>Mark Attendance</h2>
      <input
        type="number"
        placeholder="Appointment ID"
        value={appointmentId}
        onChange={(e) => setAppointmentId(e.target.value)}
      />
      <button onClick={markAttendance}>Mark as Attended</button>
      <h2>Appointment Counter: {appointmentCounter}</h2>
    </div>
  );
};

export default MarkAttendance;
