import React from 'react';
import './App.css';
import CreateAppointment from './components/CreateAppointment';
import MarkAttendance from './components/MarkAttendance';
import CheckRewards from './components/CheckRewards';
import GetAppointments from './components/GetAppointments';

const App = () => {
  return (
    <div className="App">
      <h1>WeMeet DApp</h1>
      <CreateAppointment />
      <MarkAttendance />
      <CheckRewards />
      <GetAppointments />
    </div>
  );
};

export default App;
