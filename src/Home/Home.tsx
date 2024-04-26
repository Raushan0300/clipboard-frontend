import { useState } from "react";
import "./Home.css";
import { getData, postData } from "../Config";

const Home = () => {
  const [text, setText] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [codeText, setCodeText] = useState<string>("");

  const [showText, setShowText] = useState<string>("");

  const [isLoadingSave, setIsLoadingSave] = useState<boolean>(false);
  const [isLoadingShow, setIsLoadingShow] = useState<boolean>(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingSave(true);
    const response = await postData("save", { text: text });
    console.log(response);
    if (response) {
      setCodeText(response.code);
    }
    setIsLoadingSave(false);
  };

  const handleShow = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingShow(true);
    const response = await getData("show", { code: code });
    if (response) {
      setShowText(response.text);
    }
    setIsLoadingShow(false);
  };

  const handleCopy = () => {
    const textArea = document.querySelector(
      ".homeTextArea1"
    ) as HTMLTextAreaElement;
    textArea.select();
    document.execCommand("copy");
  };

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
  };

  return (
    <div className="homeMainDiv">
      <div className="homeLeftDiv">
        <div className="homeTitleText">Copy Text</div>
        <form
          action="submit"
          className="homeForm"
          onSubmit={handleSave}>
          <textarea
            placeholder="Enter Text"
            className="homeTextArea"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <button
            type="submit"
            className="homeBtn">
            {isLoadingSave ? "Loading..." : "Save Copy"}
          </button>
        </form>
        {codeText && (
          <div className="homeCode">
            {`Code - ${codeText}`}{" "}
            <button
              className="homeCopyBtn"
              onClick={() => {
                handleCopyCode(codeText);
              }}>
              Copy
            </button>
          </div>
        )}
      </div>
      <div className="homeRightDiv">
        <div className="homeTitleText">Reveal Text</div>
        <form
          action="submit"
          className="homeForm"
          onSubmit={handleShow}>
          <input
            type="text"
            placeholder="Code"
            className="homeInput"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
          <button className="homeBtn1">
            {isLoadingShow ? "Loading..." : "Show"}
          </button>
        </form>
        <textarea
          className="homeTextArea1"
          value={showText}
          readOnly
        />
        {showText && (
          <button
            className="homeCopyBtn"
            onClick={() => {
              handleCopy();
            }}>
            Copy
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
