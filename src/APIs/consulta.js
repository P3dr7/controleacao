import https from "https";

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
		//Busca os dados da ação
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
//Encontra o nome da empresa
export async function encontrarIssuingCompany(codAcao) {
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
