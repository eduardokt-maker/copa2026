# Fonte oficial e banco de jogos encerrados

## Regra de negocio

- A fonte oficial primaria do sistema para calendario, placares, grupos, classificacao e mata-mata e a FIFA:
  `https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/scores-fixtures`.
- Toda tela publica deve consumir os dados pelo backend do app, nunca diretamente por fontes externas no JavaScript.
- Ao abrir qualquer modulo importante, o frontend chama o backend com `fresh=1` e `cache: "no-store"`.
- O backend tenta consultar a fonte oficial da FIFA e informa o status em `official_source`.
- Jogos encerrados e confirmados ficam gravados em `data/final_matches.json`.
- Se a consulta externa falhar, retornar vazia ou a pagina oficial mudar, o sistema usa o banco local de jogos encerrados para preservar placares e recalcular a classificacao.
- Um jogo encerrado ja gravado nao deve ser sobrescrito por dado externo vazio, parcial ou sem placar final.
- Horarios exibidos ao usuario devem estar em horario de Brasilia. Quando o horario ainda nao estiver confirmado, mostrar estado de aguardando.
- O album de figurinhas da selecao japonesa e uma excecao autorizada e pode manter fonte japonesa propria.

## Endpoints de verificacao

- `/api/source-status`: mostra fonte primaria, URL oficial, quantidade de jogos no banco local e se fallback foi usado.
- `/api/scores`: retorna placares, classificacao, fixtures do mata-mata e status da fonte oficial.
- `/api/groups`: retorna grupos com classificacao recalculada a partir dos jogos encerrados.

