import { api } from './api.js';

let allGames = [];

async function initLobby() {
    const grid = document.getElementById('game-grid');
    try {
        allGames = await api.getActiveGames();
        renderGames(allGames);
    } catch (err) {
        grid.innerHTML = '<p style="color: red; text-align: center;">連線異常</p>';
    }
}

function renderGames(list) {
    const grid = document.getElementById('game-grid');
    if (!list.length) {
        grid.innerHTML = '<p style="text-align: center; grid-column: span 2; color: #444;">暫無相關遊戲</p>';
        return;
    }

    grid.innerHTML = list.map(game => `
        <div class="game-card" onclick="location.href='${game.game_url}'">
            <div class="game-img-wrapper">
                <div class="game-badge">${game.category}</div>
                <div class="game-img" style="background-image: url('./images/${game.image_path}')"></div>
            </div>
            <div class="game-info">
                <div class="game-title">${game.name}</div>
                <div class="game-desc">${game.description || '點擊立即開戰'}</div>
            </div>
        </div>
    `).join('');
}

// 分類篩選並切換高亮狀態
window.filterCategory = (cat, element) => {
    // 1. 切換 CSS 樣式
    document.querySelectorAll('.cat-pill').forEach(el => el.classList.remove('active'));
    element.classList.add('active');

    // 2. 執行篩選
    const filtered = cat === 'all' ? allGames : allGames.filter(g => g.category === cat);
    renderGames(filtered);
    
    // 平滑滾動至頂部
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.addEventListener('DOMContentLoaded', initLobby);
