import React, { useState } from "react"
import axios from "axios"
import ResultList from "./ResultList"
import "./Search.css"


function Search() {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSearch = async ()=>{
        if(!query.trim())
            return;

        setLoading(true);
        setError("");

        try{
            const res = await axios.get("http://127.0.0.1:8000/search", {
                params: {q: query},
            })

            console.log("Full Axios response:", res)        // 👈 full object
            console.log("Response data:", res.data)  
            setResults(res.data)
        } catch (error) {
            setError("Search failed. Check connection")
            console.error(error)
        } finally{
            setLoading(false)
        }
    }

    return (
        <div className="search-container">
            <div className="search-box">
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search code..."/>
                <button onClick={handleSearch}>Search</button>
            </div>

            {loading && <p>Searching...</p>}
            {error && <p className="error">{error}</p>}

            <ResultList results={results} />
        </div>
    )
}

export default Search;
