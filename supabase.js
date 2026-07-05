import { createClient } from '@supabase/supabase-js'

// Usa a ANON key aqui (auth do lado do client via server proxy)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  // CORS preflight
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { action, email, password, name } = req.body || {}

  try {
    // ── CADASTRO ──
    if (action === 'register') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name || email.split('@')[0] }
        }
      })
      if (error) return res.status(400).json({ error: error.message })
      return res.json({
        ok: true,
        user: {
          id:   data.user.id,
          name: data.user.user_metadata?.display_name,
          email: data.user.email
        },
        session: data.session
      })
    }

    // ── LOGIN ──
    if (action === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return res.status(401).json({ error: error.message })
      return res.json({
        ok: true,
        user: {
          id:   data.user.id,
          name: data.user.user_metadata?.display_name || email.split('@')[0],
          email: data.user.email
        },
        session: data.session   // contém access_token que o front guarda
      })
    }

    // ── VERIFICAR TOKEN (usado no load da página) ──
    if (action === 'verify') {
      const token = (req.headers.authorization || '').replace('Bearer ', '')
      if (!token) return res.status(401).json({ error: 'Sem token' })
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (error || !user) return res.status(401).json({ error: 'Token inválido' })
      return res.json({
        ok: true,
        user: {
          id:   user.id,
          name: user.user_metadata?.display_name || user.email.split('@')[0],
          email: user.email
        }
      })
    }

    return res.status(400).json({ error: 'Ação inválida' })

  } catch (err) {
    console.error('[auth]', err)
    return res.status(500).json({ error: 'Erro interno' })
  }
}
