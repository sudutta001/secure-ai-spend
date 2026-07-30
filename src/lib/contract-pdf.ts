import { jsPDF } from "jspdf";
import type { PurchaseContract } from "./warrant-contract";

const INK = "#111111";
const MUTED = "#6b7280";
const ACCENT = "#2F5BE0";
const RED = "#c0392b";
const GREEN = "#1e874b";

export function downloadContractPdf(contract: PurchaseContract) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 56;
  const maxW = W - M * 2;
  let y = M;

  const pageBreak = (needed = 60) => {
    if (y + needed > doc.internal.pageSize.getHeight() - M) {
      doc.addPage();
      y = M;
    }
  };

  // Header
  doc.setFillColor(ACCENT);
  doc.rect(M, y, 10, 10, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(INK);
  doc.text("Warrant Purchase Contract", M + 20, y + 10);
  y += 30;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text(
    `${contract.verificationId ?? "unverified"}  ·  ${
      contract.verifiedAt ? new Date(contract.verifiedAt).toLocaleString() : new Date().toLocaleString()
    }`,
    M + 20,
    y,
  );
  y += 22;
  doc.setDrawColor(220);
  doc.line(M, y, W - M, y);
  y += 26;

  // Status
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(contract.signed ? GREEN : RED);
  doc.text(contract.signed ? "STATUS: CONTRACT SIGNED" : "STATUS: NOT AUTHORIZED", M, y);
  y += 24;

  // Intent
  const block = (title: string, body: string) => {
    pageBreak();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(MUTED);
    doc.text(title.toUpperCase(), M, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(INK);
    const lines = doc.splitTextToSize(body, maxW);
    doc.text(lines, M, y);
    y += lines.length * 14 + 14;
  };

  block("Item", contract.item);
  block("Requested intent", contract.intent);

  // Clauses
  pageBreak();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(MUTED);
  doc.text("CLAUSES", M, y);
  y += 16;

  contract.conditions.forEach((c) => {
    pageBreak(70);
    const mark = c.status === "pass" ? "[PASS]" : c.status === "fail" ? "[FAIL]" : "[ ? ]";
    doc.setFont("courier", "bold");
    doc.setFontSize(10);
    doc.setTextColor(c.status === "pass" ? GREEN : c.status === "fail" ? RED : MUTED);
    doc.text(mark, M, y);
    doc.setFont("courier", "normal");
    doc.setTextColor(INK);
    const exprLines = doc.splitTextToSize(`${c.expression}  (${c.label})`, maxW - 52);
    doc.text(exprLines, M + 48, y);
    y += exprLines.length * 13;

    const note = c.reason ?? c.detail;
    if (note) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(MUTED);
      const nl = doc.splitTextToSize(note, maxW - 52);
      doc.text(nl, M + 48, y + 4);
      y += nl.length * 12 + 4;
    }
    if (c.remediation) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(ACCENT);
      const rl = doc.splitTextToSize(`Fix: ${c.remediation}`, maxW - 52);
      doc.text(rl, M + 48, y + 4);
      y += rl.length * 12 + 4;
    }
    y += 10;
  });

  if (contract.blockedReasons.length) {
    pageBreak(80);
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(RED);
    doc.text("AGENT HALTED", M, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(INK);
    contract.blockedReasons.forEach((r) => {
      pageBreak(30);
      const l = doc.splitTextToSize(`• ${r}`, maxW);
      doc.text(l, M, y);
      y += l.length * 13 + 2;
    });
  }

  // Footer
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(MUTED);
    doc.text(
      `Warrant — the agent that cannot buy the wrong thing.    Page ${i} of ${pages}`,
      M,
      doc.internal.pageSize.getHeight() - 30,
    );
  }

  doc.save(`warrant-contract-${contract.verificationId ?? "draft"}.pdf`);
}
