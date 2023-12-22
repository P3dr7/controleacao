import https from "https";

export async function getInfos(requ, rese) {
	const { nomeAcao } = requ.body;

	try {
		const codAcao = await recuperaCodAcao(nomeAcao);
    console.log(JSON.parse(codAcao));
		const resultado = JSON.parse(codAcao);

		const tradingName = await encontrarIssuingCompany(resultado);

		if (tradingName) {
			console.log("Valor de issuingCompany encontrado:");
			console.log(tradingName);
		} else {
			console.log("issuingCompany não encontrado.");
		}


		const baseDiv = {"language":"pt-br","pageNumber":1,"pageSize":20,"tradingName":tradingName};
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

		rese.send(data);
	} catch (error) {
		console.error("Erro ao processar:", error);
		rese.status(500).send("Erro ao processar a requisição");
	}
}

export function recuperaCodAcao(nomeAcao) {
	return new Promise((resolve, reject) => {
		const baseConsulta = {
			language: "pt-br",
			pageNumber: 1,
			pageSize: 20,
			company: nomeAcao,
		};
		const objetoJson = JSON.stringify(baseConsulta);
		const encodedData = Buffer.from(objetoJson).toString("base64");

		const empresas = {
			method: "GET",
			hostname: "sistemaswebb3-listados.b3.com.br",
			path: `/listedCompaniesProxy/CompanyCall/GetInitialCompanies/${encodedData}`,
		};

		const req = https.request(empresas, (res) => {
			let data = "";

			res.on("data", (chunk) => {
				data += chunk;
			});

			res.on("end", () => {
				resolve(data); // Resolvendo a Promise com os dados
			});
		});

		req.on("error", (error) => {
			console.error("Erro na requisição:", error);
			reject(error); // Rejeitando a Promise em caso de erro
		});

		req.end();
	});
}

function encontrarIssuingCompany(codAcao) {
	try {
		if (codAcao && codAcao.results) {
			for (let resultado of codAcao.results) {
				if (resultado.hasOwnProperty("tradingName")) {
					return resultado.tradingName;
				}
			}
		}
	} catch (error) {
		console.error("Erro ao encontrar tradingName:", error);
	}

	return null;
}
