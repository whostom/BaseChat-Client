import "./MessagesPage.css"
import { io } from "socket.io-client";
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function MessagesPage() {

  const [loggedUser, setLoggedUser] = useState(null);
  const [peopleList, setPeopleList] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [messagesList, setMessagesList] = useState([]);
  const [sendContent, setSendContent] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const socket = useRef(null);
  const decodedToken = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      decodedToken.current = jwtDecode(token);
      setLoggedUser(decodedToken.current.login);
    }
    catch (error) {
      console.error("Invalid token:", error);
      navigate("/");
      return;
    }

    socket.current = io("http://localhost:3000");

    socket.current.on("connect", () => {
      console.log("Succesfully connected with the server!");

      socket.current.emit("request-user-list", { loggedUser: decodedToken.current.id });
    });

    socket.current.on("request-user-list-success", (result) => {
      if (result.length > 0) {
        const mapped = result.map(person => (<div className="card" id={person.user_id} key={person.user_id} onClick={() => selectChatHandler(person)}>{person.login}</div>));
        setPeopleList(mapped);
      }
      else {
        setPeopleList([<div key="no-users">Nie ma użytkowników do wyświetlenia!</div>]);
      }
    });

    socket.current.on("request-user-list-error", (err) => {
      console.error("Error fetching user list:", err);
    });

    socket.current.on("request-messages-success", (result) => {
      setMessagesList(result)
    });

    socket.current.on("request-messages-error", (err) => {
      console.error("Error fetching messages:", err);
    });

    socket.current.on("send-message-error", (err) => {
      console.error("Error sending a message:", err);
    });

    socket.current.on("new-message", ({ data }) => {
      setMessagesList(data);
    });

    return () => {
      socket.current.disconnect();
      socket.current.off("request-user-list-success");
      socket.current.off("request-user-list-error");
      socket.current.off("request-messages-success");
      socket.current.off("request-messages-error");
      socket.current.off("send-message-error");
      socket.current.off("receive-message");
    };
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  }

  const selectChatHandler = (person) => {
    setSelectedUser(person.login);
    setSelectedUserId(person.user_id);
  };

  useEffect(() => {
    if (selectedUserId != null) {
      socket.current.emit("request-messages", { loggedUser: decodedToken.current.id, fromId: selectedUserId });
    }
  }, [selectedUserId]);

  const handleSend = () => {
    if (!selectedFile) {
      socket.current.emit("send-message", { loggedUser: decodedToken.current.id, content: sendContent, receiverId: selectedUserId, attachment: null });
      setSendContent("");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);

    reader.onload = () => {
      const base64Attachment = reader.result;

      const attachmentObject = {
        type: "." + selectedFile.name.substr(selectedFile.name.lastIndexOf('.') + 1, selectedFile.name.length),
        content: base64Attachment.substr(base64Attachment.lastIndexOf(',') + 1, base64Attachment.length)
      };

      socket.current.emit("send-message", { loggedUser: decodedToken.current.id, content: sendContent, receiverId: selectedUserId, attachment: attachmentObject });

      setSendContent("");
      setSelectedFile(null);
    };

    reader.onerror = (error) => {
      console.error("Error converting file to Base64: ", error);
    };
  };

  return (
    <>
      <div className="flex">

        <div id="peopleList">
          <div id="loggedUser">
            Zalogowano jako: {loggedUser || "Nieznany użytkownik"}<br /><br />
            <a id="logout" onClick={logout}>Wyloguj się</a>
          </div>
          {peopleList}
        </div>

        <div id="chat">
          <div id="messageSend">
            <input type="text" id="messageContent" value={sendContent} onChange={(e) => setSendContent(e.target.value)} />
            <input type="file" id="attachmentBtn" accept=".mp4, image/*, .pdf, .txt" onChange={(e) => setSelectedFile(e.target.files[0])} />
            <button id="sendBtn" onClick={handleSend}>Wyślij</button>
          </div>
          <div id="messages">
            {messagesList.length == 0 ? (
              <div key="no-messages">
                &nbsp;Nie ma żadnych wiadomości do wyświetlenia. Zacznij konwersację już teraz!
              </div>
            ) : (
              messagesList.map((msg) => (
                <div key={msg.message_id} className={msg.author_id === decodedToken.current.id ? "authored" : "notAuthored"}>
                  <div>{msg.content}</div>
                  {msg.attachment && (
                    // Check if the attachment is an image
                    <img src={msg.attachment} alt="Attachment" style={{ maxWidth: "100px", maxHeight: "100px" }} />
                  )}
                </div>
              ))
            )}
          </div>
          <div id="selectedUser">
            {selectedUser != "" && <span>Aktualnie czatujesz z użytkownikiem {selectedUser}</span>}
          </div>
        </div>

      </div>
    </>
  )
}

export default MessagesPage
