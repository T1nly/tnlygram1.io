import React, { useState } from 'react';

export default function ProfileMenu({ user, setUser, closeMenu }) {
    const [newName, setNewName] = useState('');
    const [avatar, setAvatar] = useState(user.avatar || null);

    const changeName = async () => {
        if(!newName) return;
        await fetch(`http://localhost:5000/users/${user.id}`, {
            method: 'PATCH',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({ username: newName })
        });
        setUser({...user, username: newName});
        setNewName('');
        closeMenu();
    };

    const uploadAvatar = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar(reader.result);
            setUser({...user, avatar: reader.result});
        };
        reader.readAsDataURL(file);
    };

    const logout = () => setUser(null);

    return (
        <div className="profile-menu">
            <b>Профиль:</b>
            <p>Ник: {user.username}</p>
            <input class placeholder="Новый ник" value={newName} onChange={e => setNewName(e.target.value)} />
            <button onClick={changeName}>Сменить ник</button>
            <input type="file" onChange={uploadAvatar} />
            <button onClick={logout}>Выйти</button>
        </div>
    );
}
