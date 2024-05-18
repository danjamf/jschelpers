function myUniqueFunctionName2(request, session, config) {
  log("Virtual Test running")
  
  log("Request Body: " + request.Body)
  log("Session: " + JSON.stringify(session.allowance))
  log("Config: " + JSON.stringify(config.APIID))
  log("param-1: " + request.Params["param1"]) // case sensitive
  log("auth Header: " + request.Headers["Authorization"]) // case sensitive

//get username
  hold = request.Headers["Authorization"][0]
  testhold = hold.split(' ')[1]
  try{decodedString = b64dec(testhold)}catch (error) {
    decodedString = error
}
useremail = decodedString.split(':')[0]
userpass = decodedString.split(':')[1]
  //Make api call to upstream target
  newRequest = {
    "Method": "GET",
    "Body": "",
    "Domain": "https://radar.wandera.com",
    "Headers": {"Accept": "application/json"},
    "Resource": "/auth/v1/login-methods?email=" + useremail,
    "FormData": {}
  };
  rawlog("--- before get to upstream ---")
  response = TykMakeHttpRequest(JSON.stringify(newRequest));
  rawlog("--- After get to upstream ---")
  log("response type: " + typeof response);
  log("response: " + response);
  usableResponse = JSON.parse(response);
  //headerJson = JSON.parse(usableResponse.Headers)
  //var bodyObject = JSON.parse(usableResponse.Body);
  tokenValue = usableResponse.Headers["Set-Cookie"][0].split('=')[1].split(';')[0]

  newPOSTRequest = {
    "Method": "POST",
    "Body": "{\"username\":\""+useremail+"\",\"password\":\""+userpass+"\",\"totp\":\"\",\"backupCode\":\"\"}",
    "Domain": "https://radar.wandera.com",
    "Headers": {"Accept": "application/json", "X-Xsrf-Token": tokenValue, "Cookie": usableResponse.Headers["Set-Cookie"][0] },
    "Resource": "/auth/v1/credentials",
    "FormData": {}
  };
  response2 = TykMakeHttpRequest(JSON.stringify(newPOSTRequest));
  usableResponse2 = JSON.parse(response2);
  //headerJson = JSON.parse(usableResponse.Headers)
  //var bodyObject = JSON.parse(usableResponse.Body);
  tokenValue2 = usableResponse2.Headers["Set-Cookie"][0].split('=')[1].split(';')[0]
  newbearer= b64enc(tokenValue + '&' + tokenValue2)



  var responseObject = {
    Body: '{"access_token":"' + newbearer + '","token_type":"Bearer","expires_in":599}',
    Headers: {
      "Bearer": tokenValue + '&' + tokenValue2,
      "x-test-2": "virtual-header-2"
    },
    Code: 200
  }
  
  return TykJsResponse(responseObject, session.meta_data)   
}
log("Virtual Test initialised")