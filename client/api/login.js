import axios from "axios";

const API_BASE_URL = process.env.IBLIB_BASE_URL;

const getForwardedHeaders = (req) => ({
  'Authorization': req.headers.authorization || '',
  'Accept': 'application/json',
  'Content-Type': 'application/json',
  'X-Forwarded-For': req.headers['x-forwarded-for'] || req.socket.remoteAddress,
  'User-Agent': req.headers['user-agent'] || 'Vercel-Proxy-Client',
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  if (!API_BASE_URL) {
    console.error("FATAL: IBLIB_BASE_URL environment variable is not set on Vercel.");
    return res.status(500).json({ message: "Server configuration error. API endpoint is not set." });
  }

  const destinationUrl = `${API_BASE_URL}/login`;
  const headers = getForwardedHeaders(req);

  try {
    console.log(`Proxying login request to: ${destinationUrl}`);
    console.log("Request Body:", req.body);
    console.log("Forwarding Headers (excluding Auth for log safety):", { ...headers, 'Authorization': headers['Authorization'] ? '[REDACTED]' : '' });

    const { data, status } = await axios.post(
      destinationUrl,
      req.body,
      { headers: headers }
    );

    return res.status(status).json(data);

  } catch (error) {
    if (error.response) {
      console.error("Downstream API Error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
      return res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      console.error("Proxy Error: No response received from downstream server.", error.request);
      return res.status(502).json({ message: "Bad Gateway: No response from API server." });
    } else {
      console.error("Proxy Setup Error:", error.message);
      return res.status(500).json({ message: "Proxy setup failed", details: error.message });
    }
  }
}