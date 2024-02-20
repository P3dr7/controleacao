import {
	recuperaCodAcao,
	encontrarIssuingCompany,
} from "./consulta.js";
import https from "https";

export async function valorDividendos(requ, rese) {
	const dataAtual = new Date();
	const anoAtual = dataAtual.getFullYear();
	// res.send(dataAtual)
	// console.log(anoAtual)
	const nomeAcao = requ.params.ticker;
	const combinedArray = [];
	try {
		const codAcao = await recuperaCodAcao(nomeAcao);
		const dataAcao = [];
		const resultado = JSON.parse(codAcao);

		resultado.results.forEach((obj) => {
			if (obj.issuingCompany === nomeAcao.toUpperCase()) {
				dataAcao.push(obj);
			}
		});
		console.log(dataAcao);
		const objJSON = { results: dataAcao };
		// Agora que você tem os resultados filtrados em dataAcao, pode passá-lo diretamente para a próxima função
		const tradingName = await encontrarIssuingCompany(objJSON);

		console.log(tradingName);

		if (tradingName) {
			console.log("Valor de issuingCompany encontrado:");
			console.log(tradingName);
		} else {
			console.log("issuingCompany não encontrado.");
		}

		const baseDiv = {
			language: "pt-br",
			pageNumber: 1,
			pageSize: 20,
			tradingName: tradingName,
		};
		const jsonDiv = JSON.stringify(baseDiv);
		const encodedDiv = Buffer.from(jsonDiv).toString("base64");

		console.log(encodedDiv);
		const options = {
			method: "GET",
			hostname: "sistemaswebb3-listados.b3.com.br",
			path: `/listedCompaniesProxy/CompanyCall/GetListedCashDividends/${encodedDiv}`,
		};

		const data = await new Promise((resolve, reject) => {
			const req = https.request(options, (res) => {
				let data = "";

				res.on("data", (chunk) => {
					data += chunk;
				});

				res.on("end", () => {
					resolve(data);
				});
			});

			req.on("error", (error) => {
				reject(error);
			});

			req.end();
		});
		combinedArray.push(dataAcao[0]);

		// Passa os dados para JSON e remove os campos desejados
		const parsedData = JSON.parse(data);
		parsedData.results.forEach((obj) => {
			// Excluir os campos desejados de cada objeto
			delete obj.typeStock;
			delete obj.dateApproval;
			delete obj.ratio;
			delete obj.quotedPerShares;
		});

		// console.log(parsedData);

		combinedArray.push(parsedData);
		// console.dir(combinedArray, { depth: null });

		rese.send(combinedArray);
	} catch (error) {
		console.error("Erro ao processar:", error);
		rese.status(500).send("Erro ao processar a requisição");
	}
}
