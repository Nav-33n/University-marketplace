import { useEffect, useState } from "react";

function BackendConnection() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Fetch data from the backend API
        fetch('http://localhost:3000/api/connection')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(data => setData(data.message))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    console.log('Data fetched from backend:', data);
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Backend Connection Test</h1>
            <p className="text-lg">{data || 'Loading...'}</p>
        </div>
    );
}

export default BackendConnection;