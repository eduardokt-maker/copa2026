# copa2026

Projeto independente para acompanhar a Copa do Mundo FIFA 2026.

## Objetivo inicial

Exibir uma tela inicial bonita e de impacto com as selecoes participantes da Copa 2026, pais de origem e bandeiras.

## Tecnologia

- Python com servidor HTTP da biblioteca padrao.
- HTML, CSS e JavaScript sem dependencias externas obrigatorias.
- Dados iniciais servidos por endpoint JSON local.

## Como rodar

```powershell
python app.py
```

Se o `python` nao estiver no PATH, use o executavel Python disponivel no ambiente e rode este arquivo.

Depois acesse:

```text
http://127.0.0.1:8086
```

## Publicacao no Render

O projeto ja inclui `render.yaml` e esta preparado para Web Service no Render.

Configuracao esperada:

- Build command: `pip install -r requirements.txt`
- Start command: `python app.py`
- Runtime: Python

## Futuras funcionalidades

- Tabelas de grupos.
- Placares e agenda de jogos.
- Historias de outras Copas.
- Probabilidades e simulacoes.
- Integracao com fontes de dados esportivos.
