document.addEventListener("DOMContentLoaded", function() {
    const postRideForm = document.getElementById('post-ride-form');
    const searchRideForm = document.getElementById('search-ride-form');
    const ridesList = document.getElementById('rides-list');

    // Handle posting a ride
    postRideForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const startLocation = document.getElementById('start-location').value;
        const endLocation = document.getElementById('end-location').value;
        const date = document.getElementById('date').value;
        const price = parseFloat(document.getElementById('price').value);
        const phoneNumber = document.getElementById('phone-number').value;

        fetch('http://localhost:3000/api/rides', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ startLocation, endLocation, date, price, phoneNumber }),
        })
        .then(response => response.json())
        .then(data => {
            alert("Ride posted successfully!");
            postRideForm.reset(); // Clear the form
            loadAvailableRides(); // Refresh the ride list
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Failed to post ride.");
        });
    });

    // Load available rides
    function loadAvailableRides() {
        fetch('http://localhost:3000/api/rides')
            .then(response => response.json())
            .then(data => displayRides(data))
            .catch(error => console.error('Error loading rides:', error));
    }

    // Handle searching for rides
    searchRideForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const searchLocation = document.getElementById('search-location').value;
        const searchDestination = document.getElementById('search-destination').value;

        // Filter rides that match user's location and destination
        fetch('http://localhost:3000/api/rides')
            .then(response => response.json())
            .then(data => {
                const filteredRides = data.filter(ride => {
                    return ride.startLocation.toLowerCase().includes(searchLocation.toLowerCase()) &&
                           ride.endLocation.toLowerCase().includes(searchDestination.toLowerCase());
                });
                displayRides(filteredRides);
            })
            .catch(error => console.error('Error loading rides:', error));
    });

    // Display available rides with "Book Ride" option
    
    function displayRides(availableRides) {
    ridesList.innerHTML = ''; // Clear the list first

    if (availableRides.length === 0) {
        ridesList.innerHTML = '<li>No rides found for your search.</li>';
        return;
    }

    availableRides.forEach(ride => {
        // Assuming ride.date is in 'YYYY-MM-DDTHH:MM' format
        const rideDate = new Date(ride.date); 
        const formattedDate = rideDate.toLocaleDateString(); // Format as 'MM/DD/YYYY'
        const formattedTime = rideDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Format as 'HH:MM AM/PM'

        const li = document.createElement('li');
        li.innerHTML = `
            <div>
                <span><strong>${ride.startLocation}</strong> to <strong>${ride.endLocation}</strong></span><br>
                <span>Date: ${formattedDate}</span><br>
                <span>Time: ${formattedTime}</span><br>
                <span>Cost: $${ride.price.toFixed(2)}</span><br>
                <span>Contact: ${ride.phoneNumber}</span>
            </div>
            <button class="book-btn" data-id="${ride.id}">Book Ride</button>
        `;

        // Append the ride item to the list
        ridesList.appendChild(li);

        // Add an event listener to the "Book Ride" button
        li.querySelector('.book-btn').addEventListener('click', function() {
            bookRide(ride.id);
        });
    });
    }


    // Book a ride and remove it from the available rides
    function bookRide(rideId) {
        // Ask the customer for their phone number
        const customerPhoneNumber = prompt("Please enter your phone number to confirm the booking:");

        if (customerPhoneNumber) {
            // Simulate sending a message to the rider
            alert(`Ride booked successfully! Your phone number (${customerPhoneNumber}) will be sent to the rider.`);

            // Remove the booked ride from the database
            fetch(`http://localhost:3000/api/rides/${rideId}`, {
                method: 'DELETE',
            })
            .then(() => {
                alert("Ride has been removed from the list.");
                loadAvailableRides(); // Refresh the ride list
            })
            .catch(error => {
                console.error('Error booking ride:', error);
                alert("Failed to book ride.");
            });
        } else {
            alert("Booking canceled. Please provide a phone number.");
        }
    }

    // Load rides on initial load
    loadAvailableRides();
});
