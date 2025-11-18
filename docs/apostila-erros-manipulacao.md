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
export class EstudanteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EstudanteError";
  }
}

export class EstudanteNaoEncontradoError extends EstudanteError {
  constructor(id: number) {
    super(`Estudante com ID ${id} não encontrado ou não pertence à turma.`);
    this.name = "EstudanteNaoEncontradoError";
  }
}

export class DadosInvalidosError extends EstudanteError {
  constructor(campo: string) {
    super(`Dados inválidos: ${campo}`);
    this.name = "DadosInvalidosError";
  }
}
```

**Análise detalhada do código:**

#### 1. Classe Base: `EstudanteError`

```typescript
export class EstudanteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EstudanteError";
  }
}
```

**Por que criar uma classe base?**

- Agrupa todos os erros relacionados a estudantes
- Permite capturar qualquer erro de estudante com um único `instanceof`
- Facilita a organização e hierarquia de erros

**Elementos:**

- `extends Error`: Herda da classe nativa `Error` do JavaScript
- `constructor(message: string)`: Recebe a mensagem de erro
- `super(message)`: Passa a mensagem para a classe pai `Error`
- `this.name = "EstudanteError"`: Define o nome do erro para identificação

#### 2. Classe: `EstudanteNaoEncontradoError`

```typescript
export class EstudanteNaoEncontradoError extends EstudanteError {
  constructor(id: number) {
    super(`Estudante com ID ${id} não encontrado ou não pertence à turma.`);
    this.name = "EstudanteNaoEncontradoError";
  }
}
```

**Quando usar:**

- Ao buscar um estudante por ID e não encontrar
- Ao tentar remover um estudante que não está na turma
- Em operações que dependem da existência do estudante

**Elementos:**

- `extends EstudanteError`: Herda de `EstudanteError` (não diretamente de `Error`)
- `constructor(id: number)`: Recebe apenas o ID do estudante
- Template string: Cria mensagem automática com o ID
- Específico e informativo: Diz exatamente qual estudante não foi encontrado

**Exemplo de uso:**

```typescript
const estudante = turma.buscarEstudante(999);
// Se não encontrar: EstudanteNaoEncontradoError: Estudante com ID 999 não encontrado ou não pertence à turma.
```

#### 3. Classe: `DadosInvalidosError`

```typescript
export class DadosInvalidosError extends EstudanteError {
  constructor(campo: string) {
    super(`Dados inválidos: ${campo}`);
    this.name = "DadosInvalidosError";
  }
}
```

**Quando usar:**

- Validação de ID (deve ser maior que zero)
- Validação de nome (não pode ser vazio)
- Qualquer validação de dados de entrada

**Elementos:**

- `extends EstudanteError`: Herda de `EstudanteError`
- `constructor(campo: string)`: Recebe descrição do campo inválido
- Mensagem flexível: Permite especificar qual validação falhou

**Exemplos de uso:**

```typescript
if (id <= 0) {
  throw new DadosInvalidosError("ID deve ser maior que zero");
}
if (!nome || nome.trim().length === 0) {
  throw new DadosInvalidosError("Nome não pode ser vazio");
}
```

**Hierarquia de Erros de Estudante:**

```
Error (classe nativa)
  └── EstudanteError (base)
       ├── EstudanteNaoEncontradoError
       └── DadosInvalidosError
```

**Vantagem da hierarquia:**

```typescript
try {
  // código
} catch (error) {
  if (error instanceof EstudanteError) {
    // Captura TODOS os erros de estudante (EstudanteNaoEncontradoError E DadosInvalidosError)
    console.error(`Erro relacionado a estudante: ${error.message}`);
  }
}
```

### Erros do Projeto: TurmaError

No arquivo `src/errors/TurmaError.ts`:

```typescript
export class TurmaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TurmaError";
  }
}

export class TurmaLotadaError extends TurmaError {
  constructor(capacidade: number) {
    super(`Turma já atingiu a capacidade máxima de ${capacidade} estudantes.`);
    this.name = "TurmaLotadaError";
  }
}

