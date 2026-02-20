/**
 * Module: serviceValidation.test.js
 * Responsibility: Tests service-level input validation used by report APIs.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { getTopLotsByDefects, validateLifecycleFilters } from "../src/services/reportService.js";

/**
 * AC3:
 * Validates accepted filter inputs and normalization.
 */
test("AC3 - validateLifecycleFilters accepts valid lot/date filters", () => {
  const filters = validateLifecycleFilters({
    lotId: " LOT-22 ",
    startDate: "2026-02-01",
    endDate: "2026-02-28"
  });

  assert.deepEqual(filters, {
    lotId: "LOT-22",
    startDate: "2026-02-01",
    endDate: "2026-02-28"
  });
});

/**
 * AC3:
 * Validates rejection of invalid date range inputs.
 */
test("AC3 - validateLifecycleFilters rejects invalid date range", () => {
  assert.throws(
    () => {
      validateLifecycleFilters({ startDate: "2026-03-10", endDate: "2026-03-01" });
    },
    /startDate must be less than or equal to endDate/
  );
});

/**
 * AC7:
 * Common meeting summaries must support bounded top defect query sizes.
 */
test("AC7 - getTopLotsByDefects enforces safe query limit boundaries", async () => {
  await assert.rejects(
    async () => {
      await getTopLotsByDefects(0);
    },
    /limit must be an integer between 1 and 100/
  );
});
