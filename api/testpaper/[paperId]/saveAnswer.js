import axios from "axios";


const API_BASE_URL = process.env.IBLIB_BASE_URL;

const DEFAULT_HEADERS = (req) => ({
  'Authorization': req.headers.authorization || '',
  'Accept': 'application/json',
  'User-Agent': req.headers['user-agent'] || 'Vercel-Proxy-Client',
  'Content-Type': 'application/json',
});

export default async function handler(req, res) {
  
  const { paperId } = req.query;

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!paperId) {
    return res.status(400).json({ message: "Paper ID is required." });
  }

  try {
    const { data } = await axios.post(
      `${API_BASE_URL}/study/testpaper/questions/${paperId}`,
      req.body,
      { headers: DEFAULT_HEADERS(req) }
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Failed to save answer",
      details: error.message,
    });
  }
}