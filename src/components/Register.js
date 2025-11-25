import React, { useState } from 'react';

export default function Register({ setUser, switchMode }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [notification, setNotification] = useState('');

    const register = async () => {
        if(!username || !password) return window.alert('Введите данные!');
        const res = await fetch('http://localhost:5000/users');
        const users = await res.json();
        if(users.find(u => u.username === username)) return window.alert('Пользователь уже существует!');

        const newUser = { id: Date.now(), username, password };
        await fetch('http://localhost:5000/users', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(newUser)
        });
        setUser(newUser);
        setNotification('Успешно зарегистрировались!');
        setTimeout(() => setNotification(''), 2000);
    };

    return (
        <div className="container">
            {notification && <div className="alert">{notification}</div>}
            <h1>Регистрация</h1>
            <input placeholder="Имя" value={username} onChange={e => setUsername(e.target.value)} />
            <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} />
            <button onClick={register}>Зарегистрироваться</button>
            <p style={{textAlign:'center', marginTop:'10px'}}>
                Уже есть аккаунт? <span style={{color:'#00ffff', cursor:'pointer'}} onClick={switchMode}>Войти</span>
            </p>
        </div>
    );
}
