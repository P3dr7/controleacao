import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createObjectCsvWriter } from 'csv-writer';

export async function teste2(req, res) {
    const { nome, idade } = req.body;
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Obtém o diretório atual do script em execução
    const currentDirectory = __dirname;
    console.log('Diretório atual:', currentDirectory)
    
    // Obtém o caminho para a raiz do projeto
    const rootDirectory = path.join(currentDirectory, '../');
    const csvs = path.join(rootDirectory, 'CSVs/')
    console.log('Diretório dos CSVs:', csvs);
    console.log('Caminho da raiz do projeto:', rootDirectory);
    const nomeArquivo = `${nome}.csv`;
    const destino = path.join(csvs, nomeArquivo);

    const data = fs.readFileSync('teste12.csv', 'utf8', function (err, data) {
        if (err) {
            return console.log(err);
        }
        
    });

    const data2 = [{nome, idade}]

    // fs.writeFileSync(destino, 'Hellow Wordl',{
    //     encoding: 'utf8',
    //     flag: 'w+'
    // }, (err) => {
    //     console.log("arquivo escrito")
    // });

    const csvWriter = createObjectCsvWriter({
        path: destino,
        header: [
            { id: 'nome', title: 'Nome' },
            { id: 'idade', title: 'Idade' },
        ]
    });

    await csvWriter.writeRecords(data2)    
    console.log(data2)
    console.log(data);
    res.status(200).send(data);

}