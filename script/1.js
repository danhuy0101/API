const response = pm.response.json();
const accountType = pm.iterationData.get("type"); // "valid" or "invalid"
const description = pm.iterationData.get("description") || "No description";
const testCaseId = pm.iterationData.get("testCaseId") || "N/A";
const expectedResult =
  pm.iterationData.get("expectedResult") || "No expected result";
const testEmail = pm.iterationData.get("email");

// Enhanced logging for better traceability
console.log(`\n=== ${testCaseId} ===`);
console.log(`Description: ${description}`);
console.log(`Email: ${testEmail}`);
console.log(`Expected: ${expectedResult}`);
console.log(`Response Code: ${pm.response.code}`);
console.log(`Response Body:`, response);

// ----- VALID ACCOUNT TESTS -----
if (accountType === "valid") {
  pm.test(`✅ ${testCaseId} - Status Code 200 (${description})`, function () {
    pm.expect(pm.response.code, `Expected 200 for: ${description}`).to.equal(
      200
    );
  });

  pm.test(
    `✅ ${testCaseId} - Has Required Token Fields (${description})`,
    function () {
      pm.expect(response).to.have.property("access_token");
      pm.expect(response).to.have.property("token_type");
      pm.expect(response).to.have.property("expires_in");
    }
  );

  pm.test(
    `✅ ${testCaseId} - Token Field Types Valid (${description})`,
    function () {
      pm.expect(response.access_token).to.be.a("string");
      pm.expect(response.token_type).to.be.a("string");
      pm.expect(response.expires_in).to.be.a("number");
    }
  );

  if (pm.response.code !== 200 || !response.access_token) {
    postman.setNextRequest(null); // Stop the test run
    pm.test("Login failed - stopping execution", function () {
      pm.expect.fail("Login failed with status: " + pm.response.code);
    });
  }

  // Save token for reuse
  if (response.access_token) {
    pm.collectionVariables.set("token", response.access_token);
    console.log(`✅ ${testCaseId} - Token saved successfully`);
  }
}
// ----- INVALID ACCOUNT TESTS -----
else if (accountType === "invalid") {
  pm.test(`❌ ${testCaseId} - Status Code 401 (${description})`, function () {
    pm.expect(pm.response.code).to.equal(401);
  });

  pm.test(
    `❌ ${testCaseId} - Has Error Property (${description})`,
    function () {
      pm.expect(response).to.have.property("error");
    }
  );

  pm.test(
    `❌ ${testCaseId} - Error Message Unauthorized (${description})`,
    function () {
      pm.expect(response.error).to.equal("Unauthorized");
    }
  );

  console.log(`❌ ${testCaseId} - Login failed as expected`);
  postman.setNextRequest(null); // Stop next request if invalid account type
}
// ----- SAFETY CHECK -----
else {
  pm.test(
    `⚠️ ${testCaseId} - Unknown Account Type (${description})`,
    function () {
      pm.expect.fail(`Unknown account type: ${accountType}`);
    }
  );
  console.log(`⚠️ ${testCaseId} - Unexpected scenario`);
  postman.setNextRequest(null);
}
