import RegistroDisciplina from "./RegistroDisciplina";

export default class RegistroComAlerta extends RegistroDisciplina {
  static LIMITE_FALTAS: number = 5;

  registrar(): void {
    super.registrar();
    const faltas = RegistroComAlerta.LIMITE_FALTAS - this.estudante.presencas();
    if (faltas <= 0) {
      console.log(
        `⚠️  Alerta: ${this.estudante.nome} excedeu o limite de faltas na disciplina ${this.disciplina}.`
      );
    }
  }
}
