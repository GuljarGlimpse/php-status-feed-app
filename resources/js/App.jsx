import { useEffect, useMemo, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import api from './services/api.js';
import PostComposer from './components/PostComposer.jsx';
import ProfilePanel from './components/ProfilePanel.jsx';
import PostList from './components/PostList.jsx';
import Toast from './components/Toast.jsx';

const emptyPost = {
    title: '',
    author: '',
    body: '',
    cover_image: '',
    published_at: '',
};

const emptyProfile = {
    display_name: '',
    bio: '',
    location: '',
    website: '',
    avatar_url: '',
};

const emptyCommentDraft = { author: '', body: '' };

const App = () => {
    const [posts, setPosts] = useState([]);
    const [profile, setProfile] = useState(null);
    const [postForm, setPostForm] = useState(() => ({ ...emptyPost }));
    const [profileForm, setProfileForm] = useState(() => ({ ...emptyProfile }));
    const [editingPostId, setEditingPostId] = useState(null);
    const [commentDrafts, setCommentDrafts] = useState({});
    const [loading, setLoading] = useState(true);
    const [busyFlags, setBusyFlags] = useState(() => new Set());
    const [toast, setToast] = useState(null);

    useEffect(() => {
        boot();
    }, []);

    useEffect(() => {
        if (!toast) {
            return undefined;
        }

        const timeout = setTimeout(() => setToast(null), 4500);
        return () => clearTimeout(timeout);
    }, [toast]);

    const isBusy = (key) => busyFlags.has(key);

    const startBusy = (key) => {
        setBusyFlags((prev) => {
            const next = new Set(prev);
            next.add(key);
            return next;
        });
    };

    const stopBusy = (key) => {
        setBusyFlags((prev) => {
            const next = new Set(prev);
            next.delete(key);
            return next;
        });
    };

    const showToast = (message, tone = 'success') => {
        setToast({ id: Date.now(), message, tone });
    };

    const handleError = (fallbackMessage, error) => {
        const apiMessage = error?.response?.data?.message;
        showToast(apiMessage || fallbackMessage, 'danger');
        console.error(error);
    };

    const boot = async () => {
        try {
            setLoading(true);
            await Promise.all([loadProfile(), loadPosts()]);
        } catch (error) {
            handleError('Unable to load initial data', error);
        } finally {
            setLoading(false);
        }
    };

    const loadPosts = async () => {
        const { data } = await api.get('/posts');
        setPosts(Array.isArray(data.data) ? data.data : data);
    };

    const loadProfile = async () => {
        const { data } = await api.get('/profile');
        const payload = data.data ?? data;
        setProfile(payload);
        setProfileForm({
            display_name: payload.display_name ?? '',
            bio: payload.bio ?? '',
            location: payload.location ?? '',
            website: payload.website ?? '',
            avatar_url: payload.avatar_url ?? '',
        });
    };

    const updatePostForm = (field, value) => {
        setPostForm((prev) => ({ ...prev, [field]: value }));
    };

    const updateProfileForm = (field, value) => {
        setProfileForm((prev) => ({ ...prev, [field]: value }));
    };

    const updateCommentDraft = (postId, field, value) => {
        setCommentDrafts((prev) => ({
            ...prev,
            [postId]: { ...(prev[postId] ?? emptyCommentDraft), [field]: value },
        }));
    };

    const handlePostSubmit = async () => {
        const key = 'post-save';
        startBusy(key);
        try {
            const payload = {
                ...postForm,
                cover_image: postForm.cover_image || null,
                published_at: postForm.published_at || null,
            };

            if (editingPostId) {
                await api.put(`/posts/${editingPostId}`, payload);
                showToast('Post updated');
            } else {
                await api.post('/posts', payload);
                showToast('Post published');
            }

            setPostForm({ ...emptyPost });
            setEditingPostId(null);
            await loadPosts();
        } catch (error) {
            handleError('Unable to save post', error);
        } finally {
            stopBusy(key);
        }
    };

    const startEditPost = (post) => {
        setEditingPostId(post.id);
        setPostForm({
            title: post.title ?? '',
            author: post.author ?? '',
            body: post.body ?? '',
            cover_image: post.cover_image ?? '',
            published_at: post.published_at ? post.published_at.slice(0, 16) : '',
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEditPost = () => {
        setEditingPostId(null);
        setPostForm({ ...emptyPost });
    };

    const handleDeletePost = async (postId) => {
        if (!confirm('Delete this post?')) {
            return;
        }
        const key = `post-delete-${postId}`;
        startBusy(key);
        try {
            await api.delete(`/posts/${postId}`);
            showToast('Post removed');
            await loadPosts();
        } catch (error) {
            handleError('Unable to delete post', error);
        } finally {
            stopBusy(key);
        }
    };

    const handleCommentSubmit = async (postId) => {
        const draft = commentDrafts[postId] ?? emptyCommentDraft;
        if (!draft.author || !draft.body) {
            showToast('Add your name and comment before submitting.', 'danger');
            return;
        }
        const key = `comment-create-${postId}`;
        startBusy(key);
        try {
            await api.post(`/posts/${postId}/comments`, draft);
            showToast('Comment added');
            setCommentDrafts((prev) => ({ ...prev, [postId]: { ...emptyCommentDraft } }));
            await loadPosts();
        } catch (error) {
            handleError('Unable to save comment', error);
        } finally {
            stopBusy(key);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!confirm('Remove this comment?')) {
            return;
        }
        const key = `comment-delete-${commentId}`;
        startBusy(key);
        try {
            await api.delete(`/comments/${commentId}`);
            showToast('Comment removed');
            await loadPosts();
        } catch (error) {
            handleError('Unable to delete comment', error);
        } finally {
            stopBusy(key);
        }
    };

    const handleProfileSubmit = async () => {
        const key = 'profile-save';
        startBusy(key);
        try {
            await api.put('/profile', {
                ...profileForm,
                bio: profileForm.bio || null,
                location: profileForm.location || null,
                website: profileForm.website || null,
                avatar_url: profileForm.avatar_url || null,
            });
            await loadProfile();
            showToast('Bio updated');
            return true;
        } catch (error) {
            handleError('Unable to update profile', error);
            return false;
        } finally {
            stopBusy(key);
        }
    };

    const stats = useMemo(
        () => ({
            posts: posts.length,
            comments: posts.reduce((sum, post) => sum + (post.comments?.length ?? 0), 0),
        }),
        [posts],
    );

    if (loading) {
        return (
            <main className="app-shell app-shell--loading">
                <p>Loading workspace...</p>
            </main>
        );
    }

    return (
        <main className="app-shell">
            <header className="app-header">
                <div>
                    <p className="eyebrow">Social Console</p>
                    <h1>Team signal board</h1>
                </div>
                <div className="metrics">
                    <div>
                        <span>{stats.posts}</span>
                        <small>Posts</small>
                    </div>
                    <div>
                        <span>{stats.comments}</span>
                        <small>Comments</small>
                    </div>
                </div>
            </header>

            <div className="layout">
                <div className="layout__main">
                    <PostComposer
                        value={postForm}
                        onChange={updatePostForm}
                        onSubmit={handlePostSubmit}
                        onCancel={cancelEditPost}
                        isEditing={Boolean(editingPostId)}
                        isBusy={isBusy('post-save')}
                    />

                    <PostList
                        posts={posts}
                        onEditPost={startEditPost}
                        onDeletePost={handleDeletePost}
                        commentDrafts={commentDrafts}
                        onCommentChange={updateCommentDraft}
                        onCommentSubmit={handleCommentSubmit}
                        onDeleteComment={handleDeleteComment}
                        isBusy={isBusy}
                        formatRelative={(date) => formatDistanceToNow(date, { addSuffix: true })}
                    />
                </div>

                <aside className="layout__sidebar">
                    <ProfilePanel
                        profile={profile}
                        form={profileForm}
                        onChange={updateProfileForm}
                        onSubmit={handleProfileSubmit}
                        isBusy={isBusy('profile-save')}
                    />
                </aside>
            </div>

            {toast && <Toast message={toast.message} tone={toast.tone} key={toast.id} />}
        </main>
    );
};

export default App;
