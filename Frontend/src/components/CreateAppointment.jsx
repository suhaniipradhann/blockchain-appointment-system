import React, { useState } from 'react';
import { ethers } from 'ethers';
import WeMeet from './WeMeet.json';

const CreateAppointment = () => {
  const [student, setStudent] = useState('');
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  const createAppointment = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const networkId = await provider.getNetwork();
      const contractAddress = "0x9c122eDEc982C12b7ab78D468A3fB92cEC28B734"; // Replace with your contract address
      const contract = new ethers.Contract(contractAddress, WeMeet.abi, signer);

      const unixTimestamp = Math.floor(new Date(date).getTime() / 1000);
      const transaction = await contract.createAppointment(student, unixTimestamp, name);
      await transaction.wait();
      const counter = await contract.getAppointmentCounter();
      alert('Appointment Created, Appointment Number:' + counter.toString());
    }
  };

  return (
    <div>
      <h2>Create Appointment</h2>
      <input
        type="text"
        placeholder="Student's Address"
        value={student}
        onChange={(e) => setStudent(e.target.value)}
      />
      <input
        type="text"
        placeholder="Student's Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="datetime-local"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <button onClick={createAppointment}>Create</button>
    </div>
  );
};

export default CreateAppointment;
