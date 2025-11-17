import Estudante from "./Estudante";
import { TurmaLotadaError, EstudanteDuplicadoError } from "./errors/TurmaError";

export default class Turma {
  private static CAPACIDADE_MAXIMA = 40;
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

  resgistrarPresencaGeral(): void {
    this.estudantes.forEach((estudante) => estudante.registrarPresenca());
  }
}
