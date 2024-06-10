import requests
from flask import jsonify
API_KEY_FLEXOFFER = "41a02e6b-b5a3-4d7f-ae2a-476cdd6be0b7"
API_KEY_LINKSHARE = "IaByLItdtL04yM4A3kjR3R8G7Xb5qnkL"
LINKSHARE_AUTHTOKEN_GENERATION_KEY = 'Bearer d1NQME5lWWpjWTFSNkdiWklEeDdTVEk1SlVnSXVLSXg6SzdtQWQ0aDc5TDYwdXJRbXp1U2doenp2SER3Y0YyRlY='
def callAPI(type,url,callType):
    response =  requests.request(type,url=url,headers=getHeader(callType))
    if response.status_code == 200:
         return response
    elif response.status_code == 401:
         global API_KEY_LINKSHARE
         API_KEY_LINKSHARE = get_authtoken()
         return callAPI(type,url,callType)
    else :
         return jsonify({
            'message': 'Failed to fetch data from '+callType,
            'status': response.status_code,
        }), 500
def getHeader(callType):
     if callType == 'FLEXOFFER':
          response = {
               'apiKey': API_KEY_FLEXOFFER,
               'Accept': 'application/json'
          }
          return response 
     else:
          response = {
               'Authorization': f'Bearer {API_KEY_LINKSHARE}',
               'Content-Type': 'application/json'
          }
          return response 
     
def get_authtoken():
    url = f'https://api.linksynergy.com/token'
    payload = 'scope=3780612'
    header = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': LINKSHARE_AUTHTOKEN_GENERATION_KEY
    }
    response = requests.request("POST",url,headers=header,data=payload)
    # print(response.text)
    jsonResponse = response.json()
    # print(jsonResponse)
    return jsonResponse.get('access_token')