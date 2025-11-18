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
