import { useEffect, useState } from "react"
import { API_URL, API_URL_DEV } from '@env';

const BASE_URL = API_URL;



export const useCurrencies = () => {
    const [currencies, setCurrencies] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`${BASE_URL}/currencies`);
                const currencies = await response.json();
                setCurrencies(currencies);
            } catch (error) {
                console.log('ERROR GETTING CURRENCIES', error);
            }
        })()
    }, [])
    return currencies;
};