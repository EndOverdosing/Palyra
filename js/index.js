document.addEventListener('DOMContentLoaded', () => {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const ui = {
        settingsModalContainer: document.getElementById('settings-modal-container'),
        settingsModalPane: document.getElementById('settings-modal'),
        settingsModalHeader: document.getElementById('settings-modal-header'),
        settingsModalBody: document.getElementById('settings-modal-body'),
        appLoader: document.getElementById('app-loader'),
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
        createGroupBtn: document.getElementById('create-group-btn'),
        friendsList: document.getElementById('friends-list'),
        chatContainer: document.getElementById('chat-container'),
        welcomeScreen: document.getElementById('welcome-screen'),
        chatView: document.getElementById('chat-view'),
        chatHeader: document.getElementById('chat-header'),
        chatAvatar: document.getElementById('chat-avatar'),
        chatFriendName: document.getElementById('chat-friend-name'),
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
        createGroupModal: document.getElementById('create-group-modal'),
        createGroupForm: document.getElementById('create-group-form'),
        groupNameInput: document.getElementById('group-name-input'),
        groupMembersList: document.getElementById('group-members-list'),
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
        chatOverlay: document.getElementById('chat-overlay'),
        chatOverlayHeader: document.getElementById('chat-overlay-header'),
        chatOverlayContent: document.getElementById('chat-overlay-content'),
        chatOverlayBackdrop: document.getElementById('chat-overlay-backdrop'),
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
    };

    let peer, localStream, dataConnection, mediaConnection, currentUser, currentChatFriend, friends = {}, groups = {}, subscriptions = [];
    let callState = { isMuted: false, isVideoEnabled: true, isScreenSharing: false };
    let incomingCallData = null;
    let onlineUsers = new Set();
    let isInCall = false;
    let typingTimeout = null;
    let keepAliveInterval = null;
    let currentChatType = 'friend';
    let blockedUsers = new Set();
    let userSettings = {
        theme: 'dark',
        fontSize: 'medium',
        chatBackground: 'default',
        notifications: true,
        messageSound: true,
        onlineStatus: true,
        readReceipts: true
    };

    const showLoader = (show) => ui.appLoader.classList.toggle('hidden', !show);
    const showAuth = (show) => ui.authContainer.classList.toggle('hidden', !show);
    const showApp = (show) => ui.mainApp.classList.toggle('hidden', !show);
    const setAuthStatus = (message, isError = true) => {
        ui.authStatus.textContent = message;
        ui.authStatus.style.color = isError ? 'var(--error)' : 'var(--success)';
    };

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
                    { urls: 'stun:stun1.l.google.com:19302' },
                    { urls: 'stun:stun2.l.google.com:19302' }
                ]
            }
        });

        peer.on('open', async (id) => {
            await supabase.from('profiles').update({ peer_id: id }).eq('id', userId);
            setupPeerListeners();
            if (currentChatFriend) ui.callBtn.disabled = false;
        });

        peer.on('disconnected', () => {
            console.warn('PeerJS disconnected.');
            ui.callBtn.disabled = true;
            setTimeout(() => {
                if (peer && !peer.destroyed) {
                    peer.reconnect();
                }
            }, 1000);
        });

        peer.on('close', () => {
            console.warn('PeerJS connection closed.');
            ui.callBtn.disabled = true;
        });

        peer.on('error', err => {
            console.error('PeerJS Error:', err);

            if (err.type === 'peer-unavailable') {
                console.warn('Peer unavailable - user may be offline');
                return;
            }

            if (err.type === 'network') {
                showInfoModal("Connection Error", "Connection to the signaling server lost. Calls are temporarily unavailable.");
            }
        });
    };

    const setupDataConnectionListeners = (conn) => {
        conn.on('data', (data) => {
            if (data.type === 'chat-message' && currentChatFriend && data.sender_id === currentChatFriend.id) {
                addMessageToUI(data.message);
            } else if (data.type === 'typing') {
                showTypingIndicator(data.isTyping);
            }
        });
    };

    const setupPeerListeners = () => {
        peer.on('connection', conn => {
            dataConnection = conn;
            setupDataConnectionListeners(dataConnection);
        });

        peer.on('call', async call => {
            mediaConnection = call;
            let friend = Object.values(friends).find(f => f.peer_id === call.peer);

            if (!friend) {
                const { data: callerProfile, error } = await supabase
                    .from('profiles')
                    .select('id, username, avatar_url')
                    .eq('peer_id', call.peer)
                    .single();

                if (error || !callerProfile) {
                    console.warn('Caller not found, closing call');
                    return call.close();
                }
                friend = { ...callerProfile };
            }

            if (!friend || !friend.username) {
                console.warn('Invalid friend data, closing call');
                return call.close();
            }

            incomingCallData = { peerId: call.peer, friend };
            showIncomingCallModal(friend);
        });
    };

    const showTypingIndicator = (isTyping) => {
        if (isTyping) {
            ui.typingIndicator.classList.remove('hidden');
        } else {
            ui.typingIndicator.classList.add('hidden');
        }
    };

    const sendTypingStatus = (isTyping) => {
        if (dataConnection && dataConnection.open) {
            dataConnection.send({
                type: 'typing',
                isTyping: isTyping,
                sender_id: currentUser.id
            });
        }
    };

    const showInfoModal = (title, message) => {
        ui.infoTitle.textContent = title;
        ui.infoMessage.textContent = message;
        showModal('info');
    };

    const showModal = (type) => {
        if (type === 'settings') {
            showSettingsModal();
            return;
        }

        ui.modalContainer.classList.remove('hidden');
        ui.addFriendModal.classList.toggle('hidden', type !== 'addFriend');
        ui.createGroupModal.classList.toggle('hidden', type !== 'createGroup');
        ui.incomingCallModal.classList.toggle('hidden', type !== 'incomingCall');
        ui.confirmationModal.classList.toggle('hidden', type !== 'confirmation');
        ui.infoModal.classList.toggle('hidden', type !== 'info');
        ui.chatOptionsModal.classList.toggle('hidden', type !== 'chatOptions');
        ui.friendProfileModal.classList.toggle('hidden', type !== 'friendProfile');
        ui.changeUsernameModal.classList.toggle('hidden', type !== 'changeUsername');

        if (type === 'info') {
            ui.modalContainer.classList.add('is-info-modal');
        }
    };

    const hideModal = () => {
        ui.modalContainer.classList.add('hidden');
        ui.modalContainer.classList.remove('is-info-modal');
        ui.incomingCallAudio.pause();
        ui.incomingCallAudio.currentTime = 0;
    };

    let confirmCallback = null;
    const showConfirmationModal = (message, onConfirm, title = 'Are you sure?', confirmText = 'Confirm', confirmClass = 'danger') => {
        ui.confirmationMessage.textContent = message;
        ui.confirmationTitle.textContent = title;
        ui.confirmBtn.textContent = confirmText;

        ui.confirmBtn.className = '';
        ui.confirmBtn.classList.add(confirmClass);

        confirmCallback = onConfirm;
        showModal('confirmation');
    };

    const showIncomingCallModal = (friend) => {
        ui.callerName.textContent = friend.username;
        if (friend.avatar_url) {
            ui.callerAvatar.innerHTML = `<img src="${friend.avatar_url}" alt="${friend.username}">`;
        } else {
            ui.callerAvatar.textContent = friend.username.charAt(0).toUpperCase();
        }
        showModal('incomingCall');
        ui.incomingCallAudio.play().catch(err => console.warn('Audio play failed:', err));
    };

    const acceptCall = async () => {
        hideModal();
        if (!incomingCallData) return;

        const constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        };

        try {
            localStream = await navigator.mediaDevices.getUserMedia(constraints);
            mediaConnection.answer(localStream);
            setupMediaConnection(mediaConnection, incomingCallData.friend);
            showCallUI(true);
        } catch (err) {
            console.error('Error accessing media devices:', err);
            showInfoModal('Camera/Mic Error', 'Could not access your camera or microphone. Please check permissions.');
        }
    };

    const declineCall = () => {
        hideModal();
        if (mediaConnection) {
            mediaConnection.close();
            mediaConnection = null;
        }
        incomingCallData = null;
    };

    const startCall = async (friend) => {
        if (!peer || peer.destroyed) {
            showInfoModal('Connection Error', 'Peer connection not ready. Please wait a moment.');
            return;
        }

        if (!friend.peer_id) {
            showInfoModal('User Offline', 'Cannot call this user - they are currently offline.');
            return;
        }

        ui.callBtn.disabled = true;
        ui.callBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        const constraints = {
            video: {
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            }
        };

        try {
            localStream = await navigator.mediaDevices.getUserMedia(constraints);
            const call = peer.call(friend.peer_id, localStream);
            mediaConnection = call;
            setupMediaConnection(call, friend);
            showCallUI(true);
        } catch (err) {
            console.error('Error starting call:', err);
            ui.callBtn.disabled = false;
            ui.callBtn.innerHTML = '<i class="fa-solid fa-video"></i>';
            showInfoModal('Camera/Mic Error', 'Could not access your camera or microphone. Please check permissions.');
        }
    };

    const setupMediaConnection = (call, friend) => {
        isInCall = true;
        const localVideo = createVideoElement('local', currentUser.username);
        localVideo.srcObject = localStream;
        localVideo.muted = true;
        localVideo.play();

        call.on('stream', remoteStream => {
            const remoteVideo = createVideoElement('remote', friend.username);
            remoteVideo.srcObject = remoteStream;
            remoteVideo.play();
        });

        call.on('close', () => {
            endCall();
        });

        call.on('error', err => {
            console.error('Call error:', err);
            endCall();
        });
    };

    const createVideoElement = (type, username) => {
        const existing = ui.videoGrid.querySelector(`.participant-tile.${type}`);
        if (existing) existing.remove();

        const tile = document.createElement('div');
        tile.className = `participant-tile ${type}`;

        const video = document.createElement('video');
        video.autoplay = true;
        video.playsInline = true;

        const placeholder = document.createElement('div');
        placeholder.className = 'video-off-placeholder';

        const avatar = document.createElement('div');
        avatar.className = 'avatar';
        avatar.textContent = username.charAt(0).toUpperCase();

        const name = document.createElement('span');
        name.textContent = username;

        placeholder.appendChild(avatar);
        placeholder.appendChild(name);

        tile.appendChild(video);
        tile.appendChild(placeholder);
        ui.videoGrid.appendChild(tile);

        return video;
    };

    const updateVideoState = (type, enabled) => {
        const tile = ui.videoGrid.querySelector(`.participant-tile.${type}`);
        if (tile) {
            tile.classList.toggle('video-off', !enabled);
        }
    };

    const showCallUI = (show) => {
        ui.callSection.classList.toggle('hidden', !show);
        ui.chatView.classList.toggle('in-call', show);
        if (show && window.innerWidth <= 768) {
            ui.sidebar.classList.add('hidden');
        }
    };

    const toggleChatOverlay = (show) => {
        ui.chatOverlay.classList.toggle('visible', show);
        ui.chatOverlayBackdrop.classList.toggle('visible', show);

        if (show) {
            ui.chatOverlayContent.innerHTML = '';
            const chatClone = ui.chatView.cloneNode(true);
            chatClone.id = 'chat-view-clone';
            ui.chatOverlayContent.appendChild(chatClone);

            const clonedForm = chatClone.querySelector('#message-form');
            const clonedInput = chatClone.querySelector('#message-input');

            if (clonedForm) {
                clonedForm.onsubmit = async (e) => {
                    e.preventDefault();
                    const content = clonedInput.value.trim();
                    if (!content || !currentChatFriend) return;

                    clonedInput.value = '';

                    const message = {
                        sender_id: currentUser.id,
                        receiver_id: currentChatFriend.id,
                        content: content,
                        created_at: new Date().toISOString(),
                    };

                    const clonedMessagesContainer = chatClone.querySelector('#messages-container');
                    const messageDiv = createMessageElement(message);
                    clonedMessagesContainer.appendChild(messageDiv);
                    clonedMessagesContainer.scrollTop = clonedMessagesContainer.scrollHeight;

                    const mainMessageDiv = createMessageElement(message);
                    ui.messagesContainer.appendChild(mainMessageDiv);
                    ui.messagesContainer.scrollTop = ui.messagesContainer.scrollHeight;

                    if (dataConnection && dataConnection.open) {
                        dataConnection.send({
                            type: 'chat-message',
                            message: message,
                            sender_id: currentUser.id
                        });
                    }

                    const { error } = await supabase.from('messages').insert({
                        sender_id: message.sender_id,
                        receiver_id: message.receiver_id,
                        content: message.content
                    });

                    if (error) {
                        console.error('Error saving message:', error);
                    }
                };
            }
        }
    };

    ui.toggleChatBtn.onclick = () => {
        const isVisible = !ui.chatOverlay.classList.contains('visible');
        toggleChatOverlay(isVisible);
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
        if (dataConnection) {
            dataConnection.close();
            dataConnection = null;
        }

        ui.videoGrid.innerHTML = '';
        showCallUI(false);
        isInCall = false;

        callState = { isMuted: false, isVideoEnabled: true, isScreenSharing: false };
        ui.muteBtn.classList.remove('danger');
        ui.muteBtn.innerHTML = '<i class="fa-solid fa-microphone"></i>';
        ui.toggleVideoBtn.classList.add('active');
        ui.toggleVideoBtn.innerHTML = '<i class="fa-solid fa-video"></i>';

        ui.callBtn.disabled = false;
        ui.callBtn.innerHTML = '<i class="fa-solid fa-video"></i>';

        if (currentChatFriend && peer && !peer.destroyed) {
            setTimeout(() => {
                dataConnection = peer.connect(currentChatFriend.peer_id);
                if (dataConnection) {
                    setupDataConnectionListeners(dataConnection);
                }
            }, 1000);
        }
    };

    const handleAuth = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            loadUser(session.user.id);
        } else {
            showLoader(false);
            showAuth(true);
        }
    };

    const handleRouteChange = () => {
        const params = new URLSearchParams(window.location.search);
        const chatId = params.get('chat');

        if (chatId && friends[chatId]) {
            openChat(chatId, 'friend');
        } else if (chatId && groups[chatId]) {
            openChat(chatId, 'group');
        } else {
            closeChat();
        }
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

    ui.loginForm.onsubmit = async (e) => {
        e.preventDefault();
        const username = ui.loginForm.querySelector('#login-username').value.trim();
        const password = ui.loginForm.querySelector('#login-password').value;

        setAuthStatus('Logging in...', false);

        const { data: { user }, error } = await supabase.auth.signInWithPassword({
            email: `${username}@p2p.local`,
            password
        });

        if (error) {
            console.error('Login error:', error);
            setAuthStatus('Invalid username or password');
        } else {
            setAuthStatus('Login successful!', false);
            loadUser(user.id);
        }
    };

    ui.signupForm.onsubmit = async (e) => {
        e.preventDefault();
        const username = ui.signupForm.querySelector('#signup-username').value.trim();
        const password = ui.signupForm.querySelector('#signup-password').value;

        if (username.length < 3) {
            setAuthStatus('Username must be at least 3 characters');
            return;
        }

        if (password.length < 6) {
            setAuthStatus('Password must be at least 6 characters');
            return;
        }

        setAuthStatus('Creating account...', false);

        const { data: existingUser } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username)
            .single();

        if (existingUser) {
            setAuthStatus('Username already taken');
            return;
        }

        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
            email: `${username}@p2p.local`,
            password
        });

        if (signUpError) {
            console.error('Signup error:', signUpError);
            setAuthStatus('Could not create account. Try a different username.');
            return;
        }

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ username })
            .eq('id', user.id);

        if (profileError) {
            console.error('Profile update error:', profileError);
        }

        setAuthStatus('Account created! Logging in...', false);
        loadUser(user.id);
    };

    ui.logoutBtn.onclick = async () => {
        showConfirmationModal('Are you sure you want to logout?', async () => {
            subscriptions.forEach(sub => sub.unsubscribe());
            subscriptions = [];

            if (keepAliveInterval) {
                clearInterval(keepAliveInterval);
                keepAliveInterval = null;
            }

            if (currentUser) {
                await supabase.from('profiles').update({
                    is_online: false,
                    peer_id: null
                }).eq('id', currentUser.id);
            }

            if (peer && !peer.destroyed) {
                peer.destroy();
            }

            await supabase.auth.signOut();
            currentUser = null;
            friends = {};
            groups = {};
            onlineUsers.clear();

            showApp(false);
            showAuth(true);
            ui.loginForm.classList.remove('hidden');
            ui.signupForm.classList.add('hidden');
        }, 'Logout', 'Logout', 'danger');
    };

    const loadUser = async (userId) => {
        showLoader(true);

        let profile;
        let retries = 0;
        const maxRetries = 5;

        while (!profile && retries < maxRetries) {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId);

            if (error) {
                console.error('Error loading profile:', error);
                break;
            }

            if (data && data.length > 0) {
                profile = data[0];
                break;
            }

            retries++;
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        if (!profile) {
            console.error('Profile not found after retries, creating manually...');
            const { error: insertError } = await supabase.from('profiles').insert({
                id: userId,
                username: ''
            });

            if (insertError) {
                console.error('Error creating profile manually:', insertError);
                await supabase.auth.signOut();
                showLoader(false);
                showAuth(true);
                setAuthStatus('Error creating profile. Please try again.');
                return;
            }

            const { data: newProfile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId);

            if (newProfile && newProfile.length > 0) {
                profile = newProfile[0];
            }
        }

        if (!profile) {
            await supabase.auth.signOut();
            showLoader(false);
            showAuth(true);
            setAuthStatus('Could not load profile. Please try logging in again.');
            return;
        }

        currentUser = profile;
        ui.usernameDisplay.textContent = profile.username || 'User';

        if (profile.avatar_url) {
            ui.userAvatar.innerHTML = `<img src="${profile.avatar_url}" alt="${profile.username}">`;
        } else {
            ui.userAvatar.textContent = (profile.username || 'U').charAt(0).toUpperCase();
        }

        await supabase.from('profiles').update({
            is_online: true,
            last_seen: new Date().toISOString()
        }).eq('id', userId);

        loadSettings();
        await loadBlockedUsers();
        await initializePeer(userId);
        await loadFriendsAndGroups();
        setupRealtimeSubscriptions();
        startKeepAlive();

        showLoader(false);
        showAuth(false);
        showApp(true);
        handleRouteChange();
    };

    const setupRealtimeSubscriptions = () => {
        const friendsChannel = supabase.channel('friends-changes')
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'friends', filter: `user_id_1=eq.${currentUser.id}` },
                async (payload) => {
                    if (payload.eventType === 'DELETE') {
                        const friendId = payload.old.user_id_2;
                        delete friends[friendId];
                        if (currentChatFriend && currentChatFriend.id === friendId) {
                            closeChat();
                        }
                        renderFriendsList();
                    } else if (payload.eventType === 'INSERT') {
                        await loadFriendsAndGroups();
                    } else if (payload.eventType === 'UPDATE') {
                        await loadFriendsAndGroups();
                    }
                }
            )
            .on('postgres_changes',
                { event: '*', schema: 'public', table: 'friends', filter: `user_id_2=eq.${currentUser.id}` },
                async (payload) => {
                    if (payload.eventType === 'DELETE') {
                        const friendId = payload.old.user_id_1;
                        delete friends[friendId];
                        if (currentChatFriend && currentChatFriend.id === friendId) {
                            closeChat();
                        }
                        renderFriendsList();
                    } else if (payload.eventType === 'INSERT') {
                        await loadFriendsAndGroups();
                    } else if (payload.eventType === 'UPDATE') {
                        await loadFriendsAndGroups();
                    }
                }
            )
            .subscribe();

        const messagesChannel = supabase.channel('messages-changes')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${currentUser.id}` },
                async (payload) => {
                    if (currentChatFriend && payload.new.sender_id === currentChatFriend.id && currentChatType === 'friend') {
                        addMessageToUI(payload.new);
                        await markMessageAsRead(payload.new.id);
                    } else {
                        if (friends[payload.new.sender_id]) {
                            friends[payload.new.sender_id].unread_count = (friends[payload.new.sender_id].unread_count || 0) + 1;
                        }
                        renderFriendsList();
                        if (userSettings.notifications && userSettings.messageSound) {
                            playNotificationSound();
                        }
                    }
                }
            )
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'messages' },
                async (payload) => {
                    if (payload.new.is_read && !payload.old.is_read && payload.new.sender_id === currentUser.id) {
                        const messageElements = ui.messagesContainer.querySelectorAll('.message.sent');
                        messageElements.forEach(el => {
                            const timestamp = el.querySelector('.message-timestamp');
                            if (timestamp && !timestamp.querySelector('.read-indicator')) {
                                const readIndicator = document.createElement('span');
                                readIndicator.className = 'read-indicator';
                                readIndicator.innerHTML = ' ✓✓';
                                readIndicator.style.color = 'var(--primary)';
                                timestamp.appendChild(readIndicator);
                            }
                        });
                    }
                }
            )
            .subscribe();

        const groupMessagesChannel = supabase.channel('group-messages-changes')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'group_messages' },
                async (payload) => {
                    const { data: membership } = await supabase
                        .from('group_members')
                        .select('group_id')
                        .eq('user_id', currentUser.id)
                        .eq('group_id', payload.new.group_id)
                        .single();

                    if (membership) {
                        if (currentChatFriend && currentChatType === 'group' && currentChatFriend.id === payload.new.group_id) {
                            await loadGroupMessages(payload.new.group_id);
                        } else {
                            await loadFriendsAndGroups();
                        }
                    }
                }
            )
            .subscribe();

        const profilesChannel = supabase.channel('profiles-changes')
            .on('postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'profiles' },
                async (payload) => {
                    if (payload.new.is_online !== payload.old.is_online) {
                        if (payload.new.is_online) {
                            onlineUsers.add(payload.new.id);
                        } else {
                            onlineUsers.delete(payload.new.id);
                        }

                        if (friends[payload.new.id]) {
                            friends[payload.new.id].is_online = payload.new.is_online;
                        }

                        updateOnlineStatus();
                        renderFriendsList();
                    }

                    if (payload.new.peer_id !== payload.old.peer_id) {
                        if (friends[payload.new.id]) {
                            friends[payload.new.id].peer_id = payload.new.peer_id;

                            if (currentChatFriend && currentChatFriend.id === payload.new.id) {
                                currentChatFriend.peer_id = payload.new.peer_id;

                                if (payload.new.peer_id && peer && !peer.destroyed && !isInCall) {
                                    ui.callBtn.disabled = false;

                                    if (dataConnection) {
                                        dataConnection.close();
                                    }

                                    setTimeout(() => {
                                        dataConnection = peer.connect(payload.new.peer_id);
                                        if (dataConnection) {
                                            setupDataConnectionListeners(dataConnection);
                                        }
                                    }, 500);
                                } else if (!payload.new.peer_id) {
                                    ui.callBtn.disabled = true;
                                }
                            }
                        }
                    }

                    if (payload.new.username !== payload.old.username || payload.new.avatar_url !== payload.old.avatar_url) {
                        if (friends[payload.new.id]) {
                            friends[payload.new.id].username = payload.new.username;
                            friends[payload.new.id].avatar_url = payload.new.avatar_url;

                            if (currentChatFriend && currentChatFriend.id === payload.new.id) {
                                currentChatFriend.username = payload.new.username;
                                currentChatFriend.avatar_url = payload.new.avatar_url;

                                ui.chatFriendName.textContent = payload.new.username;
                                if (payload.new.avatar_url) {
                                    ui.chatAvatar.innerHTML = `<img src="${payload.new.avatar_url}" alt="${payload.new.username}">`;
                                } else {
                                    ui.chatAvatar.textContent = payload.new.username.charAt(0).toUpperCase();
                                }
                            }

                            renderFriendsList();
                        }
                    }

                    if (payload.new.id === currentUser.id) {
                        if (payload.new.username !== currentUser.username) {
                            currentUser.username = payload.new.username;
                            ui.usernameDisplay.textContent = payload.new.username;
                            ui.settingsUsername.textContent = payload.new.username;
                        }
                        if (payload.new.avatar_url !== currentUser.avatar_url) {
                            currentUser.avatar_url = payload.new.avatar_url;
                            if (payload.new.avatar_url) {
                                ui.userAvatar.innerHTML = `<img src="${payload.new.avatar_url}" alt="${payload.new.username}">`;
                                ui.settingsAvatar.innerHTML = `<img src="${payload.new.avatar_url}" alt="${payload.new.username}">`;
                            } else {
                                ui.userAvatar.textContent = payload.new.username.charAt(0).toUpperCase();
                                ui.settingsAvatar.textContent = payload.new.username.charAt(0).toUpperCase();
                            }
                        }
                    }
                }
            )
            .subscribe();

        const blockedChannel = supabase.channel('blocked-changes')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'blocked_users', filter: `blocked_user_id=eq.${currentUser.id}` },
                async (payload) => {
                    const blockerId = payload.new.user_id;
                    delete friends[blockerId];
                    if (currentChatFriend && currentChatFriend.id === blockerId) {
                        closeChat();
                    }
                    renderFriendsList();
                }
            )
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'blocked_users', filter: `user_id=eq.${currentUser.id}` },
                async (payload) => {
                    blockedUsers.add(payload.new.blocked_user_id);
                    delete friends[payload.new.blocked_user_id];
                    if (currentChatFriend && currentChatFriend.id === payload.new.blocked_user_id) {
                        closeChat();
                    }
                    renderFriendsList();
                }
            )
            .on('postgres_changes',
                { event: 'DELETE', schema: 'public', table: 'blocked_users', filter: `user_id=eq.${currentUser.id}` },
                async (payload) => {
                    blockedUsers.delete(payload.old.blocked_user_id);
                    await loadFriendsAndGroups();
                }
            )
            .subscribe();

        subscriptions.push(friendsChannel, messagesChannel, profilesChannel, groupMessagesChannel, blockedChannel);
    };

    const playNotificationSound = () => {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjKU1vLNeCwEJ');
        audio.play().catch(() => { });
    };

    const markMessageAsRead = async (messageId) => {
        if (userSettings.readReceipts) {
            await supabase.from('messages').update({
                is_read: true
            }).eq('id', messageId);
        }
    };

    const updateOnlineStatus = () => {
        Object.values(friends).forEach(friend => {
            const friendItem = ui.friendsList.querySelector(`[data-id="${friend.id}"]`);
            if (friendItem) {
                const statusIndicator = friendItem.querySelector('.status-indicator');
                if (statusIndicator) {
                    statusIndicator.classList.toggle('online', onlineUsers.has(friend.id));
                }
            }
        });

        if (currentChatFriend && currentChatType === 'friend') {
            ui.chatFriendStatus.classList.toggle('online', onlineUsers.has(currentChatFriend.id));
        }
    };

    const loadFriendsAndGroups = async () => {
        const { data: friendsData, error: friendsError } = await supabase
            .from('friends')
            .select(`
                user_id_1,
                user_id_2,
                profiles!friends_user_id_1_fkey(id, username, is_online, peer_id, avatar_url, created_at),
                profiles_user_id_2:profiles!friends_user_id_2_fkey(id, username, is_online, peer_id, avatar_url, created_at)
            `)
            .or(`user_id_1.eq.${currentUser.id},user_id_2.eq.${currentUser.id}`);

        if (friendsError) {
            console.error('Error loading friends:', friendsError);
            return;
        }

        friends = {};
        onlineUsers.clear();

        friendsData.forEach(friendship => {
            const isUserOne = friendship.user_id_1 === currentUser.id;
            const friendProfile = isUserOne ? friendship.profiles_user_id_2 : friendship.profiles;

            const friend = {
                id: friendProfile.id,
                username: friendProfile.username,
                is_online: friendProfile.is_online,
                peer_id: friendProfile.peer_id,
                avatar_url: friendProfile.avatar_url,
                created_at: friendProfile.created_at,
                friendship_id: `${friendship.user_id_1}-${friendship.user_id_2}`
            };

            friends[friend.id] = friend;

            if (friend.is_online) {
                onlineUsers.add(friend.id);
            }
        });

        groups = {};

        await getUnreadCounts();
        renderFriendsList();
        updateOnlineStatus();
    };

    const loadBlockedUsers = async () => {
        if (!currentUser || !currentUser.id) {
            blockedUsers = new Set();
            return;
        }

        const { data: blocks, error } = await supabase
            .from('blocked_users')
            .select('blocked_user_id')
            .eq('user_id', currentUser.id);

        if (error) {
            console.error('Error loading blocked users:', error);
            blockedUsers = new Set();
            return;
        }

        blockedUsers = new Set(blocks.map(b => b.blocked_user_id));
    };

    const getUnreadCounts = async () => {
        const { data: unreadMessages, error } = await supabase
            .from('messages')
            .select('sender_id')
            .eq('receiver_id', currentUser.id)
            .eq('is_read', false);

        if (error) {
            console.error('Error loading unread messages:', error);
            return;
        }

        if (unreadMessages) {
            unreadMessages.forEach(msg => {
                if (friends[msg.sender_id]) {
                    friends[msg.sender_id].unread_count = (friends[msg.sender_id].unread_count || 0) + 1;
                }
            });
        }
    };

    const renderFriendsList = () => {
        ui.friendsList.innerHTML = '';

        const friendsList = Object.values(friends)
            .filter(f => !blockedUsers.has(f.id))
            .sort((a, b) => {
                if (a.is_online && !b.is_online) return -1;
                if (!a.is_online && b.is_online) return 1;
                return b.username.localeCompare(a.username);
            });

        if (friendsList.length > 0) {
            const header = document.createElement('div');
            header.className = 'list-header';
            header.textContent = `Friends — ${friendsList.length}`;
            ui.friendsList.appendChild(header);

            friendsList.forEach(friend => {
                const friendItem = document.createElement('div');
                friendItem.className = 'friend-item';
                friendItem.dataset.id = friend.id;
                friendItem.dataset.type = 'friend';

                const avatarWrapper = document.createElement('div');
                avatarWrapper.className = 'avatar-wrapper';

                const avatar = document.createElement('div');
                avatar.className = 'avatar';
                if (friend.avatar_url) {
                    avatar.innerHTML = `<img src="${friend.avatar_url}" alt="${friend.username}">`;
                } else {
                    avatar.textContent = friend.username.charAt(0).toUpperCase();
                }

                const statusIndicator = document.createElement('div');
                statusIndicator.className = 'status-indicator';
                if (friend.is_online) {
                    statusIndicator.classList.add('online');
                }

                avatarWrapper.appendChild(avatar);
                avatarWrapper.appendChild(statusIndicator);

                const friendName = document.createElement('span');
                friendName.className = 'friend-name';
                friendName.textContent = friend.username;

                friendItem.appendChild(avatarWrapper);
                friendItem.appendChild(friendName);

                if (friend.unread_count > 0) {
                    const badge = document.createElement('span');
                    badge.className = 'notification-badge';
                    friendItem.appendChild(badge);
                }

                ui.friendsList.appendChild(friendItem);
            });
        } else {
            const emptyState = document.createElement('div');
            emptyState.style.padding = '2rem';
            emptyState.style.textAlign = 'center';
            emptyState.style.color = 'var(--secondary-text)';
            emptyState.innerHTML = '<i class="fa-solid fa-user-plus" style="font-size: 2rem; margin-bottom: 1rem;"></i><p>Add friends to start chatting</p>';
            ui.friendsList.appendChild(emptyState);
        }
    };

    const filterFriendsList = (searchTerm) => {
        const friendItems = ui.friendsList.querySelectorAll('.friend-item, .group-item');
        friendItems.forEach(item => {
            const name = item.querySelector('.friend-name').textContent.toLowerCase();
            if (name.includes(searchTerm.toLowerCase())) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    };

    ui.searchFriendsInput.addEventListener('input', (e) => {
        filterFriendsList(e.target.value);
    });

    const openChat = async (friendId, type) => {
        currentChatType = type;

        if (type === 'friend') {
            currentChatFriend = friends[friendId];
            if (!currentChatFriend) {
                ui.welcomeScreen.style.display = 'flex';
                ui.chatView.classList.add('hidden');
                showInfoModal('User Not Found', 'This user has removed you from their friends list. You can no longer chat with them.');
                closeChat();
                return;
            }

            ui.chatFriendName.textContent = currentChatFriend.username;

            if (currentChatFriend.avatar_url) {
                ui.chatAvatar.innerHTML = `<img src="${currentChatFriend.avatar_url}" alt="${currentChatFriend.username}">`;
            } else {
                ui.chatAvatar.textContent = currentChatFriend.username.charAt(0).toUpperCase();
            }

            ui.chatFriendStatus.classList.toggle('online', currentChatFriend.is_online);

            if (currentChatFriend.peer_id && peer && !peer.destroyed) {
                dataConnection = peer.connect(currentChatFriend.peer_id);
                if (dataConnection) {
                    setupDataConnectionListeners(dataConnection);
                    dataConnection.on('open', () => {
                    });
                }
                ui.callBtn.disabled = false;
            } else {
                ui.callBtn.disabled = true;
            }

            await loadMessages(friendId);
        }

        ui.welcomeScreen.style.display = 'none';
        ui.chatView.classList.remove('hidden');

        if (window.innerWidth <= 768) {
            ui.chatContainer.classList.add('active');
            ui.sidebar.classList.add('hidden');
        }

        const url = new URL(window.location);
        url.searchParams.set('chat', friendId);
        history.pushState(null, '', url);
    };

    const closeChat = () => {
        currentChatFriend = null;
        currentChatType = null;
        ui.chatView.classList.add('hidden');
        ui.welcomeScreen.style.display = 'flex';
        ui.messagesContainer.innerHTML = '';

        if (dataConnection && dataConnection.open) {
            dataConnection.close();
        }
        dataConnection = null;

        const url = new URL(window.location);
        url.searchParams.delete('chat');
        history.pushState(null, '', url);

        document.querySelectorAll('.friend-item, .group-item').forEach(item => {
            item.classList.remove('active');
        });
    };

    const loadMessages = async (friendId) => {
        ui.messagesContainer.innerHTML = '';

        const { data: messages, error } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${friendId}),and(sender_id.eq.${friendId},receiver_id.eq.${currentUser.id})`)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error loading messages:', error);
            return;
        }

        messages.forEach(msg => {
            addMessageToUI(msg);
        });

        ui.messagesContainer.scrollTop = ui.messagesContainer.scrollHeight;

        const unreadMessages = messages.filter(m => m.receiver_id === currentUser.id && !m.is_read);
        for (const msg of unreadMessages) {
            await markMessageAsRead(msg.id);
        }

        if (friends[friendId]) {
            friends[friendId].unread_count = 0;
            renderFriendsList();
        }
    };

    const loadGroupMessages = async (groupId) => {
        ui.messagesContainer.innerHTML = '';

        const { data: messages, error } = await supabase
            .from('group_messages')
            .select(`
                *,
                profiles(username)
            `)
            .eq('group_id', groupId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error loading group messages:', error);
            return;
        }

        messages.forEach(msg => {
            addMessageToUI({
                ...msg,
                sender_username: msg.profiles.username,
                sender_id: msg.sender_id
            });
        });

        ui.messagesContainer.scrollTop = ui.messagesContainer.scrollHeight;
    };

    const createMessageElement = (message) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';

        const isSent = message.sender_id === currentUser.id;
        messageDiv.classList.add(isSent ? 'sent' : 'received');

        const content = document.createElement('div');
        content.className = 'message-content';
        content.textContent = message.content;

        const timestamp = document.createElement('div');
        timestamp.className = 'message-timestamp';
        const date = new Date(message.created_at);
        timestamp.textContent = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        messageDiv.appendChild(content);
        messageDiv.appendChild(timestamp);

        return messageDiv;
    };

    const addMessageToUI = (message) => {
        const messageDiv = createMessageElement(message);
        ui.messagesContainer.appendChild(messageDiv);
        ui.messagesContainer.scrollTop = ui.messagesContainer.scrollHeight;
    };

    ui.addFriendBtn.onclick = () => {
        ui.friendUsernameInput.value = '';
        showModal('addFriend');
    };

    ui.createGroupBtn.onclick = () => {
        ui.groupNameInput.value = '';
        ui.groupMembersList.innerHTML = '';
        showModal('createGroup');
    };

    ui.closeModalBtn.onclick = hideModal;

    ui.addFriendForm.onsubmit = async (e) => {
        e.preventDefault();
        const friendUsername = ui.friendUsernameInput.value.trim();

        if (!friendUsername) return;

        if (friendUsername === currentUser.username) {
            showInfoModal('Error', 'You cannot add yourself as a friend.');
            return;
        }

        const { data: friendProfile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', friendUsername)
            .single();

        if (profileError || !friendProfile) {
            showInfoModal('User Not Found', 'No user found with that username.');
            return;
        }

        const { data: blockCheck } = await supabase
            .from('blocked_users')
            .select('id')
            .or(`and(user_id.eq.${currentUser.id},blocked_user_id.eq.${friendProfile.id}),and(user_id.eq.${friendProfile.id},blocked_user_id.eq.${currentUser.id})`)
            .limit(1);

        if (blockCheck && blockCheck.length > 0) {
            showInfoModal('Cannot Add Friend', 'You cannot add this user as a friend.');
            return;
        }

        const existingFriend = Object.values(friends).find(f => f.id === friendProfile.id);
        if (existingFriend) {
            showInfoModal('Already Friends', 'You are already friends with this user.');
            return;
        }

        const userId1 = currentUser.id < friendProfile.id ? currentUser.id : friendProfile.id;
        const userId2 = currentUser.id < friendProfile.id ? friendProfile.id : currentUser.id;


        const { error: friendError } = await supabase
            .from('friends')
            .insert({
                user_id_1: userId1,
                user_id_2: userId2,
                status: 'accepted',
                action_user_id: currentUser.id
            });

        if (friendError) {
            console.error('[DEBUG] Error adding friend:', friendError);
            showInfoModal('Error', 'Could not add friend. They might already be in your friends list.');
            return;
        }
        hideModal();
        showInfoModal('Success', `You are now friends with ${friendUsername}!`);
    };

    ui.settingsBtn.onclick = () => {
        ui.settingsUsername.textContent = currentUser.username;
        if (currentUser.avatar_url) {
            ui.settingsAvatar.innerHTML = `<img src="${currentUser.avatar_url}" alt="${currentUser.username}">`;
        } else {
            ui.settingsAvatar.textContent = currentUser.username.charAt(0).toUpperCase();
        }
        showSettingsModal();
    };

    ui.themeToggle.onchange = () => {
        userSettings.theme = ui.themeToggle.checked ? 'dark' : 'light';
        saveSettings();
        applySettings();
    };

    ui.fontSizeSelect.onchange = () => {
        userSettings.fontSize = ui.fontSizeSelect.value;
        saveSettings();
        applySettings();
    };

    ui.notificationsToggle.onchange = () => {
        userSettings.notifications = ui.notificationsToggle.checked;
        saveSettings();
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
            showInfoModal('Invalid File', 'Please select an image file.');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showInfoModal('File Too Large', 'Please select an image smaller than 5MB.');
            return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${currentUser.id}/${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (uploadError) {
            console.error('Upload error:', uploadError);
            showInfoModal('Upload Failed', 'Could not upload avatar. Please try again.');
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);

        const { error: updateError } = await supabase
            .from('profiles')
            .update({ avatar_url: publicUrl })
            .eq('id', currentUser.id);

        if (updateError) {
            console.error('Update error:', updateError);
            showInfoModal('Update Failed', 'Could not update avatar. Please try again.');
            return;
        }

        currentUser.avatar_url = publicUrl;
        ui.userAvatar.innerHTML = `<img src="${publicUrl}" alt="${currentUser.username}">`;
        ui.settingsAvatar.innerHTML = `<img src="${publicUrl}" alt="${currentUser.username}">`;

        showInfoModal('Success', 'Avatar updated successfully!');
    };

    ui.changeUsernameBtn.onclick = () => {
        hideSettingsModal();
        showModal('changeUsername');
    };

    ui.changeUsernameForm.onsubmit = async (e) => {
        e.preventDefault();
        const newUsername = ui.newUsernameInput.value.trim();

        if (newUsername.length < 3) {
            showInfoModal('Invalid Username', 'Username must be at least 3 characters.');
            return;
        }

        if (newUsername === currentUser.username) {
            showInfoModal('Same Username', 'This is already your username.');
            return;
        }

        const { data: existing } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', newUsername)
            .single();

        if (existing) {
            showInfoModal('Username Taken', 'This username is already in use.');
            return;
        }

        const { error } = await supabase
            .from('profiles')
            .update({ username: newUsername })
            .eq('id', currentUser.id);

        if (error) {
            console.error('Update error:', error);
            showInfoModal('Update Failed', 'Could not update username. Please try again.');
            return;
        }

        currentUser.username = newUsername;
        ui.usernameDisplay.textContent = newUsername;
        ui.settingsUsername.textContent = newUsername;
        ui.newUsernameInput.value = '';

        hideModal();
        showInfoModal('Success', 'Username updated successfully!');
    };

    ui.chatOptionsBtn.onclick = () => {
        showModal('chatOptions');
    };

    ui.viewProfileBtn.onclick = () => {
        hideModal();
        showFriendProfile(currentChatFriend);
    };

    const showFriendProfile = (friend) => {
        if (friend.avatar_url) {
            ui.profileAvatar.innerHTML = `<img src="${friend.avatar_url}" alt="${friend.username}">`;
        } else {
            ui.profileAvatar.textContent = friend.username.charAt(0).toUpperCase();
        }

        ui.profileUsername.textContent = friend.username;
        ui.profileUsernameValue.textContent = friend.username;

        if (friend.is_online) {
            ui.profileStatusDot.classList.add('online');
            ui.profileStatusText.textContent = 'Online';
        } else {
            ui.profileStatusDot.classList.remove('online');
            ui.profileStatusText.textContent = 'Offline';
        }

        if (friend.created_at) {
            const joinDate = new Date(friend.created_at);
            ui.profileJoinedDate.textContent = joinDate.toLocaleDateString();
        } else {
            ui.profileJoinedDate.textContent = 'Unknown';
        }

        showModal('friendProfile');
    };

    ui.messageUserBtn.onclick = () => {
        hideModal();
        if (currentChatFriend) {
            ui.messageInput.focus();
        }
    };

    ui.callUserBtn.onclick = () => {
        hideModal();
        if (currentChatFriend) {
            startCall(currentChatFriend);
        }
    };

    ui.unfriendBtn.onclick = () => {
        hideModal();
        const friendToRemove = currentChatFriend;
        showConfirmationModal(
            `Are you sure you want to remove ${friendToRemove.username} from your friends?`,
            async () => {
                const userId1 = currentUser.id < friendToRemove.id ? currentUser.id : friendToRemove.id;
                const userId2 = currentUser.id < friendToRemove.id ? friendToRemove.id : currentUser.id;

                const { error } = await supabase
                    .from('friends')
                    .delete()
                    .eq('user_id_1', userId1)
                    .eq('user_id_2', userId2);

                if (error) {
                    console.error('[DEBUG] Error removing friend:', error);
                    showInfoModal('Error', 'Could not remove friend. Please try again.');
                    return;
                }
                delete friends[friendToRemove.id];
                closeChat();

                if (window.innerWidth <= 768) {
                    ui.chatContainer.classList.remove('active');
                    ui.sidebar.classList.remove('hidden');
                }

                showInfoModal('Friend Removed', `${friendToRemove.username} has been removed from your friends.`);
            },
            'Remove Friend',
            'Remove',
            'danger'
        );
    };

    ui.blockUserBtn.onclick = () => {
        hideModal();
        const userToBlock = currentChatFriend;
        showConfirmationModal(
            `Are you sure you want to block ${userToBlock.username}? They won't be able to message you and will be removed from your friends.`,
            async () => {
                const userId1 = currentUser.id < userToBlock.id ? currentUser.id : userToBlock.id;
                const userId2 = currentUser.id < userToBlock.id ? userToBlock.id : currentUser.id;

                const { error: blockError } = await supabase
                    .from('blocked_users')
                    .insert({
                        user_id: currentUser.id,
                        blocked_user_id: userToBlock.id
                    });

                if (blockError && blockError.code !== '23505') {
                    console.error('[DEBUG] Error blocking user:', blockError);
                    showInfoModal('Error', 'Could not block user. Please try again.');
                    return;
                }

                const { error: unfriendError } = await supabase
                    .from('friends')
                    .delete()
                    .eq('user_id_1', userId1)
                    .eq('user_id_2', userId2);

                if (unfriendError) {
                    console.error('[DEBUG] Error removing friend:', unfriendError);
                }

                blockedUsers.add(userToBlock.id);
                delete friends[userToBlock.id];
                closeChat();

                if (window.innerWidth <= 768) {
                    ui.chatContainer.classList.remove('active');
                    ui.sidebar.classList.remove('hidden');
                }

                showInfoModal('User Blocked', `${userToBlock.username} has been blocked and removed from your friends.`);
            },
            'Block User',
            'Block',
            'danger'
        );
    };

    ui.muteConversationBtn.onclick = () => {
        hideModal();
        showInfoModal('Feature Coming Soon', 'The mute conversation feature will be available in a future update.');
    };

    ui.friendsList.onclick = (e) => {
        const friendItem = e.target.closest('.friend-item');
        if (!friendItem) return;

        const itemId = friendItem.dataset.id;
        const itemType = friendItem.dataset.type;

        openChat(itemId, itemType);
    };

    ui.messageForm.onsubmit = async (e) => {
        e.preventDefault();
        const content = ui.messageInput.value.trim();
        if (!content || !currentChatFriend) return;

        if (blockedUsers.has(currentChatFriend.id)) {
            showInfoModal('Cannot Send', 'You have blocked this user.');
            return;
        }

        ui.messageInput.value = '';
        adjustTextareaHeight();

        if (currentChatType === 'friend') {
            const message = {
                sender_id: currentUser.id,
                receiver_id: currentChatFriend.id,
                content: content,
                created_at: new Date().toISOString(),
            };

            addMessageToUI({ ...message });

            if (dataConnection && dataConnection.open) {
                dataConnection.send({
                    type: 'chat-message',
                    message: message,
                    sender_id: currentUser.id
                });
            }

            const { error } = await supabase.from('messages').insert({
                sender_id: message.sender_id,
                receiver_id: message.receiver_id,
                content: message.content
            });

            if (error) {
                console.error('Error saving message:', error);
                showInfoModal('Send Failed', 'Your message could not be saved.');
            }
        } else if (currentChatType === 'group') {
            showInfoModal('Not Supported', 'Group messages are not available.');

            const { error } = await supabase.from('group_messages').insert({
                group_id: currentChatFriend.id,
                sender_id: currentUser.id,
                content: content
            });

            if (error) {
                console.error('Error saving group message:', error);
                showInfoModal('Send Failed', 'Your message could not be sent.');
            }
        }
    };

    ui.messageInput.addEventListener('input', () => {
        adjustTextareaHeight();

        if (currentChatType === 'friend') {
            if (typingTimeout) clearTimeout(typingTimeout);

            sendTypingStatus(true);

            typingTimeout = setTimeout(() => {
                sendTypingStatus(false);
            }, 2000);
        }
    });

    ui.backToFriendsBtn.onclick = () => {
        if (isInCall) {
            showCallUI(true);
        } else {
            ui.chatContainer.classList.remove('active');
            ui.sidebar.classList.remove('hidden');
            history.pushState(null, '', '/');
            handleRouteChange();
        }
    };

    ui.modalContainer.addEventListener('click', (e) => {
        if (e.target === ui.modalContainer) {
            hideModal();
        }
    });

    ui.settingsModalContainer.addEventListener('click', (e) => {
        if (e.target === ui.settingsModalContainer) {
            hideSettingsModal();
        }
    });

    ui.callBtn.onclick = () => startCall(currentChatFriend);
    ui.acceptCallBtn.onclick = acceptCall;
    ui.declineCallBtn.onclick = declineCall;
    ui.stopCallBtn.onclick = endCall;
    ui.infoOkBtn.onclick = hideModal;

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

    ui.confirmBtn.onclick = () => {
        if (confirmCallback) {
            const callback = confirmCallback;
            confirmCallback = null;
            hideModal();
            callback();
        } else {
            hideModal();
        }
    };

    ui.cancelBtn.onclick = () => {
        confirmCallback = null;
        hideModal();
    };

    window.addEventListener('popstate', handleRouteChange);

    ui.chatOverlayBackdrop.onclick = () => toggleChatOverlay(false);

    const setupDrag = () => {
        let isDragging = false;
        let startY, startHeight;

        const dragStart = (e) => {
            isDragging = true;
            startY = e.pageY || e.touches[0].pageY;
            startHeight = ui.chatOverlay.offsetHeight;
            ui.chatOverlay.style.transition = 'none';
            document.body.style.userSelect = 'none';
        };

        const dragMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const currentY = e.pageY || e.touches[0].pageY;
            const diffY = currentY - startY;
            let newHeight = startHeight - diffY;

            const minHeight = 200;
            const maxHeight = window.innerHeight * 0.9;
            if (newHeight < minHeight) newHeight = minHeight;
            if (newHeight > maxHeight) newHeight = maxHeight;

            ui.chatOverlay.style.height = `${newHeight}px`;
        };

        const dragEnd = () => {
            if (!isDragging) return;
            isDragging = false;
            ui.chatOverlay.style.transition = 'transform 0.3s ease-out, height 0.3s ease-out';
            document.body.style.userSelect = '';

            const currentHeight = ui.chatOverlay.offsetHeight;
            if (currentHeight < startHeight * 0.7 && currentHeight < 300) {
                toggleChatOverlay(false);
                ui.chatOverlay.style.height = '';
            }
        };

        ui.chatOverlayHeader.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('mouseup', dragEnd);

        ui.chatOverlayHeader.addEventListener('touchstart', dragStart, { passive: false });
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('touchend', dragEnd);
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

    setupDrag();

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
});