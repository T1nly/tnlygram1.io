import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Posts from './components/Posts';

function App() {
  const [user, setUser] = React.useState(null); // null = не вошёл

  return (
    <div className={user ? "body-logged" : "body-login"}>
      {!user ? (
        <Login setUser={setUser} />   // страница входа/регистрации
      ) : (
        <Posts user={user} setUser={setUser} /> // посты
      )}
    </div>
  );
}

export default App;
