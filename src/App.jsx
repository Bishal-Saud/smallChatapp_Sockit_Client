import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
function App() {
  const socket = useMemo(
    () => io("http://localhost:3000/", { withCredentials: true }),
    []
  );
  // const socket = io("http://localhost:3000/");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [roomName, setRoomName] = useState("");
  const [socketID, setSocketID] = useState("");
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected", socket.id);
      setSocketID(socket.id);
      socket.on("welcome", (s) => {
        console.log(s);
      });

      socket.on("receive-msg", (data) => {
        setMessages((messages) => [...messages, data]);
        console.log(data);
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { room, message });
    setMessage("");
  };
  const joinRoomHandler = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Container>
        <Typography variant="h6" component="div">
          User Id: {socketID}
        </Typography>
        <form onSubmit={joinRoomHandler}>
          <Typography variant="h4" component="div">
            Join Room
          </Typography>
          <TextField
            variant="outlined"
            label="roomName"
            id="outlined-basic"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          ></TextField>
          <Button type="submit" variant="contained" color="primary">
            Join
          </Button>
        </form>
        <form onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            label="message"
            id="outlined-basic"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></TextField>
          <TextField
            variant="outlined"
            label="room"
            id="outlined-basic"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          ></TextField>
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </form>
        <Stack>
          {messages.map((m, i) => (
            <Typography key={i} variant="h6" component="div">
              {m}
            </Typography>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
