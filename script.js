 
        document.addEventListener('DOMContentLoaded', function () {
            // DOM Elements
            const platformTabs = document.querySelectorAll('.platform-tab');
            const contactNameInput = document.getElementById('contact-name-input');
            const usernameInput = document.getElementById('username-input');
            const contactStatusSelect = document.getElementById('contact-status-select');
            const lastSeenDateGroup = document.getElementById('last-seen-date-group');
            const lastSeenTimeGroup = document.getElementById('last-seen-time-group');
            const lastSeenDateInput = document.getElementById('last-seen-date');
            const lastSeenTimeInput = document.getElementById('last-seen-time');
            const customStatusTextGroup = document.getElementById('custom-status-text-group');
            const customStatusText = document.getElementById('custom-status-text');
            const profilePicUpload = document.getElementById('profile-pic-upload');
            const messageTextInput = document.getElementById('message-text');
            const messageStatusSelect = document.getElementById('message-status');
            const generateBtn = document.getElementById('generate-btn');
            const downloadBtn = document.getElementById('download-btn');
            const shareFacebookBtn = document.getElementById('share-facebook');
            const shareTwitterBtn = document.getElementById('share-twitter');
            const shareLinkedInBtn = document.getElementById('share-linkedin');
            const shareInstagramBtn = document.getElementById('share-instagram');
            const copyLinkBtn = document.getElementById('copy-link');
            const chatBody = document.getElementById('chat-body');
            const contactNameDisplay = document.getElementById('contact-name');
            const usernameDisplay = document.getElementById('username');
            const emojiPicker = document.getElementById('emoji-picker');
            const profilePic = document.getElementById('profile-pic');
            const chatHeaderActions = document.getElementById('chat-header-actions');
            const instagramReplyOptions = document.getElementById('instagram-reply-options');

            // Emoji list
            const emojis = ["😀", "😂", "🥰", "😎", "🤔", "🙄", "😏", "😒", "😍", "😘", "🤪", "😭", "😤", "😱", "👋", "👍", "👎", "❤️", "🔥", "💯"];

            // Current platform
            let currentPlatform = 'whatsapp';

            // Initialize
            renderEmojiPicker();
            // Set initial active tab based on defaultPlatform
            document.querySelector(`.platform-tab[data-platform="${currentPlatform}"]`).classList.add('active');
            chatBody.className = 'chat-body ' + currentPlatform; // Apply initial platform class to chat body
            updateChat();

            // Event listeners
            platformTabs.forEach(tab => {
                tab.addEventListener('click', function () {
                    platformTabs.forEach(t => t.classList.remove('active'));
                    this.classList.add('active');
                    currentPlatform = this.dataset.platform;

                    // Update chat body class and header class
                    document.querySelector('.container').className = 'container ' + currentPlatform;
                    chatBody.className = 'chat-body ' + currentPlatform;

                    // Hide Instagram reply options if switching platform
                    instagramReplyOptions.classList.remove('show');

                    updateHeader(); // Update header elements based on new platform
                    updateChat(); // Re-render chat for new platform styling
                });
            });

            contactNameInput.addEventListener('input', updateHeader);
            usernameInput.addEventListener('input', updateHeader); // Added listener for username input
            contactStatusSelect.addEventListener('change', function () {
                toggleStatusInputs();
                updateHeader();
            });
            lastSeenDateInput.addEventListener('input', updateHeader);
            lastSeenTimeInput.addEventListener('input', updateHeader);
            customStatusText.addEventListener('input', updateHeader);

            profilePicUpload.addEventListener('change', function (event) {
                if (event.target.files && event.target.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function (e) {
                        profilePic.src = e.target.result;
                    };
                    reader.readAsDataURL(event.target.files[0]);
                }
            });

            generateBtn.addEventListener('click', updateChat);
            messageTextInput.addEventListener('input', updateChat); // Live update for messages
            messageStatusSelect.addEventListener('change', updateChat); // Live update for message status

            downloadBtn.addEventListener('click', downloadAsImage);
            shareFacebookBtn.addEventListener('click', () => shareOnSocialMedia('facebook'));
            shareTwitterBtn.addEventListener('click', () => shareOnSocialMedia('twitter'));
            shareLinkedInBtn.addEventListener('click', () => shareOnSocialMedia('linkedin'));
            shareInstagramBtn.addEventListener('click', () => shareOnSocialMedia('instagram'));
            copyLinkBtn.addEventListener('click', copyLinkToClipboard);

            // Hide Instagram reply options when clicking outside the menu
            document.addEventListener('click', function (event) {
                if (currentPlatform === 'instagram' && instagramReplyOptions.classList.contains('show') && !instagramReplyOptions.contains(event.target) && !event.target.closest('.message')) {
                    instagramReplyOptions.classList.remove('show');
                }
            });

            // Initial toggle for status inputs
            toggleStatusInputs();

            // Functions
            function toggleStatusInputs() {
                const statusType = contactStatusSelect.value;
                lastSeenDateGroup.style.display = 'none';
                lastSeenTimeGroup.style.display = 'none';
                customStatusTextGroup.style.display = 'none';

                if (statusType === 'lastseen') {
                    lastSeenDateGroup.style.display = 'flex';
                    lastSeenTimeGroup.style.display = 'flex';
                } else if (statusType === 'custom') {
                    customStatusTextGroup.style.display = 'flex';
                }
            }

            function updateHeader() {
                contactNameDisplay.textContent = contactNameInput.value;
                usernameDisplay.textContent = usernameInput.value; // Update username display

                const statusType = contactStatusSelect.value;
                let statusText = '';
                let callButtonsHTML = '';

                switch (currentPlatform) {
                    case 'whatsapp':
                    case 'messenger':
                    case 'imessage':
                    case 'tiktok':
                        callButtonsHTML = '<i class="fas fa-phone-alt"></i><i class="fas fa-video"></i>';
                        break;
                    case 'instagram':
                    case 'threads':
                        callButtonsHTML = ''; // No call buttons for Instagram/Threads usually in header, or they are in a different place
                        break;
                }
                chatHeaderActions.innerHTML = callButtonsHTML;


                if (statusType === 'online') {
                    statusText = 'online';
                } else if (statusType === 'typing') {
                    statusText = 'typing...';
                } else if (statusType === 'lastseen') {
                    const dateVal = lastSeenDateInput.value;
                    const timeVal = lastSeenTimeInput.value;
                    if (dateVal && timeVal) {
                        const date = new Date(dateVal + 'T' + timeVal);
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        const yesterday = new Date(today);
                        yesterday.setDate(today.getDate() - 1);

                        let datePrefix = '';
                        if (date.toDateString() === today.toDateString()) {
                            datePrefix = 'today';
                        } else if (date.toDateString() === yesterday.toDateString()) {
                            datePrefix = 'yesterday';
                        } else {
                            datePrefix = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                        }
                        statusText = `last seen ${datePrefix} at ${formatTime(date)}`;
                    } else {
                        statusText = 'last seen recently'; // Default if date/time not set
                    }
                } else if (statusType === 'custom') {
                    statusText = customStatusText.value || 'Custom Status';
                }
                usernameDisplay.textContent = statusText; // Display status in the username spot
            }

            function formatTime(date) {
                let hours = date.getHours();
                const minutes = date.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12; // the hour '0' should be '12'
                const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
                return `${hours}:${formattedMinutes} ${ampm}`;
            }

            function renderEmojiPicker() {
                emojis.forEach(emoji => {
                    const button = document.createElement('button');
                    button.classList.add('emoji-btn');
                    button.textContent = emoji;
                    button.addEventListener('click', () => {
                        const start = messageTextInput.selectionStart;
                        const end = messageTextInput.selectionEnd;
                        const text = messageTextInput.value;
                        messageTextInput.value = text.substring(0, start) + emoji + text.substring(end);
                        messageTextInput.focus();
                        messageTextInput.selectionEnd = start + emoji.length; // Place cursor after inserted emoji
                        updateChat(); // Update chat immediately after emoji insertion
                    });
                    emojiPicker.appendChild(button);
                });
            }

            function updateChat() {
                chatBody.innerHTML = ''; // Clear existing messages
                const messages = messageTextInput.value.split('\n').filter(line => line.trim() !== '');
                const currentMessageStatus = messageStatusSelect.value;
                const lastMessageType = messages.length > 0 ? messages[messages.length - 1].startsWith('[S]') ? 'sent' : 'received' : '';

                messages.forEach((msgLine, index) => {
                    let messageType = '';
                    let messageContent = msgLine;

                    if (msgLine.startsWith('[S]')) {
                        messageType = 'sent';
                        messageContent = msgLine.substring(3).trim();
                    } else if (msgLine.startsWith('[R]')) {
                        messageType = 'received';
                        messageContent = msgLine.substring(3).trim();
                    } else {
                        // Default to received if no prefix, or handle as a different message type if desired
                        messageType = 'received';
                    }

                    if (messageContent) { // Only create message if there's content
                        const messageDiv = document.createElement('div');
                        messageDiv.classList.add('message', messageType);

                        let timeString = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

                        let tickHtml = '';
                        if (messageType === 'sent' && currentPlatform === 'whatsapp') {
                            if (currentMessageStatus === 'read') {
                                tickHtml = `<span class="tick read double-tick">
                                    <svg viewBox="0 0 16 15" width="12" height="12" class="tick-1">
                                        <path d="M15.01 3.236l-7.24 7.24-2.827-2.827a.996.996 0 1 0-1.414 1.414l3.535 3.535a.996.996 0 0 0 1.414 0l7.95-7.95a.996.996 0 0 0-1.414-1.414z"/>
                                    </svg>
                                    <svg viewBox="0 0 16 15" width="12" height="12" class="tick-2">
                                        <path d="M15.01 3.236l-7.24 7.24-2.827-2.827a.996.996 0 1 0-1.414 1.414l3.535 3.535a.996.996 0 0 0 1.414 0l7.95-7.95a.996.996 0 0 0-1.414-1.414z"/>
                                    </svg>
                                </span>`;
                            } else if (currentMessageStatus === 'delivered') {
                                tickHtml = `<span class="tick single-tick">
                                    <svg viewBox="0 0 16 15" width="12" height="12">
                                        <path d="M15.01 3.236l-7.24 7.24-2.827-2.827a.996.996 0 1 0-1.414 1.414l3.535 3.535a.996.996 0 0 0 1.414 0l7.95-7.95a.996.996 0 0 0-1.414-1.414z"/>
                                    </svg>
                                </span>`;
                            }
                        } else if (messageType === 'sent') {
                            // Platform-specific read receipts
                            if (currentMessageStatus === 'read' || currentMessageStatus === 'delivered') {
                                switch (currentPlatform) {
                                    case 'messenger':
                                        tickHtml = `<span class="tick messenger-tick">
                                            <svg viewBox="0 0 16 15" width="10" height="10">
                                                <path d="M15.01 3.236l-7.24 7.24-2.827-2.827a.996.996 0 1 0-1.414 1.414l3.535 3.535a.996.996 0 0 0 1.414 0l7.95-7.95a.996.996 0 0 0-1.414-1.414z"/>
                                            </svg>
                                        </span>`;
                                        break;
                                    case 'imessage':
                                        tickHtml = `<span class="tick imessage-tick">Delivered</span>`;
                                        break;
                                    case 'instagram':
                                        tickHtml = `<span class="tick instagram-tick">
                                            <svg viewBox="0 0 16 15" width="10" height="10">
                                                <path d="M15.01 3.236l-7.24 7.24-2.827-2.827a.996.996 0 1 0-1.414 1.414l3.535 3.535a.996.996 0 0 0 1.414 0l7.95-7.95a.996.996 0 0 0-1.414-1.414z"/>
                                            </svg>
                                        </span>`;
                                        break;
                                    case 'tiktok':
                                        tickHtml = `<span class="tick tiktok-tick">
                                            <svg viewBox="0 0 16 15" width="10" height="10">
                                                <path d="M15.01 3.236l-7.24 7.24-2.827-2.827a.996.996 0 1 0-1.414 1.414l3.535 3.535a.996.996 0 0 0 1.414 0l7.95-7.95a.996.996 0 0 0-1.414-1.414z"/>
                                            </svg>
                                        </span>`;
                                        break;
                                    case 'threads':
                                        tickHtml = `<span class="tick threads-tick">
                                            <svg viewBox="0 0 16 15" width="10" height="10">
                                                <path d="M15.01 3.236l-7.24 7.24-2.827-2.827a.996.996 0 1 0-1.414 1.414l3.535 3.535a.996.996 0 0 0 1.414 0l7.95-7.95a.996.996 0 0 0-1.414-1.414z"/>
                                            </svg>
                                        </span>`;
                                        break;
                                    default:
                                        tickHtml = `<span class="tick"><i class="fas fa-check"></i></span>`;
                                }
                            }
                        }

                        messageDiv.innerHTML = `${messageContent}<span class="message-time">${timeString}${tickHtml}</span>`;

                        if (currentPlatform === 'instagram') {
                            messageDiv.addEventListener('contextmenu', (e) => {
                                e.preventDefault(); // Prevent default right-click menu
                                showInstagramReplyOptions(e.clientX, e.clientY);
                            });
                            messageDiv.addEventListener('click', (e) => {
                                // If already showing, click on message hides it. If not, it shows it.
                                if (instagramReplyOptions.classList.contains('show')) {
                                    instagramReplyOptions.classList.remove('show');
                                } else {
                                    showInstagramReplyOptions(e.clientX, e.clientY);
                                }
                            });
                        }
                        chatBody.appendChild(messageDiv);
                    }
                });

                // Add typing indicator if selected and it's the last message
                if (contactStatusSelect.value === 'typing' && lastMessageType === 'received') {
                    const typingIndicatorDiv = document.createElement('div');
                    typingIndicatorDiv.classList.add('typing-indicator');
                    typingIndicatorDiv.innerHTML = `
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    `;
                    chatBody.appendChild(typingIndicatorDiv);
                }

                // Scroll to bottom of chat
                chatBody.scrollTop = chatBody.scrollHeight;
            }

            function showInstagramReplyOptions(x, y) {
                instagramReplyOptions.style.top = '0'; // Reset position
                instagramReplyOptions.style.left = '0';
                instagramReplyOptions.classList.add('show');

                const menu = instagramReplyOptions.querySelector('.instagram-reply-menu');
                const menuWidth = menu.offsetWidth;
                const menuHeight = menu.offsetHeight;

                // Adjust position to stay within bounds
                let left = x;
                let top = y;

                if (left + menuWidth > window.innerWidth - 20) { // 20px padding from right edge
                    left = window.innerWidth - menuWidth - 20;
                }
                if (top + menuHeight > window.innerHeight - 20) { // 20px padding from bottom edge
                    top = window.innerHeight - menuHeight - 20;
                }

                // Position relative to the container for correct screenshot
                const containerRect = document.querySelector('.container').getBoundingClientRect();
                menu.style.position = 'absolute';
                menu.style.left = `${left - containerRect.left}px`;
                menu.style.top = `${top - containerRect.top}px`;
            }


            function downloadAsImage() {
                // Temporarily hide controls and other elements not part of the chat screenshot
                const controls = document.querySelector('.controls-column');
                const description = document.querySelector('.website-description');
                const disclaimer = document.querySelector('.disclaimer');
                const platformSelector = document.querySelector('.platform-selector'); // Hide platform selector too

                controls.style.display = 'none';
                description.style.display = 'none';
                disclaimer.style.display = 'none';
                platformSelector.style.display = 'none';

                // Ensure the Instagram reply options are hidden before screenshot
                instagramReplyOptions.classList.remove('show');

                html2canvas(document.querySelector('.container'), {
                    scale: 2, // Increase scale for higher resolution
                    useCORS: true, // Important for loading external images like profile pics and WhatsApp background
                    logging: true,
                    allowTaint: true // Allow images from other origins to be "tainted" on the canvas
                }).then(canvas => {
                    const link = document.createElement('a');
                    link.download = 'chat-screenshot.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();

                    // Restore visibility
                    controls.style.display = 'block'; // Or 'flex' depending on original display
                    description.style.display = 'block';
                    disclaimer.style.display = 'block';
                    platformSelector.style.display = 'flex'; // Restore as flex
                }).catch(error => {
                    console.error('oops, something went wrong!', error);
                    // Ensure visibility is restored even on error
                    controls.style.display = 'block';
                    description.style.display = 'block';
                    disclaimer.style.display = 'block';
                    platformSelector.style.display = 'flex';
                });
            }

            function shareOnSocialMedia(platform) {
                const url = encodeURIComponent(window.location.href);
                const text = encodeURIComponent("Check out my fake chat screenshot from UnreadMyMessage.com!");
                let shareUrl = '';

                switch (platform) {
                    case 'facebook':
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                        break;
                    case 'twitter':
                        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
                        break;
                    case 'linkedin':
                        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`;
                        break;
                    case 'instagram':
                        alert("For Instagram, please download the image and upload it manually.");
                        return; // Instagram sharing is typically via direct upload, not URL
                }

                if (shareUrl) {
                    window.open(shareUrl, '_blank');
                }
            }

            function copyLinkToClipboard() {
                const dummy = document.createElement('textarea');
                document.body.appendChild(dummy);
                dummy.value = window.location.href;
                dummy.select();
                document.execCommand('copy');
                document.body.removeChild(dummy);
                alert('Link copied to clipboard!');
            }
        });
    