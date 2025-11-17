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
