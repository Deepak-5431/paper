import axios from "axios";




const API_BASE2_URL = "https://test.iblib.com/api";

const DEFAULT_HEADERS = (req) => ({
  'Authorization': req.headers.authorization || '',
  'Accept': 'application/json',
  'User-Agent': req.headers['user-agent'] || 'Node-Proxy-Client',
  'Content-Type': 'application/json',
});

export const ProxyLogin = async (req, res) => {
  try {
    const { data } = await axios.post(`${API_BASE2_URL}/login`, req.body, {
      headers: DEFAULT_HEADERS(req)
    });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Proxy login failed",
      details: error.message,
    });
  }
};

export const ProxyTestPaper = async (req, res) => {
  try {
    const { paperId } = req.params;
    const { data } = await axios.get(
      `${API_BASE2_URL}/study/testpaper/${paperId}`,
      { headers: DEFAULT_HEADERS(req) }
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: "Failed to fetch test paper details"
    });
  }
};

export const ProxyQuestions = async (req, res) => {
  try {
    const { paperId } = req.params;
    const { data } = await axios.get(
      `${API_BASE2_URL}/study/testpaper/questions/${paperId}`,
      { headers: DEFAULT_HEADERS(req), params: req.query }
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || "Proxy question fetch failed",
    });
  }
};


export const ProxyAllTestPapers = async (req, res) => {
  try {
    const { data } = await axios.get(
      `${API_BASE2_URL}/study/testpapers/`,
      { headers: DEFAULT_HEADERS(req) }
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: "Failed to fetch all test papers",
    });
  }
};


export const ProxyTestPapersWithStatus = async (req, res) => {
  try {
    
    const allPapersResponse = await axios.get(
      `${API_BASE2_URL}/study/testpapers/`,
      { headers: DEFAULT_HEADERS(req) }
    );
    const allPapers = allPapersResponse.data;

    
    const detailPromises = allPapers.map(paper =>
      axios.get(
        `${API_BASE2_URL}/study/testpaper/${paper.id}`,
        { headers: DEFAULT_HEADERS(req) }
      )
    );

    
    const detailResponses = await Promise.all(detailPromises);

   
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
    });
  }
};


export const ProxySaveAnswer = async (req, res) => {
  try {
    const { data } = await axios.post(
      `${API_BASE2_URL}/study/testpaper/questions/${req.params.paperId}`,
      req.body,
      { headers: DEFAULT_HEADERS(req) }
    );
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      message: "Failed to save answer",
      details: error.response?.data || error.message,
    });
  }
};

export const ProxySubmitTest = async (req, res) => {
  try {
    const { paperId } = req.params;
    const submitUrl = `${API_BASE2_URL}/study/testpaper/questions/${paperId}?isSubmit=1`;
    const payloadToSend = req.body;

    console.log("Submitting to external API with URL:", submitUrl);
    console.log("Submitting with FINAL correct body:", payloadToSend);

    const { data } = await axios.post(
      submitUrl,
      payloadToSend,
      { headers: DEFAULT_HEADERS(req) }
    );
    
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
};