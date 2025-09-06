import axios from "axios";

const API_BASE2_URL = process.env.API_BASE2_URL;

const DEFAULT_HEADERS = (req) => ({
  'Authorization': req.headers.authorization || '',
  'Accept': 'application/json',
  'User-Agent': req.headers['user-agent'] || 'Vite-Proxy-Client',
  'Content-Type': 'application/json',
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { data } = await axios.get(
      `${API_BASE2_URL}/study/testpapers/`,
      { headers: DEFAULT_HEADERS(req) }
    );

    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Failed to fetch all test papers",
      details: error.message,
    });
  }
}
