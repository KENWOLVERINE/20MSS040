const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3001;
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3NTY4NzYyLCJpYXQiOjE3MTc1Njg0NjIsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijc0ODk0OTRmLTExZTgtNDI5NC04ZDJjLTYxZWUxY2FlNjZiMyIsInN1YiI6Im5rYXRoaXJlc2FuMjA0M0BnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJQU0dDQVMiLCJjbGllbnRJRCI6Ijc0ODk0OTRmLTExZTgtNDI5NC04ZDJjLTYxZWUxY2FlNjZiMyIsImNsaWVudFNlY3JldCI6Ik9pcWVqQkdFTUtzQXlPQ3oiLCJvd25lck5hbWUiOiJTYW5qYXkiLCJvd25lckVtYWlsIjoibmthdGhpcmVzYW4yMDQzQGdtYWlsLmNvbSIsInJvbGxObyI6IjIwTVNTMDQwIn0.awreKmbavHYt4xK59ohjvitEnWWDKmz0_DulUMN3m9E';
const URL = "http://20.244.56.144/test/${type}";
let windowSize = 10;
let storedNumbers = [];

const fetchNumbers = async (type) => {
    try {
        let config={
            'get':URL,header:{'Authorization':'Bearer ${TOKEN}'}
        }
        const response = await axios(config, { timeout: 1000 });
        return response.data.numbers;
    } catch (error) {
        console.error(`Error fetching numbers: ${error.message}`);
        return [];
    }
};

const calculateAverage = (numbers) => {
    if (numbers.length === 0) return 0;
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return (sum / numbers.length).toFixed(2);
};

app.get('/numbers/:type', async (req, res) => {
    const { type } = req.params;
    const validTypes = ['primes', 'fibonacci', 'even', 'random'];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    const newNumbers = await fetchNumbers(type);
    const uniqueNumbers = newNumbers.filter(num => !storedNumbers.includes(num));

    if (uniqueNumbers.length > 0) {
        storedNumbers = [...storedNumbers, ...uniqueNumbers].slice(-windowSize);
    }

    const average = calculateAverage(storedNumbers);

    res.json({
        windowPrevState: storedNumbers.slice(0, -uniqueNumbers.length),
        windowCurrState: storedNumbers,
        numbers: newNumbers,
        avg: average
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
