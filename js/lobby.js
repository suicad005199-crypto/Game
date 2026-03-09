import { api } from './api.js';

let allGames = [];

/**
 * 初始化載入資料
 */
async function initLobby() {
    const grid = document.getElementById('game-grid');
    try {
        allGames = await api.getActiveGames();
        console.log('[Lobby] 資料同步成功', allGames.length, '款遊戲');
        renderGames(allGames);
    } catch (err) {
        grid.innerHTML = '<p style="color: #ff4436; text-align: center;">連線異常，請重整</p>';
    }
}

/**
 * 渲染卡片邏輯
 */
function renderGames(list) {
    const grid = document.getElementById('game-grid');
    
    if (!list.length) {
        grid.innerHTML = '<p style="text-align: center; grid-column: span 2; color: #444; padding: 50px 0;">目前無符合分類的遊戲</p>';
        return;
    }

    grid.innerHTML = list.map(game => `
        <div class="game-card" onclick="location.href='${game.game_url}'">
            <div class="game-img-wrapper">
                <div class="game-img" style="background-image: url('./images/${game.image_path}')"></div>
                <div class="game-badge">${game.category}</div>
            </div>
            <div class="game-info">
                <div class="game-title">${game.name}</div>
                <div class="game-desc">${game.description || '立即開始遊戲'}</div>
            </div>
        </div>
    `).join('');
}

/**
 * 全域過濾函數
 * @param {string} cat 分類標籤
 * @param {HTMLElement} el 點擊的選單元素
 */
window.filterCategory = (cat, el) => {
    // 1. 切換側邊欄選單的高亮狀態
    document.querySelectorAll('.sidebar-menu li').forEach(item => item.classList.remove('active'));
    el.classList.add('active');

    // 2. 執行過濾
    const filtered = cat === 'all' ? allGames : allGames.filter(g => g.category === cat);
    renderGames(filtered);

    // 3. 過濾完後自動收起漢堡選單
    if (typeof window.toggleMenu === 'function') {
        window.toggleMenu();
    }
    
    // 4. 回到頂部以獲得最佳視覺感受
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.addEventListener('DOMContentLoaded', initLobby);
