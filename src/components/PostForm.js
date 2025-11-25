import React, { useState } from 'react';

export default function PostForm({ user, refreshPosts }) {
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);

    const createPost = async () => {
        if(!content) return alert('Введите текст поста!');
        let imageData = null;

        if(file){
            const reader = new FileReader();
            reader.onloadend = async () => {
                imageData = reader.result;
                await savePost(imageData);
            };
            reader.readAsDataURL(file);
        } else {
            await savePost(null);
        }
    };

    const savePost = async (imageData) => {
        const newPost = {
            id: Date.now(),
            author: user.username,
            avatar: user.avatar || null,
            content,
            image: imageData,
            likes: 0,
            comments: []  // обязательно создаем пустой массив
        };
        await fetch('http://localhost:5000/posts', {
            method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify(newPost)
        });
        setContent('');
        setFile(null);
        refreshPosts();
    };

return (
    <div style={{marginBottom:'20px', marginLeft:'50px'}}>  {/* добавили margin-left */}
        <textarea 
            placeholder="Что у вас нового?" 
            value={content} 
            onChange={e => setContent(e.target.value)} 
            style={{ 
                width:'90%', 
                padding:'10px', 
                borderRadius:'8px', 
                marginBottom:'10px',
                resize: 'none'  // отключаем возможность ресайза
            }}
        />
        <input type="file" onChange={e => setFile(e.target.files[0])} style={{marginBottom:'10px'}} />
        <button onClick={createPost}>Добавить пост</button>
    </div>
);
}