import { supabase } from '../lib/supabase.js'
import { createClient } from '@supabase/supabase-js'

// Para verificar o token do usuário
const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

async function getUserFromToken(req) {
  const token = (req.headers.authorization || '').replace('Bearer ', '')
  if (!token) return null
  const { data: { user } } = await supabaseAnon.auth.getUser(token)
  return user || null
}

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end()

  // ── GET /api/ranking — busca top 15 global ──
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('scores')
      .select('id, display_name, score, hits, best_combo, accuracy, played_at')
      .order('score', { ascending: false })
      .limit(15)

    if (error) return res.status(500).json({ error: error.message })
    return res.json({ ok: true, ranking: data })
  }

  // ── POST /api/ranking — salva score (requer login) ──
  if (req.method === 'POST') {
    const user = await getUserFromToken(req)
    const { score, hits, best_combo, accuracy, display_name } = req.body || {}

    if (typeof score !== 'number') {
      return res.status(400).json({ error: 'Score inválido' })
    }

    const row = {
      score,
      hits:         hits        || 0,
      best_combo:   best_combo  || 1,
      accuracy:     accuracy    || 0,
      display_name: user
        ? (user.user_metadata?.display_name || user.email.split('@')[0])
        : (display_name || 'Anônimo'),
      user_id:      user ? user.id : null,
      played_at:    new Date().toISOString()
    }

    const { error } = await supabase.from('scores').insert(row)
    if (error) return res.status(500).json({ error: error.message })

    // Retorna ranking atualizado
    const { data: ranking } = await supabase
      .from('scores')
      .select('id, display_name, score, hits, best_combo, accuracy, played_at')
      .order('score', { ascending: false })
      .limit(15)

    // Posição do score recém inserido
    const pos = ranking.findIndex(r =>
      r.display_name === row.display_name && r.score === score
    )

    return res.json({ ok: true, ranking, position: pos + 1 })
  }

  return res.status(405).json({ error: 'Método não permitido' })
}
