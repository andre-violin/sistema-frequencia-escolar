# Apostila: Erros e Manipulação de Erros em TypeScript

## 📚 Índice

1. [Introdução](#introdução)
2. [Conceitos Fundamentais](#conceitos-fundamentais)
3. [Classes de Erro Personalizadas](#classes-de-erro-personalizadas)
4. [Lançamento de Erros (throw)](#lançamento-de-erros-throw)
5. [Tratamento de Erros (try-catch)](#tratamento-de-erros-try-catch)
6. [Implementação no Projeto](#implementação-no-projeto)
7. [Exercícios Práticos](#exercícios-práticos)
8. [Boas Práticas](#boas-práticas)

---

## 🎯 Introdução

A manipulação de erros é uma técnica fundamental na programação que permite ao desenvolvedor **prever, detectar e tratar situações anormais** que podem ocorrer durante a execução de um programa.

### Por que é importante?

- **Previne crashes**: Evita que o programa pare abruptamente
- **Melhora a experiência do usuário**: Fornece mensagens claras sobre o que deu errado
- **Facilita a manutenção**: Torna o código mais robusto e fácil de debugar
- **Valida dados**: Garante que apenas dados válidos sejam processados

---

## 📖 Conceitos Fundamentais

### O que é um Erro?

Um **erro** (ou exceção) é um objeto que representa uma condição anormal durante a execução do programa. Em TypeScript/JavaScript, todos os erros herdam da classe `Error`.

### Estrutura Básica de um Erro

```typescript
class Error {
  name: string; // Nome do tipo de erro
  message: string; // Mensagem descritiva
  stack?: string; // Rastreamento da pilha de chamadas
}
```

### Tipos de Erros Nativos

JavaScript fornece vários tipos de erros nativos:

- `Error`: Erro genérico
- `TypeError`: Erro de tipo (ex: chamar algo que não é função)
- `ReferenceError`: Referência a variável inexistente
- `RangeError`: Número fora do intervalo permitido
- `SyntaxError`: Erro de sintaxe no código

---

## 🎨 Classes de Erro Personalizadas

### Por que criar erros personalizados?

Erros personalizados permitem:

- **Identificar** o tipo específico de problema
- **Tratar** diferentes erros de formas diferentes
- **Comunicar** melhor o contexto do erro

### Estrutura de uma Classe de Erro Personalizada

```typescript
export class MeuErro extends Error {
  constructor(message: string) {
    super(message); // Chama o construtor da classe pai (Error)
    this.name = "MeuErro"; // Define o nome do erro
  }
}
```

### Erros do Projeto: EstudanteError

No arquivo `src/errors/EstudanteError.ts`:

```typescript
export class DadosInvalidosError extends Error {
  constructor(campo: string) {
    super(`Dados inválidos: ${campo}`);
    this.name = "DadosInvalidosError";
  }
}
```

**Análise do código:**

1. `export class DadosInvalidosError extends Error`:

   - Cria uma nova classe que herda de `Error`
   - `export` permite usar em outros arquivos

2. `constructor(campo: string)`:

   - Recebe o campo que está inválido como parâmetro

3. `super(\`Dados inválidos: ${campo}\`)`:

   - Chama o construtor da classe pai `Error`
   - Define a mensagem do erro

4. `this.name = "DadosInvalidosError"`:
   - Define o nome do erro para identificação

### Erros do Projeto: TurmaError

No arquivo `src/errors/TurmaError.ts`:

```typescript
export class TurmaLotadaError extends Error {
  constructor(capacidade: number) {
    super(`Turma já atingiu a capacidade máxima de ${capacidade} estudantes.`);
    this.name = "TurmaLotadaError";
  }
}

export class EstudanteDuplicadoError extends Error {
  constructor(nomeEstudante: string) {
    super(`Estudante ${nomeEstudante} já está cadastrado na turma.`);
    this.name = "EstudanteDuplicadoError";
  }
}
```

**Vantagens:**

- Cada erro tem uma mensagem específica e contextual
- Facilita o tratamento diferenciado de cada situação
- Melhora a legibilidade do código

---

## 🚀 Lançamento de Erros (throw)

### O que é throw?

A palavra-chave `throw` é usada para **lançar (ou disparar)** um erro. Quando um erro é lançado, a execução normal do código é interrompida.

### Sintaxe Básica

```typescript
throw new Error("Mensagem do erro");
```

### Quando usar throw?

Use `throw` quando detectar uma condição que:

- **Viola** as regras de negócio
- **Impossibilita** a continuação normal do programa
- **Requer** atenção imediata

### Exemplo 1: Validação de ID no Construtor

No arquivo `src/Estudante.ts`:

```typescript
constructor(id: number, nome: string) {
  if (id <= 0) {
    throw new DadosInvalidosError("ID deve ser maior que zero");
  }
  if (!nome || nome.trim().length === 0) {
    throw new DadosInvalidosError("Nome não pode ser vazio");
  }
  this.id = id;
  this.nome = nome;
  this.presenca = 0;
}
```

**Análise linha por linha:**

1. `if (id <= 0)`: Verifica se o ID é inválido
2. `throw new DadosInvalidosError("ID deve ser maior que zero")`: Lança erro personalizado
3. `if (!nome || nome.trim().length === 0)`: Verifica se nome está vazio ou só tem espaços
4. Se passar pelas validações, cria o estudante normalmente

### Exemplo 2: Validação de Capacidade da Turma

No arquivo `src/Turma.ts`:

```typescript
adicionarEstudante(estudante: Estudante): void {
  if (this.estudantes.length >= Turma.CAPACIDADE_MAXIMA) {
    throw new TurmaLotadaError(Turma.CAPACIDADE_MAXIMA);
  }

  if (this.estudantes.some(e => e.id === estudante.id)) {
    throw new EstudanteDuplicadoError(estudante.nome);
  }

  this.estudantes.push(estudante);
}
```

**Análise:**

1. **Primeira validação**: Verifica se a turma está cheia

   - `this.estudantes.length >= Turma.CAPACIDADE_MAXIMA`
   - Se estiver, lança `TurmaLotadaError`

2. **Segunda validação**: Verifica se o estudante já está na turma

   - `this.estudantes.some(e => e.id === estudante.id)`
   - `some()` retorna `true` se encontrar algum estudante com mesmo ID
   - Se encontrar, lança `EstudanteDuplicadoError`

3. **Ação normal**: Se passar pelas validações, adiciona o estudante

---

## 🛡️ Tratamento de Erros (try-catch)

### O que é try-catch?

É uma estrutura que permite **tentar** executar um código e **capturar** erros que possam ocorrer, tratando-os adequadamente.

### Sintaxe Básica

```typescript
try {
  // Código que pode gerar erro
} catch (error) {
  // Código para tratar o erro
}
```

### Estrutura Completa

```typescript
try {
  // Tenta executar este código
} catch (error) {
  // Executa se houver erro no try
} finally {
  // Sempre executa (opcional)
}
```

### Fluxo de Execução

```
┌─────────────────┐
│  Início do try  │
└────────┬────────┘
         │
         ▼
   ┌─────────┐
   │ Erro?   │
   └─┬────┬──┘
     │    │
    Não  Sim
     │    │
     │    ▼
     │  ┌──────────────┐
     │  │ Bloco catch  │
     │  └──────┬───────┘
     │         │
     ▼         ▼
   ┌──────────────┐
   │    finally   │
   │  (opcional)  │
   └──────┬───────┘
          │
          ▼
     Continua...
```

### Exemplo 1: Criação de Estudantes

No arquivo `src/index.ts`:

```typescript
const estudantes: Estudante[] = [];

let estudante1!: Estudante;
let estudante2!: Estudante;
let estudante3!: Estudante;

try {
  estudante1 = new Estudante(1, "Ana Maria");
  estudantes.push(estudante1);
  estudante2 = new Estudante(2, "João Pedro");
  estudantes.push(estudante2);
  estudante3 = new Estudante(3, "Maria Clara");
  estudantes.push(estudante3);

  // Teste de erro: ID inválido
  // const estudanteInvalido = new Estudante(-1, "Teste");

  // Teste de erro: Nome vazio
  // const estudanteInvalido2 = new Estudante(4, "");
} catch (error) {
  if (error instanceof DadosInvalidosError) {
    console.error(`❌ Erro ao criar estudante: ${error.message}`);
    process.exit(1);
  } else {
    console.error(`❌ Erro inesperado: ${error}`);
    process.exit(1);
  }
}
```

**Análise detalhada:**

1. **Declaração de variáveis**:

   ```typescript
   let estudante1!: Estudante;
   ```

   - `!` (definite assignment assertion): informa ao TypeScript que a variável será atribuída
   - Necessário porque as variáveis são declaradas fora do `try`

2. **Bloco try**:

   - Tenta criar três estudantes
   - Se algum dado for inválido, o construtor lança um erro
   - A execução para imediatamente quando há erro

3. **Bloco catch**:
   ```typescript
   if (error instanceof DadosInvalidosError) {
   ```
   - `instanceof` verifica se o erro é do tipo específico
   - Permite tratar diferentes tipos de erro de formas diferentes
   - `process.exit(1)` encerra o programa com código de erro

### Exemplo 2: Adicionar Estudante na Turma

```typescript
const info01 = new Turma(1, "Informática 1º Ano");

try {
  info01.adicionarEstudante(estudante1);

  // Teste de erro: adicionar estudante duplicado
  // info01.adicionarEstudante(estudante1);
} catch (error) {
  if (error instanceof EstudanteDuplicadoError) {
    console.error(`❌ ${error.message}`);
  } else if (error instanceof TurmaLotadaError) {
    console.error(`❌ ${error.message}`);
  } else {
    console.error(`❌ Erro inesperado: ${error}`);
  }
}
```

**Diferenças do exemplo anterior:**

- **Não usa `process.exit(1)`**: O programa pode continuar mesmo com erro
- **Múltiplos tipos de erro**: Trata `EstudanteDuplicadoError` e `TurmaLotadaError` separadamente
- **Erro genérico**: Último `else` captura qualquer outro tipo de erro

---

## 🔧 Implementação no Projeto

### Arquitetura de Erros do Projeto

```
src/
├── errors/
│   ├── EstudanteError.ts    → Erros relacionados a Estudante
│   └── TurmaError.ts         → Erros relacionados a Turma
├── Estudante.ts              → Valida e lança erros
├── Turma.ts                  → Valida e lança erros
└── index.ts                  → Trata erros (try-catch)
```

### Fluxo de Erro no Projeto

```
┌─────────────────────────────────────────────────┐
│ index.ts tenta criar Estudante                  │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│ Estudante.ts valida dados no construtor         │
└────────────────────┬────────────────────────────┘
                     │
                ┌────┴────┐
                │ Válido? │
                └─┬────┬──┘
                  │    │
                 Sim  Não
                  │    │
                  │    ▼
                  │  ┌─────────────────────────────┐
                  │  │ throw DadosInvalidosError   │
                  │  └──────────┬──────────────────┘
                  │             │
                  │             ▼
                  │  ┌─────────────────────────────┐
                  │  │ catch em index.ts           │
                  │  │ → Exibe mensagem de erro    │
                  │  │ → Encerra programa          │
                  │  └─────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────┐
│ Estudante criado com sucesso                    │
└─────────────────────────────────────────────────┘
```

### Casos de Uso Implementados

#### 1. Validação de Dados do Estudante

**Arquivo**: `src/Estudante.ts`

**Regras de Negócio**:

- ID deve ser maior que zero
- Nome não pode ser vazio ou conter apenas espaços

**Implementação**:

```typescript
constructor(id: number, nome: string) {
  if (id <= 0) {
    throw new DadosInvalidosError("ID deve ser maior que zero");
  }
  if (!nome || nome.trim().length === 0) {
    throw new DadosInvalidosError("Nome não pode ser vazio");
  }
  this.id = id;
  this.nome = nome;
  this.presenca = 0;
}
```

**Testando**:

```typescript
// ✅ Correto
const aluno1 = new Estudante(1, "João");

// ❌ Erro: ID inválido
const aluno2 = new Estudante(-1, "Maria");
// Resultado: DadosInvalidosError: Dados inválidos: ID deve ser maior que zero

// ❌ Erro: Nome vazio
const aluno3 = new Estudante(1, "");
// Resultado: DadosInvalidosError: Dados inválidos: Nome não pode ser vazio

// ❌ Erro: Nome só com espaços
const aluno4 = new Estudante(1, "   ");
// Resultado: DadosInvalidosError: Dados inválidos: Nome não pode ser vazio
```

#### 2. Validação de Capacidade da Turma

**Arquivo**: `src/Turma.ts`

**Regras de Negócio**:

- Turma tem capacidade máxima de 40 estudantes
- Não pode adicionar estudante duplicado

**Implementação**:

```typescript
private static CAPACIDADE_MAXIMA = 40;

adicionarEstudante(estudante: Estudante): void {
  if (this.estudantes.length >= Turma.CAPACIDADE_MAXIMA) {
    throw new TurmaLotadaError(Turma.CAPACIDADE_MAXIMA);
  }

  if (this.estudantes.some(e => e.id === estudante.id)) {
    throw new EstudanteDuplicadoError(estudante.nome);
  }

  this.estudantes.push(estudante);
}
```

**Testando**:

```typescript
const turma = new Turma(1, "Informática 1º Ano");
const aluno1 = new Estudante(1, "João");

// ✅ Correto
turma.adicionarEstudante(aluno1);

// ❌ Erro: Estudante duplicado
turma.adicionarEstudante(aluno1);
// Resultado: EstudanteDuplicadoError: Estudante João já está cadastrado na turma.

// ❌ Erro: Turma lotada (se adicionar mais de 40 estudantes)
// Resultado: TurmaLotadaError: Turma já atingiu a capacidade máxima de 40 estudantes.
```

---

## 💡 Exercícios Práticos

### Exercício 1: Criar Erro Personalizado

**Objetivo**: Criar um erro para validar idade mínima de estudante.

**Tarefa**:

1. Crie um novo erro chamado `IdadeInvalidaError` em `src/errors/EstudanteError.ts`
2. O erro deve receber a idade mínima permitida
3. A mensagem deve ser: "Estudante deve ter no mínimo X anos"

**Solução**:

```typescript
export class IdadeInvalidaError extends Error {
  constructor(idadeMinima: number) {
    super(`Estudante deve ter no mínimo ${idadeMinima} anos`);
    this.name = "IdadeInvalidaError";
  }
}
```

### Exercício 2: Adicionar Validação de Idade

**Objetivo**: Modificar a classe `Estudante` para validar idade.

**Tarefa**:

1. Adicione um atributo `idade: number` na classe `Estudante`
2. Adicione validação no construtor: idade mínima 14 anos
3. Lance `IdadeInvalidaError` se a idade for inválida

**Solução**:

```typescript
export default class Estudante {
  id: number;
  nome: string;
  idade: number;
  private presenca: number = 0;

  constructor(id: number, nome: string, idade: number) {
    if (id <= 0) {
      throw new DadosInvalidosError("ID deve ser maior que zero");
    }
    if (!nome || nome.trim().length === 0) {
      throw new DadosInvalidosError("Nome não pode ser vazio");
    }
    if (idade < 14) {
      throw new IdadeInvalidaError(14);
    }
    this.id = id;
    this.nome = nome;
    this.idade = idade;
    this.presenca = 0;
  }

  // ... resto do código
}
```

### Exercício 3: Tratar Múltiplos Erros

**Objetivo**: Criar código que trata diferentes tipos de erro.

**Tarefa**:
Escreva código que:

1. Tente criar um estudante com dados inválidos
2. Capture e trate cada tipo de erro separadamente
3. Exiba mensagens personalizadas para cada tipo

**Solução**:

```typescript
try {
  const estudante = new Estudante(-1, "", 10);
} catch (error) {
  if (error instanceof DadosInvalidosError) {
    console.error(`❌ Dados inválidos: ${error.message}`);
  } else if (error instanceof IdadeInvalidaError) {
    console.error(`❌ Idade inválida: ${error.message}`);
  } else {
    console.error(`❌ Erro desconhecido: ${error}`);
  }
}
```

### Exercício 4: Validação de Disciplina

**Objetivo**: Criar validação para nomes de disciplina.

**Tarefa**:

1. Crie `DisciplinaInvalidaError` em um novo arquivo `src/errors/DisciplinaError.ts`
2. Adicione validação na classe `RegistroDisciplina`
3. Nome da disciplina deve ter pelo menos 3 caracteres

**Solução**:

Arquivo `src/errors/DisciplinaError.ts`:

```typescript
export class DisciplinaInvalidaError extends Error {
  constructor() {
    super("Nome da disciplina deve ter pelo menos 3 caracteres");
    this.name = "DisciplinaInvalidaError";
  }
}
```

Modificação em `src/RegistroDisciplina.ts`:

```typescript
import { DisciplinaInvalidaError } from "./errors/DisciplinaError";

export default class RegistroDisciplina extends RegistroPresenca {
  protected disciplina: string;

  constructor(estudante: Estudante, data: Date, disciplina: string) {
    if (!disciplina || disciplina.trim().length < 3) {
      throw new DisciplinaInvalidaError();
    }
    super(estudante, data);
    this.disciplina = disciplina;
  }

  // ... resto do código
}
```

---

## ✅ Boas Práticas

### 1. Use Erros Específicos

❌ **Evite**:

```typescript
throw new Error("Erro");
```

✅ **Prefira**:

```typescript
throw new DadosInvalidosError("ID deve ser maior que zero");
```

**Por quê?**: Erros específicos facilitam o tratamento e debugging.

### 2. Valide na Entrada

❌ **Evite** validar depois que o objeto já foi criado:

```typescript
const estudante = new Estudante(-1, "João");
if (estudante.id <= 0) {
  // Muito tarde!
}
```

✅ **Prefira** validar no construtor:

```typescript
constructor(id: number, nome: string) {
  if (id <= 0) {
    throw new DadosInvalidosError("ID deve ser maior que zero");
  }
  // ...
}
```

### 3. Mensagens Claras e Descritivas

❌ **Evite**:

```typescript
throw new Error("Erro no estudante");
```

✅ **Prefira**:

```typescript
throw new DadosInvalidosError("ID deve ser maior que zero");
```

### 4. Documente os Erros que uma Função Pode Lançar

✅ **Bom**:

```typescript
/**
 * Adiciona um estudante na turma
 * @throws {TurmaLotadaError} Se a turma já estiver cheia
 * @throws {EstudanteDuplicadoError} Se o estudante já estiver na turma
 */
adicionarEstudante(estudante: Estudante): void {
  // ...
}
```

### 5. Não Ignore Erros

❌ **Evite**:

```typescript
try {
  criarEstudante();
} catch (error) {
  // Não faz nada
}
```

✅ **Prefira**:

```typescript
try {
  criarEstudante();
} catch (error) {
  console.error(`Erro: ${error.message}`);
  // Ou: registrar em log, notificar usuário, etc.
}
```

### 6. Use instanceof para Verificar Tipos

✅ **Correto**:

```typescript
catch (error) {
  if (error instanceof DadosInvalidosError) {
    // Trata erro específico
  }
}
```

### 7. Organize Erros por Contexto

✅ **Estrutura recomendada**:

```
src/errors/
├── EstudanteError.ts    → Erros de Estudante
├── TurmaError.ts        → Erros de Turma
├── DisciplinaError.ts   → Erros de Disciplina
└── SistemaError.ts      → Erros gerais do sistema
```

### 8. Hierarquia de Erros

✅ **Use herança para agrupar erros relacionados**:

```typescript
// Erro base
export class EstudanteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EstudanteError";
  }
}

// Erros específicos
export class DadosInvalidosError extends EstudanteError {
  constructor(campo: string) {
    super(`Dados inválidos: ${campo}`);
    this.name = "DadosInvalidosError";
  }
}

export class EstudanteNaoEncontradoError extends EstudanteError {
  constructor(id: number) {
    super(`Estudante ${id} não encontrado`);
    this.name = "EstudanteNaoEncontradoError";
  }
}
```

**Vantagem**: Pode capturar todos os erros de estudante com:

```typescript
catch (error) {
  if (error instanceof EstudanteError) {
    // Trata qualquer erro de estudante
  }
}
```

---

## 🎓 Resumo

### Conceitos-Chave

| Conceito       | Descrição              | Uso                                          |
| -------------- | ---------------------- | -------------------------------------------- |
| **Error**      | Classe base para erros | Herdar para criar erros personalizados       |
| **throw**      | Lançar um erro         | Quando detectar condição inválida            |
| **try**        | Tentar executar código | Código que pode gerar erro                   |
| **catch**      | Capturar erro          | Tratar o erro adequadamente                  |
| **instanceof** | Verificar tipo do erro | Tratar diferentes erros de formas diferentes |

### Fluxo Completo

```
1. Definir erros personalizados
   ↓
2. Adicionar validações (throw)
   ↓
3. Envolver código em try-catch
   ↓
4. Tratar cada tipo de erro
   ↓
5. Exibir mensagem ou tomar ação
```

### Checklist para Implementar Erros

- [ ] Criar classe de erro personalizada
- [ ] Adicionar validação na classe/método
- [ ] Lançar erro com `throw` quando inválido
- [ ] Envolver código de chamada em `try-catch`
- [ ] Verificar tipo do erro com `instanceof`
- [ ] Tratar cada tipo de erro adequadamente
- [ ] Exibir mensagem clara para o usuário
- [ ] Documentar os erros que podem ocorrer

---

## 📚 Referências e Leitura Adicional

### Documentação Oficial

- [TypeScript Handbook - Error Handling](https://www.typescriptlang.org/docs/)
- [MDN - Error](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error)
- [MDN - try...catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)

### Padrões e Boas Práticas

- Clean Code - Robert C. Martin (Capítulo sobre tratamento de erros)
- Effective TypeScript - Dan Vanderkam

### Exercícios Adicionais

1. Implemente validação de CPF com erro personalizado
2. Crie sistema de log de erros em arquivo
3. Adicione validação de e-mail com erro específico
4. Implemente retry automático para erros temporários

---

**Desenvolvido para a disciplina de Linguagem Técnica de Programação**  
**IFMS - Campus Aquidauana**  
**Novembro de 2025**
