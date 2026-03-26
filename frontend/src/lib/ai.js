import axiosInstance from "./axios";

export async function getAiHint(payload) {
  try {
    const { data } = await axiosInstance.post("/ai/hint", payload);
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to get AI hint",
    };
  }
}

export async function reviewAiCode(payload) {
  try {
    const { data } = await axiosInstance.post("/ai/review", payload);
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to review code",
    };
  }
}

export async function explainAiProblem(payload) {
  try {
    const { data } = await axiosInstance.post("/ai/explain", payload);
    return data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to explain problem",
    };
  }
}
