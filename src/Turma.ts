import Estudante from "./Estudante";

export default class Turma {
  id: number;
  nome: string;
  estudantes: Estudante[] = [];

  constructor(id: number, nome: string) {
    this.id = id;
    this.nome = nome;
  }

  adicionarEstudante(estudante: Estudante): void {
    this.estudantes.push(estudante);
    console.log(`Estudante ${estudante.nome} adicionado à turma ${this.nome}!`);
  }

  resgistrarPresencaGeral(): void {
    this.estudantes.forEach((estudante) => estudante.registrarPresenca());
  }
}
