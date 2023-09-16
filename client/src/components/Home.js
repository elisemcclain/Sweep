import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Styles.css";

function Home() {
  const history = useHistory();

  function handleClick() {
    const path = "/login";
    history.push(path);
  }

  return (
    <div>
      <div>
        <div>
          <img className="logo" src={"./logosweep.png"} alt="Sweep-logo" />
        </div>
        <p>Keep yourself informed of what crime is happening around you.</p>
      </div>
      <div className="enter">
        <button onClick={handleClick} className="enter_button">
          Click to create account
        </button>
      </div>
      <br />
    </div>
  );
}

export default Home;
