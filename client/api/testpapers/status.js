import axios from "axios";
const API_BASE_URL = process.env.IBLIB_BASE_URL;

const DEFAULT_HEADERS = (req) => ({
  'Authorization': req.headers.authorization || '',
  'Accept': 'application/json',
  'User-Agent': req.headers['user-agent'] || 'Vercel-Proxy-Client',
  'Content-Type': 'application/json',
});

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Fetch all test papers
    const allPapersResponse = await axios.get(`${API_BASE_URL}/study/testpapers/`, {
      headers: DEFAULT_HEADERS(req),
    });
    const allPapers = allPapersResponse.data;

    // Fetch details for each paper in parallel
    const detailPromises = allPapers.map(paper =>
      axios.get(`${API_BASE2_URL}/study/testpaper/${paper.id}`, {
        headers: DEFAULT_HEADERS(req),
      })
    );

    const detailResponses = await Promise.all(detailPromises);

    // Merge completion status into all papers
    const papersWithStatus = allPapers.map((paper, index) => {
      const detailedPaper = detailResponses[index].data;
      return {
        ...paper,
        isCompleted: detailedPaper.isCompleted || "0",
      };
    });

    return res.status(200).json(papersWithStatus);

  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: "Failed to fetch test papers with status",
      details: error.response?.data || error.message,
    });
  }
}
