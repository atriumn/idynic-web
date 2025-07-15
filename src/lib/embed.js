// Simple embedding service - for now we'll use a mock implementation
// In production, this would call OpenAI's embedding API

export async function getEmbedding(text) {
  // Mock embedding: hash-based pseudo-random vector for consistent clustering
  const hash = text.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  // Generate a consistent 128-dimensional vector based on text hash
  const vector = [];
  let seed = Math.abs(hash);
  for (let i = 0; i < 128; i++) {
    seed = (seed * 9301 + 49297) % 233280;
    vector.push((seed / 233280) * 2 - 1); // normalize to [-1, 1]
  }
  
  return vector;
}

// For production use with OpenAI:
/*
export async function getEmbedding(text) {
  const response = await fetch('/api/embeddings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  const { data } = await response.json();
  return data[0].embedding;
}
*/