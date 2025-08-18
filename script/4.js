const response = pm.response.json();
const description = pm.iterationData.get("description") || "No description";

// Log current test case
console.log(`Running test: ${description}`);

// ----- INVALID ACCOUNT TESTS -----

pm.test(`[INVALID] Status code is 401 - ${description}`, function () {
  pm.expect(pm.response.code, `Expected 401 for: ${description}`).to.equal(401);
});

pm.test(`[INVALID] Response has error property - ${description}`, function () {
  pm.expect(
    response,
    `Missing error field for: ${description}`
  ).to.have.property("error");
});

pm.test(
  `[INVALID] Error message is 'Unauthorized' - ${description}`,
  function () {
    pm.expect(
      response.error,
      `Wrong error message for: ${description}`
    ).to.equal("Unauthorized");
  }
);
