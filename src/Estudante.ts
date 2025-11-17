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
    // this.presenca = this.presenca + 1
    // this.presenca += 1
    this.presenca++;
    // console.log(this.nome + ' teve presença registrada!')
    console.log(`${this.nome} teve presença registrada!`);
  }

  presencas(): number {
    return this.presenca;
  }
}
