import { useEffect, useState } from "react";
import { Lock, Unlock, RefreshCw, AlertCircle } from "lucide-react";
import { getAdminMessages, getAdminSubscribers, getAdminApplications } from "../api.js";

const TOKEN_KEY = "vink_admin_token";
const TABS = [
  { id: "messages", label: "Contact Messages", fetcher: getAdminMessages },
  { id: "subscribers", label: "Newsletter Subscribers", fetcher: getAdminSubscribers },
  { id: "applications", label: "Job Applications", fetcher: getAdminApplications },
];

function formatDate(iso) {
  return new Date(iso).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function DataTable({ rows }) {
  if (!rows || rows.length === 0) {
    return <p className="text-sm text-vh-cream/50 py-8 text-center">Nothing here yet.</p>;
  }
  // Newsletter subscribers come back as { count, subscribers: [...] }; everything
  // else is already a plain array.
  const list = Array.isArray(rows) ? rows : rows.subscribers || [];
  const columns = Object.keys(list[0] || {}).filter((k) => k !== "id");

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-vh-line text-left">
            {columns.map((col) => (
              <th key={col} className="py-2 pr-4 text-xs tracking-wide text-vh-gold whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {list.map((row, i) => (
            <tr key={row.id ?? i} className="border-b border-vh-line/50 align-top">
              {columns.map((col) => (
                <td key={col} className="py-2 pr-4 text-vh-cream/80 max-w-xs">
                  {col === "submittedAt" || col === "subscribedAt" ? formatDate(row[col]) : String(row[col] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(() => sessionStorage.getItem(TOKEN_KEY) || "");
  const [tokenInput, setTokenInput] = useState("");
  const [activeTab, setActiveTab] = useState("messages");
  const [data, setData] = useState({});
  const [status, setStatus] = useState("idle"); // idle | loading | error
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState("");

  const load = async (activeToken, tabId) => {
    setStatus("loading");
    setError("");
    try {
      const tab = TABS.find((t) => t.id === tabId);
      const result = await tab.fetcher(activeToken);
      setData((d) => ({ ...d, [tabId]: result }));
      setStatus("idle");
    } catch (err) {
      setStatus("error");
      if (/unauthorized/i.test(err.message)) {
        sessionStorage.removeItem(TOKEN_KEY);
        setToken("");
        setAuthError("That token was rejected. Check it and try again.");
      } else {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    if (token) load(token, activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, activeTab]);

  const handleUnlock = (e) => {
    e.preventDefault();
    setAuthError("");
    sessionStorage.setItem(TOKEN_KEY, tokenInput);
    setToken(tokenInput);
    setTokenInput("");
  };

  const handleLock = () => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setData({});
  };

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <form onSubmit={handleUnlock} className="w-full max-w-sm rounded-sm border border-vh-line bg-vh-forest-card p-8">
          <div className="flex items-center gap-2 mb-4">
            <Lock size={18} className="text-vh-gold" />
            <h1 className="font-display text-lg text-vh-cream">Admin Access</h1>
          </div>
          <label htmlFor="admin-token" className="text-xs text-vh-cream/60">
            Admin Token
          </label>
          {authError && (
            <p className="mt-1 mb-1 flex items-center gap-1.5 text-xs text-red-400">
              <AlertCircle size={13} /> {authError}
            </p>
          )}
          <input
            id="admin-token"
            type="password"
            required
            autoFocus
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="mt-1 w-full bg-vh-black/40 border border-vh-line rounded-sm px-3 py-2 text-sm text-vh-cream focus:outline-none focus:border-vh-gold"
            placeholder="Paste the ADMIN_TOKEN value"
          />
          <p className="mt-2 text-xs text-vh-cream/40">
            Stored only for this browser tab session — never sent anywhere except this API.
          </p>
          <button
            type="submit"
            className="mt-4 w-full rounded-sm bg-vh-gold px-5 py-2.5 text-sm font-medium text-vh-black hover:bg-vh-gold-light transition-colors"
          >
            Unlock
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="px-6 lg:px-8 py-12 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl text-vh-cream">Admin</h1>
        <button
          onClick={handleLock}
          className="flex items-center gap-1.5 text-xs text-vh-cream/60 hover:text-vh-gold"
        >
          <Unlock size={13} /> Lock
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
              activeTab === tab.id
                ? "bg-vh-gold text-vh-black border-vh-gold"
                : "border-vh-line text-vh-cream/70 hover:border-vh-gold hover:text-vh-gold"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <button
          onClick={() => load(token, activeTab)}
          aria-label="Refresh"
          className="ml-auto flex items-center gap-1.5 text-xs text-vh-cream/60 hover:text-vh-gold"
        >
          <RefreshCw size={13} className={status === "loading" ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="rounded-sm border border-vh-line bg-vh-forest-card p-5">
        {status === "error" && (
          <div className="flex items-center gap-2 text-sm text-red-400 py-4">
            <AlertCircle size={16} /> {error}
          </div>
        )}
        {status === "loading" && !data[activeTab] && (
          <p className="text-sm text-vh-cream/50 py-8 text-center">Loading…</p>
        )}
        {status !== "error" && data[activeTab] && <DataTable rows={data[activeTab]} />}
      </div>
    </div>
  );
}
