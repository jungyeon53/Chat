import React, { useState, useEffect, useRef } from 'react';
import { Button, Container, TextField } from '@mui/material';
import SockJS from 'sockjs-client';
import { Stomp } from "@stomp/stompjs";
import './App.css';


function App() {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const stompClient = useRef(null);

  useEffect(() => {
    if (stompClient.current) {
      stompClient.current.on('connect', () => {
        console.log('연결성공');
        setConnected(true);
      });

      stompClient.current.on('disconnect', () => {
        console.log('연결실패');
        setConnected(false);
      });

      stompClient.current.on('chat message', (messageOutput) => {
        showMessageOutput(messageOutput);
      });
    }

    return () => {
      if (stompClient.current) {
        stompClient.current.disconnect();
      }
    };
  }, []);

  function connect() {
    const socket = new SockJS('http://localhost:8080/web');
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, () => {
      console.log('연결성공');
      setConnected(true);

      // 채팅 받기 
      stompClient.current.subscribe('/game/chat', (message) => {
        let msg = JSON.parse(message.body);
        showMessageOutput(msg);
      });
    });

    socket.onclose = () => {
      console.log('채팅끝');
      setConnected(false);
    };
  }

  function sendMessage() {
    if (connected && stompClient.current) {
      const from = nickname;
      const text = message;
      const time = new Date().toLocaleTimeString();
      const messageObject = { from, text, time };

      console.log('메세지:', messageObject);

      stompClient.current.send('/game/chat', {}, JSON.stringify(messageObject));
    } else {
      console.log('서버에 연결되지 않았습니다.');
    }
  }

  function showMessageOutput(messageOutput) {
    setChatHistory((prevChatHistory) => {
      const newChatHistory = [...prevChatHistory, messageOutput];
      return newChatHistory;
    });
  }
  
  return (
    <div className="App">
        <div className="text">
          <h4>닉네임을 입력하고 등록을 누르시면 채팅이 시작됩니다.</h4>
        </div>
        <div className="con">
          <TextField
            id="outlined-basic"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <Button
            variant="contained"
            className="btn"
            name="connect"
            id="connect"
            onClick={() => connect()}
          >
            등록
          </Button>
        </div>
        <div className="con2">
          <TextField
            id="standard-basic"
            placeholder="채팅 메시지"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            variant="contained"
            className="btn2"
            onClick={() => sendMessage()}
          >
            전송
          </Button>
        </div>
        <div className="chatbg">
          <div className="chat">
            {chatHistory.map((chat, index) => (
              <p key={index}>{`${chat.from}: ${chat.text} (${chat.time})`}</p>
            ))}
          </div>
        </div>
    </div>
  );
}

export default App;
