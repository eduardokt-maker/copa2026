# Fonte oficial e banco de jogos encerrados

## Regra de negocio

- A fonte oficial primaria do sistema para calendario, placares, grupos, classificacao e mata-mata e a FIFA:
  `https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures`.
- Toda tela publica deve consumir os dados pelo backend do app, nunca diretamente por fontes externas no JavaScript.
- Ao abrir qualquer modulo importante, o frontend chama o backend com `fresh=1` e `cache: "no-store"`.
- O backend tenta consultar a fonte oficial da FIFA e informa o status em `official_source`.
- Jogos encerrados e confirmados ficam gravados em `data/final_matches.json`.
- Jogos de grupos e jogos de mata-mata podem coexistir no banco definitivo, mas a classificacao de grupos deve considerar somente partidas dos grupos A a L.
- Jogos de mata-mata devem ser identificados por `match_id` oficial, de 73 a 104, e expostos em `/api/scores` tambem no objeto `knockout_results`.
- Em mata-mata, se o placar terminar empatado, o sistema deve preservar `winner` e, quando disponivel, `home_penalties` e `away_penalties`; o avancamento de fase deve usar esse vencedor oficial.
- Se a consulta externa falhar, retornar vazia ou a pagina oficial mudar, o sistema usa o banco local de jogos encerrados para preservar placares e recalcular a classificacao.
- Um jogo encerrado ja gravado nao deve ser sobrescrito por dado externo vazio, parcial ou sem placar final.
- Horarios exibidos ao usuario devem estar em horario de Brasilia. Quando o horario ainda nao estiver confirmado, mostrar estado de aguardando.
- A rotina de atualizacao periodica usa intervalos dinamicos:
  - 30 segundos quando existe jogo dentro da janela ao vivo.
  - 5 minutos em dia de jogo ou quando ha partida nas proximas 24 horas.
  - 15 minutos quando nao ha jogo imediato.
- A agenda de monitoramento do mata-mata deve considerar todas as fases, nao apenas os 16 avos:
  - 16 avos de final: jogos 73 a 88.
  - Oitavas de final: jogos 89 a 96.
  - Quartas de final: jogos 97 a 100.
  - Semifinais: jogos 101 e 102.
  - Terceiro lugar e final: jogos 103 e 104.
- Quando a FIFA publicar ou alterar data, horario ou estadio de uma fase futura, o backend deve ser a origem unica para sobrescrever os cards da tela Mata-mata e do Calendario Geral.
- Dados de consulta temporaria ficam em `data/live_sync.json`; somente jogos encerrados confirmados entram no banco definitivo `data/final_matches.json`.
- O album de figurinhas da selecao japonesa e uma excecao autorizada e pode manter fonte japonesa propria.

## Endpoints de verificacao

- `/api/source-status`: mostra fonte primaria, URL oficial, quantidade de jogos no banco local e se fallback foi usado.
- `/api/live-sync`: mostra modo atual da rotina (`live`, `matchday` ou `routine`), intervalo de proxima consulta e ultimo status da fonte.
- `/api/scores`: retorna placares, classificacao, fixtures do mata-mata e status da fonte oficial.
- `/api/groups`: retorna grupos com classificacao recalculada a partir dos jogos encerrados.
