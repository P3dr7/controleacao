import {inserirOuCriarCSV} from './controllers/inputFiles.js';
import {teste1} from './controllers/teste1.js';
import { teste2 } from './controllers/teste2.js';
import { getInfos } from './APIs/consulta.js';
import { valorDividendos } from './APIs/filtraDados.js';

export default function routes(fastify, options, done) {
    fastify.post("/getInfos", getInfos)
    fastify.post("/criaCSV", inserirOuCriarCSV)
    fastify.get("/teste1", teste1)
    fastify.post("/", teste2)
    fastify.get("/dividendos", valorDividendos)
	done();
}

