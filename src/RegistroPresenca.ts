import Estudante from "./Estudante";

export default class RegistroPresenca {
  estudante: Estudante;
  data: Date;

  constructor(estudante: Estudante, data: Date) {
    this.estudante = estudante;
    this.data = data;
  }

  // Método genérico para registrar presença
  registrar(): void {
    this.estudante.registrarPresenca();
    console.log(
      `Presença registrada para ${
        this.estudante.nome
      } em ${this.data.toLocaleDateString()}`
    );
  }
}
