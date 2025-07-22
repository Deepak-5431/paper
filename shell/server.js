import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());

const API_BASE = 'https://iblib.com'; // Main backend

// Shell route to forward login
app.post('/api/login', async (req, res) => {
  try {
    const response = await axios.post(`${API_BASE}/api/login`, req.body, {
      headers: { 'Content-Type': 'application/json' }
    });
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Shell error:', error.message);
    res.status(error.response?.status || 500).json({
      error: 'Proxy failed',
      message: error.message,
      details: error.response?.data
    });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🛡️  Shell API ready on http://localhost:${PORT}`));
