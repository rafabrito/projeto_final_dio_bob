---
name: certificado
description: Use when the user types /certificado. Generates a fictional DIO-style markdown certificate with the user's name and the completed track (trilha) name.
metadata:
  argument-hint: "[seu nome] | [trilha concluída]"
---

# /certificado — Certificado Fictício DIO

## Objetivo
Gerar um certificado fictício e formatado em Markdown, comemorando a conclusão de uma trilha da DIO, personalizado com o nome do usuário e o nome da trilha concluída.

## Passos

### 1. Coletar os parâmetros
- Verifique se o usuário já forneceu nome e trilha no mesmo comando. Exemplos aceitos:
  - `/certificado João Silva | React`
  - `/certificado Ana Lima, Trilha Python`
  - `/certificado` (sem argumentos — pedir tudo)
- Se o **nome do usuário** não foi informado, pergunte: *"Qual é o seu nome para constar no certificado?"*
- Se a **trilha concluída** não foi informada, pergunte: *"Qual trilha você concluiu? (ex.: React, Python, DevOps…)"*
- Não pergunte o que já foi fornecido.

### 2. Buscar dados da trilha (opcional, mas enriquece o certificado)
- Use `read_file` para ler `dio_explorer/data/trilhas_dio.json`.
- Procure (case-insensitive) a trilha cujo campo `tecnologia` ou `nome` corresponda ao informado.
- Se encontrar: use o `nome` oficial da trilha, `nivel`, `xp_total`, `modulos` e `badges` para enriquecer o certificado.
- Se **não** encontrar: use os dados informados pelo usuário como estão, sem gerar erro.

### 3. Calcular a data de emissão
- Use a data atual no formato **DD de [mês por extenso] de AAAA** (ex.: 15 de junho de 2025).

### 4. Gerar o certificado em Markdown

Use **exatamente** este template, preenchendo os campos com colchetes:

```markdown
---

<div align="center">

# 🎓 CERTIFICADO DE CONCLUSÃO

### Digital Innovation One — DIO

---

**Certificamos que**

# [NOME COMPLETO DO USUÁRIO]

concluiu com êxito a trilha de aprendizagem

## 🚀 [Nome Oficial da Trilha]

---

| 📅 Data de Conclusão | 🏆 Nível | ⚡ XP Conquistado | 📦 Módulos Concluídos |
|---|---|---|---|
| [Data] | [Nível] | [XP Total] XP | [Número] módulos |

---

### 🏅 Badges Conquistadas

[lista com bullet points dos badges — ou "Badges personalizadas para esta jornada" se não houver dados]

---

> *"A jornada de mil milhas começa com um único passo."*

**ID do Certificado:** DIO-[ANO][MÊS][DIA]-[4 dígitos aleatórios]  
**Válido em:** https://www.dio.me

</div>

---
```

> ⚠️ **Lembrete:** Este é um certificado **fictício e educacional**, gerado para fins de aprendizagem e motivação. Não tem validade oficial.

### 5. Mensagem de parabéns
- Após o certificado, adicione uma mensagem personalizada de parabéns com 2–3 linhas motivacionais, mencionando o nome da pessoa e a tecnologia concluída.
- Sugira o próximo passo, por exemplo: *"Que tal tentar um `/desafio [tecnologia] Avançado` para consolidar seu conhecimento?"*
