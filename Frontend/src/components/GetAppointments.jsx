import React, { useState } from 'react';
import { ethers } from 'ethers';
import WeMeetABI from './WeMeet.json'; // Adjust the path if necessary

const GetAppointments = () => {
  const [date, setDate] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [error, setError] = useState('');

  const getAppointmentsForDate = async (date) => {
    try {
      setError('');
      // Connect to the Ethereum provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractAddress = '0x9c122eDEc982C12b7ab78D468A3fB92cEC28B734'; // Replace with your contract address
      const weMeetContract = new ethers.Contract(contractAddress, WeMeetABI.abi, signer);

      // Convert date to Unix timestamp
      const selectedDate = new Date(date);
      const startOfDay = Math.floor(selectedDate.setUTCHours(0, 0, 0, 0) / 1000);
      const endOfDay = startOfDay + 86400;

      // Fetch appointments (this assumes your contract has a way to fetch all appointments)
      const appointmentCounter = await weMeetContract.getAppointmentCounter();
      const appointmentsForDate = [];

      for (let i = 1; i <= appointmentCounter; i++) {
        const appointment = await weMeetContract.getAppointment(i);
        const appointmentDate = Number(appointment[4]); // Convert BigInt to Number
        if (appointmentDate >= startOfDay && appointmentDate < endOfDay) {
          appointmentsForDate.push(appointment);
        }
      }

      setAppointments(appointmentsForDate);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to fetch appointments. Make sure your wallet is connected and the contract is deployed correctly.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (date) {
      getAppointmentsForDate(date);
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  return (
    <div>
      <h2>Get Appointments for a Specific Date</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button type="submit">Get Appointments</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <h3>Appointments on {date}:</h3>
        {appointments.length === 0 && <p>No appointments found for this date.</p>}
        {appointments.length > 0 && (
          <ul>
            {appointments.map((appointment, index) => (
              <li key={index} onClick={() => handleAppointmentClick(appointment)} style={{ cursor: 'pointer', marginBottom: '10px', border: '1px solid #ccc', padding: '10px', borderRadius: '5px' }}>
                <p>Appointment ID: {Number(appointment[0]).toString()}</p>
                <p>Student: {appointment[1]}</p>
                <p>Student Name: {appointment[2]}</p>
                <p>Lecturer: {appointment[3]}</p>
                <p>Date: {new Date(Number(appointment[4]) * 1000).toLocaleString()}</p>
                <p>Attended: {appointment[5].toString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedAppointment && (
        <div>
          <h3>Selected Appointment Details</h3>
          <p>Appointment ID: {Number(selectedAppointment[0]).toString()}</p>
          <p>Student: {selectedAppointment[1]}</p>
          <p>Student Name: {selectedAppointment[2]}</p>
          <p>Lecturer: {selectedAppointment[3]}</p>
          <p>Date: {new Date(Number(selectedAppointment[4]) * 1000).toLocaleString()}</p>
          <p>Attended: {selectedAppointment[5].toString()}</p>
        </div>
      )}
    </div>
  );
};

export default GetAppointments;
