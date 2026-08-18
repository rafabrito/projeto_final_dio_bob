---
name: trilha
description: Use when the user types /trilha followed by a technology name. Reads the file dio_explorer/data/trilhas_dio.json and returns a formatted study plan with all modules for that technology track.
metadata:
  argument-hint: "[tecnologia]"
---

# /trilha — Plano de Estudos DIO

## Objetivo
Receber o nome de uma tecnologia e retornar um plano de estudos formatado com os módulos da trilha correspondente no arquivo `dio_explorer/data/trilhas_dio.json`.

## Passos

### 1. Identificar a tecnologia pedida
- O argumento vem logo após `/trilha`, por exemplo: `/trilha React` ou `/trilha Python`.
- Se nenhum argumento for fornecido, pergunte ao usuário qual tecnologia deseja estudar.

### 2. Ler o arquivo de dados
- Use a ferramenta `read_file` para ler `dio_explorer/data/trilhas_dio.json`.

### 3. Buscar a trilha correspondente
- Percorra o array `trilhas` e encontre o objeto cujo campo `tecnologia` contenha (case-insensitive) a tecnologia fornecida pelo usuário.
- Se não encontrar correspondência exata, tente correspondência parcial (ex.: "js" → "JavaScript", "node" → "Node.js").
- Se não encontrar nenhuma trilha, liste as tecnologias disponíveis e peça ao usuário para escolher uma.

### 4. Gerar os módulos fictícios
- O campo `modulos` indica o **número total de módulos** da trilha (não há lista de módulos no JSON).
- Gere os títulos dos módulos de forma **coerente com a tecnologia** — módulos reais que alguém esperaria encontrar numa trilha daquela stack. A quantidade deve bater exatamente com o valor do campo `modulos`.
- Exemplos de padrão para nomear módulos:
  - Módulo 1: Fundamentos e Configuração de Ambiente
  - Módulo 2: Conceitos Essenciais de [Tecnologia]
  - Módulo N: Projeto Final / Certificação

### 5. Formatar a resposta
Retorne a resposta no seguinte formato markdown:

```
# 🎓 Trilha DIO — [Nome da Trilha]

> **Tecnologia:** [tecnologia] | **Nível:** [nivel] | **XP Total:** [xp_total] XP | **Lives ao Vivo:** [lives_ao_vivo]

---

## 📚 Plano de Estudos — [número] Módulos

| # | Módulo | Descrição Rápida |
|---|--------|-----------------|
| 1 | [título do módulo] | [1 frase descritiva] |
| 2 | [título do módulo] | [1 frase descritiva] |
...

---

## 🏅 Badges que você vai conquistar
[lista com bullet points dos badges da trilha]

## 🎁 Promoção
[Se promocao.ativa = true]: ⚡ Promoção ativa! **[desconto_percentual]% de desconto** válido até [validade].
[Se promocao.ativa = false]: Sem promoção ativa no momento.

## ℹ️ Informações Adicionais
- Acesso: [Vitalício / Por tempo limitado]
- Fonte: https://www.dio.me
```

### 6. Dica final
- Encerre sempre com uma mensagem motivacional curta encorajando o usuário a começar a trilha.
