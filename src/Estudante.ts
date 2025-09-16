export default class Estudante {
  id: number;
  nome: string;
  presenca: number = 0;

  constructor(id: number, nome: string) {
    this.id = id;
    this.nome = nome;
  }

  registrarPresenca(): void {
    // this.presenca = this.presenca + 1
    // this.presenca += 1
    this.presenca++;
    // console.log(this.nome + ' teve presença registrada!')
    console.log(`${this.nome} teve presença registrada!`);
  }
}
