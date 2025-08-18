const response = pm.response.json();
const accountType = pm.iterationData.get("type"); // "valid" or "invalid"
const description = pm.iterationData.get("description") || "No description";

// Log current test case
console.log(`Running test: ${description}`);

pm.test(`[VALID] Status code is 200 - ${description}`, function () {
  pm.expect(pm.response.code, `Expected 200 for: ${description}`).to.equal(200);
});

pm.test(
  `[VALID] Response has required token fields - ${description}`,
  function () {
    pm.expect(
      response,
      `Missing token fields for: ${description}`
    ).to.have.property("access_token");
    pm.expect(response).to.have.property("token_type");
    pm.expect(response).to.have.property("expires_in");
  }
);

pm.test(`[VALID] Validate types of properties - ${description}`, function () {
  pm.expect(response.access_token).to.be.a("string");
  pm.expect(response.token_type).to.be.a("string");
  pm.expect(response.expires_in).to.be.a("number");
});

// Save token for reuse
pm.collectionVariables.set("token", response.access_token);
