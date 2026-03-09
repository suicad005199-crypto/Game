import { supabase } from './api.js';

export const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
};

export const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = 'index.html';
};

export const getUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
};
