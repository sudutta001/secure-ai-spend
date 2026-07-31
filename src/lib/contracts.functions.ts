import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface StoredContract {
  id: string;
  request: string;
  item: string;
  signed: boolean;
  failedClauses: string[];
  verifiedAt: string;
}

export const listContracts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<StoredContract[]> => {
    const { data, error } = await context.supabase
      .from("contracts")
      .select("id, request, item, signed, failed_clauses, verified_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: r.id,
      request: r.request,
      item: r.item,
      signed: r.signed,
      failedClauses: r.failed_clauses ?? [],
      verifiedAt: r.verified_at,
    }));
  });

export const saveContract = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      request: string;
      item: string;
      signed: boolean;
      failedClauses: string[];
      verificationId?: string;
      verifiedAt?: string;
    }) => {
      const request = typeof input?.request === "string" ? input.request.trim() : "";
      if (!request) throw new Error("A purchase request is required.");
      if (request.length > 2000) throw new Error("Purchase request is too long.");
      return {
        request,
        item: String(input?.item ?? "").slice(0, 300),
        signed: Boolean(input?.signed),
        failedClauses: Array.isArray(input?.failedClauses)
          ? input.failedClauses.slice(0, 40).map((c) => String(c).slice(0, 120))
          : [],
        verificationId: input?.verificationId ? String(input.verificationId).slice(0, 120) : null,
        verifiedAt: input?.verifiedAt ?? new Date().toISOString(),
      };
    },
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("contracts").insert({
      user_id: context.userId,
      request: data.request,
      item: data.item,
      signed: data.signed,
      failed_clauses: data.failedClauses,
      verification_id: data.verificationId,
      verified_at: data.verifiedAt,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteContract = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => ({ id: String(input?.id ?? "") }))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("contracts")
      .delete()
      .eq("id", data.id)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const clearContracts = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { error } = await context.supabase
      .from("contracts")
      .delete()
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
