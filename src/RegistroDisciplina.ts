import Estudante from "./Estudante";
import RegistroPresenca from "./RegistroPresenca";

// Subclasse especializada para registrar presença em disciplinas específicas
export default class RegistroDisciplina extends RegistroPresenca {
  disciplina: string;

  constructor(estudante: Estudante, data: Date, disciplina: string) {
    super(estudante, data); // Chama o contrutor da superclasse
    this.disciplina = disciplina;
  }

  //  Sobrescevendo o método resgistrar para incluir a disciplina
  registrar(): void {
    super.registrar();
    console.log(`Disciplina: ${this.disciplina}`);
  }
}
