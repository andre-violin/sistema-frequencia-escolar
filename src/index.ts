import Estudante from "./Estudante";
import RelatorioFrequencia from "./RelatorioFrequencia";

const estudantes: Estudante[] = [];

const estudante1 = new Estudante(1, "Ana Maria");
estudantes.push(estudante1);
const estudante2 = new Estudante(2, "João Pedro");
estudantes.push(estudante2);
const estudante3 = new Estudante(3, "Maria Clara");
estudantes.push(estudante3);

RelatorioFrequencia.gerarRelatorioMensal(estudantes);

estudante1.registrarPresenca();
estudante2.registrarPresenca();
estudante3.registrarPresenca();
estudante1.registrarPresenca();
RelatorioFrequencia.gerarRelatorioMensal(estudantes);
