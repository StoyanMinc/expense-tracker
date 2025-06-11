import fs from 'fs';
const BASE_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies';

export async function getCurrency(req, res) {
    let currenciesData = [
        { label: '$', bgn: 0, eur: 0 },
        { label: '€', usd: 0, bgn: 0 },
        { label: 'лв.', usd: 0, eur: 0 }
    ]

    try {
        const currencies = ['usd', 'eur', 'bgn']; // Add the correct ISO codes
        const requests = currencies.map(code =>
            fetch(`${BASE_URL}/${code}.json`).then(res => res.json())
        );

        const [usdData, euroData, levaData] = await Promise.all(requests);
        
        currenciesData[0].bgn = usdData.usd.bgn;
        currenciesData[0].eur = usdData.usd.eur;
        currenciesData[1].usd = euroData.eur.usd;
        currenciesData[1].bgn = euroData.eur.bgn;
        currenciesData[2].usd = levaData.bgn.usd;
        currenciesData[2].eur = levaData.bgn.eur;
        
        await fs.writeFile('data/currencies.json', JSON.stringify(currenciesData), 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('File written successfully!');
            });
        res.status(200).json(currenciesData);
    } catch (error) {
        console.error("Currency fetch failed:", error);
        res.status(500).json({ error: 'Failed to fetch currencies' });
    }
}
