import { api } from './api.js';
import { auth } from './auth.js';

let allGames = [];
let filteredGames = [];
let currentPage = 1;
const PAGE_SIZE = 4; // 限制單頁最多顯示 4 款

/**
 * 初始化載入資料
 */
async function initLobby() {
    updateUserUI(); // 優先檢查會員狀態

    try {
        allGames = await api.getActiveGames();
        filteredGames = [...allGames]; // 初始顯示全部 (對應首頁 TOP 4)
        renderCurrentPage();
    } catch (err) {
        console.error("載入失敗:", err);
        document.getElementById('game-grid').innerHTML = '<p style="color: #ff4436; text-align: center; grid-column: span 2; padding: 20px;">連線異常，請重整</p>';
    }
}

/**
 * 更新頂部會員 UI
 */
async function updateUserUI() {
    const balanceBox = document.querySelector('.balance-box');
    const loginBtn = document.querySelector('.login-btn');
    
    if (!loginBtn) return;

    try {
        const user = await auth.checkUser();
        if (user) {
            if (balanceBox) {
                balanceBox.innerText = `NT$ ${Number(user.balance || 0).toLocaleString()}`;
                balanceBox.style.display = 'block';
            }
            loginBtn.innerText = '退出';
            loginBtn.style.background = 'transparent';
            loginBtn.style.border = '1px solid var(--border)';
            loginBtn.style.color = '#aaa';
        } else {
            if (balanceBox) balanceBox.style.display = 'none';
            loginBtn.innerText = '登入';
        }
    } catch (err) {
        console.error('獲取狀態失敗', err);
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
    
    if (!filteredGames.length) {
        grid.innerHTML = '<p style="text-align: center; grid-column: span 2; color: #555; padding: 50px 0;">暫無相關遊戲</p>';
        if (pagination) pagination.style.display = 'none';
        return;
    }

    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const itemsToShow = filteredGames.slice(start, end);

    grid.innerHTML = itemsToShow.map(game => `
        <div class="game-card" onclick="handleGameClick('${game.game_url}')">
            <div class="game-img-wrapper">
                <div class="game-img" style="background-image: url('./images/${game.image_path}')"
                     onerror="this.style.backgroundImage='url(./images/default-game.jpg)'"></div>
            </div>
            <div class="game-info">
                <div class="game-title">${game.name}</div>
                <div class="game-desc">${game.category} | 立即開賽</div>
            </div>
        </div>
    `).join('');

    // 控制分頁器顯示
    if (pagination) {
        if (filteredGames.length > PAGE_SIZE) {
            pagination.style.display = 'flex';
            if (pageNum) pageNum.innerText = currentPage;
            if (prevBtn) prevBtn.disabled = currentPage === 1;
            if (nextBtn) nextBtn.disabled = end >= filteredGames.length;
        } else {
            pagination.style.display = 'none';
        }
    }
}

/**
 * 點擊遊戲處理 (檢查登入與 Gmail 綁定)
 */
window.handleGameClick = async (url) => {
    const user = await auth.checkUser();
    if (!user) {
        alert('請先進行 Gmail 綁定或以訪客身分登入即可開始遊玩'); // 優先使用 Gmail 與訪客綁定
    } else {
        location.href = url || '#';
    }
};

/**
 * 分頁切換功能
 */
window.changePage = (step) => {
    currentPage += step;
    renderCurrentPage();
    window.scrollTo({ top: 250, behavior: 'smooth' }); // 切換後捲動至遊戲區起點
};

/**
 * 全域過濾函數 (整合分頁重置與動態標題)
 */
window.filterCategory = (cat, el) => {
    const titleEl = document.getElementById('display-title');
    
    // 更新側邊欄狀態
    document.querySelectorAll('.sidebar-menu li').forEach(item => item.classList.remove('active'));
    if (el) el.classList.add('active');

    // 動態更新大廳標題
    if (titleEl) {
        titleEl.innerText = cat === 'all' ? '熱門推薦 TOP 4' : `${cat}系列`;
    }

    // 執行過濾並重置回第 1 頁
    filteredGames = cat === 'all' ? allGames : allGames.filter(g => g.category === cat);
    currentPage = 1; 
    renderCurrentPage();

    // 關閉側邊欄
    if (document.getElementById('sidebar')?.classList.contains('open') && window.toggleMenu) {
        window.toggleMenu();
    }
    
    window.scrollTo({ top: 250, behavior: 'smooth' });
};

document.addEventListener('DOMContentLoaded', initLobby);
