import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [type, setType] = useState('even');
    const [response, setResponse] = useState(null);

    const fetchNumbers = async () => {
        try {
            const res = await axios.get(`http://localhost:3001/numbers/${type}`);
            setResponse(res.data);
        } catch (error) {
            console.error('Error fetching numbers:', error);
        }
    };

    return (
        <div>
            <h1>Average Calculator</h1>
            <select onChange={(e) => setType(e.target.value)} value={type}>
                <option value="primes">Primes</option>
                <option value="fibonacci">Fibonacci</option>
                <option value="even">Even</option>
                <option value="random">Random</option>
            </select>
            <button onClick={fetchNumbers}>Fetch Numbers</button>
            {response && (
                <div>
                    <h2>Response:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default App;

