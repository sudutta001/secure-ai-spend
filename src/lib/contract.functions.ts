import { createServerFn } from "@tanstack/react-start";
import { buildContract, type PurchaseContract } from "./warrant-contract";

// Clause checking runs on the server so the verdict cannot be tampered with
// in the browser. Every verification is logged.
export const verifyPurchaseRequest = createServerFn({ method: "POST" })
  .inputValidator((input: { request: string }) => {
    const request = typeof input?.request === "string" ? input.request.trim() : "";
    if (!request) throw new Error("A purchase request is required.");
    if (request.length > 2000) throw new Error("Purchase request is too long (max 2000 characters).");
    return { request };
  })
  .handler(async ({ data }): Promise<PurchaseContract> => {
    const contract = buildContract(data.request);
    const verificationId = `wrnt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
    const verifiedAt = new Date().toISOString();

    console.log(
      "[warrant:verify]",
      JSON.stringify({
        verificationId,
        verifiedAt,
        signed: contract.signed,
        clauses: contract.conditions.map((c) => ({ id: c.id, status: c.status })),
        blocked: contract.blockedReasons.length,
      }),
    );

    return { ...contract, verificationId, verifiedAt };
  });
