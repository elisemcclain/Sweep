import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

function Home() {
  const history = useHistory();

  function handleClick() {
    const path = "/login";
    history.push(path);
  }

  //   const handleGoblinClick = (goblin) => {
  //     const path = `/goblins/${goblin.name}`;
  //     history.push(path);
  //   };

  return (
    <div>
      <div>
        <h1>SWEEP</h1>
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
