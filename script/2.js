// Basic checks
pm.test("Content-Type is JSON", function () {
  pm.expect(pm.response.headers.get("Content-Type")).to.include(
    "application/json"
  );
});

const response = pm.response.json();

if (pm.response.code === 200) {
  // Exact keys (no missing and no extra)
  pm.test("Response has exact required keys", function () {
    const expectedKeys = [
      "id",
      "first_name",
      "last_name",
      "address",
      "city",
      "state",
      "country",
      "postcode",
      "phone",
      "dob",
      "email",
      "password",
      "role",
      "enabled",
      "failed_login_attempts",
    ];
    const keys = Object.keys(response).sort();
    pm.expect(keys).to.eql(expectedKeys.sort());
  });

  // Types + specific validations
  pm.test("Response data types and formats are correct", function () {
    pm.expect(response.id).to.be.a("number");
    pm.expect(response.first_name).to.be.a("string");
    pm.expect(response.last_name).to.be.a("string");
    pm.expect(response.address).to.be.a("string");
    pm.expect(response.city).to.be.a("string");

    // Nulls (use .to.be.null, not .to.be.a('null'))
    pm.expect(response.state).to.be.null;
    pm.expect(response.postcode).to.be.null;
    pm.expect(response.phone).to.be.null;

    pm.expect(response.country).to.be.a("string");
    pm.expect(response.dob).to.be.a("string");
    pm.expect(response.email).to.be.a("string");
    pm.expect(response.password).to.be.a("string");
    pm.expect(response.role).to.be.a("string");
    pm.expect(response.enabled).to.be.a("number");
    pm.expect(response.failed_login_attempts).to.be.a("number");
  });

  // Value constraints
  pm.test("Field value constraints are valid", function () {
    // id positive
    pm.expect(response.id).to.be.above(0);

    // dob simple YYYY-MM-DD format
    pm.expect(response.dob).to.match(/^\d{4}-\d{2}-\d{2}$/);

    // email format
    pm.expect(response.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

    // password looks like SHA-256 hex
    pm.expect(response.password).to.match(/^[a-f0-9]{64}$/i);

    // role expected values
    pm.expect(["user", "admin"]).to.include(response.role);

    // enabled is 0/1
    pm.expect([0, 1]).to.include(response.enabled);

    // failed_login_attempts non-negative
    pm.expect(response.failed_login_attempts).to.be.at.least(0);
  });

  // Optional: if you saved the login email, assert it matches
  const loginEmail = pm.collectionVariables.get("login_email");
  if (loginEmail) {
    pm.test("Email matches the logged-in user", function () {
      pm.expect(response.email).to.equal(loginEmail.trim());
    });
  }
} else if (pm.response.code === 401) {
  // Unauthorized contract
  pm.test("Status code is 401 - Unauthorized", function () {
    pm.expect(pm.response.code).to.equal(401);
  });

  pm.test("Response has only 'message' with 'Unauthorized'", function () {
    pm.expect(response).to.have.property("message", "Unauthorized");
    pm.expect(Object.keys(response)).to.eql(["message"]);
  });
} else {
  // Anything else is unexpected
  pm.test("Unexpected status code", function () {
    pm.expect.fail(`Unexpected status: ${pm.response.code}`);
  });
}
