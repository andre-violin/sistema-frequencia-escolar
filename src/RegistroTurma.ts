import Estudante from "./Estudante";
import RegistroPresenca from "./RegistroPresenca";
import Turma from "./Turma";

export default class RegistroTurma extends RegistroPresenca {
  turma: Turma;

  constructor(estudante: Estudante, data: Date, turma: Turma) {
    super(estudante, data);
    this.turma = turma;
  }

  registrar(): void {
    super.registrar();
    console.log(`Turma: ${this.turma.nome}`);
  }
}
