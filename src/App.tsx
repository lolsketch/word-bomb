import { Reactions } from "./components/Reactions";
import { getPostId } from "./utils";
// import reactLogo from "./assets/react.svg";
// import partyKitLogo from "./assets/partykit.png";
// import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const postID = getPostId();

  return (
    <>
      <h1>Word Dash</h1>
      <div className="card">
        <Reactions postID={postID} />
      </div>

      <p className="read-the-docs"></p>
    </>
  );
}

export default App;
