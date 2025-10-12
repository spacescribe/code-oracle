import React, { useState } from 'react';
import axios from 'axios';
import './IndexRepo.css'

function IndexRepo() {
    const [repoUrl, setRepoUrl] = useState("")
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState("")

    const handleIndex = async () => {
        if(!repoUrl.trim()) return;

        setLoading(true)
        setMsg("")

        try{
            const res = await axios.post("http://127.0.0.1:8000/index-repo", {
                repo_url: repoUrl,
            })

            setMsg(`Repo: "${res.data.repo}" indexed. ${res.data.files} files.`)
            setRepoUrl("");
        } catch (err){
            console.error(err)
            setMsg(`Failed to index repo "${repoUrl}"`)
        } finally {
            setLoading(false)
        }
    }

    return(
        <div className='index-repo-container'>
            <input type="text" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder='Enter git repo url..' />
            <button onClick={handleIndex} disabled={loading}> {loading ? "Indexing...": "Index repo"} </button>
            {msg && <p className='message'>{msg}</p>}
        </div>
    )
}

export default IndexRepo;