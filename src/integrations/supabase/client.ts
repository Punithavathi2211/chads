import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://koxvdgtffzxgiekkyeym.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtveHZkZ3RmZnp4Z2lla2t5ZXltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MTk5ODUsImV4cCI6MjA2ODk5NTk4NX0.ywguEporqN9eIOlkMcSpAoXyaykgEtZQGIY5D-zr3jQ'

export const supabase = createClient(supabaseUrl, supabaseKey)