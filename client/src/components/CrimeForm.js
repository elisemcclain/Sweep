import React, { useState } from "react";

function CrimeForm() {
  const [formSuccess, setFormSuccess] = useState(false);
  const [crimeData, setCrimeData] = useState({
    name: "",
    desc: "",
    address: "",
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
      const response = await fetch("http://127.0.0.1:5555/crimes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(crimeData),
      });

      if (response.ok) {
        setCrimeData(crimeData);
        setFormSuccess(true);
        console.log("Report Submitted!");
      } else {
        console.error("Error creating crime");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {!formSuccess ? (
        <div>
          <h5 className="text">
            Submit a crime report so your neighbors are also well informed.
          </h5>
          <div className="crime-form-container">
            <section className="text-center">
              <div
                className="p-5 bg-image"
                style={{
                  height: "130px",
                }}
              ></div>

              <div
                className="card mx-4 mx-md-5 shadow-5-strong"
                style={{
                  marginTop: "-100px",
                  background: "hsla(0, 0%, 100%, 0.8)",
                  backdropFilter: "blur(30px)",
                }}
              >
                <div className="card-body py-5 px-md-5">
                  <h2 className="fw-bold mb-5">Report a Crime</h2>
                  <form onSubmit={handleSubmit}>
                    <div>
                      <label>Type:</label>
                      <input
                        type="text"
                        name="name"
                        value={crimeData.name}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label>Description:</label>
                      <textarea
                        name="desc"
                        value={crimeData.desc}
                        onChange={handleChange}
                        required
                        className="form-control"
                      ></textarea>
                    </div>
                    <div>
                      <label>Address:</label>
                      <input
                        type="text"
                        name="address"
                        value={crimeData.address}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div>
                      <label>Date Occurred:</label>
                      <input
                        type="date"
                        name="date"
                        value={crimeData.date}
                        onChange={handleChange}
                        required
                        className="form-control"
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="btn btn-primary btn-block mt-4"
                      >
                        Submit Report
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      ) : (
        <div>
          <h3>Your report has been submitted!</h3>
        </div>
      )}
    </div>
  );
}

export default CrimeForm;
