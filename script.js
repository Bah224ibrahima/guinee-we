// Variables globales
let currentUser = {
    id: 1,
    name: "Amadou Diallo",
    username: "amadou_diallo",
    location: "Conakry, Guinée",
    avatar: "https://via.placeholder.com/150",
    followers: 2300,
    following: 456,
    posts: 156
};

let posts = [
    {
        id: 1,
        user: "Fatoumata Camara",
        username: "fatoumata_c",
        avatar: "https://via.placeholder.com/50",
        location: "Kankan, Guinée",
        content: "Magnifique coucher de soleil sur le Niger! 🌅 La beauté de notre Guinée est incomparable.",
        image: "https://via.placeholder.com/500x300",
        likes: 124,
        comments: 23,
        shares: 12,
        timestamp: "Il y a 2 heures",
        liked: false
    },
    {
        id: 2,
        user: "Ibrahim Konaté",
        username: "ibrahim_k",
        avatar: "https://via.placeholder.com/50",
        location: "Labé, Guinée",
        content: "Festival de djembé traditionnel ce weekend! Venez nombreux célébrer notre culture 🥁 #CultureGuinéenne #Djembé",
        likes: 89,
        comments: 15,
        shares: 8,
        timestamp: "Il y a 4 heures",
        liked: true
    },
    {
        id: 3,
        user: "Mariama Bah",
        username: "mariama_bah",
        avatar: "https://via.placeholder.com/50",
        location: "Boké, Guinée",
        content: "Recette traditionnelle du riz au gras de ma grand-mère 🍚 Qui veut la recette?",
        image: "https://via.placeholder.com/500x300",
        likes: 156,
        comments: 34,
        shares: 19,
        timestamp: "Il y a 6 heures",
        liked: false
    }
];

let conversations = [
    {
        id: 1,
        name: "Fatoumata Camara",
        avatar: "https://via.placeholder.com/50",
        lastMessage: "Salut! Comment tu vas?",
        timestamp: "Il y a 5 min",
        messages: [
            { sender: "them", message: "Salut! Comment tu vas?", time: "14:30" },
            { sender: "me", message: "Ça va bien merci! Et toi?", time: "14:32" },
            { sender: "them", message: "Super! Tu viens au festival ce weekend?", time: "14:35" }
        ]
    },
    {
        id: 2,
        name: "Ibrahim Konaté",
        avatar: "https://via.placeholder.com/50",
        lastMessage: "À bientôt!",
        timestamp: "Il y a 1h",
        messages: [
            { sender: "them", message: "Hey! Tu as vu mon post sur le djembé?", time: "13:20" },
            { sender: "me", message: "Oui! C'est génial, j'aimerais venir", time: "13:25" },
            { sender: "them", message: "Parfait! À bientôt!", time: "13:26" }
        ]
    }
];

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    loadConversations();
    setupEventListeners();
    showSection('home');
});

// Configuration des événements
function setupEventListeners() {
    // Recherche en temps réel
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    
    // Soumission de message avec Entrée
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Soumission de post avec Ctrl+Entrée
    document.getElementById('postInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.ctrlKey) {
            createPost();
        }
    });

    // Upload de média
    document.getElementById('mediaFile').addEventListener('change', handleMediaUpload);
}

// Navigation entre sections
function showSection(sectionName) {
    // Cacher toutes les sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Afficher la section demandée
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Mettre à jour les boutons de navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
}

// Chargement des posts
function loadPosts() {
    const postsFeed = document.getElementById('postsFeed');
    postsFeed.innerHTML = '';
    
    posts.forEach(post => {
        const postElement = createPostElement(post);
        postsFeed.appendChild(postElement);
    });
}

// Création d'un élément post
function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'post-card guinea-theme';
    postDiv.innerHTML = `
        <div class="post-header">
            <img src="${post.avatar}" alt="Profile" class="profile-pic-small">
            <div class="post-user-info">
                <h4>${post.user}</h4>
                <small>${post.location} • ${post.timestamp}</small>
            </div>
        </div>
        
        <div class="post-content">
            <p>${post.content}</p>
            ${post.image ? `<img src="${post.image}" alt="Post media" class="post-media">` : ''}
        </div>
        
        <div class="post-actions">
            <button class="action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike(${post.id})">
                <i class="fas fa-heart"></i> ${post.likes}
            </button>
            <button class="action-btn" onclick="showComments(${post.id})">
                <i class="fas fa-comment"></i> ${post.comments}
            </button>
            <button class="action-btn" onclick="sharePost(${post.id})">
                <i class="fas fa-share"></i> ${post.shares}
            </button>
        </div>
    `;
    
    return postDiv;
}

