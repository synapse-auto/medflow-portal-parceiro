-- Feature 004b: pagamento por LOTE (unidade + data de vencimento).
-- Antes o aviso era por Unidade; agora a mesma unidade pode ter vários vencimentos em datas
-- diferentes, cada um avisado/pago em separado. Adiciona a data ao aviso e move a unicidade
-- do aviso ATIVO para (contratante, unidade, data_vencimento).

alter table public.pagamentos_avisos
  add column if not exists data_vencimento date;

-- 1 aviso ATIVO por LOTE (não mais por unidade): trava reenvio enquanto pendente/verificado.
-- (Linhas legadas com data_vencimento NULL são tratadas como distintas pelo índice e não
--  conflitam — o app sempre grava a data daqui pra frente.)
drop index if exists pagamentos_avisos_ativo_uq;
create unique index if not exists pagamentos_avisos_ativo_uq
  on public.pagamentos_avisos (contratante, unidade, data_vencimento)
  where status in ('pendente', 'verificado');
