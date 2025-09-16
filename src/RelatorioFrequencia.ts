import Estudante from "./Estudante";
export default class RelatorioFrequencia {
  static gerarRelatorioMensal(estudantes: Estudante[]): void {
    console.log("Relatório Mensal de Frequência");
    estudantes.forEach((estudante) => {
      console.log(
        `Matrícula: ${estudante.id} - Estudante: ${estudante.nome} - Presenças: ${estudante.presenca}`
      );
    });
  }
}
