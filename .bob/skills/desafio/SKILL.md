---
name: desafio
description: Use when the user types /desafio. Generates a random coding challenge based on a level (Básico, Intermediário, Avançado) and technology chosen by the user, formatted as a practical DIO-style challenge.
metadata:
  argument-hint: "[tecnologia] [nível]"
---

# /desafio — Gerador de Desafio de Código DIO

## Objetivo
Gerar um desafio de código aleatório e prático baseado no **nível** e na **tecnologia** escolhidos pelo usuário.

## Passos

### 1. Coletar os parâmetros
- Verifique se o usuário já forneceu tecnologia e nível no mesmo comando, por exemplo:
  - `/desafio Python Básico`
  - `/desafio React Intermediário`
- Se **tecnologia** não foi informada, use `ask_followup_question` e ofereça como sugestões as mais populares: Python, JavaScript, React, Java, Node.js, TypeScript, e "Outra (digitar)".
- Se **nível** não foi informado, use `ask_followup_question` com as opções: **Básico**, **Intermediário**, **Avançado**.
- Não pergunte sobre parâmetros que já foram fornecidos.

### 2. Gerar o desafio
Crie um desafio **inédito, criativo e prático** adequado ao nível e tecnologia.

**Diretrizes por nível:**
- **Básico:** exercício de lógica simples, manipulação de variáveis, loops, condicionais. Resolução em até 20 linhas.
- **Intermediário:** envolve estruturas de dados, funções, módulos, pequenas APIs ou componentes. Resolução em até 50 linhas.
- **Avançado:** problemas arquiteturais, performance, padrões de design, integração, algoritmos não triviais. Resolução pode ultrapassar 50 linhas.

### 3. Formatar a resposta

Apresente o desafio **exatamente** neste formato:

```
# ⚔️ Desafio DIO — [Título Criativo do Desafio]

> **Tecnologia:** [tecnologia] | **Nível:** [nível] | **XP:** [valor XP fictício entre 500–5000]

---

## 📋 Descrição
[Parágrafo explicando o contexto e o que precisa ser construído, como se fosse um briefing real de projeto]

## 🎯 Requisitos Funcionais
- [ ] [Requisito 1]
- [ ] [Requisito 2]
- [ ] [Requisito N — mínimo 3, máximo 6]

## 💡 Dicas
- [Dica técnica relevante 1]
- [Dica técnica relevante 2]

## 📥 Exemplo de Entrada / Saída esperada
[Exemplo concreto de input e output, ou comportamento esperado da UI/componente]

## 🏆 Critérios de Avaliação
- [ ] Funcionalidade completa
- [ ] Código limpo e legível
- [ ] [Critério específico da tecnologia/nível]
- [ ] [Critério opcional: testes, performance, etc.]

---
> 💬 Quando terminar, use `/certificado` para gerar seu certificado de conclusão!
```

### 4. Comportamento adicional
- Cada invocação deve gerar um desafio **diferente** — varie o tema, contexto e requisitos a cada chamada.
- Exemplos de temas: sistema de tarefas, API de clima, jogo de adivinhas, carrinho de compras, contador de palavras, gerador de senhas, dashboard, etc.
- O desafio não precisa ter solução — é um enunciado, não um tutorial.
