#!/usr/bin/env node
const API_URL = process.env.VITE_API_URL || 'http://200.98.64.133:8000';
const endpoint = `${API_URL}/produtos/?skip=0&limit=5`;

async function run() {
  try {
    console.log('Consultando', endpoint);
    const res = await fetch(endpoint, { method: 'GET', headers: { Accept: 'application/json' } });
    console.log('Status:', res.status, res.statusText);
    const text = await res.text();
    try {
      const json = JSON.parse(text);
      console.log('Resposta (JSON):', JSON.stringify(json, null, 2));
    } catch {
      console.log('Resposta (texto):', text);
    }
  } catch (err) {
    console.error('Erro ao consultar API:', err);
    process.exitCode = 2;
  }
}

run();
