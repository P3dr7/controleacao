import { getInfos, recuperaCodAcao } from './consulta.js';

export async function valorDividendos(req, res) {
    const dataAtual = new Date();
    const anoAtual = dataAtual.getFullYear();
    res.send(dataAtual)
    console.log(anoAtual)

    
}