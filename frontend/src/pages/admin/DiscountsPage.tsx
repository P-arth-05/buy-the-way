import { useEffect, useState } from "react";

interface ApiResponse<T> {
  message: string;
  data: T;
}

interface DiscountRow {
  id: number;
  code: string;
  percentage: number;
  startDate: string;
  endDate: string;
}

interface PromoFormState {
  code: string;
  percentage: string;
  startDate: string;
  endDate: string;
}

const API_BASE_URL =
  (globalThis as { __API_BASE_URL__?: string }).__API_BASE_URL__ ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8080";

const buildApiBaseCandidates = () => {
  const candidates = [
    API_BASE_URL,
    window.location.origin,
    "http://localhost:8080",
    "http://localhost:8081",
  ].filter(Boolean);

  return [...new Set(candidates)];
};

const requestFromApiCandidates = async <T,>(path: string, init?: RequestInit): Promise<ApiResponse<T>> => {
  const apiBaseCandidates = buildApiBaseCandidates();
  let lastError = "Failed to fetch from all API URLs.";

  for (const apiBase of apiBaseCandidates) {
    try {
      const response = await fetch(`${apiBase}${path}`, init);

      if (!response.ok) {
        const responseText = await response.text();
        lastError = responseText || `Request failed from ${apiBase} (${response.status})`;
        continue;
      }

      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        lastError = `Non-JSON response from ${apiBase}`;
        continue;
      }

      return (await response.json()) as ApiResponse<T>;
    } catch {
      lastError = `Network error while connecting to ${apiBase}`;
    }
  }

  throw new Error(lastError);
};

const DiscountsPage = () => {
  const [discounts, setDiscounts] = useState<DiscountRow[]>([]);
  const [loadingDiscounts, setLoadingDiscounts] = useState(true);
  const [savingPromo, setSavingPromo] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoForm, setPromoForm] = useState<PromoFormState>({
    code: "",
    percentage: "",
    startDate: "",
    endDate: "",
  });
  const today = new Date().toISOString().slice(0, 10);

  const loadDiscounts = async () => {
    setLoadingDiscounts(true);
    setPromoError("");

    try {
      const payload = await requestFromApiCandidates<DiscountRow[]>("/api/discounts");
      setDiscounts(payload.data || []);
    } catch (fetchError) {
      setDiscounts([]);
      setPromoError(fetchError instanceof Error ? fetchError.message : "Failed to load promo codes");
    } finally {
      setLoadingDiscounts(false);
    }
  };

  useEffect(() => {
    void loadDiscounts();
  }, []);

  const handleCreatePromo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPromoError("");

    if (!promoForm.code.trim()) {
      setPromoError("Promo code is required.");
      return;
    }

    if (!promoForm.startDate || !promoForm.endDate) {
      setPromoError("Start and end dates are required.");
      return;
    }

    if (promoForm.startDate < today) {
      setPromoError("Start date cannot be before today.");
      return;
    }

    if (promoForm.endDate < promoForm.startDate) {
      setPromoError("End date cannot be before start date.");
      return;
    }

    const parsedPercentage = Number(promoForm.percentage);
    if (!Number.isFinite(parsedPercentage) || parsedPercentage <= 0 || parsedPercentage > 100) {
      setPromoError("Discount percentage must be between 0 and 100.");
      return;
    }

    setSavingPromo(true);

    try {
      await requestFromApiCandidates<DiscountRow>("/api/discounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: promoForm.code.trim(),
          percentage: parsedPercentage,
          startDate: promoForm.startDate,
          endDate: promoForm.endDate,
        }),
      });

      setPromoForm({
        code: "",
        percentage: "",
        startDate: "",
        endDate: "",
      });

      await loadDiscounts();
    } catch (createError) {
      setPromoError(createError instanceof Error ? createError.message : "Failed to create promo code");
    } finally {
      setSavingPromo(false);
    }
  };

  const handleDeletePromo = async (id: number) => {
    setPromoError("");
    try {
      await requestFromApiCandidates<null>(`/api/discounts/${id}`, { method: "DELETE" });
      await loadDiscounts();
    } catch (deleteError) {
      setPromoError(deleteError instanceof Error ? deleteError.message : "Failed to delete promo code");
    }
  };

  const isDiscountActive = (discount: DiscountRow) => {
    const today = new Date().toISOString().slice(0, 10);
    return today >= discount.startDate && today <= discount.endDate;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold">Promo Codes</h2>
        <p className="text-sm text-muted-foreground">Create and manage discount code validity windows.</p>
      </div>

      <div className="bg-card rounded-2xl shadow-soft p-6 space-y-5">
        <form onSubmit={handleCreatePromo} className="grid md:grid-cols-5 gap-3 items-end">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Code</label>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="SUMMER25"
              value={promoForm.code}
              onChange={(event) => setPromoForm((prev) => ({ ...prev, code: event.target.value.toUpperCase() }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Discount %</label>
            <input
              type="number"
              min="0.01"
              max="100"
              step="0.01"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="10"
              value={promoForm.percentage}
              onChange={(event) => setPromoForm((prev) => ({ ...prev, percentage: event.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Start date</label>
            <input
              type="date"
              min={today}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={promoForm.startDate}
              onChange={(event) => setPromoForm((prev) => ({ ...prev, startDate: event.target.value }))}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">End date</label>
            <input
              type="date"
              min={promoForm.startDate || today}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={promoForm.endDate}
              onChange={(event) => setPromoForm((prev) => ({ ...prev, endDate: event.target.value }))}
            />
          </div>

          <button
            type="submit"
            disabled={savingPromo}
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          >
            {savingPromo ? "Saving..." : "Create code"}
          </button>
        </form>

        {promoError ? <p className="text-sm text-destructive">{promoError}</p> : null}

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b">
                <th className="py-2 pr-4">Code</th>
                <th className="py-2 pr-4">Discount</th>
                <th className="py-2 pr-4">Start</th>
                <th className="py-2 pr-4">End</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {loadingDiscounts ? (
                <tr>
                  <td colSpan={6} className="py-4 text-muted-foreground">Loading promo codes...</td>
                </tr>
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-4 text-muted-foreground">No promo codes found.</td>
                </tr>
              ) : (
                discounts.map((discount) => (
                  <tr key={discount.id} className="border-b last:border-b-0">
                    <td className="py-3 pr-4 font-medium">{discount.code}</td>
                    <td className="py-3 pr-4">{Number(discount.percentage).toLocaleString("en-IN")}%</td>
                    <td className="py-3 pr-4">{discount.startDate}</td>
                    <td className="py-3 pr-4">{discount.endDate}</td>
                    <td className="py-3 pr-4">
                      <span className={isDiscountActive(discount) ? "text-emerald-600" : "text-muted-foreground"}>
                        {isDiscountActive(discount) ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => void handleDeletePromo(discount.id)}
                        className="rounded-md border border-destructive/30 px-2.5 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DiscountsPage;
