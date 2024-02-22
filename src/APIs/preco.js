import dotenv from "dotenv";
import https from "https";

dotenv.config();

export async function getPriceStock(req, res) {

	// const ticker = req.body.ticker;

	// // Aqui você pode fazer a requisição para a API, porem ela permite so 25 por dia 
	// let tickerBR = ticker + ".SA";
	// tickerBR = tickerBR.replace(/\s/g, "");
	// console.log(tickerBR);
	// console.log(process.env.SECRET_KEY);

	// // Aqui você pode fazer a requisição para a API que quiser
	// const options = {
	// 	method: "GET",
	// 	hostname: "www.alphavantage.co",
	// 	path: `/query?function=TIME_SERIES_DAILY&symbol=${tickerBR}&interval=60min&apikey=${process.env.SECRET_KEY}`,
	// };

	// const data = await new Promise((resolve, reject) => {
	// 	const req = https.request(options, (res) => {
	// 		let data = "";

	// 		res.on("data", (chunk) => {
	// 			data += chunk;
	// 		});

	// 		res.on("end", () => {
	// 			resolve(data);
	// 		});
	// 	});

	// 	req.on("error", (error) => {
	// 		reject(error);
	// 	});

	// 	req.end();
	// });
	const dataJSON = {
		"Meta Data": {
			"1. Information": "Daily Prices (open, high, low, close) and Volumes",
			"2. Symbol": "PETR4.SA",
			"3. Last Refreshed": "2024-02-21",
			"4. Output Size": "Compact",
			"5. Time Zone": "US/Eastern",
		},
		"Time Series (Daily)": {
			"2024-02-21": {
				"1. open": "42.4500",
				"2. high": "42.7200",
				"3. low": "42.1300",
				"4. close": "42.5100",
				"5. volume": "20873800",
			},
			"2024-02-20": {
				"1. open": "42.7700",
				"2. high": "42.8200",
				"3. low": "42.1000",
				"4. close": "42.4500",
				"5. volume": "42375400",
			},
			"2024-02-19": {
				"1. open": "42.7600",
				"2. high": "42.9400",
				"3. low": "42.5600",
				"4. close": "42.9000",
				"5. volume": "12826700",
			},
			"2024-02-16": {
				"1. open": "42.0900",
				"2. high": "42.8900",
				"3. low": "42.0600",
				"4. close": "42.6900",
				"5. volume": "37268900",
			},
		},
	};

	// const dataJSON = JSON.parse(data);

	const symbol = dataJSON["Meta Data"]["2. Symbol"];

	const timeSeries = Object.entries(dataJSON["Time Series (Daily)"]).map(
		([date, data]) => ({
			date,
			close: data["4. close"],
		})
	);

	const dataJSON2 = [symbol, timeSeries];

	const dataResolved = JSON.stringify(dataJSON2);

	res.send(dataResolved);
	// Aqui você pode fazer o que quiser com os dados recebidos
}
