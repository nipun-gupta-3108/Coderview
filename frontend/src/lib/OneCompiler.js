import axiosInstance from "./axios";

export async function executeCode(language, code) {
  try {
    const response = await axiosInstance.post("/execute", {
      language,
      code,
    });

    return response.data;
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to execute code",
    };
  }
}
