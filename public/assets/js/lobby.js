import { fetchGames } from './games.js';

const renderLobby = async () => {
    const grid = document.getElementById('game-grid');
    grid.className = 'game-grid';
    grid.innerHTML = '<p style="text-align:center; grid-column:span 2;">載入中...</p>';
    
    const games = await fetchGames();
    
    grid.innerHTML = games.map(game => `
        <div class="game-item">
            <img src="./assets/image/games/${game.image_url.split('/').pop()}" alt="${game.title}" onerror="this.src=''">
            <div class="info">
                <div>${game.title}</div>
                <div class="provider">${game.provider}</div>
            </div>
        </div>
    `).join('');
};

document.addEventListener('DOMContentLoaded', renderLobby);
