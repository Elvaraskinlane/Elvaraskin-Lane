const https = require('https');

async function testToken() {
  const WP_URL = "https://shop.elvaraskinlane.ng";
  // Just try hitting the validate endpoint with a dummy token
  const res = await fetch(`${WP_URL}/wp-json/jwt-auth/v1/token/validate`, {
    method: "POST",
    headers: {
      "Authorization": "Bearer fake_token_just_testing_headers"
    }
  });
  
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Data:", data);
}
testToken();
