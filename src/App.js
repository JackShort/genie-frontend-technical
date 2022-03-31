import './App.css';
import { useState } from 'react';
import Gallery from './components/Gallery';

function App() {
    const [collection, setCollection] = useState('');
    const [input, setInput] = useState('');

    return (
        <div className="App">
            <div className="text-2xl font-bold my-6">Genie.xyz</div>
            <div className="text-md">Collection Address</div>
            <div className="flow">
                <input
                    className="border mr-2"
                    type="text"
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Collection Address"
                />
                <button onClick={() => setCollection(input)} className="bg-slate-200 py-1 px-2 text-sm rounded mb-4">
                    Submit
                </button>
            </div>

            <Gallery collection={collection} />
        </div>
    );
}

export default App;
