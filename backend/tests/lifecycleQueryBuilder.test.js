/**
 * Module: lifecycleQueryBuilder.test.js
 * Responsibility: Verifies lifecycle query structure and filter behavior for AC alignment.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { buildLifecycleQuery } from "../src/repositories/reportRepository.js";

/**
 * AC1, AC2, AC6:
 * Ensures production/inspection/shipping data appear together and are aligned by lot.
 */
test("AC1/AC2/AC6 - lifecycle query joins all three functions by lot and selects inspection+shipping fields", () => {
  const { text, params } = buildLifecycleQuery();

  assert.equal(params.length, 0);
  assert.match(text, /LEFT JOIN production_records pr ON pr\.lot_id = l\.id/);
  assert.match(text, /LEFT JOIN inspection_records i ON i\.lot_id = l\.id/);
  assert.match(text, /LEFT JOIN shipping_records s ON s\.lot_id = l\.id/);
  assert.match(text, /i\.inspection_result/);
  assert.match(text, /s\.shipment_status/);
});

/**
 * AC3:
 * Ensures lot/date filtering is translated into SQL predicates.
 */
test("AC3 - lifecycle query applies lotId and date range filters", () => {
  const { text, params } = buildLifecycleQuery({
    lotId: "LOT-1001",
    startDate: "2026-01-01",
    endDate: "2026-01-31"
  });

  assert.deepEqual(params, ["LOT-1001", "2026-01-01", "2026-01-31"]);
  assert.match(text, /WHERE l\.lot_id = \$1 AND l\.production_date >= \$2 AND l\.production_date <= \$3/);
});

/**
 * AC4, AC10:
 * Ensures missing information is explicitly represented.
 */
test("AC4/AC10 - lifecycle query exposes missing data flags", () => {
  const { text } = buildLifecycleQuery();

  assert.match(text, /AS production_data_missing/);
  assert.match(text, /AS inspection_data_missing/);
  assert.match(text, /AS shipping_data_missing/);
});

/**
 * AC9:
 * Ensures deterministic output ordering for repeated requests.
 */
test("AC9 - lifecycle query includes stable deterministic sort", () => {
  const { text } = buildLifecycleQuery();
  assert.match(text, /ORDER BY l\.production_date, l\.lot_id, pr\.production_date, i\.inspection_date, s\.ship_date/);
});