export class EstudanteDuplicadoError extends TurmaError {
  constructor(nomeEstudante: string) {
    super(`Estudante ${nomeEstudante} já está cadastrado na turma.`);
    this.name = "EstudanteDuplicadoError";
  }
}
```

**Análise detalhada do código:**

#### 1. Classe Base: `TurmaError`

```typescript
export class TurmaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TurmaError";
  }
}
```

**Por que criar uma classe base?**

- Agrupa todos os erros relacionados a turmas
- Permite capturar qualquer erro de turma com um único `instanceof`
- Mantém consistência com a estrutura de `EstudanteError`
- Facilita expansão futura (novos erros de turma)

**Elementos:**

- `extends Error`: Herda da classe nativa `Error`
- `export`: Permite importar em outros arquivos
- Genérico: Aceita qualquer mensagem de erro

#### 2. Classe: `TurmaLotadaError`

```typescript
export class TurmaLotadaError extends TurmaError {
  constructor(capacidade: number) {
    super(`Turma já atingiu a capacidade máxima de ${capacidade} estudantes.`);
    this.name = "TurmaLotadaError";
  }
}
```

**Quando usar:**

- Ao tentar adicionar estudante em turma que já atingiu o limite
- No método `adicionarEstudante()` da classe `Turma`

**Elementos:**

- `extends TurmaError`: Herda de `TurmaError` (não diretamente de `Error`)
- `constructor(capacidade: number)`: Recebe o número máximo de estudantes
- Mensagem automática: Informa qual é a capacidade máxima
- Contexto claro: Usuário sabe exatamente por que a operação falhou

**Exemplo de uso:**

```typescript
if (this.estudantes.length >= Turma.CAPACIDADE_MAXIMA) {
  throw new TurmaLotadaError(Turma.CAPACIDADE_MAXIMA);
}
// Resultado: TurmaLotadaError: Turma já atingiu a capacidade máxima de 2 estudantes.
```

#### 3. Classe: `EstudanteDuplicadoError`

```typescript
export class EstudanteDuplicadoError extends TurmaError {
  constructor(nomeEstudante: string) {
    super(`Estudante ${nomeEstudante} já está cadastrado na turma.`);
    this.name = "EstudanteDuplicadoError";
  }
}
```

**Quando usar:**

- Ao tentar adicionar um estudante que já existe na turma
- Validação por ID (não pelo nome)
- Previne duplicatas no array de estudantes

**Elementos:**

- `extends TurmaError`: Herda de `TurmaError`
- `constructor(nomeEstudante: string)`: Recebe o nome para mensagem
- Informativo: Diz qual estudante está duplicado
- Amigável: Usa o nome do estudante (mais legível que ID)

**Exemplo de uso:**

```typescript
if (this.estudantes.some((e) => e.id === estudante.id)) {
  throw new EstudanteDuplicadoError(estudante.nome);
}
// Resultado: EstudanteDuplicadoError: Estudante Ana Maria já está cadastrado na turma.
```

**Hierarquia de Erros de Turma:**

```
Error (classe nativa)
  └── TurmaError (base)
       ├── TurmaLotadaError
       └── EstudanteDuplicadoError
```

**Vantagens da hierarquia:**

- Cada erro tem uma mensagem específica e contextual
- Facilita o tratamento diferenciado de cada situação
- Melhora a legibilidade do código
- Permite capturar todos os erros de turma em um único bloco:

```typescript
try {
  turma.adicionarEstudante(estudante);
} catch (error) {
  if (error instanceof TurmaError) {
    // Captura TODOS os erros de turma
    console.error(`Erro na turma: ${error.message}`);
  }
}
```

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

### Exemplo 1: Validação de Dados no Construtor de Estudante

No arquivo `src/Estudante.ts`, o construtor completo com validações:

```typescript
import { DadosInvalidosError } from "./errors/EstudanteError";

export default class Estudante {
  id: number;
  nome: string;
  private presenca: number = 0;

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

