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

  try {
    const submitUrl = `${API_BASE_URL}/study/testpaper/questions/${paperId}?isSubmit=1`;
    const payloadToSend = req.body;

    console.log("Submitting to external API with URL:", submitUrl);

    const { data } = await axios.post(submitUrl, payloadToSend, {
      headers: DEFAULT_HEADERS(req),
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error("--- FULL SUBMISSION ERROR ---");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    } else {
      console.error("Error Message:", error.message);
    }
    console.error("--------------------------");

    return res.status(error.response?.status || 500).json({
      message: "Re-attempt is not allowed",
      details: error.response?.data || error.message,
    });
  }
}
