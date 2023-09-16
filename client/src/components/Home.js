import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Home() {
  const history = useHistory();

  function handleClick() {
    const path = "/login";
    history.push(path);
  }

  return (
    <div>
      <div>
        <p>Keep yourself informed of what crime is happening around you.</p>
      </div>
      <div className="enter">
        <button className="btn btn-primary" onClick={handleClick}>
          Click to create account
        </button>
      </div>
      <br />
    </div>
  );
}

export default Home;
