import Estudante from "./Estudante";
import RegistroDisciplina from "./RegistroDisciplina";
import RegistroPresenca from "./RegistroPresenca";
import RegistroTurma from "./RegistroTurma";
import RelatorioFrequencia from "./RelatorioFrequencia";
import Turma from "./Turma";

const estudantes: Estudante[] = [];

const estudante1 = new Estudante(1, "Ana Maria");
estudantes.push(estudante1);
const estudante2 = new Estudante(2, "João Pedro");
estudantes.push(estudante2);
const estudante3 = new Estudante(3, "Maria Clara");
estudantes.push(estudante3);

// RelatorioFrequencia.gerarRelatorioMensal(estudantes);
RelatorioFrequencia.gerarRelatorioMensal(estudantes);

estudante1.registrarPresenca();
estudante2.registrarPresenca();
estudante3.registrarPresenca();
estudante1.registrarPresenca();
RelatorioFrequencia.gerarRelatorioMensal(estudantes);

const info01 = new Turma(1, "Informática 1º Ano");
info01.adicionarEstudante(estudante1);
const info02 = new Turma(1, "Informática 2º Ano");
info02.adicionarEstudante(estudante2);
info02.adicionarEstudante(estudante3);
RelatorioFrequencia.gerarRelatorioMensal(estudantes);
info01.resgistrarPresencaGeral();
RelatorioFrequencia.gerarRelatorioMensal(estudantes);
info02.resgistrarPresencaGeral();
RelatorioFrequencia.gerarRelatorioMensal(estudantes);

const registrarPresenca1 = new RegistroPresenca(estudante1, new Date());
registrarPresenca1.registrar();

const registrarPresencaDisciplinaLTP = new RegistroDisciplina(
  estudante2,
  new Date(),
  "LTP"
);
registrarPresencaDisciplinaLTP.registrar();
RelatorioFrequencia.gerarRelatorioMensal(estudantes);

const resgistrarPresencaTurmaLTP = new RegistroTurma(
  estudante1,
  new Date(),
  info01
);
resgistrarPresencaTurmaLTP.registrar();
