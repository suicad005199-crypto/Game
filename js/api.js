// 初始化 Supabase 客戶端
const supabaseUrl = '你的_SUPABASE_URL';
const supabaseKey = '你的_SUPABASE_ANON_KEY';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 封裝常用功能
export const api = {
    // 獲取所有上架遊戲
    async getGames() {
        const { data, error } = await _supabase
            .from('games')
            .select('*')
            .eq('is_active', true)
            .order('sort_order', { ascending: true });
        if (error) throw error;
        return data;
    },
    // 管理員修改狀態 (admin.html 使用)
    async toggleGameStatus(id, status) {
        const { error } = await _supabase
            .from('games')
            .update({ is_active: status })
            .eq('id', id);
        if (error) throw error;
    }
};