  public registrarPresenca(): void {
    this.presenca++;
    console.log(`${this.nome} teve presença registrada!`);
  }

  presencas(): number {
    return this.presenca;
  }
}
```

**Análise detalhada linha por linha:**

#### Importação

```typescript
import { DadosInvalidosError } from "./errors/EstudanteError";
```

- Importa o erro personalizado do arquivo de erros
- Permite usar `DadosInvalidosError` no construtor

#### Declaração da classe e atributos

```typescript
export default class Estudante {
  id: number;
  nome: string;
  private presenca: number = 0;
```

- `export default`: Permite importar a classe em outros arquivos
- `id` e `nome`: Atributos públicos
- `private presenca`: Atributo privado, inicializado com 0

#### Validação 1: ID

```typescript
if (id <= 0) {
  throw new DadosInvalidosError("ID deve ser maior que zero");
}
```

- **Condição**: `id <= 0` verifica se ID é zero ou negativo
- **Ação**: Lança `DadosInvalidosError` com mensagem específica
- **Interrupção**: Construtor para aqui, objeto não é criado
- **Regra de negócio**: ID deve ser positivo

**Casos cobertos:**

```typescript
new Estudante(0, "João"); // ❌ Erro: ID deve ser maior que zero
new Estudante(-1, "Maria"); // ❌ Erro: ID deve ser maior que zero
new Estudante(-99, "Ana"); // ❌ Erro: ID deve ser maior que zero
```

#### Validação 2: Nome vazio

```typescript
if (!nome || nome.trim().length === 0) {
  throw new DadosInvalidosError("Nome não pode ser vazio");
}
```

- **Condição dupla**:
  - `!nome`: Verifica se nome é `null`, `undefined` ou string vazia
  - `nome.trim().length === 0`: Verifica se só tem espaços em branco
- **`trim()`**: Remove espaços do início e fim
- **Ação**: Lança erro se nome for inválido

**Casos cobertos:**

```typescript
new Estudante(1, ""); // ❌ Erro: Nome não pode ser vazio
new Estudante(1, "   "); // ❌ Erro: Nome não pode ser vazio
new Estudante(1, "\t\n"); // ❌ Erro: Nome não pode ser vazio
```

#### Atribuições (se passar nas validações)

```typescript
this.id = id;
this.nome = nome;
this.presenca = 0;
```

- Só executa se todas as validações passarem
- Inicializa os atributos do objeto
- Estudante é criado com sucesso

#### Método registrarPresenca

```typescript
public registrarPresenca(): void {
  this.presenca++;
  console.log(`${this.nome} teve presença registrada!`);
}
```

- Incrementa contador de presenças
- Exibe mensagem no console
- Método público, pode ser chamado externamente

#### Método presencas (getter)

```typescript
presencas(): number {
  return this.presenca;
}
```

- Retorna o número de presenças
- Permite acesso ao atributo privado `presenca`
- Encapsulamento: leitura permitida, escrita controlada

**Fluxo completo do construtor:**

```
Chamar: new Estudante(id, nome)
  ↓
Validar ID > 0?
  ├─ NÃO → throw DadosInvalidosError → ERRO
  └─ SIM → Continua
       ↓
  Validar nome não vazio?
       ├─ NÃO → throw DadosInvalidosError → ERRO
       └─ SIM → Continua
            ↓
       Atribuir valores
            ↓
       Objeto criado ✓
```

### Exemplo 2: Validações na Classe Turma

No arquivo `src/Turma.ts`, classe completa com todos os métodos que lançam erros:

```typescript
import Estudante from "./Estudante";
import { EstudanteNaoEncontradoError } from "./errors/EstudanteError";
import { TurmaLotadaError, EstudanteDuplicadoError } from "./errors/TurmaError";

export default class Turma {
  private static CAPACIDADE_MAXIMA = 2;
  id: number;
  nome: string;
  estudantes: Estudante[] = [];

  constructor(id: number, nome: string) {
    this.id = id;
    this.nome = nome;
  }

