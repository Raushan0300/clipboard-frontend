import { useState } from "react";
import "./Home.css";
import { getData, postData } from "../Config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const [text, setText] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [codeText, setCodeText] = useState<string>("");
  const [showText, setShowText] = useState<string>("");

  const [isLoadingSave, setIsLoadingSave] = useState<boolean>(false);
  const [isLoadingShow, setIsLoadingShow] = useState<boolean>(false);

  const [isText, setIsText] = useState<boolean>(false);
  const [isFile, setIsFile] = useState<boolean>(false);

  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // const [uploadProgress, setUploadProgress] = useState(0);

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
    setShowText("");
    const response = await getData("show", { code: code, responseType: 'blob' });
    if (response.text) {
      setShowText(response.text);
    } else{
      window.open(`https://drive.google.com/uc?export=download&id=${response.fileId}`)
//       let link = document.createElement('a');
// link.href = `https://drive.google.com/uc?export=download&id=${response.fileId}`;
// document.body.appendChild(link);
// link.click();
// document.body.removeChild(link);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] ?? null;
    setSelectedFile(selectedFile);
    // console.log('Selected File:', selectedFile);
  };
  

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }
  
    setIsLoadingSave(true);
  
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
  
      console.log('Selected File:', selectedFile);
      console.log('FormData:', formData);
  
      const response = await postData('upload', formData);
  
      // console.log('File uploaded:', response.data);
      setCodeText(response.code);
      setIsLoadingSave(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsLoadingSave(false);
    }
  };
  

  return (
    <div className="homeMainDiv">
      <div className="homeLeftDiv">
        <div className="homeTitleText">Copy</div>
        <div className="homeBtnDiv">
          <button
            className="homeBtn"
            onClick={() => {
              setIsText(true);
              setIsFile(false);
              setCodeText("");
            }}>
            Text
          </button>
          <button
            className="homeBtn"
            onClick={() => {
              setIsFile(true);
              setIsText(false);
              setCodeText("");
            }}>
            File
          </button>
          </div>
        {isText&&<form
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
        </form>}

        {isFile && (
  <form action="submit" className="homeForm" encType="multipart/form-data" onSubmit={handleUpload}>
    <label htmlFor="fileInput" className="customFileInput">
      <span className="icon">
        <FontAwesomeIcon icon={faUpload} />
      </span>
      <span className="homeFileNameText">{selectedFileName || 'Choose a file...'}</span>
    </label>
    <input
      type="file"
      id="fileInput"
      className="hidden"
      onChange={(e) => {
        handleFileChange(e);
        const file = e.target.files?.[0];
        if (file) {
          setSelectedFileName(file.name);
          const reader = new FileReader();
          reader.readAsText(file);
        }
      }}
    />
    <button type="submit" className="homeBtn">
      {isLoadingSave ? "Loading..." : "Save Copy"}
    </button>
    {/* {isLoadingSave&&<progress value={uploadProgress} max="100" />} */}
  </form>
)}

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
        <div className="homeTitleText">Reveal</div>
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
            maxLength={4}
          />
          <button className="homeBtn1">
            {isLoadingShow ? "Loading..." : "Show"}
          </button>
        </form>
        {showText && (
          <>
            <textarea
              className="homeTextArea1"
              value={showText}
              readOnly
            />

            <button
              className="homeCopyBtn"
              onClick={() => {
                handleCopy();
              }}>
              Copy
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
