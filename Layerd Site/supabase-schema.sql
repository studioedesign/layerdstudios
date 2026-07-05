-- ============================================================
-- LAYERD STUDIOS — Schema do Supabase
-- Execute isso no SQL Editor do Supabase (supabase.com → projeto → SQL Editor)
-- ============================================================

-- Tabela de scores do jogo
CREATE TABLE IF NOT EXISTS public.scores (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL DEFAULT 'Anônimo',
  score        INTEGER NOT NULL DEFAULT 0,
  hits         INTEGER NOT NULL DEFAULT 0,
  best_combo   INTEGER NOT NULL DEFAULT 1,
  accuracy     INTEGER NOT NULL DEFAULT 0,   -- 0-100 (%)
  played_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índice para leitura rápida do ranking
CREATE INDEX IF NOT EXISTS idx_scores_score ON public.scores (score DESC);
CREATE INDEX IF NOT EXISTS idx_scores_user  ON public.scores (user_id);

-- Row Level Security: qualquer um lê, mas só o dono deleta o próprio score
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;

-- Política: leitura pública (o ranking é público)
CREATE POLICY "scores_select_public"
  ON public.scores FOR SELECT
  USING (true);

-- Política: insert público (jogadores anônimos também podem salvar)
CREATE POLICY "scores_insert_public"
  ON public.scores FOR INSERT
  WITH CHECK (true);

-- Política: delete só pelo próprio usuário (não essencial, mas boa prática)
CREATE POLICY "scores_delete_own"
  ON public.scores FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================
-- OPCIONAL: view de "melhor score por usuário" 
-- Útil se quiser mostrar só o top score de cada jogador
-- ============================================================
CREATE OR REPLACE VIEW public.best_scores AS
SELECT DISTINCT ON (COALESCE(user_id::text, display_name))
  id, user_id, display_name, score, hits, best_combo, accuracy, played_at
FROM public.scores
ORDER BY COALESCE(user_id::text, display_name), score DESC;
