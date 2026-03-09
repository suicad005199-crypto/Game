// 修正引用：我們匯出的是 apiFetch，而不是 supabase
import { apiFetch } from './api.js';

/**
 * 根據分類取得遊戲清單
 * @param {string} category - 遊戲分類 (如 'LIVE', '老虎機', 'all')
 */
export const getGames = async (category = 'all') => {
    try {
        // 構建 PostgREST 查詢字串
        // 如果是 'all' 就不加分類過濾，否則篩選 category 欄位
        let queryPath = 'games?is_active=eq.true&select=*';
        
        if (category !== 'all') {
            queryPath += `&category=eq.${category}`;
        }

        // 使用 apiFetch 進行資料抓取
        const games = await apiFetch(queryPath, { method: 'GET' });
        
        return games || [];
    } catch (error) {
        console.error('取得遊戲清單失敗:', error);
        return [];
    }
};
