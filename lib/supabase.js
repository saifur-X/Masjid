import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zeclkzhukigeroccuumu.supabase.co';
// তোমার দেওয়া পাব্লিক কি
const supabaseAnonKey = 'sb_publishable_mELN2Dipn_fU3ySVw4AaSw_ty_O-RG0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
