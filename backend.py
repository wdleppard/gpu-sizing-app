from fastapi import FastAPI, Query
from typing import List, Optional
import json

app = FastAPI()

def load_gpus():
    with open('nvidia_gpus.json') as f:
        return json.load(f)

gpus = load_gpus()

@app.get('/recommend')
def recommend_gpus(
    memory_gb: float = Query(..., description='Required GPU memory in GB'),
    concurrent_users: int = Query(..., description='Number of concurrent users'),
    images_per_sec: int = Query(..., description='Images/documents processed per second'),
    fp: Optional[str] = Query(None, description='Floating point precision required (e.g., FP16, FP32, FP64)'),
    min_error: Optional[bool] = Query(False, description='Minimize error rates (True/False)')
):
    results = []
    for gpu in gpus:
        try:
            mem_val = float(gpu['memory'].replace('GB','').strip())
        except:
            continue
        if mem_val < memory_gb:
            continue
        if fp and fp not in gpu['fp']:
            continue
        results.append(gpu)
    return {'recommendations': results[:10]}
