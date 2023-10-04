import { useHistory } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

function Home() {
  const history = useHistory();

  function handleClick() {
    history.push("/signup");
  }

  return (
    <div>
      <div className="description">
        <h2>Keep yourself informed of what crime is happening around you.</h2>
      </div>
      <div className="btn-top">
        <button
          onClick={handleClick}
          className="btn-start btn-outline-secondary btn-lg"
        >
          Click here to get started.
        </button>
        <div className="world">
          <img className="world-main" src={"/world.png"} alt="world-logo" />
        </div>
      </div>
    </div>
  );
}

export default Home;