// Système de like
function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        if (post.liked) {
            post.likes--;
            post.liked = false;
        } else {
            post.likes++;
            post.liked = true;
        }
        
        // Animation de like
        showNotification(post.liked ? '❤️ Post aimé!' : '💔 Like retiré', 'success');
        loadPosts();
    }
}

// Partage de post
function sharePost(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.shares++;
        showNotification('📤 Post partagé!', 'success');
        loadPosts();
        
        // Simulation de partage social
        if (navigator.share) {
            navigator.share({
                title: 'Guinée Web - ' + post.user,
                text: post.content,
                url: window.location.href
            });
        }
    }
}

// Création d'un nouveau post
function createPost() {
    const postInput = document.getElementById('postInput');
    const content = postInput.value.trim();
    
    if (content === '') {
        showNotification('⚠️ Veuillez écrire quelque chose!', 'warning');
        return;
    }
    
    const newPost = {
        id: posts.length + 1,
        user: currentUser.name,
        username: currentUser.username,
        avatar: currentUser.avatar,
        location: currentUser.location,
        content: content,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: "À l'instant",
        liked: false
    };
    
    // Gestion de l'upload de média
    const mediaFile = document.getElementById('mediaFile');
    if (mediaFile.files.length > 0) {
        const file = mediaFile.files[0];
        newPost.image = URL.createObjectURL(file);
    }
    
    posts.unshift(newPost);
    loadPosts();
    
    // Réinitialiser le formulaire
    postInput.value = '';
    mediaFile.value = '';
    toggleMediaUpload();
    
    showNotification('✅ Post publié avec succès!', 'success');
}

// Toggle upload de média
function toggleMediaUpload() {
    const mediaUpload = document.getElementById('mediaUpload');
    mediaUpload.style.display = mediaUpload.style.display === 'none' ? 'block' : 'none';
}

// Gestion de l'upload de média
function handleMediaUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const fileType = file.type;
        const fileSize = file.size / 1024 / 1024; // MB
        
        if (fileSize > 10) {
            showNotification('⚠️ Le fichier est trop volumineux (max 10MB)', 'warning');
            return;
        }
        
        if (fileType.startsWith('image/') || fileType.startsWith('video/')) {
            showNotification(`📁 ${file.name} sélectionné`, 'success');
        } else {
            showNotification('⚠️ Format de fichier non supporté', 'warning');
        }
    }
}

// Chargement des conversations
function loadConversations() {
    const conversationsContainer = document.querySelector('.conversations');
    conversationsContainer.innerHTML = '';
    
    conversations.forEach(conv => {
        const convElement = document.createElement('div');
        convElement.className = 'conversation';
        convElement.onclick = () => openChat(conv.name);
        convElement.innerHTML = `
            <img src="${conv.avatar}" alt="Profile">
            <div class="conv-info">
                <h4>${conv.name}</h4>
                <p>${conv.lastMessage}</p>
                <small>${conv.timestamp}</small>
            </div>
        `;
        conversationsContainer.appendChild(convElement);
    });
}

