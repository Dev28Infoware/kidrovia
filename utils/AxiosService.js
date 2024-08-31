const axios = require('axios');
const xml2js = require('xml2js');
const qs = require('qs');
let tokenExpiry=0;
let refreshToken='-';

async function getAPI(url,header,type){
    try{
        if(type === 'JSON'){
            const response = await axios.get(url,{headers:header});
            return response.data;
        }
        else{
            const response = await axios.get(url,{headers:header});
            let xmlResponse = response.data;
            const parser = new xml2js.Parser();
            const result = await new Promise((resolve,reject)=>{
                parser.parseString(xmlResponse,(err,result)=>{
                    if(err){
                        console.error('Error parsing XML:', err);
                        reject(err);
                    }
                    resolve(result)
                });
            });
            return result;
        }
    }
    catch(error){
        console.log(`Error fetching products from API : ${error.message}`);
        // console.error(error.stack);
        // throw new Error('Failed to fetch data from API');
    }
}

async function postAPI(url,header,data){
    try{
        const response = await axios.post(url, data, { headers: header });
        return response.data;
    }
    catch(error){
        console.log(`Error fetching users from API : ${error.message}`);
        throw new Error('Failed to fetch data from API');
    }
}

async function getFlexOfferProductIds(url, header) {
  try {
    // Fetch the API response
    const response = await getAPI(url, header, 'JSON');
    
    
    if (Array.isArray(response)) {
      // Extract product IDs from the response
      return response.map(product => product.pid);
    } else {
      // throw new Error('Invalid response format: Response is not an array');
      return [];
    }
  } catch (error) {
    console.error(`Error fetching product IDs: ${error.message}`);
    return [];
  }
}

async function linkShareRefreshToken(){
  if(tokenExpiry==0 || Date.now()>= tokenExpiry){
      let authTokenAPI = 'https://api.linksynergy.com/token';
      let authTokenHeader = {
          'Authorization':'Bearer d1NQME5lWWpjWTFSNkdiWklEeDdTVEk1SlVnSXVLSXg6SzdtQWQ0aDc5TDYwdXJRbXp1U2doenp2SER3Y0YyRlY=',
          'Content-Type':'application/x-www-form-urlencoded'
      }
      let data = qs.stringify({
          'scope': '3780612' 
      });
      const refreshTokenResponse = await postAPI(authTokenAPI,authTokenHeader,data);
      tokenExpiry=Date.now()+refreshTokenResponse.expires_in*1000;
      refreshToken=refreshTokenResponse.access_token;
      return refreshTokenResponse.access_token;
  }
  return refreshToken;
}
module.exports = {getAPI,postAPI,linkShareRefreshToken, getFlexOfferProductIds};