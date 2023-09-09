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
        {/* <img className="gobsmacked" src={"./Gobsmacked.png"} alt="GOBSMACKED" /> */}
      </div>
      <div className="enter">
        <button onClick={handleClick} className="enter_button">
          Click to create account
        </button>
      </div>
      <br />
      {/* {goblins.length > 0 && (
        <div className="center-imgs">
          {goblins.map((goblin) => {
            return (
              <img
                className="gob-imgs"
                src={goblin.img_url}
                alt={goblin.name}
                onClick={() => handleGoblinClick(goblin)}
              />
            );
          })}
          ,
        </div>
      )} */}
    </div>
  );
}

export default Home;
