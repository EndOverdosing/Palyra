document.addEventListener('DOMContentLoaded', () => {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const { createClient } = supabase;
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        realtime: {
            params: {
                eventsPerSecond: 10
            }
        }
    });

    window.supabase = supabaseClient;

    const ui = {
        settingsModalContainer: document.getElementById('settings-modal-container'),
        settingsModalPane: document.getElementById('settings-modal'),
        settingsModalHeader: document.getElementById('settings-modal-header'),
        settingsModalBody: document.getElementById('settings-modal-body'),
        authContainer: document.getElementById('auth-container'),
        mainApp: document.getElementById('main-app'),
        loginForm: document.getElementById('login-form'),
        signupForm: document.getElementById('signup-form'),
        showSignup: document.getElementById('show-signup'),
        showLogin: document.getElementById('show-login'),
        authStatus: document.getElementById('auth-status'),
        sidebar: document.getElementById('sidebar'),
        usernameDisplay: document.getElementById('username-display'),
        userAvatar: document.getElementById('user-avatar'),
        logoutBtn: document.getElementById('logout-btn'),
        settingsBtn: document.getElementById('settings-btn'),
        addFriendBtn: document.getElementById('add-friend-btn'),
        friendsList: document.getElementById('friends-list'),
        chatContainer: document.getElementById('chat-container'),
        welcomeScreen: document.getElementById('welcome-screen'),
        chatView: document.getElementById('chat-view'),
        chatHeader: document.getElementById('chat-header'),
        chatAvatar: document.getElementById('chat-avatar'),
        chatFriendName: document.getElementById('chat-friend-name'),
        chatStatusText: document.getElementById('chat-status-text'),
        backToFriendsBtn: document.getElementById('back-to-friends-btn'),
        callBtn: document.getElementById('call-btn'),
        chatOptionsBtn: document.getElementById('chat-options-btn'),
        messagesContainer: document.getElementById('messages-container'),
        messageForm: document.getElementById('message-form'),
        messageInput: document.getElementById('message-input'),
        modalContainer: document.getElementById('modal-container'),
        closeModalBtn: document.getElementById('close-modal-btn'),
        addFriendModal: document.getElementById('add-friend-modal'),
        addFriendForm: document.getElementById('add-friend-form'),
        friendUsernameInput: document.getElementById('friend-username-input'),
        incomingCallModal: document.getElementById('incoming-call-modal'),
        callerAvatar: document.getElementById('caller-avatar'),
        callerName: document.getElementById('caller-name'),
        declineCallBtn: document.getElementById('decline-call-btn'),
        acceptCallBtn: document.getElementById('accept-call-btn'),
        callSection: document.getElementById('call-section'),
        videoGrid: document.getElementById('video-grid'),
        muteBtn: document.getElementById('mute-btn'),
        toggleVideoBtn: document.getElementById('toggle-video-btn'),
        shareScreenBtn: document.getElementById('share-screen-btn'),
        stopCallBtn: document.getElementById('stop-call-btn'),
        confirmationModal: document.getElementById('confirmation-modal'),
        confirmationTitle: document.getElementById('confirmation-title'),
        confirmationMessage: document.getElementById('confirmation-message'),
        confirmBtn: document.getElementById('confirm-btn'),
        cancelBtn: document.getElementById('cancel-btn'),
        chatFriendStatus: document.getElementById('chat-friend-status'),
        infoModal: document.getElementById('info-modal'),
        infoTitle: document.getElementById('info-title'),
        infoMessage: document.getElementById('info-message'),
        infoOkBtn: document.getElementById('info-ok-btn'),
        toggleChatBtn: document.getElementById('toggle-chat-btn'),
        incomingCallAudio: document.getElementById('incoming-call-audio'),
        typingIndicator: document.getElementById('typing-indicator'),
        settingsModal: document.getElementById('settings-modal'),
        themeToggle: document.getElementById('theme-toggle'),
        fontSizeSelect: document.getElementById('font-size-select'),
        notificationsToggle: document.getElementById('notifications-toggle'),
        messageSoundToggle: document.getElementById('message-sound-toggle'),
        onlineStatusToggle: document.getElementById('online-status-toggle'),
        readReceiptsToggle: document.getElementById('read-receipts-toggle'),
        settingsAvatar: document.getElementById('settings-avatar'),
        settingsUsername: document.getElementById('settings-username'),
        changeAvatarBtn: document.getElementById('change-avatar-btn'),
        changeUsernameBtn: document.getElementById('change-username-btn'),
        avatarUpload: document.getElementById('avatar-upload'),
        chatOptionsModal: document.getElementById('chat-options-modal'),
        viewProfileBtn: document.getElementById('view-profile-btn'),
        muteConversationBtn: document.getElementById('mute-conversation-btn'),
        blockUserBtn: document.getElementById('block-user-btn'),
        unfriendBtn: document.getElementById('unfriend-btn'),
        friendProfileModal: document.getElementById('friend-profile-modal'),
        profileAvatar: document.getElementById('profile-avatar'),
        profileUsername: document.getElementById('profile-username'),
        profileStatusDot: document.getElementById('profile-status-dot'),
        profileStatusText: document.getElementById('profile-status-text'),
        profileUsernameValue: document.getElementById('profile-username-value'),
        profileJoinedDate: document.getElementById('profile-joined-date'),
        messageUserBtn: document.getElementById('message-user-btn'),
        callUserBtn: document.getElementById('call-user-btn'),
        changeUsernameModal: document.getElementById('change-username-modal'),
        changeUsernameForm: document.getElementById('change-username-form'),
        newUsernameInput: document.getElementById('new-username-input'),
        searchFriendsInput: document.getElementById('search-friends-input'),
        replyPreview: document.getElementById('reply-preview'),
        replyPreviewText: document.querySelector('.reply-preview-text'),
        cancelReplyBtn: document.getElementById('cancel-reply-btn'),
        editMessageModal: document.getElementById('edit-message-modal'),
        editMessageForm: document.getElementById('edit-message-form'),
        editMessageInput: document.getElementById('edit-message-input'),
        fileInput: document.getElementById('file-input'),
        filePreviewModal: document.getElementById('file-preview-modal'),
        filePreviewContent: document.getElementById('file-preview-content'),
        fileSendForm: document.getElementById('file-send-form'),
        fileCaptionInput: document.getElementById('file-caption-input'),
        friendRequestsModal: document.getElementById('friend-requests-modal'),
        requestsList: document.getElementById('requests-list'),
        closeChatPaneBtn: document.getElementById('close-chat-pane-btn'),
        callTitle: document.getElementById('call-title'),
    };

    let peer, localStream, dataConnection, mediaConnection, currentUser, currentChatFriend, friends = {}, subscriptions = [];
    let callState = { isMuted: false, isVideoEnabled: true, isScreenSharing: false };
    let incomingCallData = null;
    let onlineUsers = new Set();
    let isInCall = false;
    let typingTimeout = null;

    let keepAliveInterval = null;
    let currentChatType = 'friend';
    let blockedUsers = new Set();
    let friendRequests = [];
    let pendingRequests = [];
    let replyingTo = null;
    let editingMessage = null;
    let pendingFiles = [];
    let conversations = [];

    let userSettings = {
        theme: 'dark',
        fontSize: 'medium',
        notifications: true,
        messageSound: true,
        onlineStatus: true,
        readReceipts: true
    };

    const HEARTBEAT_INTERVAL = 3000;
    let heartbeatTimer = null;
    let lastActivityTime = Date.now();
    let isTabVisible = true;

    let touchStartX = 0;
    let touchStartY = 0;
    let currentSwipeElement = null;
    let swipeThreshold = 60;

    function initializeMessageSwipe() {
        const messagesContainer = ui.messagesContainer;
        if (!messagesContainer) {
            return;
        }

        if (messagesContainer.dataset.swipeInitialized) return;
        messagesContainer.dataset.swipeInitialized = 'true';

        messagesContainer.addEventListener('touchstart', (e) => {
            const messageElement = e.target.closest('.message');
            if (!messageElement) return;

            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            currentSwipeElement = messageElement;

            const timestamp = messageElement.querySelector('.message-timestamp-reveal');
            if (timestamp) timestamp.style.opacity = '0';
        }, { passive: true });

        messagesContainer.addEventListener('touchmove', (e) => {
            if (!currentSwipeElement) return;

            const touchX = e.touches[0].clientX;
            const touchY = e.touches[0].clientY;
            const deltaX = touchX - touchStartX;
            const deltaY = touchY - touchStartY;

            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                currentSwipeElement = null;
                return;
            }

            const isSentMessage = currentSwipeElement.classList.contains('sent');
            const isReceivedMessage = currentSwipeElement.classList.contains('received');

            if ((isSentMessage && deltaX < 0) || (isReceivedMessage && deltaX > 0)) {
                e.preventDefault();
                const maxSwipe = 80;
                const swipeAmount = Math.min(Math.abs(deltaX), maxSwipe);
                const direction = deltaX < 0 ? -1 : 1;

                currentSwipeElement.style.transform = `translateX(${swipeAmount * direction}px)`;

                const timestamp = currentSwipeElement.querySelector('.message-timestamp-reveal');
                if (timestamp) {
                    const opacity = Math.min(swipeAmount / swipeThreshold, 1);
                    timestamp.style.opacity = opacity;
                }
            }
        }, { passive: false });

        messagesContainer.addEventListener('touchend', () => {
            if (currentSwipeElement) {
                currentSwipeElement.style.transform = '';
                const timestamp = currentSwipeElement.querySelector('.message-timestamp-reveal');
                if (timestamp) {
                    setTimeout(() => { timestamp.style.opacity = '0'; }, 300);
                }
                currentSwipeElement = null;
            }
        });
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    document.addEventListener('visibilitychange', () => {
        isTabVisible = !document.hidden;
        if (isTabVisible) {
            lastActivityTime = Date.now();
            if (currentUser) {
                updateUserPresence();
            }
        }
    });

    function startHeartbeat() {
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        heartbeatTimer = setInterval(async () => {
            if (currentUser && userSettings.onlineStatus) {
                await supabase.from('profiles').update({
                    last_seen: new Date().toISOString(),
                    is_online: true
                }).eq('id', currentUser.id);
            }
        }, HEARTBEAT_INTERVAL);
    }

    async function updateUserPresence() {
        if (currentUser && userSettings.onlineStatus) {
            await supabase.from('profiles').update({
                last_seen: new Date().toISOString(),
                is_online: true
            }).eq('id', currentUser.id);
        }
    }

    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }

    ui.callBtn.onclick = async () => {
        await startCall();
    };

    ui.chatOptionsBtn.onclick = () => {
        showModal(ui.chatOptionsModal);
    };

    const showAuth = (show) => ui.authContainer.classList.toggle('hidden', !show);
    const showApp = (show) => ui.mainApp.classList.toggle('hidden', !show);

    const loadSettings = () => {
        const saved = localStorage.getItem('userSettings');
        if (saved) {
            userSettings = { ...userSettings, ...JSON.parse(saved) };
        }
        applySettings();
    };

    const saveSettings = () => {
        localStorage.setItem('userSettings', JSON.stringify(userSettings));
    };

    const applySettings = () => {
        document.documentElement.setAttribute('data-theme', userSettings.theme);
        document.body.setAttribute('data-font-size', userSettings.fontSize);

        ui.themeToggle.checked = userSettings.theme === 'dark';
        ui.fontSizeSelect.value = userSettings.fontSize;
        ui.notificationsToggle.checked = userSettings.notifications;
        ui.messageSoundToggle.checked = userSettings.messageSound;
        ui.onlineStatusToggle.checked = userSettings.onlineStatus;
        ui.readReceiptsToggle.checked = userSettings.readReceipts;

        ui.themeToggle.onchange = () => {
            userSettings.theme = ui.themeToggle.checked ? 'dark' : 'light';
            saveSettings();
            applySettings();
        };
    };

    const startKeepAlive = () => {
        if (keepAliveInterval) clearInterval(keepAliveInterval);
        keepAliveInterval = setInterval(async () => {
            if (currentUser) {
                await supabase.from('profiles').update({
                    last_seen: new Date().toISOString()
                }).eq('id', currentUser.id);
            }
        }, 30000);
    };

    const initializePeer = async (userId) => {
        if (peer && !peer.destroyed) peer.destroy();
        ui.callBtn.disabled = true;

        peer = new Peer(undefined, {
            config: {
                'iceServers': [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            }
        });

        peer.on('open', async (id) => {
            await supabase.from('profiles').update({ peer_id: id }).eq('id', userId);
            ui.callBtn.disabled = false;
        });

        peer.on('call', handleIncomingCall);

        peer.on('error', (err) => {
            if (err.type === 'peer-unavailable' || err.message.includes('Could not connect to peer')) {
                showCallOverlay('User Offline', 'The person you\'re trying to call is currently offline. Please try again later.', 'error');
            }

            if (err.type === 'network' || err.type === 'server-error') {
                setTimeout(() => initializePeer(userId), 5000);
            }
        });
    };

    const handleAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
            const loaded = await loadUserData(session.user.id);

            if (!loaded) {
                await supabase.auth.signOut();
                showAuth(true);
                showInfoModal('Account Error', 'Your account could not be loaded. Please sign in again.');
                return;
            }

            showApp(true);
        } else {
            showAuth(true);
        }
    };

    const loadUserData = async (userId) => {
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error || !profile) {
                console.error('Profile load error:', error);
                return false;
            }

            currentUser = profile;
            ui.usernameDisplay.textContent = profile.username;
            ui.userAvatar.textContent = profile.username[0].toUpperCase();
            ui.settingsUsername.textContent = profile.username;
            ui.settingsAvatar.textContent = profile.username[0].toUpperCase();

            if (profile.avatar_url) {
                ui.userAvatar.innerHTML = `<img src="${profile.avatar_url}" alt="${profile.username}">`;
                ui.settingsAvatar.innerHTML = `<img src="${profile.avatar_url}" alt="${profile.username}">`;
            }

            await supabase.from('profiles').update({
                is_online: userSettings.onlineStatus,
                last_seen: new Date().toISOString()
            }).eq('id', userId);

            await loadFriends();
            await loadFriendRequests();
            await loadBlockedUsers();
            await checkPendingCallInvites();

            subscribeToPresence();
            subscribeToMessages();
            subscribeToFriendRequests();
            subscribeToFriendships();
            subscribeToCallInvites();

            initializePeer(userId);
            startKeepAlive();
            startHeartbeat();
            loadSettings();

            return true;
        } catch (error) {
            console.error('Failed to load user data:', error);
            return false;
        }
    };

    let loadFriendsTimeout = null;
    let isLoadingFriends = false;

    const loadFriends = async () => {
        if (isLoadingFriends) {
            return;
        }

        isLoadingFriends = true;

        const { data: friendships } = await supabase
            .from('friendships')
            .select('*, friend:profiles!friendships_friend_id_fkey(*)')
            .eq('user_id', currentUser.id)
            .eq('status', 'accepted');

        const { data: reverseFriendships } = await supabase
            .from('friendships')
            .select('*, friend:profiles!friendships_user_id_fkey(*)')
            .eq('friend_id', currentUser.id)
            .eq('status', 'accepted');

        friends = Object.create(null);

        const uniqueFriendIds = new Set();

        (friendships || []).forEach(f => {
            const friend = f.friend;
            if (friend && friend.id !== currentUser.id && !uniqueFriendIds.has(friend.id)) {
                friends[friend.id] = friend;
                uniqueFriendIds.add(friend.id);
            }
        });

        (reverseFriendships || []).forEach(f => {
            const friend = f.friend;
            if (friend && friend.id !== currentUser.id && !uniqueFriendIds.has(friend.id)) {
                friends[friend.id] = friend;
                uniqueFriendIds.add(friend.id);
            }
        });

        await updateConversationsList();

        clearTimeout(loadFriendsTimeout);
        loadFriendsTimeout = setTimeout(() => {
            isLoadingFriends = false;
        }, 500);
    };

    const addFileButton = () => {
        const fileBtn = document.createElement('button');
        fileBtn.type = 'button';
        fileBtn.className = 'attach-file-btn';
        fileBtn.innerHTML = '<i class="fa-solid fa-paperclip"></i>';
        fileBtn.title = 'Attach File';
        fileBtn.style.cssText = `
        background: var(--tertiary-bg);
        color: var(--secondary-text);
        font-size: 1.2rem;
        padding: 0;
        margin-right: 0.5rem;
    `;
        fileBtn.onclick = () => ui.fileInput.click();

        const messageWrapper = document.querySelector('.message-input-wrapper');
        if (messageWrapper && !messageWrapper.querySelector('.attach-file-btn')) {
            messageWrapper.insertBefore(fileBtn, messageWrapper.firstChild);
        }
    };

    const loadFriendRequests = async () => {
        const { data: incoming } = await supabase
            .from('friendships')
            .select('*, requester:profiles!friendships_user_id_fkey(*)')
            .eq('friend_id', currentUser.id)
            .eq('status', 'pending');

        const { data: outgoing } = await supabase
            .from('friendships')
            .select('*, recipient:profiles!friendships_friend_id_fkey(*)')
            .eq('user_id', currentUser.id)
            .eq('status', 'pending');

        friendRequests = incoming || [];
        pendingRequests = outgoing || [];
    };

    const loadBlockedUsers = async () => {
        const { data: blocks } = await supabase
            .from('blocked_users')
            .select('blocked_user_id')
            .eq('user_id', currentUser.id);

        blockedUsers = new Set((blocks || []).map(b => b.blocked_user_id));
    };

    const subscribeToFriendRequests = () => {
        if (!currentUser || !currentUser.id) return;

        const channel = supabase
            .channel('friend-requests-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'friendships'
            }, async (payload) => {
                if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                    if (payload.new.friend_id === currentUser.id && payload.new.status === 'pending') {
                        await loadFriendRequests();
                        showNotification('New friend request received!');
                    } else if (payload.new.status === 'accepted') {
                        await loadFriends();
                        await updateConversationsList();
                    }
                } else if (payload.eventType === 'DELETE') {
                    await loadFriends();
                    await loadFriendRequests();
                    await updateConversationsList();
                }
            })
            .subscribe();

        subscriptions.push(channel);
    };

    const subscribeToFriendships = () => {
        if (!currentUser || !currentUser.id) return;

        const channel = supabase
            .channel('friendships-changes')
            .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: 'friendships'
            }, async () => {
                await loadFriends();
                await updateConversationsList();
            })
            .subscribe();

        subscriptions.push(channel);
    };

    const subscribeToCallInvites = () => {
        if (!currentUser || !currentUser.id) return;

        const channel = supabase
            .channel('call-invites-changes')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'call_invites',
                filter: `callee_id=eq.${currentUser.id}`
            }, async (payload) => {
                if (payload.new.status === 'pending') {
                    const { data: caller } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', payload.new.caller_id)
                        .single();

                    if (caller) {
                        ui.callerName.textContent = caller.username;
                        ui.callerAvatar.textContent = caller.username[0].toUpperCase();
                        if (caller.avatar_url) {
                            ui.callerAvatar.innerHTML = `<img src="${caller.avatar_url}" alt="${caller.username}">`;
                        }

                        incomingCallData = { from: caller.id, callInviteId: payload.new.id };
                        showModal(ui.incomingCallModal);
                        ui.incomingCallAudio.play();
                    }
                }
            })
            .subscribe();

        subscriptions.push(channel);
    };

    const subscribeToPresence = () => {
        if (!currentUser || !currentUser.id) return;

        const channel = supabase.channel('online-users');

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState();
                onlineUsers.clear();
                Object.values(state).forEach(presences => {
                    presences.forEach(p => onlineUsers.add(p.user_id));
                });
                updateConversationsList();
            })
            .on('presence', { event: 'join' }, ({ newPresences }) => {
                newPresences.forEach(p => onlineUsers.add(p.user_id));
                updateConversationsList();
            })
            .on('presence', { event: 'leave' }, ({ leftPresences }) => {
                leftPresences.forEach(p => onlineUsers.delete(p.user_id));
                updateConversationsList();
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({ user_id: currentUser.id });
                }
            });

        subscriptions.push(channel);
    };

    ui.showSignup.onclick = (e) => {
        e.preventDefault();
        ui.loginForm.classList.add('hidden');
        ui.signupForm.classList.remove('hidden');
        ui.authStatus.textContent = '';
    };

    ui.showLogin.onclick = (e) => {
        e.preventDefault();
        ui.signupForm.classList.add('hidden');
        ui.loginForm.classList.remove('hidden');
        ui.authStatus.textContent = '';
    };

    const subscribeToMessages = () => {
        if (!currentUser || !currentUser.id) {
            console.error('Cannot subscribe to messages: currentUser not loaded');
            return;
        }

        const channel = supabase
            .channel('messages-changes')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `or(receiver_id=eq.${currentUser.id},sender_id=eq.${currentUser.id})`
            }, async (payload) => {
                await handleNewMessage(payload.new);
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'messages'
            }, (payload) => {
                updateMessageInUI(payload.new);
            })
            .on('postgres_changes', {
                event: 'DELETE',
                schema: 'public',
                table: 'messages'
            }, (payload) => {
                removeMessageFromUI(payload.old.id);
            })
            .subscribe();

        subscriptions.push(channel);
    };

    const checkPendingCallInvites = async () => {
        const { data: pendingCalls } = await supabase
            .from('call_invites')
            .select('*, caller:profiles!call_invites_caller_id_fkey(*)')
            .eq('callee_id', currentUser.id)
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (pendingCalls && pendingCalls.length > 0) {
            const latestCall = pendingCalls[0];
            const caller = latestCall.caller;

            ui.callerName.textContent = caller.username;
            ui.callerAvatar.textContent = caller.username[0].toUpperCase();
            if (caller.avatar_url) {
                ui.callerAvatar.innerHTML = `<img src="${caller.avatar_url}" alt="${caller.username}">`;
            }

            incomingCallData = { from: caller.id, callInviteId: latestCall.id };
            showModal(ui.incomingCallModal);
            ui.incomingCallAudio.play();
        }
    };

    const handleNewMessage = async (message) => {
        if (blockedUsers.has(message.sender_id)) return;

        if (document.querySelector(`[data-message-id="${message.id}"]`)) return;

        const { data: sender } = await supabase.from('profiles').select('*').eq('id', message.sender_id).single();
        if (!sender) return;

        await updateConversationsList();

        if (message.sender_id === currentUser.id) {
            if (currentChatType === 'friend' && currentChatFriend?.id === message.receiver_id) {
                displayMessage(message, currentUser);
                scrollToBottom();
            }
            return;
        }

        const shouldNotify = !isTabVisible || (currentChatType !== 'friend' || currentChatFriend?.id !== message.sender_id);

        if (currentChatType === 'friend' && currentChatFriend?.id === message.sender_id) {
            displayMessage(message, sender);
            if (userSettings.readReceipts) {
                await supabase.from('messages').update({ read: true }).eq('id', message.id);
            }
            scrollToBottom();
        }

        if (shouldNotify) {
            if (userSettings.notifications && 'Notification' in window && Notification.permission === 'granted') {
                new Notification(`New message from ${sender.username}`, {
                    body: message.content || 'Sent a file',
                    icon: sender.avatar_url || '/icon.png',
                    tag: message.id
                });
            }
            if (userSettings.messageSound) {
                playMessageSound();
            }
        }
    };

    const updateMessageInUI = (message) => {
        const msgElement = document.querySelector(`[data-message-id="${message.id}"]`);
        if (msgElement) {
            const contentElement = msgElement.querySelector('.message-content');
            if (contentElement) {
                contentElement.textContent = message.content;
                const editedBadge = msgElement.querySelector('.message-edited') || document.createElement('span');
                editedBadge.className = 'message-edited';
                editedBadge.textContent = '(edited)';
                if (!msgElement.querySelector('.message-edited')) {
                    contentElement.appendChild(editedBadge);
                }
            }
        }
    };

    const removeMessageFromUI = (messageId) => {
        const msgElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (msgElement) {
            msgElement.remove();
        }
    };

    let updateConversationsTimeout = null;
    let isUpdatingConversations = false;
    let renderConversationsTimeout = null;
    let isRenderingConversations = false;

    const updateConversationsList = async () => {
        if (isUpdatingConversations) {
            return;
        }

        isUpdatingConversations = true;

        conversations = [];

        for (const friendId in friends) {
            const friend = friends[friendId];
            const { data: messages } = await supabase
                .from('messages')
                .select('*')
                .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${currentUser.id})`)
                .order('created_at', { ascending: false })
                .limit(1);

            const lastMessage = messages?.[0];
            conversations.push({
                type: 'friend',
                id: friendId,
                data: friend,
                lastMessage: lastMessage,
                timestamp: lastMessage?.created_at || friend.created_at
            });
        }

        conversations.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        clearTimeout(renderConversationsTimeout);
        renderConversationsTimeout = setTimeout(renderConversationsList, 200);

        clearTimeout(updateConversationsTimeout);
        updateConversationsTimeout = setTimeout(() => {
            isUpdatingConversations = false;
        }, 500);
    };

    const renderConversationsList = () => {
        if (isRenderingConversations) {
            return;
        }

        isRenderingConversations = true;

        let html = '';

        if (friendRequests.length > 0) {
            html += `<div class="list-header">Friend Requests (${friendRequests.length})</div>`;
            html += `<div class="friend-item" onclick="window.showFriendRequestsModal()">
                <div class="avatar"><i class="fa-solid fa-user-plus"></i></div>
                <div class="friend-info">
                    <div class="friend-name">Pending Requests</div>
                    <div class="friend-status">${friendRequests.length} request${friendRequests.length !== 1 ? 's' : ''}</div>
                </div>
            </div>`;
        }

        if (conversations.length > 0) {
            html += '<div class="list-header">Messages</div>';
            conversations.forEach(conv => {
                if (conv.type === 'friend') {
                    const friend = conv.data;
                    const isOnline = onlineUsers.has(friend.id);
                    const isBlocked = blockedUsers.has(friend.id);
                    if (!isBlocked) {
                        html += `
                            <div class="friend-item" data-friend-id="${friend.id}" onclick="window.openChat('${friend.id}', 'friend')">
                                <div class="avatar-wrapper">
                                    <div class="avatar">${friend.avatar_url ? `<img src="${friend.avatar_url}" alt="${friend.username}">` : friend.username[0].toUpperCase()}</div>
                                    <div class="status-indicator ${isOnline ? 'online' : ''}"></div>
                                </div>
                                <div class="friend-info">
                                    <div class="friend-name">${friend.username}</div>
                                    <div class="friend-status">${conv.lastMessage ? (conv.lastMessage.sender_id === currentUser.id ? 'You: ' : '') + (conv.lastMessage.content?.substring(0, 30) || 'Sent a file') : 'No messages yet'}</div>
                                </div>
                            </div>
                        `;
                    }
                }
            });
        } else {
            html += '<div class="list-header">No conversations yet</div>';
        }

        ui.friendsList.innerHTML = html;

        clearTimeout(renderConversationsTimeout);
        renderConversationsTimeout = setTimeout(() => {
            isRenderingConversations = false;
        }, 500);
    };

    window.showFriendRequestsModal = () => {
        showModal(ui.friendRequestsModal);
        renderFriendRequests();
    };

    const renderFriendRequests = () => {
        if (friendRequests.length === 0) {
            ui.requestsList.innerHTML = '<p style="text-align: center; color: var(--secondary-text); padding: 2rem;">No pending requests</p>';
            return;
        }

        let html = '';
        friendRequests.forEach(request => {
            const requester = request.requester;
            html += `
                <div class="request-item" data-request-id="${request.id}">
                    <div class="avatar">${requester.avatar_url ? `<img src="${requester.avatar_url}" alt="${requester.username}">` : requester.username[0].toUpperCase()}</div>
                    <div class="request-info">
                        <div class="request-username">${requester.username}</div>
                        <div class="request-time">${formatTimeAgo(request.created_at)}</div>
                    </div>
                    <div class="request-actions">
                        <button onclick="window.acceptFriendRequest('${request.id}')" style="background-color: var(--success);" title="Accept"><i class="fa-solid fa-check"></i></button>
                        <button onclick="window.declineFriendRequest('${request.id}')" style="background-color: var(--error);" title="Decline"><i class="fa-solid fa-times"></i></button>
                    </div>
                </div>
            `;
        });

        ui.requestsList.innerHTML = html;
    };

    window.acceptFriendRequest = async (requestId) => {
        await supabase.from('friendships').update({ status: 'accepted' }).eq('id', requestId);
        await loadFriends();
        await loadFriendRequests();
        renderFriendRequests();
        await updateConversationsList();
    };

    window.declineFriendRequest = async (requestId) => {
        await supabase.from('friendships').delete().eq('id', requestId);
        await loadFriendRequests();
        renderFriendRequests();
    };

    window.openChat = async (id, type) => {
        currentChatType = type;

        if (type === 'friend') {
            currentChatFriend = friends[id];
            if (!currentChatFriend) return;

            ui.chatFriendName.textContent = currentChatFriend.username;
            ui.chatAvatar.textContent = currentChatFriend.username[0].toUpperCase();

            const isOnline = onlineUsers.has(currentChatFriend.id);
            ui.chatStatusText.textContent = isOnline ? 'Online' : 'Offline';
            ui.chatStatusText.classList.remove('hidden');

            if (currentChatFriend.avatar_url) {
                ui.chatAvatar.innerHTML = `<img src="${currentChatFriend.avatar_url}" alt="${currentChatFriend.username}">`;
            }

            ui.chatFriendStatus.classList.toggle('online', onlineUsers.has(currentChatFriend.id));

            await loadMessages(currentChatFriend.id);
            subscribeToTypingIndicators(id);
        }

        ui.welcomeScreen.classList.add('hidden');
        ui.chatView.classList.remove('hidden');

        const friendInfo = document.querySelector('#chat-header .friend-info');
        if (friendInfo) {
            friendInfo.onclick = () => {
                if (currentChatType === 'friend') {
                    ui.profileUsername.textContent = currentChatFriend.username;
                    ui.profileUsernameValue.textContent = currentChatFriend.username;
                    ui.profileAvatar.textContent = currentChatFriend.username[0].toUpperCase();

                    if (currentChatFriend.avatar_url) {
                        ui.profileAvatar.innerHTML = `<img src="${currentChatFriend.avatar_url}" alt="${currentChatFriend.username}">`;
                    }

                    const isOnline = onlineUsers.has(currentChatFriend.id);
                    ui.profileStatusDot.classList.toggle('online', isOnline);
                    ui.profileStatusText.textContent = isOnline ? 'Online' : 'Offline';

                    const joinedDate = new Date(currentChatFriend.created_at).toLocaleDateString();
                    ui.profileJoinedDate.textContent = joinedDate;

                    showModal(ui.friendProfileModal);
                }
            };
        }

        initializeMessageSwipe();

        if (window.innerWidth <= 768) {
            ui.sidebar.classList.add('hidden');
            ui.chatContainer.classList.add('active');
        }

        document.querySelectorAll('.friend-item').forEach(item => item.classList.remove('active'));
        const activeItem = document.querySelector(`[data-friend-id="${id}"]`);
        if (activeItem) activeItem.classList.add('active');
    };

    const subscribeToTypingIndicators = (friendId) => {
        subscriptions.forEach(sub => {
            if (sub && sub.topic && sub.topic.includes('typing-')) {
                sub.unsubscribe();
            }
        });

        const typingChannel = supabase.channel(`typing-${currentUser.id}-${friendId}`);

        typingChannel
            .on('broadcast', { event: 'typing' }, (payload) => {
                if (payload.payload.userId !== currentUser.id) {
                    if (payload.payload.isTyping) {
                        showTypingIndicator(friendId);
                    } else {
                        hideTypingIndicator(friendId);
                    }
                }
            })
            .subscribe();

        subscriptions.push(typingChannel);
    };

    const showTypingIndicator = (friendId) => {
        const friend = friends[friendId];
        if (!friend || currentChatType !== 'friend' || currentChatFriend?.id !== friendId) return;

        if (!ui.typingIndicator) {
            const indicator = document.createElement('div');
            indicator.id = 'typing-indicator';
            indicator.className = 'typing-indicator';
            indicator.innerHTML = `
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <span class="typing-text">${friend.username} is typing...</span>
            `;
            indicator.style.cssText = `
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem 1rem;
                color: var(--secondary-text);
                font-size: 0.85rem;
                font-style: italic;
            `;

            const dots = indicator.querySelector('.typing-dots');
            dots.style.cssText = `
                display: flex;
                gap: 0.25rem;
            `;

            dots.querySelectorAll('span').forEach((span, i) => {
                span.style.cssText = `
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: var(--secondary-text);
                    animation: typing-bounce 1.4s infinite ease-in-out;
                    animation-delay: ${i * 0.2}s;
                `;
            });

            ui.messagesContainer.appendChild(indicator);
            ui.typingIndicator = indicator;
            scrollToBottom();
        }
    };

    const hideTypingIndicator = (friendId) => {
        if (ui.typingIndicator) {
            ui.typingIndicator.remove();
            ui.typingIndicator = null;
        }
    };

    const loadMessages = async (friendId) => {
        const { data: messages } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${currentUser.id})`)
            .order('created_at', { ascending: true });

        ui.messagesContainer.innerHTML = '';
        for (const message of messages || []) {
            const sender = message.sender_id === currentUser.id ? currentUser : currentChatFriend;
            displayMessage(message, sender);
        }

        if (userSettings.readReceipts) {
            await supabase.from('messages')
                .update({ read: true })
                .eq('receiver_id', currentUser.id)
                .eq('sender_id', friendId);
        }

        scrollToBottom();
    };

    const displayMessage = (message, sender) => {
        if (document.querySelector(`[data-message-id="${message.id}"]`)) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender_id === currentUser.id ? 'sent' : 'received'}`;
        messageDiv.dataset.messageId = message.id;

        const isMobile = window.innerWidth <= 768;
        const isSent = message.sender_id === currentUser.id;

        let content = '';

        if (message.reply_to_id) {
            const replyText = message.reply_to_content || 'Original message';
            content += `<div class="message-reply-context" style="background: rgba(88, 101, 242, 0.1); padding: 0.5rem; border-left: 3px solid var(--primary-accent); margin-bottom: 0.5rem; border-radius: 4px; font-size: 0.85rem;"><i class="fa-solid fa-reply"></i> ${escapeHtml(replyText.substring(0, 50))}${replyText.length > 50 ? '...' : ''}</div>`;
        }

        if (message.file_url) {
            const fileType = message.file_type || 'file';
            if (fileType.startsWith('image/')) {
                content += `<img src="${message.file_url}" alt="Image" class="message-image" onclick="window.open('${message.file_url}', '_blank')" style="max-width: 300px; border-radius: var(--button-border-radius); cursor: pointer; display: block;">`;
            } else if (fileType.startsWith('audio/')) {
                content += `<audio controls src="${message.file_url}" class="message-audio" style="max-width: 100%;"></audio>`;
            } else {
                content += `<a href="${message.file_url}" target="_blank" class="message-file" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: var(--tertiary-bg); border-radius: var(--button-border-radius); text-decoration: none; color: var(--primary-text);"><i class="fa-solid fa-file"></i> ${message.file_name || 'File'}</a>`;
            }
        }

        if (message.content) {
            content += `<div class="message-content">${escapeHtml(message.content)}${message.edited ? '<span class="message-edited" style="font-size: 0.75rem; color: var(--secondary-text); margin-left: 0.5rem;">(edited)</span>' : ''}</div>`;
        }

        if (message.call_duration !== null && message.call_duration !== undefined) {
            const caller = message.sender_id === currentUser.id ? 'You' : sender.username;
            const duration = formatCallDuration(message.call_duration);
            content = `<div class="message-call-info" style="display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-phone"></i> ${caller} called at ${duration}</div>`;
        }

        content += `<div class="message-reactions" data-message-id="${message.id}" style="display: flex; flex-wrap: wrap; gap: 0.25rem; margin-top: 0.25rem;"></div>`;

        const timestamp = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        if (isMobile) {
            const timestampDiv = document.createElement('div');
            timestampDiv.className = 'message-timestamp-reveal';
            timestampDiv.textContent = timestamp;
            timestampDiv.style.cssText = `
            position: absolute;
            bottom: 0.25rem;
            font-size: 0.75rem;
            color: var(--secondary-text);
            opacity: 0;
            transition: opacity 0.2s ease;
            pointer-events: none;
            ${isSent ? 'right: 0.5rem;' : 'left: 0.5rem;'}
        `;

            const contentWrapper = document.createElement('div');
            contentWrapper.innerHTML = content;
            contentWrapper.style.cssText = 'position: relative;';

            messageDiv.appendChild(contentWrapper);
            messageDiv.appendChild(timestampDiv);

            setupMessageSwipe(contentWrapper, isSent);
        } else {
            const contentWrapper = document.createElement('div');
            contentWrapper.innerHTML = content;
            messageDiv.appendChild(contentWrapper);

            const timestampDiv = document.createElement('div');
            timestampDiv.className = 'message-timestamp';
            timestampDiv.textContent = timestamp;
            timestampDiv.style.cssText = `
            font-size: 0.7rem;
            color: var(--secondary-text);
            margin-top: 0.25rem;
            text-align: ${isSent ? 'right' : 'left'};
        `;
            messageDiv.appendChild(timestampDiv);
        }

        if (message.sender_id === currentUser.id) {
            messageDiv.addEventListener('contextmenu', (e) => showMessageContextMenu(e, message));
            messageDiv.addEventListener('click', (e) => {
                if (e.target.closest('.message-content') && !e.target.closest('.message-reaction')) {
                    showMessageContextMenu(e, message);
                }
            });
        }

        messageDiv.addEventListener('click', (e) => {
            if (e.target.classList.contains('message-reaction')) {
                toggleReaction(message.id, e.target.dataset.emoji);
            }
        });

        ui.messagesContainer.appendChild(messageDiv);

        if (message.reactions) {
            renderReactions(message.id, message.reactions);
        }
    };

    const setupMessageSwipe = (element, isSent) => {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });

        element.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = currentX - startX;

            const maxSwipe = 80;

            const swipeAmount = isSent ? Math.min(Math.max(diff, -maxSwipe), 0) : Math.max(Math.min(diff, maxSwipe), 0);

            element.style.transform = `translateX(${swipeAmount}px)`;

            const timestamp = element.parentElement.querySelector('.message-timestamp-reveal');
            if (timestamp) {
                timestamp.style.opacity = Math.abs(swipeAmount) / maxSwipe;
            }
        });

        element.addEventListener('touchend', () => {
            isDragging = false;
            element.style.transform = 'translateX(0)';

            const timestamp = element.parentElement.querySelector('.message-timestamp-reveal');
            if (timestamp) {
                timestamp.style.opacity = 0;
            }
        });
    };

    const showMessageContextMenu = (e, message) => {
        e.preventDefault();
        e.stopPropagation();

        const existingMenu = document.querySelector('.context-menu');
        if (existingMenu) existingMenu.remove();

        const menu = document.createElement('div');
        menu.className = 'context-menu';
        menu.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        background: var(--secondary-bg);
        border: 1px solid var(--border-color);
        border-radius: var(--card-border-radius);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        min-width: 150px;
        padding: 0.5rem 0;
    `;

        const items = [
            { icon: 'fa-reply', text: 'Reply', action: () => window.replyToMessage(message.id, message.content || 'File') },
            { icon: 'fa-face-smile', text: 'React', action: () => window.addReaction(message.id) }
        ];

        if (message.content && message.sender_id === currentUser.id) {
            items.push({ icon: 'fa-edit', text: 'Edit', action: () => window.editMessage(message.id, message.content) });
        }

        if (message.sender_id === currentUser.id) {
            items.push({ icon: 'fa-trash', text: 'Delete', action: () => window.deleteMessage(message.id), danger: true });
        }

        items.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'context-menu-item';
            menuItem.innerHTML = `<i class="fa-solid ${item.icon}"></i> ${item.text}`;
            menuItem.style.cssText = `
            padding: 0.75rem 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            transition: var(--transition-fast);
            ${item.danger ? 'color: var(--error);' : ''}
        `;
            menuItem.onmouseover = () => menuItem.style.background = 'var(--tertiary-bg)';
            menuItem.onmouseout = () => menuItem.style.background = 'transparent';
            menuItem.onclick = () => {
                item.action();
                menu.remove();
            };
            menu.appendChild(menuItem);
        });

        document.body.appendChild(menu);

        const closeMenu = (e) => {
            if (!menu.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        setTimeout(() => document.addEventListener('click', closeMenu), 10);
    };

    if (ui.fileInput) {
        ui.fileInput.addEventListener('change', async (e) => {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            pendingFiles = files;

            ui.filePreviewContent.innerHTML = '';
            files.forEach(file => {
                const filePreview = document.createElement('div');
                filePreview.style.cssText = 'margin-bottom: 1rem;';

                if (file.type.startsWith('image/')) {
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(file);
                    img.style.cssText = 'max-width: 100%; max-height: 300px; border-radius: var(--button-border-radius);';
                    filePreview.appendChild(img);
                } else {
                    filePreview.innerHTML = `<div style="padding: 1rem; background: var(--tertiary-bg); border-radius: var(--button-border-radius); display: flex; align-items: center; gap: 0.5rem;"><i class="fa-solid fa-file"></i> ${file.name}</div>`;
                }

                ui.filePreviewContent.appendChild(filePreview);
            });

            showModal(ui.filePreviewModal);
            e.target.value = '';
        });
    }

    window.replyToMessage = (messageId, content) => {
        replyingTo = { id: messageId, content };
        ui.replyPreviewText.textContent = content.substring(0, 100);
        ui.replyPreview.classList.remove('hidden');
        ui.messageInput.focus();
    };

    ui.cancelReplyBtn.onclick = () => {
        replyingTo = null;
        ui.replyPreview.classList.add('hidden');
    };

    window.editMessage = (messageId, content) => {
        editingMessage = { id: messageId, type: 'message' };
        ui.editMessageInput.value = content;
        showModal(ui.editMessageModal);
    };

    ui.editMessageForm.onsubmit = async (e) => {
        e.preventDefault();
        const newContent = ui.editMessageInput.value.trim();
        if (!newContent || !editingMessage) return;

        const table = 'messages';
        await supabase.from(table).update({
            content: newContent,
            edited: true
        }).eq('id', editingMessage.id);

        editingMessage = null;
        hideModal();
    };

    window.deleteMessage = async (messageId) => {
        showConfirmationModal('Delete this message?', 'This action cannot be undone.', async () => {
            await supabase.from('messages').delete().eq('id', messageId);
        });
    };

    const showConfirmationModal = (title, message, onConfirm) => {
        ui.confirmationTitle.textContent = title;
        ui.confirmationMessage.textContent = message;
        showModal(ui.confirmationModal);

        ui.confirmBtn.onclick = async () => {
            await onConfirm();
            hideModal();
        };

        ui.cancelBtn.onclick = () => {
            hideModal();
        };
    };

    const showInfoModal = (title, message) => {
        ui.infoTitle.textContent = title;
        ui.infoMessage.textContent = message;
        showModal(ui.infoModal);

        ui.infoOkBtn.onclick = () => {
            hideModal();
        };
    };

    window.addReaction = async (messageId) => {
        const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡', '🎉', '🔥'];

        const picker = document.createElement('div');
        picker.className = 'emoji-picker';
        picker.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--secondary-bg);
        padding: 1rem;
        border-radius: var(--card-border-radius);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5rem;
    `;

        emojis.forEach(emoji => {
            const btn = document.createElement('button');
            btn.textContent = emoji;
            btn.style.cssText = `
            font-size: 2rem;
            padding: 0.5rem;
            background: none;
            border: none;
            cursor: pointer;
            border-radius: var(--button-border-radius);
            transition: var(--transition-fast);
        `;
            btn.onmouseover = () => btn.style.background = 'var(--tertiary-bg)';
            btn.onmouseout = () => btn.style.background = 'none';
            btn.onclick = async () => {
                await toggleReaction(messageId, emoji);
                document.body.removeChild(backdrop);
            };
            picker.appendChild(btn);
        });

        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
        backdrop.onclick = (e) => {
            if (e.target === backdrop) {
                document.body.removeChild(backdrop);
            }
        };

        backdrop.appendChild(picker);
        document.body.appendChild(backdrop);
    };

    const toggleReaction = async (messageId, emoji) => {
        const { data: message } = await supabase.from('messages').select('reactions').eq('id', messageId).single();
        let reactions = message?.reactions || {};

        if (!reactions[emoji]) {
            reactions[emoji] = [];
        }

        const userIndex = reactions[emoji].indexOf(currentUser.id);
        if (userIndex > -1) {
            reactions[emoji].splice(userIndex, 1);
            if (reactions[emoji].length === 0) {
                delete reactions[emoji];
            }
        } else {
            reactions[emoji].push(currentUser.id);
        }

        await supabase.from('messages').update({ reactions }).eq('id', messageId);
        renderReactions(messageId, reactions);
    };

    const renderReactions = (messageId, reactions) => {
        const container = document.querySelector(`[data-message-id="${messageId}"] .message-reactions`);
        if (!container) return;

        let html = '';
        for (const [emoji, users] of Object.entries(reactions)) {
            if (users.length > 0) {
                const hasReacted = users.includes(currentUser.id);
                html += `<span class="message-reaction ${hasReacted ? 'reacted' : ''}" data-emoji="${emoji}">${emoji} ${users.length}</span>`;
            }
        }
        container.innerHTML = html;
    };

    const scrollToBottom = () => {
        ui.messagesContainer.scrollTop = ui.messagesContainer.scrollHeight;
    };

    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const then = new Date(timestamp);
        const diff = now - then;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    const formatCallDuration = (seconds) => {
        if (seconds === 0) return 'Missed';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    const showNotification = (message) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Peer 2 Peer', { body: message });
        }
    };

    const playMessageSound = () => {
        const audio = new Audio('/audios/message.mp3');
        audio.play().catch(() => { });
    };

    ui.messageForm.onsubmit = async (e) => {
        e.preventDefault();
        const content = ui.messageInput.value.trim();
        if (!content && pendingFiles.length === 0) return;

        const messageData = {
            content,
            sender_id: currentUser.id,
            created_at: new Date().toISOString()
        };

        if (replyingTo) {
            messageData.reply_to_id = replyingTo.id;
            messageData.reply_to_content = replyingTo.content;
        }

        if (pendingFiles.length > 0) {
            const file = pendingFiles[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${currentUser.id}-avatar.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            const { data: uploadData } = await supabase.storage
                .from('files')
                .upload(filePath, file);

            if (uploadData) {
                const { data: { publicUrl } } = supabase.storage
                    .from('files')
                    .getPublicUrl(filePath);

                messageData.file_url = publicUrl;
                messageData.file_type = file.type;
                messageData.file_name = file.name;
            }

            pendingFiles = [];
        }

        const tempId = `temp-${Date.now()}`;
        messageData.id = tempId;

        if (currentChatType === 'friend') {
            messageData.receiver_id = currentChatFriend.id;

            displayMessage(messageData, currentUser);
            scrollToBottom();

            const { data: insertedMessage } = await supabase.from('messages').insert([messageData]).select().single();

            if (insertedMessage) {
                const tempElement = document.querySelector(`[data-message-id="${tempId}"]`);
                if (tempElement) {
                    tempElement.dataset.messageId = insertedMessage.id;
                }
            }
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            return;
        }

        ui.messageInput.value = '';
        ui.messageInput.style.height = 'auto';
        replyingTo = null;
        ui.replyPreview.classList.add('hidden');
        await updateConversationsList();
    };

    ui.messageInput.addEventListener('input', () => {
        adjustTextareaHeight();

        if (typingTimeout) clearTimeout(typingTimeout);

        if (currentChatType === 'friend' && currentChatFriend) {
            const typingChannel = supabase.channel(`typing-${currentUser.id}-${currentChatFriend.id}`);

            typingChannel.send({
                type: 'broadcast',
                event: 'typing',
                payload: { isTyping: true, userId: currentUser.id }
            });
        }

        typingTimeout = setTimeout(() => {
            if (currentChatType === 'friend' && currentChatFriend) {
                const typingChannel = supabase.channel(`typing-${currentUser.id}-${currentChatFriend.id}`);

                typingChannel.send({
                    type: 'broadcast',
                    event: 'typing',
                    payload: { isTyping: false, userId: currentUser.id }
                });
            }
        }, 1000);
    });

    ui.fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        pendingFiles = files;

        ui.filePreviewContent.innerHTML = '';
        files.forEach(file => {
            const filePreview = document.createElement('div');
            filePreview.className = 'file-preview-item';

            if (file.type.startsWith('image/')) {
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.style.maxWidth = '100%';
                img.style.maxHeight = '300px';
                filePreview.appendChild(img);
            } else {
                filePreview.innerHTML = `<i class="fa-solid fa-file"></i> ${file.name}`;
            }

            ui.filePreviewContent.appendChild(filePreview);
        });

        showModal(ui.filePreviewModal);
    });

    ui.fileSendForm.onsubmit = async (e) => {
        e.preventDefault();
        const caption = ui.fileCaptionInput.value.trim();

        ui.messageInput.value = caption;
        hideModal();
        ui.fileCaptionInput.value = '';

        ui.messageForm.dispatchEvent(new Event('submit'));
    };

    ui.addFriendForm.onsubmit = async (e) => {
        e.preventDefault();
        const username = ui.friendUsernameInput.value.trim();
        if (!username) return;

        const { data: targetUser } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .single();

        if (!targetUser) {
            showInfoModal('User not found', 'The username you entered does not exist.');
            return;
        }

        if (targetUser.id === currentUser.id) {
            showInfoModal('Cannot add yourself', 'You cannot add yourself as a friend.');
            return;
        }

        const { data: existing } = await supabase
            .from('friendships')
            .select('*')
            .or(`and(user_id.eq.${currentUser.id},friend_id.eq.${targetUser.id}),and(user_id.eq.${targetUser.id},friend_id.eq.${currentUser.id})`)
            .single();

        if (existing) {
            showInfoModal('Request exists', 'Friend request already exists or you are already friends.');
            return;
        }

        await supabase.from('friendships').insert([{
            user_id: currentUser.id,
            friend_id: targetUser.id,
            status: 'pending'
        }]);

        ui.friendUsernameInput.value = '';
        hideModal();
        showInfoModal('Request sent', 'Friend request sent successfully!');
    };

    const showModal = (modal) => {
        ui.modalContainer.classList.remove('hidden');

        const modalContent = document.getElementById('modal-content');
        const allModals = modalContent.querySelectorAll('#modal-content > div:not(.close-btn)');
        allModals.forEach(m => m.classList.add('hidden'));

        if (typeof modal === 'string') {
            const dynamicModals = modalContent.querySelectorAll('.dynamic-modal');
            dynamicModals.forEach(dm => dm.remove());

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = modal;
            const newModal = tempDiv.firstElementChild;
            if (newModal) {
                modalContent.appendChild(newModal);
            }
        } else if (modal && modal.classList) {
            modal.classList.remove('hidden');
        }
    };

    const hideModal = () => {
        ui.modalContainer.classList.add('hidden');

        const modalContent = document.getElementById('modal-content');
        const dynamicModals = modalContent.querySelectorAll('.dynamic-modal');
        dynamicModals.forEach(dm => dm.remove());
    };

    ui.closeModalBtn.onclick = hideModal;
    ui.modalContainer.onclick = (e) => {
        if (e.target === ui.modalContainer) hideModal();
    };

    document.addEventListener('click', (e) => {
        if (ui.modalContainer && !ui.modalContainer.classList.contains('hidden')) {
            const modalContent = document.getElementById('modal-content');
            if (modalContent && !modalContent.contains(e.target) && e.target === ui.modalContainer) {
                hideModal();
            }
        }
    });

    ui.addFriendBtn.onclick = () => {
        showModal(ui.addFriendModal);
    };

    ui.backToFriendsBtn.onclick = () => {
        ui.sidebar.classList.remove('hidden');
        ui.chatContainer.classList.remove('active');
    };

    ui.viewProfileBtn.onclick = async () => {
        if (currentChatType === 'friend') {
            ui.profileUsername.textContent = currentChatFriend.username;
            ui.profileUsernameValue.textContent = currentChatFriend.username;
            ui.profileAvatar.textContent = currentChatFriend.username[0].toUpperCase();

            if (currentChatFriend.avatar_url) {
                ui.profileAvatar.innerHTML = `<img src="${currentChatFriend.avatar_url}" alt="${currentChatFriend.username}">`;
            }

            const isOnline = onlineUsers.has(currentChatFriend.id);
            ui.profileStatusDot.classList.toggle('online', isOnline);
            ui.profileStatusText.textContent = isOnline ? 'Online' : 'Offline';

            const joinedDate = new Date(currentChatFriend.created_at).toLocaleDateString();
            ui.profileJoinedDate.textContent = joinedDate;

            hideModal();
            showModal(ui.friendProfileModal);
        }
    };

    ui.blockUserBtn.onclick = async () => {
        if (currentChatType === 'friend') {
            showConfirmationModal(`Block ${currentChatFriend.username}?`, 'This user will be blocked and you will not receive messages from them.', async () => {
                await supabase.from('blocked_users').insert([{
                    user_id: currentUser.id,
                    blocked_user_id: currentChatFriend.id
                }]);

                await loadBlockedUsers();
                hideModal();
                ui.chatView.classList.add('hidden');
                ui.welcomeScreen.classList.remove('hidden');
                await updateConversationsList();
            });
        }
    };

    ui.unfriendBtn.onclick = async () => {
        if (currentChatType === 'friend') {
            showConfirmationModal(`Remove ${currentChatFriend.username}?`, 'This user will be removed from your friends list.', async () => {
                await supabase.from('friendships').delete()
                    .or(`and(user_id.eq.${currentUser.id}, friend_id.eq.${currentChatFriend.id}), and(user_id.eq.${currentChatFriend.id}, friend_id.eq.${currentUser.id})`);

                await loadFriends();
                hideModal();
                ui.chatView.classList.add('hidden');
                ui.welcomeScreen.classList.remove('hidden');

                if (window.innerWidth <= 768) {
                    ui.sidebar.classList.remove('hidden');
                }

                await updateConversationsList();
            });
        }
    };

    ui.settingsBtn.onclick = () => {
        showSettingsModal();
    };

    ui.logoutBtn.onclick = async () => {
        showConfirmationModal('Logout', 'Are you sure you want to logout?', async () => {
            await supabase.auth.signOut();
            location.reload();
        });
    };

    ui.loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;

        if (!username || !password) {
            showInfoModal('Invalid credentials', 'Please enter both username and password.');
            return;
        }

        try {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('email')
                .eq('username', username)
                .maybeSingle();

            if (profileError && profileError.code !== 'PGRST116') {
                console.error('Profile lookup error:', profileError);
                showInfoModal('Error', 'Could not find user. Please try again.');
                return;
            }

            if (!profile) {
                showInfoModal('Username not found', 'The username you entered does not exist.');
                return;
            }

            const { error: loginError } = await supabase.auth.signInWithPassword({
                email: profile.email,
                password: password
            });

            if (loginError) {
                console.error('Login error:', loginError);
                showInfoModal('Invalid credentials', 'Incorrect username or password.');
                return;
            }

            location.reload();
        } catch (error) {
            console.error('Unexpected error:', error);
            showInfoModal('Error', 'An unexpected error occurred. Please try again.');
        }
    };

    ui.signupForm.onsubmit = async (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value;

        if (!username || username.length < 3) {
            showInfoModal('Invalid username', 'Username must be at least 3 characters long.');
            return;
        }

        if (!password || password.length < 6) {
            showInfoModal('Invalid password', 'Password must be at least 6 characters long.');
            return;
        }

        try {
            const { data: existing, error: checkError } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', username)
                .maybeSingle();

            if (checkError && checkError.code !== 'PGRST116') {
                console.error('Check error:', checkError);
                showInfoModal('Error', 'Could not verify username. Please try again.');
                return;
            }

            if (existing) {
                showInfoModal('Username taken', 'This username is already taken. Please choose another.');
                return;
            }

            const email = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@p2p.local`;

            const { data: authData, error: signupError } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        username: username
                    }
                }
            });

            if (signupError) {
                console.error('Signup error:', signupError);
                showInfoModal('Signup failed', signupError.message);
                return;
            }

            if (authData.user) {
                await new Promise(resolve => setTimeout(resolve, 500));

                const { error: updateError } = await supabase
                    .from('profiles')
                    .update({ username: username })
                    .eq('id', authData.user.id);

                if (updateError) {
                    console.error('Profile update error:', updateError);
                }

                location.reload();
            }
        } catch (error) {
            console.error('Unexpected error:', error);
            showInfoModal('Error', 'An unexpected error occurred. Please try again.');
        }
    };

    ui.fontSizeSelect.onchange = () => {
        userSettings.fontSize = ui.fontSizeSelect.value;
        saveSettings();
        applySettings();
    };

    ui.notificationsToggle.onchange = () => {
        userSettings.notifications = ui.notificationsToggle.checked;
        saveSettings();
        if (userSettings.notifications && 'Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    };

    ui.messageSoundToggle.onchange = () => {
        userSettings.messageSound = ui.messageSoundToggle.checked;
        saveSettings();
    };

    ui.onlineStatusToggle.onchange = async () => {
        userSettings.onlineStatus = ui.onlineStatusToggle.checked;
        saveSettings();
        await supabase.from('profiles').update({
            is_online: userSettings.onlineStatus
        }).eq('id', currentUser.id);
    };

    ui.readReceiptsToggle.onchange = () => {
        userSettings.readReceipts = ui.readReceiptsToggle.checked;
        saveSettings();
    };

    ui.changeAvatarBtn.onclick = () => {
        ui.avatarUpload.click();
    };

    ui.avatarUpload.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showInfoModal('Invalid file', 'Please upload an image file.');
            e.target.value = '';
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            showInfoModal('File too large', 'Please upload an image smaller than 5MB.');
            e.target.value = '';
            return;
        }

        try {
            const base64 = await fileToBase64(file);

            await supabase.from('profiles').update({
                avatar_url: base64
            }).eq('id', currentUser.id);

            currentUser.avatar_url = base64;
            ui.userAvatar.innerHTML = `<img src="${base64}" alt="${currentUser.username}">`;
            ui.settingsAvatar.innerHTML = `<img src="${base64}" alt="${currentUser.username}">`;

            showInfoModal('Success', 'Profile picture updated successfully!');
        } catch (error) {
            console.error('Upload error:', error);
            showInfoModal('Upload failed', 'Could not upload image. Please try again.');
        }

        e.target.value = '';
    };

    ui.changeUsernameBtn.onclick = () => {
        hideSettingsModal();
        showModal(ui.changeUsernameModal);
    };

    ui.changeUsernameForm.onsubmit = async (e) => {
        e.preventDefault();
        const newUsername = ui.newUsernameInput.value.trim();

        if (!newUsername || newUsername.length < 3) {
            showInfoModal('Invalid username', 'Username must be at least 3 characters long.');
            return;
        }

        try {
            const { data: existing, error: checkError } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', newUsername)
                .maybeSingle();

            if (checkError && checkError.code !== 'PGRST116') {
                console.error('Check error:', checkError);
                showInfoModal('Error', 'Could not verify username. Please try again.');
                return;
            }

            if (existing) {
                showInfoModal('Username taken', 'This username is already taken. Please choose another.');
                return;
            }

            await supabase.from('profiles').update({
                username: newUsername
            }).eq('id', currentUser.id);

            currentUser.username = newUsername;
            ui.usernameDisplay.textContent = newUsername;
            ui.settingsUsername.textContent = newUsername;
            ui.userAvatar.textContent = newUsername[0].toUpperCase();
            ui.settingsAvatar.textContent = newUsername[0].toUpperCase();

            if (currentUser.avatar_url) {
                ui.userAvatar.innerHTML = `<img src="${currentUser.avatar_url}" alt="${newUsername}">`;
                ui.settingsAvatar.innerHTML = `<img src="${currentUser.avatar_url}" alt="${newUsername}">`;
            }

            ui.newUsernameInput.value = '';
            hideModal();
            showInfoModal('Success', 'Username updated successfully!');
        } catch (error) {
            console.error('Update error:', error);
            showInfoModal('Error', 'Could not update username. Please try again.');
        }
    };

    const handleIncomingCall = (call) => {
        mediaConnection = call;
        incomingCallData = call.metadata;

        const callerId = incomingCallData.from;
        const caller = friends[callerId];

        if (!caller) {
            call.close();
            return;
        }

        ui.callerName.textContent = caller.username;
        ui.callerAvatar.textContent = caller.username[0].toUpperCase();
        if (caller.avatar_url) {
            ui.callerAvatar.innerHTML = `<img src="${caller.avatar_url}" alt="${caller.username}">`;
        }

        showModal(ui.incomingCallModal);
        ui.incomingCallAudio.play();
    };

    ui.acceptCallBtn.onclick = async () => {
        ui.incomingCallAudio.pause();
        ui.incomingCallAudio.currentTime = 0;
        hideModal();

        if (incomingCallData?.callInviteId) {
            await supabase.from('call_invites').update({ status: 'accepted' }).eq('id', incomingCallData.callInviteId);
        }

        const startTime = Date.now();

        try {
            localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

            if (mediaConnection) {
                mediaConnection.answer(localStream);

                mediaConnection.on('stream', (remoteStream) => {
                    showCallUI();
                    addVideoStream('local', localStream, currentUser);
                    addVideoStream('remote', remoteStream, friends[incomingCallData.from]);
                });

                mediaConnection.on('close', async () => {
                    const duration = Math.floor((Date.now() - startTime) / 1000);
                    await saveCallRecord(incomingCallData.from, duration);
                    if (incomingCallData?.callInviteId) {
                        await supabase.from('call_invites').update({ status: 'completed' }).eq('id', incomingCallData.callInviteId);
                    }
                    endCall();
                });
            } else {
                const { data: friendProfile } = await supabase
                    .from('profiles')
                    .select('peer_id')
                    .eq('id', incomingCallData.from)
                    .single();

                if (friendProfile?.peer_id) {
                    const call = peer.call(friendProfile.peer_id, localStream, {
                        metadata: { from: currentUser.id, callInviteId: incomingCallData.callInviteId }
                    });

                    mediaConnection = call;

                    call.on('stream', (remoteStream) => {
                        showCallUI();
                        addVideoStream('local', localStream, currentUser);
                        addVideoStream('remote', remoteStream, friends[incomingCallData.from]);
                    });

                    call.on('close', async () => {
                        const duration = Math.floor((Date.now() - startTime) / 1000);
                        await saveCallRecord(incomingCallData.from, duration);
                        if (incomingCallData?.callInviteId) {
                            await supabase.from('call_invites').update({ status: 'completed' }).eq('id', incomingCallData.callInviteId);
                        }
                        endCall();
                    });
                }
            }

        } catch (error) {
            showInfoModal('Media access denied', 'Could not access camera/microphone. Please check your permissions.');
        }
    };

    ui.declineCallBtn.onclick = async () => {
        ui.incomingCallAudio.pause();
        ui.incomingCallAudio.currentTime = 0;
        hideModal();

        if (incomingCallData?.callInviteId) {
            await supabase.from('call_invites').update({ status: 'declined' }).eq('id', incomingCallData.callInviteId);
        }

        if (mediaConnection) {
            mediaConnection.close();
            mediaConnection = null;
        }
    };

    const showOutgoingCallUI = (friendName) => {
        const callUIHTML = `
            <div id="outgoing-call-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10000; color: white;">
                <div class="avatar" style="width: 120px; height: 120px; font-size: 48px; margin-bottom: 2rem;">${friendName[0].toUpperCase()}</div>
                <h2 style="margin-bottom: 0.5rem;">Calling ${friendName}...</h2>
                <p style="color: rgba(255, 255, 255, 0.7); margin-bottom: 3rem;">Waiting for response</p>
                <button id="cancel-outgoing-call" style="padding: 1rem 2rem; background: var(--error); color: white; border: none; border-radius: var(--button-border-radius); cursor: pointer; font-size: 1rem;">
                    <i class="fa-solid fa-phone-slash"></i> Cancel
                </button>
            </div>
        `;
        const overlay = document.createElement('div');
        overlay.innerHTML = callUIHTML;
        document.body.appendChild(overlay.firstElementChild);

        document.getElementById('cancel-outgoing-call').onclick = () => {
            const outgoingOverlay = document.getElementById('outgoing-call-overlay');
            if (outgoingOverlay) outgoingOverlay.remove();
            if (mediaConnection) {
                mediaConnection.close();
                mediaConnection = null;
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
                localStream = null;
            }
        };
    };

    const hideOutgoingCallUI = () => {
        const outgoingOverlay = document.getElementById('outgoing-call-overlay');
        if (outgoingOverlay) {
            outgoingOverlay.remove();
        }
    };

    const startCall = async () => {
        if (!currentChatFriend || currentChatType !== 'friend') {
            return;
        }

        showOutgoingCallUI(currentChatFriend.username);

        const callInvite = {
            caller_id: currentUser.id,
            callee_id: currentChatFriend.id,
            status: 'pending',
            created_at: new Date().toISOString()
        };

        const { data: existingCall } = await supabase
            .from('call_invites')
            .select('*')
            .eq('caller_id', currentUser.id)
            .eq('callee_id', currentChatFriend.id)
            .eq('status', 'pending')
            .single();

        if (existingCall) {
            hideOutgoingCallUI();
            showInfoModal('Call already pending', 'You already have a pending call to this user.');
            return;
        }

        const { data: insertedInvite } = await supabase
            .from('call_invites')
            .insert([callInvite])
            .select()
            .single();


        const { data: friendProfile } = await supabase
            .from('profiles')
            .select('peer_id')
            .eq('id', currentChatFriend.id)
            .single();

        if (friendProfile?.peer_id) {
            const startTime = Date.now();

            try {
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

                const call = peer.call(friendProfile.peer_id, localStream, {
                    metadata: { from: currentUser.id, callInviteId: insertedInvite.id }
                });

                mediaConnection = call;

                call.on('stream', (remoteStream) => {
                    hideOutgoingCallUI();
                    showCallUI();
                    addVideoStream('local', localStream, currentUser);
                    addVideoStream('remote', remoteStream, currentChatFriend);
                });

                call.on('close', async () => {
                    hideOutgoingCallUI();
                    const duration = Math.floor((Date.now() - startTime) / 1000);
                    await saveCallRecord(currentChatFriend.id, duration);
                    await supabase.from('call_invites').update({ status: 'completed' }).eq('id', insertedInvite.id);
                    endCall();
                });

            } catch (error) {
                hideOutgoingCallUI();
                showInfoModal('Media access denied', 'Could not access camera/microphone. Please check your permissions.');
            }
        } else {
            hideOutgoingCallUI();
            showInfoModal('Call sent', 'Your friend will see the call invitation when they come online.');
        }
    };

    const saveCallRecord = async (otherUserId, duration) => {
        if (currentChatType === 'friend') {
            await supabase.from('messages').insert([{
                sender_id: currentUser.id,
                receiver_id: otherUserId,
                call_duration: duration,
                created_at: new Date().toISOString()
            }]);
        }
        await updateConversationsList();
    };

    const showCallUI = () => {
        ui.callSection.classList.remove('hidden');
        isInCall = true;
    };

    const addVideoStream = (id, stream, user) => {
        const existingTile = document.getElementById(`video-${id}`);
        if (existingTile) existingTile.remove();

        const tile = document.createElement('div');
        tile.className = 'participant-tile';
        tile.id = `video-${id}`;

        const video = document.createElement('video');
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        if (id === 'local') video.muted = true;

        const placeholder = document.createElement('div');
        placeholder.className = 'video-off-placeholder';
        placeholder.innerHTML = `
        <div class="avatar">${user.avatar_url ? `<img src="${user.avatar_url}" alt="${user.username}">` : user.username[0].toUpperCase()}</div>
        <span>${user.username}</span>
    `;

        tile.appendChild(video);
        tile.appendChild(placeholder);
        ui.videoGrid.appendChild(tile);

        const hasVideo = stream.getVideoTracks().length > 0 && stream.getVideoTracks()[0].enabled;
        tile.classList.toggle('video-off', !hasVideo);
    };

    const updateVideoState = (id, enabled) => {
        const tile = document.getElementById(`video-${id}`);
        if (tile) {
            tile.classList.toggle('video-off', !enabled);
            const video = tile.querySelector('video');
            if (video && video.srcObject) {
                const videoTrack = video.srcObject.getVideoTracks()[0];
                if (videoTrack) {
                    videoTrack.enabled = enabled;
                }
            }
        }
    };

    const endCall = () => {
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            localStream = null;
        }
        if (mediaConnection) {
            mediaConnection.close();
            mediaConnection = null;
        }
        ui.videoGrid.innerHTML = '';
        ui.callSection.classList.add('hidden');
        isInCall = false;
        callState = { isMuted: false, isVideoEnabled: true, isScreenSharing: false };
    };

    ui.stopCallBtn.onclick = endCall;

    ui.muteBtn.onclick = () => {
        callState.isMuted = !callState.isMuted;
        if (localStream) localStream.getAudioTracks().forEach(t => t.enabled = !callState.isMuted);
        ui.muteBtn.classList.toggle('danger', callState.isMuted);
        ui.muteBtn.innerHTML = callState.isMuted ? '<i class="fa-solid fa-microphone-slash"></i>' : '<i class="fa-solid fa-microphone"></i>';
    };

    ui.toggleVideoBtn.onclick = async () => {
        callState.isVideoEnabled = !callState.isVideoEnabled;
        if (localStream) localStream.getVideoTracks().forEach(t => t.enabled = callState.isVideoEnabled);
        updateVideoState('local', callState.isVideoEnabled);
        ui.toggleVideoBtn.classList.toggle('active', callState.isVideoEnabled);
        ui.toggleVideoBtn.innerHTML = callState.isVideoEnabled ? '<i class="fa-solid fa-video"></i>' : '<i class="fa-solid fa-video-slash"></i>';
    };

    ui.shareScreenBtn.onclick = async () => {
        if (callState.isScreenSharing) {
            try {
                const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
                const videoTrack = cameraStream.getVideoTracks()[0];
                const sender = mediaConnection.peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
                if (sender) {
                    await sender.replaceTrack(videoTrack);
                }
                if (localStream) {
                    localStream.getVideoTracks()[0].stop();
                    localStream.removeTrack(localStream.getVideoTracks()[0]);
                    localStream.addTrack(videoTrack);
                }
                callState.isScreenSharing = false;
                ui.shareScreenBtn.classList.remove('active');
            } catch (error) {
                showInfoModal('Error', 'Could not stop screen sharing.');
            }
        } else {
            try {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = screenStream.getVideoTracks()[0];

                const sender = mediaConnection.peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
                if (sender) {
                    await sender.replaceTrack(screenTrack);
                }

                if (localStream) {
                    const oldTrack = localStream.getVideoTracks()[0];
                    localStream.removeTrack(oldTrack);
                    localStream.addTrack(screenTrack);
                }

                callState.isScreenSharing = true;
                ui.shareScreenBtn.classList.add('active');

                screenTrack.onended = async () => {
                    try {
                        const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
                        const videoTrack = cameraStream.getVideoTracks()[0];
                        const sender = mediaConnection.peerConnection.getSenders().find(s => s.track && s.track.kind === 'video');
                        if (sender) {
                            await sender.replaceTrack(videoTrack);
                        }
                        if (localStream) {
                            localStream.removeTrack(localStream.getVideoTracks()[0]);
                            localStream.addTrack(videoTrack);
                        }
                        callState.isScreenSharing = false;
                        ui.shareScreenBtn.classList.remove('active');
                    } catch (err) {
                    }
                };
            } catch (error) {
                showInfoModal('Screen Share Error', 'Could not start screen sharing. Please try again.');
            }
        }
    };

    const setupSettingsDrag = () => {
        if (window.innerWidth > 768) {
            return;
        }

        let isDragging = false;
        let startY, startTranslate;

        const dragStart = (e) => {
            if (window.innerWidth > 768) return;
            isDragging = true;
            startY = e.pageY || e.touches[0].pageY;
            startTranslate = 0;
            ui.settingsModalPane.style.transition = 'none';
        };

        const dragMove = (e) => {
            if (!isDragging || window.innerWidth > 768) return;
            const currentY = e.pageY || e.touches[0].pageY;
            const diffY = currentY - startY;

            if (diffY > 0) {
                ui.settingsModalPane.style.transform = `translateY(${diffY}px)`;
            }
        };

        const dragEnd = (e) => {
            if (!isDragging || window.innerWidth > 768) return;
            isDragging = false;
            ui.settingsModalPane.style.transition = 'transform 0.3s ease-out';

            const currentY = e.pageY || e.changedTouches[0].pageY;
            const diffY = currentY - startY;

            if (diffY > 100) {
                ui.settingsModalPane.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    hideSettingsModal();
                    ui.settingsModalPane.style.transform = '';
                }, 300);
            } else {
                ui.settingsModalPane.style.transform = 'translateY(0)';
            }
        };

        ui.settingsModalHeader.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);

        ui.settingsModalHeader.addEventListener('touchstart', dragStart, { passive: true });
        document.addEventListener('touchmove', dragMove, { passive: true });
        document.addEventListener('touchend', dragEnd, { passive: true });

        ui.settingsModalContainer.addEventListener('click', (e) => {
            if (e.target === ui.settingsModalContainer) {
                hideSettingsModal();
            }
        });
    };

    setupSettingsDrag();

    const showSettingsModal = () => {
        ui.settingsModalContainer.classList.add('visible');
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                ui.settingsModalPane.classList.add('visible');
            }, 10);
        }
    };

    const hideSettingsModal = () => {
        ui.settingsModalPane.classList.remove('visible');
        setTimeout(() => {
            ui.settingsModalContainer.classList.remove('visible');
        }, 300);
    };

    const adjustTextareaHeight = () => {
        ui.messageInput.style.height = 'auto';
        const scrollHeight = ui.messageInput.scrollHeight;
        ui.messageInput.style.height = `${Math.min(scrollHeight, 120)}px`;
    };

    window.addEventListener('beforeunload', async () => {
        if (currentUser && userSettings.onlineStatus) {
            await supabase.from('profiles').update({
                is_online: false
            }).eq('id', currentUser.id);
        }
    });

    handleAuth();
    setTimeout(addFileButton, 500);
});