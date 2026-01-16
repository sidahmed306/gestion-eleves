import { createClient } from '@supabase/supabase-js'

// ✅ J'ai mis ton URL ici (c'est bon, ne touche plus à cette ligne) :
const supabaseUrl = 'https://oioxirgwbtttiykewuge.supabase.co'

// ⚠️ ACTION REQUISE : Colle ta clé "anon public" (la longue chaîne qui commence par eyJ...) entre les guillemets ci-dessous
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pb3hpcmd3YnR0dGl5a2V3dWdlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1OTU4MTMsImV4cCI6MjA4NDE3MTgxM30.nDFmee1jk4pXucp1IwHibaPPYi4yCl7b6jCA2WH9SOg'

export const supabase = createClient(supabaseUrl, supabaseKey)