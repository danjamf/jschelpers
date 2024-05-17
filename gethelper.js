function radarechotest(request, session, config) {
  log("Virtual Test running")
  requestpath = request.URL.split('/radar')[1] //assumes path of helper is /radar - otherwise change it!


  hold = request.Headers["Authorization"][0]
  testholdencoded = hold.split(' ')[1]
  testholddecoded = b64dec(testholdencoded)
  xsrf = testholddecoded.split('&')[0]
  sessioncookie = testholddecoded.split('&')[1]

  newRequest = {
    "Method": "GET",
    "Body": "",
    "Domain": "https://radar.wandera.com",
    "Headers": {"Accept": "application/json", "X-Xsrf-Token": xsrf, "Cookie": "XSRF-TOKEN="+xsrf+";SESSION="+sessioncookie}
    "Resource": requestpath,
    "FormData": {}
  };
  
  response = TykMakeHttpRequest(JSON.stringify(newRequest));
  usableResponse = JSON.parse(response)

  var responseObject = {
    Body: usableResponse.Body
    Headers: {
      "Content-Type": "application/json"
    },
    Code: 200
  }
  
  return TykJsResponse(responseObject, session.meta_data)   
}
