import { api } from './api.js';

let allGames = [];
let filteredGames = [];
let currentPage = 1;
const PAGE_SIZE = 4; // 限制單頁最多顯示 4 款

/**
 * 初始化載入資料
 */
async function initLobby() {
    const grid = document.getElementById('game-grid');
    try {
        allGames = await api.getActiveGames();
        filteredGames = [...allGames]; // 初始顯示全部
        renderCurrentPage();
    } catch (err) {
        grid.innerHTML = '<p style="color: #ff4436; text-align: center;">連線異常，請重整</p>';
    }
}

/**
 * 依據當前頁碼渲染卡片與更新分頁按鈕狀態
 */
function renderCurrentPage() {
    const grid = document.getElementById('game-grid');
    const pagination = document.getElementById('pagination');
    const pageNum = document.getElementById('page-num');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // 無資料處理
    if (!filteredGames.length) {
        grid.innerHTML = '<p style="text-align: center; grid-column: span 2; color: #444; padding: 50px 0;">目前無符合分類的遊戲</p>';
        pagination.style.display = 'none';
        return;
    }

    // 計算切割範圍
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const itemsToShow = filteredGames.slice(start, end);

    // 渲染遊戲卡片
    grid.innerHTML = itemsToShow.map(game => `
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

    // 控制分頁器顯示與按鈕狀態
    if (filteredGames.length > PAGE_SIZE) {
        pagination.style.display = 'flex';
        pageNum.innerText = currentPage;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = end >= filteredGames.length;
    } else {
        pagination.style.display = 'none';
    }
}

/**
 * 分頁切換功能
 */
window.changePage = (step) => {
    currentPage += step;
    renderCurrentPage();
    window.scrollTo({ top: 0, behavior: 'smooth' }); // 切換後回到上方
};

/**
 * 全域過濾函數 (整合分頁重置)
 */
window.filterCategory = (cat, el) => {
    document.querySelectorAll('.sidebar-menu li').forEach(item => item.classList.remove('active'));
    el.classList.add('active');

    // 執行過濾並重置回第 1 頁
    filteredGames = cat === 'all' ? allGames : allGames.filter(g => g.category === cat);
    currentPage = 1; 

    renderCurrentPage();

    if (typeof window.toggleMenu === 'function') {
        window.toggleMenu();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

document.addEventListener('DOMContentLoaded', initLobby);
