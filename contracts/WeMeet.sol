// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract WeMeet {
    // Struct to represent an appointment
    struct Appointment {
        uint256 id;
        address student;
        string name;
        address lecturer;
        uint256 date; // Unix timestamp
        bool attended;
    }

    // Struct to represent rewards for students
    struct Reward {
        address student;
        uint256 points;
    }

    // State variables
    mapping(uint256 => Appointment) public appointments;
    mapping(address => Reward) public rewards;
    uint256 public appointmentCounter;

    // Events to be emitted for various actions
    event AppointmentCreated(uint256 id, address student, string name,address lecturer, uint256 date);
    event AppointmentAttended(uint256 id, address student, address lecturer);
    event RewardGiven(address student, uint256 points);

    // Constructor to initialize the appointment counter
    constructor() {
        appointmentCounter = 0;
    }

    // Function to create an appointment
    function createAppointment(address _student, uint256 _date,string memory name) public {
        require(_student != address(0), "Student address cannot be zero");
        require(_date > block.timestamp, "Appointment date must be in the future");

        appointmentCounter++;
        appointments[appointmentCounter] = Appointment({
            id: appointmentCounter,
            student: _student,
            name: name,
            lecturer: msg.sender,
            date: _date,
            attended: false
        });

        emit AppointmentCreated(appointmentCounter, _student, name ,msg.sender, _date);
    }
    
    // Function to return the current appointment counter
    function getAppointmentCounter() public view returns (uint256) {
        Appointment memory appointment = appointments[appointmentCounter];
        return (appointment.id);
        }

    // Function to mark an appointment as attended
    function markAsAttended(uint256 _appointmentId) public {
        Appointment storage appointment = appointments[_appointmentId];
        require(appointment.lecturer == msg.sender, "Only the lecturer can mark the appointment as attended");
        require(!appointment.attended, "Appointment already marked as attended");

        appointment.attended = true;

        // Reward the student
        rewards[appointment.student].student = appointment.student;
        rewards[appointment.student].points += 10; // Example: reward 10 points

        emit AppointmentAttended(_appointmentId, appointment.student, appointment.lecturer);
        emit RewardGiven(appointment.student, rewards[appointment.student].points);
    }

    // Function to get details of an appointment
    function getAppointment(uint256 _appointmentId) public view returns (uint256, address,string memory,address, uint256, bool) {
        Appointment memory appointment = appointments[_appointmentId];
        return (appointment.id, appointment.student, appointment.name, appointment.lecturer, appointment.date, appointment.attended);
    }

    // Function to get reward points of a student
    function getRewardPoints(address _student) public view returns (uint256) {
        return rewards[_student].points;
    }
}
