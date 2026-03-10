import { api } from './api.js';

let allGames = [];
let filteredGames = [];
let currentPage = 1;
const PAGE_SIZE = 4; // 嚴格限制每頁 4 個

/**
 * 初始化
 */
async function initLobby() {
    try {
        allGames = await api.getActiveGames();
        // 初始狀態：顯示全部（對應首頁 TOP 4 邏輯）
        filteredGames = [...allGames];
        renderCurrentPage();
    } catch (err) {
        document.getElementById('game-grid').innerHTML = '<p style="text-align:center; padding:20px;">載入失敗</p>';
    }
}

/**
 * 渲染邏輯
 */
function renderCurrentPage() {
    const grid = document.getElementById('game-grid');
    const pageNum = document.getElementById('page-num');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const pagination = document.getElementById('pagination');

    // 計算分頁
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const itemsToShow = filteredGames.slice(start, end);

    // 渲染卡片
    grid.innerHTML = itemsToShow.map(game => `
        <div class="game-card" onclick="location.href='${game.game_url}'">
            <div class="game-img-wrapper">
                <div class="game-img" style="background-image: url('./images/${game.image_path}')"></div>
            </div>
            <div class="game-info">
                <div class="game-title">${game.name}</div>
                <div class="game-desc">${game.category} | 立即開賽</div>
            </div>
        </div>
    `).join('');

    // 更新頁碼與按鈕狀態
    pageNum.innerText = currentPage;
    prevBtn.disabled = (currentPage === 1);
    nextBtn.disabled = (end >= filteredGames.length);
    
    // 如果總數小於等於 4，隱藏分頁器
    pagination.style.display = filteredGames.length > PAGE_SIZE ? 'flex' : 'none';
}

/**
 * 分頁切換
 */
window.changePage = (step) => {
    currentPage += step;
    renderCurrentPage();
    window.scrollTo({ top: 400, behavior: 'smooth' }); // 捲動到遊戲區起點
};

/**
 * 分類篩選
 */
window.filterCategory = (cat, el) => {
    const titleEl = document.getElementById('display-title');
    
    // 更新標題內容
    if (cat === 'all') {
        titleEl.innerText = "熱門推薦 TOP 4";
    } else {
        titleEl.innerText = `${cat}系列`;
    }

    filteredGames = cat === 'all' ? allGames : allGames.filter(g => g.category === cat);
    currentPage = 1;
    renderCurrentPage();
};

document.addEventListener('DOMContentLoaded', initLobby);
