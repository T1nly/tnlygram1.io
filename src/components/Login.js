import React, { useState } from 'react';

export default function Login({ setUser, switchMode }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState('');

    const login = async () => {
        const res = await fetch('http://localhost:5000/users');
        const users = await res.json();
        const match = users.find(u => u.username === username && u.password === password);
        if(match){
            setUser(match);
            setNotification('Успешно вошли!');
            setTimeout(() => setNotification(''), 2000);
        } else {
            window.alert('Неверные данные!');
        }
    };

    return (
        <div className="container">
            {notification && <div className="alert">{notification}</div>}
            <h1>Вход</h1>
            <input placeholder="Имя" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={login}>Войти</button>
            <p style={{textAlign:'center', marginTop:'10px'}}>
                Нету аккаунта? <span style={{color:'#00ffff', cursor:'pointer'}} onClick={switchMode}>Зарегистрироваться</span>
            </p>
        </div>
    );
}
