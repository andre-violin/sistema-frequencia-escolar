import Estudante from "./Estudante";
import RegistroDisciplina from "./RegistroDisciplina";
import RegistroPresenca from "./RegistroPresenca";
import RegistroTurma from "./RegistroTurma";
import RelatorioFrequencia from "./RelatorioFrequencia";
import Turma from "./Turma";
import RegistroComAlerta from "./RegistroComAlerta";
import {
  DadosInvalidosError,
  EstudanteNaoEncontradoError,
} from "./errors/EstudanteError";
import { TurmaLotadaError, EstudanteDuplicadoError } from "./errors/TurmaError";

const estudantes: Estudante[] = [];

let estudante1!: Estudante;
let estudante2!: Estudante;
let estudante3!: Estudante;
let estudante4!: Estudante;

try {
  estudante1 = new Estudante(1, "Ana Maria");
  estudantes.push(estudante1);
  estudante2 = new Estudante(2, "João Pedro");
  estudantes.push(estudante2);
  estudante3 = new Estudante(3, "Maria Clara");
  estudantes.push(estudante3);
  estudante4 = new Estudante(4, "Carlos Eduardo");
  estudantes.push(estudante4);

  // Teste de erro: ID inválido
  // const estudanteInvalido = new Estudante(-1, "Teste");

  // Teste de erro: Nome vazio
  // const estudanteInvalido2 = new Estudante(4, "");
} catch (error) {
  if (error instanceof DadosInvalidosError) {
    console.error(`❌ Erro ao criar estudante: ${error.message}`);
    process.exit(1); // Encerra o programa se não conseguir criar os estudantes
  } else {
    console.error(`❌ Erro inesperado: ${error}`);
    process.exit(1);
  }
}

// RelatorioFrequencia.gerarRelatorioMensal(estudantes);
RelatorioFrequencia.gerarRelatorioMensal(estudantes);

estudante1.registrarPresenca();
estudante2.registrarPresenca();
estudante3.registrarPresenca();
estudante1.registrarPresenca();
RelatorioFrequencia.gerarRelatorioMensal(estudantes);

const info01 = new Turma(1, "Informática 1º Ano");
const info02 = new Turma(1, "Informática 2º Ano");

try {
  info01.adicionarEstudante(estudante1);

  // Teste de erro: adicionar estudante duplicado
  // info01.adicionarEstudante(estudante1);

  info02.adicionarEstudante(estudante2);
  info02.adicionarEstudante(estudante3);
  // Teste de erro: turma lotada
  // info02.adicionarEstudante(estudante4);
} catch (error) {
  if (error instanceof EstudanteDuplicadoError) {
    console.error(`❌ ${error.message}`);
  } else if (error instanceof TurmaLotadaError) {
    console.error(`❌ ${error.message}`);
  } else {
    console.error(`❌ Erro inesperado: ${error}`);
  }
}

try {
  const estudanteEncontrado = info01.buscarEstudante(estudante1.id);
  console.log(`✅ Encontrado: ${estudanteEncontrado.nome}`);

  const estudanteInexistente = info01.buscarEstudante(estudante2.id);
  console.log(`Encontrado: ${estudanteInexistente.nome}`);
} catch (error) {
  if (error instanceof EstudanteNaoEncontradoError) {
    console.error(`❌ ${error.message}`);
  }
}
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

// Exemplo de uso do RegistroComAlerta
const registroComAlerta1 = new RegistroComAlerta(
  estudante1,
  new Date(),
  "Matemática"
);
registroComAlerta1.registrar();

// Outro exemplo
const registroComAlerta2 = new RegistroComAlerta(
  estudante2,
  new Date(),
  "Português"
);
registroComAlerta2.registrar();

// Gerar relatório após os registros
RelatorioFrequencia.gerarRelatorioMensal(estudantes);
