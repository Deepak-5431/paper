import axios from "axios";

const API_BASE2_URL = process.env.API_BASE2_URL;


const DEFAULT_HEADERS = (req) => ({
  'Authorization': req.headers.authorization || '',
  'Accept': 'application/json',
  'User-Agent': req.headers['user-agent'] || 'Vite-Proxy-Client',
  'Content-Type': 'application/json',
});


export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { data } = await axios.post(
      `${API_BASE2_URL}/login`,
      req.body,
      { headers: DEFAULT_HEADERS(req) }
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Proxy login failed",
      details: error.message,
    });
  }
}
