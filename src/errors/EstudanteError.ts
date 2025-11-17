export class EstudanteError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EstudanteError";
  }
}

export class EstudanteNaoEncontradoError extends EstudanteError {
  constructor(id: number) {
    super(`Estudante com ID ${id} não foi encontrado.`);
    this.name = "EstudanteNaoEncontradoError";
  }
}

export class DadosInvalidosError extends EstudanteError {
  constructor(campo: string) {
    super(`Dados inválidos: ${campo}`);
    this.name = "DadosInvalidosError";
  }
}
