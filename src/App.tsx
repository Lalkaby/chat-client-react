import React, {useEffect, useState } from 'react';
import axios from 'axios';

const backendUrl = 'http://localhost:8080';

interface Message {
  id: string;
  username: string;
  message: string;
}

interface User {
  id: string;
  username: string;
}

export const App = () => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState<Array<User>>([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<Message>>([]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${backendUrl}/login?username=${username}`, { username });
      setToken(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.delete(`${backendUrl}/logout?token=${token}`);
      setToken('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async () => {
    try {
      const response = await axios.post(`${backendUrl}/message?token=${token}&message=${message}`, { token, message });
      setMessage('');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if(token) {
        try {
          const response = await axios.get(`${backendUrl}/message/list?token=${token}`);
          setMessages(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [token]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if(token) {
        try {
          const response = await axios.get(`${backendUrl}/user/list?token=${token}`);
          setUsers(response.data);
        } catch (error) {
          console.error(error);
        }
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [token]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleLogout);

    return () => {
      window.removeEventListener('beforeunload', handleLogout);
    };
  }, [token]);

  return (
      <>
        {token ? (
            <div className={'content'}>
              <div className={'head'}>
                <h2>Welcome, {username}!</h2>
                <button className={'logout'} onClick={handleLogout}>Logout</button>
              </div>
              <div className={'chat'}>
                <div className={'messages_wrapper'}>
                  <div className={'messages'}>
                    {messages.map((message) => (
                        <div key={message.id}>
                          <b>{message.username}:</b> {message.message}
                        </div>
                    ))}
                  </div>
                  <div className={'actions'}>
                    <input className={'message_input'} value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button className={'send_message_button'} onClick={handleSendMessage}>Send</button>
                  </div>
                </div>
                <div className={'users_wrapper'}>
                  <h3>Users in chat:</h3>
                  <div className={'users_list'}>
                    {users.map((user) => (
                        <div key={user.id}>
                          {user.username}
                        </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
        ) : (
            <div>
              <h2>Enter you name:</h2>
              <input value={username} onChange={(e) => setUsername(e.target.value)} />
              <button onClick={handleLogin}>Login</button>
            </div>
        )}
      </>
  );
}