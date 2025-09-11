import axios from "axios";

const VITE_API_BASE_URL = process.env.IBLIB_BASE_URL; 

const DEFAULT_HEADERS = (req) => ({
  'Authorization': req.headers.authorization || '',
  'Accept': 'application/json',
  'User-Agent': req.headers['user-agent'] || 'Vercel-Proxy-Client',
  'Content-Type': 'application/json',
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log(" Proxying login request to:", `${VITE_API_BASE_URL}/login`);
    console.log(" Body:", req.body);

    const { data } = await axios.post(
      `${API_BASE_URL}/login`,
      req.body,
      { headers: DEFAULT_HEADERS(req) }
    );

    return res.status(200).json(data);
  } catch (error) {
    console.error(" Login proxy error:", error.response?.data || error.message);

    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Proxy login failed",
      details: error.message,
    });
  }
}
