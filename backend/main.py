from fastapi import FastAPI, Query
from meilisearch import Client
from git import Repo
import os
import re
from pydantic import BaseModel

client = Client("http://127.0.0.1:7700")

app = FastAPI()

INDEX_NAME = "code_base"

class RepoRequestModel(BaseModel):
    repo_url : str
    local_path : str = "./repos"

@app.post("/index-repo")
def index_repo(req: RepoRequestModel):
    repo_name = req.repo_url.split("/")[-1].replace(".git", "")
    target_path = os.path.join(req.local_path, repo_name)

    if not os.path.exists(target_path):
        Repo.clone_from(req.repo_url, target_path)
    else:
        repo = Repo(target_path)
        repo.remotes.origin.pull()

    docs = []

    for root, _, files in os.walk(target_path):
        for file in files:
            filepath = os.path.join(root, file)
            try:
                with open(filepath, "r", errors="ignore") as f:
                    content = f.read()
                    rel_path = os.path.relpath(filepath, target_path)
                    safe_id = f"{repo_name}_{rel_path}"
                    safe_id = re.sub(r'[^a-zA-Z0-9_-]', "_", safe_id)[:500]

                    docs.append({
                        "id": safe_id,
                        "repo": repo_name,
                        "path": rel_path,
                        "content": content[:1000]
                    })
            except Exception:
                continue

    client.index(INDEX_NAME).add_documents(docs)
    task = client.index(INDEX_NAME).add_documents(docs)
    return {"repo": repo_name, "status": "indexing_started", "files": len(docs), "task": task}

@app.get("/search")
def search(q: str = Query(...)):
    results = client.index(INDEX_NAME).search(q)
    return results["hits"]