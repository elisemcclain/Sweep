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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/crimes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(crimeData),
      });

      if (response.ok) {
        console.log("Report Submitted!");
      } else {
        console.error("Error creating crime");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Type:</label>
        <input
          type="text"
          name="name"
          value={crimeData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Category:</label>
        <input
          type="text"
          name="crime_categories"
          value={crimeData.crime_categories}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Description:</label>
        <textarea
          name="desc"
          value={crimeData.desc}
          onChange={handleChange}
          required
        ></textarea>
      </div>
      <div>
        <label>Location:</label>
        <input
          type="text"
          name="locations"
          value={crimeData.locations}
          onChange={handleChange}
          required
        />
      </div>
      {/* <div>
        <label>Date Occurred:</label>
        <input
          type="text"
          name="date"
          value={crimeData.date}
          onChange={handleChange}
          required
        />
      </div> */}
      <div>
        <button type="submit">Submit Report</button>
      </div>
    </form>
  );
}

export default CrimeForm;
