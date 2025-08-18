const response = pm.response.json();
const description = pm.iterationData.get("description") || "No description";

// Log the current test case
console.log(`Running change-password test: ${description}`);

// Check HTTP status
pm.test(
  `[CHANGE PASSWORD] Status code is correct - ${description}`,
  function () {
    pm.expect(
      pm.response.code,
      `Unexpected status for: ${description}`
    ).to.be.oneOf([200, 400, 404]);
  }
);

// ----- SUCCESS CASE -----
if (response.success === true) {
  pm.test(
    `[CHANGE PASSWORD] Successful password change - ${description}`,
    function () {
      pm.expect(response.success).to.be.true;
      // Optionally check no error message is present
      pm.expect(response).to.not.have.property("message");
    }
  );
}

// ----- WRONG CURRENT PASSWORD CASE -----
else if (
  response.success === false &&
  response.message &&
  response.message.includes("does not match")
) {
  pm.test(
    `[CHANGE PASSWORD] Wrong current password handled - ${description}`,
    function () {
      pm.expect(response.success).to.be.false;
      pm.expect(response.message).to.include("does not match");
    }
  );
}

// ----- PASSWORD CONFIRMATION MISMATCH CASE -----
else if (
  response.message &&
  (response.message.toLowerCase().includes("confirmation") ||
    response.message.toLowerCase().includes("not match"))
) {
  pm.test(
    `[CHANGE PASSWORD] Password confirmation mismatch handled - ${description}`,
    function () {
      // Your backend returns only message here — not great, but we test what's available
      pm.expect(response.message.toLowerCase()).to.include("not match");
    }
  );
}

// ----- RESOURCE NOT FOUND CASE -----
else if (
  response.message &&
  response.message.toLowerCase().includes("resource not found")
) {
  pm.test(
    `[CHANGE PASSWORD] Resource not found handled - ${description}`,
    function () {
      pm.expect(response.message).to.equal("Resource not found");
    }
  );
}

// ----- UNKNOWN CASE -----
else {
  pm.test(
    `[CHANGE PASSWORD] Unexpected response format - ${description}`,
    function () {
      pm.expect.fail(
        `Unexpected change-password response: ${JSON.stringify(response)}`
      );
    }
  );
}
