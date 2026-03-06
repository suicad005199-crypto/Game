export async function onRequest(context) {
    // 從 Cloudflare 環境變數讀取 (需於 Dashboard 設定)
    const SUPABASE_URL = context.env.SUPABASE_URL;
    const SUPABASE_KEY = context.env.SUPABASE_KEY;

    // 透過 REST API 向 Supabase 請求
    const response = await fetch(`${SUPABASE_URL}/rest/v1/games?is_active=eq.true&select=*&order=sort_order.asc`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });

    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
