// js/api.js 修正版
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// 檢查：這兩個變數是否已正確填入您的 Supabase 資訊
const SUPABASE_URL = 'https://xvdgcnzvkkwplmgczulv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2ZGdjbnp2a2t3cGxtZ2N6dWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTQxNjcsImV4cCI6MjA4ODM5MDE2N30.b8g9HrI0lBRITqIQHpa3cbYM6C43kHuR1DS_ICMixE0'; 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const api = {
    async getActiveGames() {
        // 檢查：資料表名稱是否確實為 'games'
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('is_active', true) // 檢查：SQL 裡這欄位是否為 true
            .order('sort_order', { ascending: true });

        if (error) {
            console.error('Supabase 讀取錯誤:', error.message);
            return [];
        }
        return data || [];
    }
};