  adicionarEstudante(estudante: Estudante): void {
    if (this.estudantes.length >= Turma.CAPACIDADE_MAXIMA) {
      throw new TurmaLotadaError(Turma.CAPACIDADE_MAXIMA);
    }

    if (this.estudantes.some((e) => e.id === estudante.id)) {
      throw new EstudanteDuplicadoError(estudante.nome);
    }

    this.estudantes.push(estudante);
    console.log(`Estudante ${estudante.nome} adicionado à turma ${this.nome}!`);
  }

  buscarEstudante(id: number): Estudante {
    const estudante = this.estudantes.find((e) => e.id === id);

    if (!estudante) {
      throw new EstudanteNaoEncontradoError(id);
    }

    return estudante;
  }

  removerEstudante(id: number): void {
    const estudante = this.buscarEstudante(id); // lança erro se não encontrar

    const index = this.estudantes.indexOf(estudante);
    this.estudantes.splice(index, 1);

    console.log(`Estudante ${estudante.nome} removido da turma ${this.nome}!`);
  }

  resgistrarPresencaGeral(): void {
    this.estudantes.forEach((estudante) => estudante.registrarPresenca());
  }
}
```

**Análise detalhada de cada método:**

#### Importações

```typescript
import Estudante from "./Estudante";
import { EstudanteNaoEncontradoError } from "./errors/EstudanteError";
import { TurmaLotadaError, EstudanteDuplicadoError } from "./errors/TurmaError";
```

- Importa a classe `Estudante` para tipar os parâmetros
- Importa `EstudanteNaoEncontradoError` do arquivo de erros de estudante
- Importa `TurmaLotadaError` e `EstudanteDuplicadoError` do arquivo de erros de turma

#### Atributos da classe

```typescript
private static CAPACIDADE_MAXIMA = 2;
id: number;
nome: string;
estudantes: Estudante[] = [];
```

- `CAPACIDADE_MAXIMA`: Constante privada e estática (2 para testes, normalmente seria 40)
- `id` e `nome`: Identificação da turma
- `estudantes`: Array de objetos Estudante (inicializado vazio)

#### Método 1: `adicionarEstudante`

```typescript
adicionarEstudante(estudante: Estudante): void {
  if (this.estudantes.length >= Turma.CAPACIDADE_MAXIMA) {
    throw new TurmaLotadaError(Turma.CAPACIDADE_MAXIMA);
  }

  if (this.estudantes.some((e) => e.id === estudante.id)) {
    throw new EstudanteDuplicadoError(estudante.nome);
  }

  this.estudantes.push(estudante);
  console.log(`Estudante ${estudante.nome} adicionado à turma ${this.nome}!`);
}
```

**Validação 1: Turma lotada**

```typescript
if (this.estudantes.length >= Turma.CAPACIDADE_MAXIMA) {
  throw new TurmaLotadaError(Turma.CAPACIDADE_MAXIMA);
}
```

- **Verifica**: Se o número atual de estudantes atingiu o limite
- **Ação**: Lança `TurmaLotadaError` com a capacidade máxima
- **Resultado**: "Turma já atingiu a capacidade máxima de 2 estudantes."
- **Impede**: Adicionar mais estudantes que o permitido

**Validação 2: Estudante duplicado**

```typescript
if (this.estudantes.some((e) => e.id === estudante.id)) {
  throw new EstudanteDuplicadoError(estudante.nome);
}
```

- **`some()`**: Percorre o array e retorna `true` se encontrar
- **Compara**: IDs de estudantes (não nomes, pois podem ser iguais)
- **Ação**: Lança `EstudanteDuplicadoError` com o nome do estudante
- **Resultado**: "Estudante Ana Maria já está cadastrado na turma."
- **Impede**: Duplicatas no array

**Ação normal:**

```typescript
this.estudantes.push(estudante);
console.log(`Estudante ${estudante.nome} adicionado à turma ${this.nome}!`);
```

- Adiciona o estudante ao array
- Exibe mensagem de sucesso

#### Método 2: `buscarEstudante`

```typescript
buscarEstudante(id: number): Estudante {
  const estudante = this.estudantes.find((e) => e.id === id);

  if (!estudante) {
    throw new EstudanteNaoEncontradoError(id);
  }

  return estudante;
}
```

**Busca:**

```typescript
const estudante = this.estudantes.find((e) => e.id === id);
```

- **`find()`**: Retorna o primeiro elemento que satisfaz a condição
- **Retorna**: O objeto `Estudante` se encontrar, ou `undefined` se não encontrar

**Validação:**

```typescript
if (!estudante) {
  throw new EstudanteNaoEncontradoError(id);
}
```

- **Verifica**: Se `estudante` é `undefined` (não encontrado)
- **Ação**: Lança `EstudanteNaoEncontradoError` com o ID buscado
- **Resultado**: "Estudante com ID 999 não encontrado ou não pertence à turma."
- **Garante**: Método só retorna se realmente encontrar

**Retorno:**

```typescript
return estudante;
```

- Retorna o estudante encontrado
- TypeScript sabe que não é `undefined` aqui (validado acima)

#### Método 3: `removerEstudante`

```typescript
removerEstudante(id: number): void {
  const estudante = this.buscarEstudante(id); // lança erro se não encontrar

  const index = this.estudantes.indexOf(estudante);
  this.estudantes.splice(index, 1);

  console.log(`Estudante ${estudante.nome} removido da turma ${this.nome}!`);
}
```

**Reutilização de validação:**

```typescript
const estudante = this.buscarEstudante(id);
```

- **Chama**: Método `buscarEstudante()` que já valida
- **Se não encontrar**: `buscarEstudante` lança `EstudanteNaoEncontradoError`
- **Se encontrar**: Retorna o objeto e continua
- **DRY**: Não repete código de validação

**Remoção:**

```typescript
const index = this.estudantes.indexOf(estudante);
this.estudantes.splice(index, 1);
```

- **`indexOf()`**: Encontra a posição do estudante no array
- **`splice(index, 1)`**: Remove 1 elemento na posição `index`
- **Modifica**: O array original

**Mensagem de sucesso:**

```typescript
console.log(`Estudante ${estudante.nome} removido da turma ${this.nome}!`);
```

#### Método 4: `resgistrarPresencaGeral` (sem validações)

```typescript
resgistrarPresencaGeral(): void {
  this.estudantes.forEach((estudante) => estudante.registrarPresenca());
}
```

- **`forEach()`**: Percorre todos os estudantes
- **Ação**: Chama `registrarPresenca()` de cada um
- **Sem validação**: Assume que array já foi validado

**Fluxo de validações na Turma:**

```
ADICIONAR ESTUDANTE
  ↓
Turma cheia?
  ├─ SIM → throw TurmaLotadaError
  └─ NÃO → Continua
       ↓
  Estudante já existe?
       ├─ SIM → throw EstudanteDuplicadoError
       └─ NÃO → Adiciona ✓

BUSCAR ESTUDANTE
  ↓
Estudante encontrado?
  ├─ NÃO → throw EstudanteNaoEncontradoError
  └─ SIM → Retorna estudante ✓

REMOVER ESTUDANTE
  ↓
Buscar (pode lançar erro)
  ↓
Remover do array ✓
```

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

### Exemplo 3: Código Completo do index.ts

O arquivo `src/index.ts` demonstra todos os conceitos de tratamento de erros aplicados no projeto:

```typescript
import Estudante from "./Estudante";
import RegistroDisciplina from "./RegistroDisciplina";
import RegistroPresenca from "./RegistroPresenca";
import RegistroTurma from "./RegistroTurma";
import RelatorioFrequencia from "./RelatorioFrequencia";
import Turma from "./Turma";
import RegistroComAlerta from "./RegistroComAlerta";
import {
  DadosInvalidosError,
  EstudanteNaoEncontradoError,
} from "./errors/EstudanteError";
import { TurmaLotadaError, EstudanteDuplicadoError } from "./errors/TurmaError";

const estudantes: Estudante[] = [];

let estudante1!: Estudante;
let estudante2!: Estudante;
let estudante3!: Estudante;
let estudante4!: Estudante;

try {
  estudante1 = new Estudante(1, "Ana Maria");
  estudantes.push(estudante1);
  estudante2 = new Estudante(2, "João Pedro");
  estudantes.push(estudante2);
  estudante3 = new Estudante(3, "Maria Clara");
  estudantes.push(estudante3);
  estudante4 = new Estudante(4, "Carlos Eduardo");
  estudantes.push(estudante4);

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

RelatorioFrequencia.gerarRelatorioMensal(estudantes);

estudante1.registrarPresenca();
estudante2.registrarPresenca();
estudante3.registrarPresenca();
estudante1.registrarPresenca();
RelatorioFrequencia.gerarRelatorioMensal(estudantes);

const info01 = new Turma(1, "Informática 1º Ano");
const info02 = new Turma(1, "Informática 2º Ano");

try {
  info01.adicionarEstudante(estudante1);

  // Teste de erro: adicionar estudante duplicado
  // info01.adicionarEstudante(estudante1);

  info02.adicionarEstudante(estudante2);
  info02.adicionarEstudante(estudante3);
  // Teste de erro: turma lotada
  // info02.adicionarEstudante(estudante4);
} catch (error) {
  if (error instanceof EstudanteDuplicadoError) {
    console.error(`❌ ${error.message}`);
  } else if (error instanceof TurmaLotadaError) {
    console.error(`❌ ${error.message}`);
  } else {
    console.error(`❌ Erro inesperado: ${error}`);
  }
}

try {
  const estudanteEncontrado = info01.buscarEstudante(estudante1.id);
  console.log(`✅ Encontrado: ${estudanteEncontrado.nome}`);

  const estudanteInexistente = info01.buscarEstudante(estudante2.id);
  console.log(`Encontrado: ${estudanteInexistente.nome}`);
} catch (error) {
  if (error instanceof EstudanteNaoEncontradoError) {
    console.error(`❌ ${error.message}`);
  }
}

RelatorioFrequencia.gerarRelatorioMensal(estudantes);
info01.resgistrarPresencaGeral();
RelatorioFrequencia.gerarRelatorioMensal(estudantes);
info02.resgistrarPresencaGeral();
RelatorioFrequencia.gerarRelatorioMensal(estudantes);

const registrarPresenca1 = new RegistroPresenca(estudante1, new Date());
registrarPresenca1.registrar();

const registrarPresencaDisciplinaLTP = new RegistroDisciplina(
  estudante2,
  new Date(),
  "LTP"
);
registrarPresencaDisciplinaLTP.registrar();
RelatorioFrequencia.gerarRelatorioMensal(estudantes);

const resgistrarPresencaTurmaLTP = new RegistroTurma(
  estudante1,
  new Date(),
  info01
);
resgistrarPresencaTurmaLTP.registrar();

const registroComAlerta1 = new RegistroComAlerta(
  estudante1,
  new Date(),
  "Matemática"
);
registroComAlerta1.registrar();

const registroComAlerta2 = new RegistroComAlerta(
  estudante2,
  new Date(),
  "Português"
);
registroComAlerta2.registrar();

RelatorioFrequencia.gerarRelatorioMensal(estudantes);
```

**Análise completa do código:**

#### 1. Importações de Erros

```typescript
import {
  DadosInvalidosError,
  EstudanteNaoEncontradoError,
} from "./errors/EstudanteError";
import { TurmaLotadaError, EstudanteDuplicadoError } from "./errors/TurmaError";
```

**Por quê importar os erros?**

- Permite usar `instanceof` para identificar tipos específicos de erro
- Necessário para tratamento diferenciado de cada tipo
- Sem as importações, só conseguiríamos capturar erros genéricos

#### 2. Declaração de Variáveis com `!`

```typescript
let estudante1!: Estudante;
let estudante2!: Estudante;
let estudante3!: Estudante;
let estudante4!: Estudante;
```

**O que significa `!`?**

- **Definite Assignment Assertion** (Asserção de Atribuição Definitiva)
- Diz ao TypeScript: "Confie em mim, esta variável será atribuída antes de ser usada"
- Necessário porque as variáveis são declaradas FORA do `try` mas atribuídas DENTRO

**Por que não declarar dentro do try?**

```typescript
// ❌ Não funciona:
try {
  const estudante1 = new Estudante(1, "Ana");
}
estudante1.registrarPresenca(); // ERRO: estudante1 não existe aqui (escopo)
```

**Alternativas ao `!`:**

```typescript
// Opção 1: Nullable (mais verboso)
let estudante1: Estudante | null = null;
// depois precisa verificar: if (estudante1) { ... }

// Opção 2: Com `!` + process.exit (mais limpo) ✓
let estudante1!: Estudante;
// garantido por process.exit(1) no catch
```

#### 3. Try-Catch para Criação de Estudantes (Erro Crítico)

```typescript
try {
  estudante1 = new Estudante(1, "Ana Maria");
  estudantes.push(estudante1);
  estudante2 = new Estudante(2, "João Pedro");
  estudantes.push(estudante2);
  estudante3 = new Estudante(3, "Maria Clara");
  estudantes.push(estudante3);
  estudante4 = new Estudante(4, "Carlos Eduardo");
  estudantes.push(estudante4);

  // Testes comentados para validação
  // const estudanteInvalido = new Estudante(-1, "Teste");
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

**Fluxo de execução:**

```
Tenta criar estudante1
  ↓ (sucesso)
Adiciona ao array
  ↓
Tenta criar estudante2
  ↓ (sucesso)
Adiciona ao array
  ↓
... (continua para estudante3 e 4)
  ↓
Se QUALQUER erro ocorrer:
  ↓
Vai para catch
  ↓
Verifica tipo do erro
  ↓
Exibe mensagem apropriada
  ↓
process.exit(1) → PROGRAMA ENCERRA
```

**Por que usar `process.exit(1)`?**

- **Erro crítico**: Sem estudantes, o resto do programa não faz sentido
- **Código 1**: Indica que houve erro (código 0 = sucesso)
- **Previne bugs**: Garante que variáveis não fiquem `undefined`

**Testes comentados:**

```typescript
// Descomentar para testar ID inválido:
// const estudanteInvalido = new Estudante(-1, "Teste");
// Resultado: ❌ Erro ao criar estudante: Dados inválidos: ID deve ser maior que zero
//            [Programa encerra]

// Descomentar para testar nome vazio:
// const estudanteInvalido2 = new Estudante(4, "");
// Resultado: ❌ Erro ao criar estudante: Dados inválidos: Nome não pode ser vazio
//            [Programa encerra]
```

#### 4. Try-Catch para Adicionar Estudantes em Turmas (Erro Não-Crítico)

```typescript
const info01 = new Turma(1, "Informática 1º Ano");
const info02 = new Turma(1, "Informática 2º Ano");

try {
  info01.adicionarEstudante(estudante1);
  // info01.adicionarEstudante(estudante1); // teste duplicado

  info02.adicionarEstudante(estudante2);
  info02.adicionarEstudante(estudante3);
  // info02.adicionarEstudante(estudante4); // teste turma lotada
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

**Diferenças do try-catch anterior:**

- **SEM `process.exit(1)`**: Programa continua mesmo com erro
- **Múltiplos tipos**: Trata 2 tipos de erro diferentes
- **Menos crítico**: Falhar ao adicionar em turma não impede o resto

**Por que NÃO encerrar o programa?**

- Adicionar em turma é uma operação isolada
- Se falhar, outras partes do sistema podem continuar
- Usuário pode corrigir e tentar novamente

**Testes disponíveis:**

```typescript
// Teste 1: Estudante duplicado
// info01.adicionarEstudante(estudante1);
// Resultado: ❌ Estudante Ana Maria já está cadastrado na turma.
//            [Programa CONTINUA]

// Teste 2: Turma lotada (CAPACIDADE_MAXIMA = 2)
// info02.adicionarEstudante(estudante4);
// Resultado: ❌ Turma já atingiu a capacidade máxima de 2 estudantes.
//            [Programa CONTINUA]
```

#### 5. Try-Catch para Buscar Estudante

```typescript
try {
  const estudanteEncontrado = info01.buscarEstudante(estudante1.id);
  console.log(`✅ Encontrado: ${estudanteEncontrado.nome}`);

  const estudanteInexistente = info01.buscarEstudante(estudante2.id);
  console.log(`Encontrado: ${estudanteInexistente.nome}`);
} catch (error) {
  if (error instanceof EstudanteNaoEncontradoError) {
    console.error(`❌ ${error.message}`);
  }
}
```

**O que acontece:**

**Primeira busca (estudante1):**

```typescript
const estudanteEncontrado = info01.buscarEstudante(estudante1.id);
```

- `estudante1` FOI adicionado em `info01`
- Busca encontra o estudante
- Exibe: `✅ Encontrado: Ana Maria`
- Continua normalmente

**Segunda busca (estudante2):**

```typescript
const estudanteInexistente = info01.buscarEstudante(estudante2.id);
```

- `estudante2` NÃO foi adicionado em `info01` (está em `info02`)
- `buscarEstudante` não encontra
- Lança `EstudanteNaoEncontradoError`
- Vai para o `catch`
- Exibe: `❌ Estudante com ID 2 não encontrado ou não pertence à turma.`

**Por que o segundo `console.log` nunca executa?**

```typescript
console.log(`Encontrado: ${estudanteInexistente.nome}`); // ← Nunca chega aqui
```

- Quando erro é lançado, execução salta direto para o `catch`
- Linhas após o `throw` no `try` são ignoradas

**Fluxo visual:**

```
try {
  buscar estudante1 → ✓ encontrado
  console.log("✅ Encontrado...") → executa

  buscar estudante2 → ✗ não encontrado
  ↓ throw EstudanteNaoEncontradoError
  ↓ [pula para catch]
  console.log("Encontrado...") → NUNCA executa
}
catch {
  exibe erro ❌
}
```

#### 6. Resto do Código (Sem Erros)

```typescript
RelatorioFrequencia.gerarRelatorioMensal(estudantes);
info01.resgistrarPresencaGeral();
info02.resgistrarPresencaGeral();

const registrarPresenca1 = new RegistroPresenca(estudante1, new Date());
registrarPresenca1.registrar();

// ... outros registros ...
```

- Código sem validações especiais
- Assume que objetos já foram validados anteriormente
- Operações normais do sistema

**Resumo dos 3 Try-Catch no index.ts:**

| Try-Catch              | Objetivo                     | Erros Capturados                              | Usa process.exit? | Por quê?                                    |
| ---------------------- | ---------------------------- | --------------------------------------------- | ----------------- | ------------------------------------------- |
| #1 Criar Estudantes    | Criar 4 estudantes           | `DadosInvalidosError`                         | ✅ SIM            | Erro crítico - sem estudantes nada funciona |
| #2 Adicionar em Turmas | Adicionar em info01 e info02 | `EstudanteDuplicadoError`, `TurmaLotadaError` | ❌ NÃO            | Erro não-crítico - programa pode continuar  |
| #3 Buscar Estudante    | Buscar em info01             | `EstudanteNaoEncontradoError`                 | ❌ NÃO            | Erro esperado - demonstração de busca       |

**Estratégias diferentes para erros diferentes:**

```
ERRO CRÍTICO (criar estudantes)
├─ Captura erro
├─ Exibe mensagem
└─ process.exit(1) ← ENCERRA PROGRAMA

ERRO NÃO-CRÍTICO (turma/busca)
├─ Captura erro
├─ Exibe mensagem
└─ Continua programa ← PROGRAMA SEGUE
```

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
