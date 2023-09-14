import React, { useState } from "react";

function CrimeForm() {
  const [crimeData, setCrimeData] = useState({
    name: "",
    crime_categories: "",
    desc: "",
    locations: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCrimeData({
      ...crimeData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send crimeData to your backend API using an HTTP POST request
    // You can use a library like Axios or the built-in fetch function
    // Example: axios.post("/api/crimes", crimeData);
    // After successfully posting, you can redirect or show a success message
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Type:</label>
        <input
          type="text"
          name="title"
          value={crimeData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Category:</label>
        <input
          type="text"
          name="location"
          value={crimeData.crime_categories}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="description"
          value={crimeData.desc}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <div>
        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={crimeData.locations}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Date Occurred:</label>
        <input
          type="text"
          name="date"
          value={crimeData.date}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <button type="submit">Submit Report</button>
      </div>
    </form>
  );
}

export default CrimeForm;