// Ouverture d'une conversation
function openChat(contactName) {
    document.getElementById('chatWith').textContent = contactName;
    
    // Trouver la conversation
    const conversation = conversations.find(conv => conv.name === contactName);
    if (conversation) {
        loadChatMessages(conversation.messages);
    }
    
    // Marquer la conversation comme active
    const allConvs = document.querySelectorAll('.conversation');
    allConvs.forEach(conv => conv.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// Chargement des messages
function loadChatMessages(messages) {
    const chatMessages = document.getElementById('chatMessages');
    chatMessages.innerHTML = '';
    
    messages.forEach(msg => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${msg.sender === 'me' ? 'sent' : 'received'}`;
        messageElement.innerHTML = `
            ${msg.message}
            <small style="display: block; font-size: 0.8em; opacity: 0.7; margin-top: 5px;">
                ${msg.time}
            </small>
        `;
        chatMessages.appendChild(messageElement);
    });
    
    // Scroll vers le bas
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Envoi de message
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message === '') return;
    
    const chatMessages = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message sent';
    messageElement.innerHTML = `
        ${message}
        <small style="display: block; font-size: 0.8em; opacity: 0.7; margin-top: 5px;">
            ${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
        </small>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    messageInput.value = '';
    
    // Simulation de réponse automatique
    setTimeout(() => {
        const autoReply = document.createElement('div');
        autoReply.className = 'message received';
        autoReply.innerHTML = `
            Merci pour votre message! Je vous réponds bientôt 😊
            <small style="display: block; font-size: 0.8em; opacity: 0.7; margin-top: 5px;">
                ${new Date().toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}
            </small>
        `;
        chatMessages.appendChild(autoReply);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 2000);
}

// Fonction de recherche
function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    
    if (query.length < 2) return;
    
    // Simulation de recherche
    const searchResults = [
        { name: 'Fatoumata Camara', type: 'user', location: 'Kankan, Guinée' },
        { name: 'Festival de Djembé', type: 'event', location: 'Labé, Guinée' },
        { name: '#CultureGuinéenne', type: 'hashtag', posts: '2.3K posts' }
    ];
    
    // Affichage des résultats (à implémenter selon les besoins)
    console.log('Recherche:', query, searchResults);
}

// Affichage des commentaires
function showComments(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        const comments = [
            { user: 'Sékou Touré', comment: 'Magnifique photo!', time: 'Il y a 1h' },
            { user: 'Aminata Diallo', comment: 'J\'adore notre pays ❤️', time: 'Il y a 30min' }
        ];
        
        let commentsHTML = '<div class="comments-modal"><div class="comments-content"><h3>Commentaires</h3>';
        comments.forEach(comment => {
            commentsHTML += `
                <div class="comment">
                    <strong>${comment.user}</strong>
                    <p>${comment.comment}</p>
                    <small>${comment.time}</small>
                </div>
            `;
        });
        commentsHTML += '<button onclick="closeModal()">Fermer</button></div></div>';
        
        document.body.insertAdjacentHTML('beforeend', commentsHTML);
    }
}

// Fermeture de modal
function closeModal() {
    const modal = document.querySelector('.comments-modal');
    if (modal) {
        modal.remove();
    }
}

// Système de notifications
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--guinea-green)' : 
                   type === 'warning' ? 'var(--guinea-yellow)' : 
                   type === 'error' ? 'var(--guinea-red)' : 'var(--guinea-gray)'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(300px);
        transition: all 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Suppression automatique
    setTimeout(() => {
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Fonctionnalités des shorts
function playShort(videoElement) {
    if (videoElement.paused) {
        videoElement.play();
    } else {
        videoElement.pause();
    }
}

// Système de suivi d'utilisateurs
function followUser(userId) {
    showNotification('👥 Vous suivez maintenant cet utilisateur!', 'success');
    
    // Mise à jour du bouton
    const followBtn = event.target;
    followBtn.textContent = 'Suivi';
    followBtn.style.background = 'var(--guinea-green)';
    followBtn.disabled = true;
}

// Mise à jour du profil
function updateProfile() {
    showNotification('✅ Profil mis à jour!', 'success');
}

// Génération de contenu culturel aléatoire
function generateCulturalContent() {
    const culturalPosts = [
        "🎭 Les masques traditionnels baga sont de véritables œuvres d'art!",
        "🥁 Le son du djembé résonne dans tout Conakry ce soir!",
        "🍚 Rien de mieux qu'un bon riz au gras préparé avec amour!",
        "🌍 Fier d'être guinéen! Notre culture est si riche!",
        "🎵 Les griots perpétuent nos traditions orales depuis des siècles!"
    ];
    
    const randomPost = culturalPosts[Math.floor(Math.random() * culturalPosts.length)];
    document.getElementById('postInput').value = randomPost;
}

// Gestion du mode sombre/clair
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Chargement du thème sauvegardé
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
}

// Fonctionnalités temps réel (simulation)
function startRealTimeUpdates() {
    // Simulation de nouvelles notifications
    setInterval(() => {
        const notifications = [
            "❤️ Fatoumata a aimé votre post",
            "💬 Nouveau commentaire sur votre photo",
            "👥 Ibrahim a commencé à vous suivre",
            "📱 Nouveau message de Mariama"
        ];
        
        if (Math.random() < 0.1) { // 10% de chance
            const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
            showNotification(randomNotification, 'info');
        }
    }, 30000); // Toutes les 30 secondes
}

// Démarrage des mises à jour temps réel
startRealTimeUpdates();

// Gestion des erreurs globales
window.addEventListener('error', function(e) {
    console.error('Erreur:', e.error);
    showNotification('❌ Une erreur est survenue', 'error');
});

// Fonctions utilitaires
function formatTime(date) {
    return new Date(date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function truncateText(text, maxLength) {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// Export des fonctions pour utilisation globale
window.guineaWeb = {
    showSection,
    createPost,
    toggleLike,
    sharePost,
    sendMessage,
    openChat,
    followUser,
    showNotification
};

// Initialisation finale
console.log('🇬🇳 Guinée Web chargé avec succès!');
loadSavedTheme();