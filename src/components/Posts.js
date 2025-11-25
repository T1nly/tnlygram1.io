import React, { useEffect, useState } from 'react';
import PostForm from './PostForm';
import ProfileMenu from './ProfileMenu';

export default function Posts({ user, setUser }) {
    const [posts, setPosts] = useState([]);
    const [news] = useState([
        "Новости 1: Новый функционал!",
        "Новости 2: Киберпанк тема обновлена.",
        "Новости 3: Следующий апдейт скоро.",
        "Новости 4: Новый функционал!",
        "Новости 5: Киберпанк тема обновлена.",
        "Новости 6: Новый функционал!",
        "Новости 7: Киберпанк тема обновлена.",
        "Новости 8: Следующий апдейт скоро.",
        "Новости 9: Новый функционал!",
        "Новости 10: Киберпанк тема обновлена.",
    ]);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activePost, setActivePost] = useState(null); // пост для модалки
    const [commentText, setCommentText] = useState('');

    const fetchPosts = async () => {
        const res = await fetch('http://localhost:5000/posts');
        const data = await res.json();
        setPosts(data.sort((a,b)=>b.id - a.id));
    };

    useEffect(() => { fetchPosts(); }, []);

    const likePost = async (post) => {
        const likedBy = Array.isArray(post.likedBy) ? post.likedBy : [];
        if(likedBy.includes(user.username)) return;

        const updatedLikes = post.likes + 1;
        const updatedLikedBy = [...likedBy, user.username];

        await fetch(`http://localhost:5000/posts/${post.id}`, {
            method:'PATCH',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({likes: updatedLikes, likedBy: updatedLikedBy})
        });

        fetchPosts();
    };

    const openCommentModal = (post) => {
        setActivePost(post);
        setCommentText('');
    };

    const submitComment = async () => {
        if(!commentText) return;

        const currentComments = Array.isArray(activePost.comments) ? activePost.comments : [];
        const updatedComments = [...currentComments, {author:user.username, text:commentText}];

        await fetch(`http://localhost:5000/posts/${activePost.id}`, {
            method:'PATCH',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({comments: updatedComments})
        });

        fetchPosts();
        setActivePost(null); // закрыть модалку
    };

    return (
        <>
            <div className="news-sidebar">
                <h2>Новости</h2>
                {news.map((n,i) => <p key={i}>{n}</p>)}
            </div>

            <div className="main-content">
                <h1>Посты</h1>
                <PostForm user={user} refreshPosts={fetchPosts} />

                {posts.map(p => (
                    <div key={p.id} className="post">
                        <div style={{display:'flex', alignItems:'center', marginBottom:'8px'}}>
                            {p.avatar && <img src={p.avatar} alt="avatar" style={{width:'40px', height:'40px', borderRadius:'50%', marginRight:'10px'}} />}
                            <b>{p.author}</b>
                        </div>
                        <p>{p.content}</p>
                        {p.image && <img src={p.image} alt="post" style={{width:'30%', borderRadius:'8px', marginTop:'10px'}} />}
                        <div style={{display:'flex', alignItems:'center', marginTop:'8px', gap:'10px'}}>
                            <button onClick={()=>likePost(p)}>❤️ {p.likes}</button>
                            <button onClick={()=>openCommentModal(p)}>💬 Комментировать</button>
                        </div>
                    </div>
                ))}
            </div>

            <button className="profile-button" onClick={() => setMenuOpen(!menuOpen)}>
                {user.avatar ? <img src={user.avatar} alt="avatar" /> : null}
            </button>

            {menuOpen && <ProfileMenu user={user} setUser={setUser} closeMenu={() => setMenuOpen(false)} />}

            {/* Модальное окно комментариев */}
            {activePost && (
                <div style={{
                    position:'fixed', top:0, left:0, width:'100%', height:'100%',
                    background:'rgba(0,0,0,0.7)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:1000
                }}>
                    <div style={{background:'#111', padding:'20px', borderRadius:'10px', width:'400px', color:'#fff'}}>
                        <h3>Комментарии к {activePost.author}</h3>
                        <div style={{maxHeight:'200px', overflowY:'auto', marginBottom:'10px'}}>
                            {(activePost.comments || []).map((c,i)=>(
                                <p key={i}><b>{c.author}</b>: {c.text}</p>
                            ))}
                        </div>
                        <textarea 
                            value={commentText} 
                            onChange={e=>setCommentText(e.target.value)} 
                            placeholder="Ваш комментарий..." 
                            style={{width:'100%', borderRadius:'5px', padding:'5px', marginBottom:'10px'}}
                        />
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                            <button onClick={()=>setActivePost(null)}>Закрыть</button>
                            <button onClick={submitComment}>Отправить</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
