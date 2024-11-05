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
  const [profilePic, setProfilePic] = useState(null);

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
      socket.current.emit("get-profile-picture", { userId: decodedToken.current.id });
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

    // socket.current.on("get-profile-picture-success", (data) => {
    //   setProfilePic(data.profile);
    // });

    socket.current.on("update-profile-success", (data) => {
      setProfilePic(data);
      alert("Profile picture updated successfully!");
    });

    socket.current.on("update-profile-error", (error) => {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture.");
    });

    return () => {
      socket.current.disconnect();

      socket.current.off("request-user-list-success");
      socket.current.off("request-user-list-error");
      socket.current.off("request-messages-success");
      socket.current.off("request-messages-error");
      socket.current.off("send-message-error");
      socket.current.off("new-message");
      // socket.current.off("get-profile-picture-success");
      socket.current.off("update-profile-success");
      socket.current.off("update-profile-error");
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
      console.error("Error converting file to Base64: ", erroDr);
    };
  };

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64Profile = reader.result.split(",")[1];
        const attachmentObject = {
          type: "." + file.name.split(".").pop(),
          content: base64Profile,
        };
        socket.current.emit("update-profile", { loggedUser: decodedToken.current.id, profilePicture: attachmentObject, });
      };
    }
  };

  return (
    <>
      <div className="flex">

        <div id="peopleList">
          {peopleList}
          <div id="loggedUser">
            {profilePic ? (<img src={profilePic} alt="Profile" style={{ width: "100px", height: "100px" }} />) : ("Nie wybrano zdjęcia profilowego")}
            <input type="file" accept="image/*" onChange={handleProfileUpload} />
            {loggedUser || "Nieznany użytkownik"}<br />
            <a id="logout" onClick={logout}>Wyloguj się</a>
          </div>
        </div>

        <div id="chat">
          {selectedUser && (
            <div id="messageSend">
              <input type="text" id="messageContent" value={sendContent} onChange={(e) => setSendContent(e.target.value)} />
              <input type="file" id="attachmentBtn" accept=".mp4, image/*, .pdf, .txt" onChange={(e) => setSelectedFile(e.target.files[0])} />
              <button id="sendBtn" onClick={handleSend}>Wyślij</button>
            </div>
          )}
          <div id="messages">
            {messagesList.length == 0 && selectedUser ? (
              <div key="no-messages">
                &nbsp;Nie ma żadnych wiadomości do wyświetlenia. Zacznij konwersację już teraz!
              </div>
            ) : (
              messagesList.map((msg) => {
                const getAttachmentType = (attachment) => {
                  const extension = attachment.split('.').pop().toLowerCase();
                  if (['png', 'jpg', 'jpeg', 'gif'].includes(extension)) {
                    return 'image';
                  } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
                    return 'video';
                  } else {
                    return 'other';
                  }
                };

                const attachmentType = msg.attachment ? getAttachmentType(msg.attachment) : null;

                return (
                  <div
                    key={msg.message_id}
                    className={msg.author_id === decodedToken.current.id ? "authored" : "notAuthored"}
                  >
                    <div>{msg.content}</div>
                    {msg.attachment && (
                      <>
                        {attachmentType === 'image' && (
                          <img
                            src={msg.attachment}
                            alt="attachment"
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        )}
                        {attachmentType === 'video' && (
                          <video width="320" height="240" controls>
                            <source src={msg.attachment} type={`video/${msg.attachment.split('.').pop()}`} />
                            Twoja przeglądarka nie wspiera elementu video.
                          </video>
                        )}
                        {attachmentType === 'other' && (
                          <a href={msg.attachment} download>
                            {msg.attachment.split('/').pop()}
                          </a>
                        )}
                      </>
                    )}
                  </div>
                );
              })
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
