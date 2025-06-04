import React, { useState } from 'react';

function App() {
  const [form, setForm] = useState({
    memory_gb: '',
    concurrent_users: '',
    images_per_sec: '',
    fp: '',
    min_error: false
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setResults([]);
    const params = new URLSearchParams({
      memory_gb: form.memory_gb,
      concurrent_users: form.concurrent_users,
      images_per_sec: form.images_per_sec,
      fp: form.fp,
      min_error: form.min_error
    });
    const res = await fetch(`http://localhost:8000/recommend?${params}`);
    const data = await res.json();
    setResults(data.recommendations || []);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>AI GPU Sizing Tool</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Memory Required (GB): </label>
          <input name="memory_gb" type="number" step="0.1" value={form.memory_gb} onChange={handleChange} required />
        </div>
        <div>
          <label>Concurrent Users: </label>
          <input name="concurrent_users" type="number" value={form.concurrent_users} onChange={handleChange} required />
        </div>
        <div>
          <label>Images/Documents per Second: </label>
          <input name="images_per_sec" type="number" value={form.images_per_sec} onChange={handleChange} required />
        </div>
        <div>
          <label>Floating Point Precision: </label>
          <select name="fp" value={form.fp} onChange={handleChange} required>
            <option value="">Select</option>
            <option value="FP16">FP16</option>
            <option value="FP32">FP32</option>
            <option value="FP64">FP64</option>
          </select>
        </div>
        <div>
          <label>
            <input name="min_error" type="checkbox" checked={form.min_error} onChange={handleChange} />
            Minimize Error Rate
          </label>
        </div>
        <button type="submit" disabled={loading}>Get Recommendations</button>
      </form>
      <hr />
      {loading && <div>Loading...</div>}
      {results.length > 0 && (
        <div>
          <h3>Recommended NVIDIA GPUs</h3>
          <ul>
            {results.map((gpu, idx) => (
              <li key={idx}>
                <b>{gpu.name}</b> - Memory: {gpu.memory}, FP: {gpu.fp}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
