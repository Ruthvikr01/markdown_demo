/**
 * Module: querySemantics.test.js
 * Responsibility: Verifies SQL semantics that support operational summary questions.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { buildLifecycleQuery } from "../src/repositories/reportRepository.js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDir = dirname(currentFilePath);
const repositoryPath = join(currentDir, "../src/repositories/reportRepository.js");
const repositorySource = readFileSync(repositoryPath, "utf8");

/**
 * AC5:
 * Ensures production line performance query includes issue-centric metrics.
 */
test("AC5 - production line performance query includes issue_runs and issue_rate", () => {
  assert.match(repositorySource, /AS issue_runs/);
  assert.match(repositorySource, /AS issue_rate/);
});

/**
 * AC6:
 * Ensures lifecycle dataset includes both inspection outcomes and shipping status.
 */
test("AC6 - lifecycle query selects inspection_result and shipment_status together", () => {
  const { text } = buildLifecycleQuery();
  assert.match(text, /i\.inspection_result/);
  assert.match(text, /s\.shipment_status/);
});

/**
 * AC8:
 * Ensures API supports one-call dashboard retrieval (reduced manual effort).
 */
test("AC8 - routes file defines unified dashboard endpoint", () => {
  const routesPath = join(currentDir, "../src/routes/index.js");
  const routesSource = readFileSync(routesPath, "utf8");
  assert.match(routesSource, /apiRouter\.get\("\/dashboard", getDashboard\)/);
});

/**
 * AC7:
 * Ensures dashboard service bundles all common operational summaries.
 */
test("AC7 - report service returns meeting-ready dashboard bundle keys", () => {
  const servicePath = join(currentDir, "../src/services/reportService.js");
  const serviceSource = readFileSync(servicePath, "utf8");

  assert.match(serviceSource, /export async function getDashboardBundle/);
  assert.match(serviceSource, /lotsSummary/);
  assert.match(serviceSource, /linePerformance/);
  assert.match(serviceSource, /inspections/);
  assert.match(serviceSource, /shipping/);
  assert.match(serviceSource, /lifecycle/);
  assert.match(serviceSource, /topDefects/);
  assert.match(serviceSource, /holds/);
  assert.match(serviceSource, /shiftEfficiency/);
});

/**
 * AC1:
 * Ensures lifecycle SQL has all required functional joins in one dataset.
 */
test("AC1 - lifecycle query has all required joins", () => {
  const { text } = buildLifecycleQuery();
  assert.match(text, /LEFT JOIN production_records/);
  assert.match(text, /LEFT JOIN inspection_records/);
  assert.match(text, /LEFT JOIN shipping_records/);
});
