const BASE = import.meta.env.VITE_API_URL || "/api";

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

function get(path) {
  return fetch(`${BASE}${path}`).then(handle);
}

function post(path, body) {
  return fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }).then(handle);
}

export const getCompany = () => get("/company");
export const getSectors = () => get("/sectors");
export const getSector = (id) => get(`/sectors/${id}`);
export const getMarkets = () => get("/markets");
export const getStats = () => get("/stats");
export const getAds = () => get("/ads");
export const getLeadership = () => get("/leadership");
export const getSustainability = () => get("/sustainability");
export const getJobs = () => get("/jobs");
export const getJob = (id) => get(`/jobs/${id}`);
export const getInvestorReports = () => get("/investor-reports");
export const investorReportDownloadUrl = (id) => `${BASE}/investor-reports/${id}/download`;
export const getNews = () => get("/news");
export const getArticle = (id) => get(`/news/${id}`);

export const subscribeNewsletter = (email) => post("/newsletter", { email });
export const submitContact = (payload) => post("/contact", payload);
export const submitApplication = (payload) => post("/careers/apply", payload);
