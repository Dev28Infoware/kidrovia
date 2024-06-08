from flask import Flask,request, jsonify
import requests
import xmltodict
import xml.etree.ElementTree as ET
from flask_cors import CORS
import os
app = Flask(__name__)
CORS(app)

# API Keys
api_key_flexoffer = "41a02e6b-b5a3-4d7f-ae2a-476cdd6be0b7"
api_key_linkshare = "FCAIfuko1q6xUUpbIWNrM4Y4V5AvR3YL"


# URLs
API_URL_LINKSHARE_ADVERTISERS = 'https://api.linksynergy.com/v2/advertisers'


@app.route("/get-api-key", methods=['POST'])
def link_share_offer():
    api_key_linkshare = request.json.get('apikey_linkshare')
    return jsonify({
        'api_linkshare': api_key_linkshare
    })


@app.route('/advertisers', methods=['GET'])
def get_advertisers():
    flexoffer_url = 'https://api.flexoffers.com/advertisers?ProgramStatus=Approved&ApplicationStatus=All&Page=1&pageSize=10'
    linkshare_url = API_URL_LINKSHARE_ADVERTISERS


    # Fetch data from FlexOffers
    flexoffer_headers = {'apiKey': api_key_flexoffer}
    flexoffer_response = requests.get(flexoffer_url, headers=flexoffer_headers)
    
    # Fetch data from LinkShare
    linkshare_headers = {'Authorization': f'Bearer {api_key_linkshare}'}
    linkshare_response = requests.get(linkshare_url, headers=linkshare_headers)
    
    if flexoffer_response.status_code != 200 or linkshare_response.status_code != 200:
        return jsonify({
            'error': 'Failed to fetch data from one or both APIs',
            'flexoffer_status': flexoffer_response.status_code,
            'linkshare_status': linkshare_response.status_code
        }), 500
    
    # Process FlexOffers data
    flexoffer_data = flexoffer_response.json()
    flexoffer_results = flexoffer_data.get('results', [])
    flexoffer_advertisers = [{'name': item.get('name'), 'source': 'flexoffer'} for item in flexoffer_results]
    
    # Process LinkShare data
    linkshare_data = linkshare_response.json()
    linkshare_advertisers = [{'name': advertiser['name'], 'source': 'linkshare'} for advertiser in linkshare_data['advertisers']]
    
    # Combine results
    advertisers = flexoffer_advertisers + linkshare_advertisers
    
    return jsonify(advertisers)


def parse_coupon(coupon):
    return {
        "advertiserId": coupon['advertiserid'],
        "advertiserName": coupon['advertisername'],
        "linkName": coupon['offerdescription'],
        "linkUrl": coupon['clickurl'],
        "couponCode": coupon['offerdescription'],
        "source": 'linkshare'
    }

@app.route('/coupons', methods=['GET'])
def get_coupons():
    #category = request.args.get('category', '1')
    #advertiser_id = request.args.get('advertiserid')

    # Fetch data from FlexOffers
    flexoffer_url = f'https://api.flexoffers.com/coupons?page=1&pageSize=10&promotionalTypes=Coupon&advertiserName=Parfums%20Christian%20Dior'
    flexoffer_headers = {'apiKey': api_key_flexoffer}
    flexoffer_response = requests.get(flexoffer_url, headers=flexoffer_headers)
    
    # Fetch data from LinkShare
    linkshare_url = f"https://api.linksynergy.com/coupon/1.0?category=2&promotiontype=11"
    linkshare_headers = {"Authorization": f"Bearer {api_key_linkshare}"}
    linkshare_response = requests.get(linkshare_url, headers=linkshare_headers)

    if flexoffer_response.status_code != 200 or linkshare_response.status_code != 200:
        return jsonify({
            'error': 'Failed to fetch data from one or both APIs',
            'flexoffer_status': flexoffer_response.status_code,
            'linkshare_status': linkshare_response.status_code
        }), 500

    # Process FlexOffers data
    flexoffer_data = flexoffer_response.json()
    flexoffer_coupons = [{
        'advertiserId': item.get('advertiserId'),
        'advertiserName': item.get('advertiserName'),
        'linkName': item.get('couponName'),
        'linkUrl': item.get('destinationUrl'),
        'couponCode': item.get('couponCode'),
        'source': 'flexoffer'
    } for item in flexoffer_data.get('coupons', [])]

    # Process LinkShare data
    linkshare_data = xmltodict.parse(linkshare_response.content)
    linkshare_coupons = []
    if 'link' in linkshare_data['couponfeed']:
        if isinstance(linkshare_data['couponfeed']['link'], list):
            links = linkshare_data['couponfeed']['link']
        else:
            links = [linkshare_data['couponfeed']['link']]
        for coupon in links:
            linkshare_coupons.append({
                'advertiserId': coupon['advertiserid'],
                'advertiserName': coupon['advertisername'],
                'linkName': coupon['offerdescription'],
                'linkUrl': coupon['clickurl'],
                'couponCode': coupon.get('couponcode'),
                'source': 'linkshare'
            })

    # Combine results
    coupons = linkshare_coupons + flexoffer_coupons
    
    return jsonify(coupons)
    
@app.route('/products', methods=['GET'])
def get_products():
    cid = '619.1.362B'
    keyword = 'kids'
    
    # Fetch data from FlexOffers
    flexoffer_products = []
    if cid:
        flexoffer_url = f'https://api.flexoffers.com/products/full?page=1&pageSize=10&cid=619.1.362B'
        flexoffer_headers = {'apiKey': api_key_flexoffer}
        flexoffer_response = requests.get(flexoffer_url, headers=flexoffer_headers)
        if flexoffer_response.status_code == 200:
            flexoffer_data = flexoffer_response.json()
            flexoffer_products = [{
                'name': item.get('name'),
                'brand': item.get('brand'),
                'deepLinkURL': item.get('deepLinkURL'),
                'imageUrl': item.get('imageUrl'),
                'price': item.get('price'),
                'source': 'flexoffer'
            } for item in flexoffer_data]
    
    # Fetch data from LinkShare
    linkshare_products = []
    if keyword:
        linkshare_url = f'https://api.linksynergy.com/productsearch/1.0?keyword=kids'
        linkshare_headers = {'Authorization': f'Bearer {api_key_linkshare}'}
        linkshare_response = requests.get(linkshare_url, headers=linkshare_headers)
        if linkshare_response.status_code == 200:
            root = ET.fromstring(linkshare_response.content)
            for item in root.findall('item'):
                product = {
                    'name': item.find('productname').text,
                    'brand': item.find('merchantname').text,
                    'deepLinkURL': item.find('linkurl').text,
                    'imageUrl': item.find('imageurl').text,
                    'price': item.find('price').text,
                    'source': 'linkshare'
                }
                linkshare_products.append(product)
    
    # Combine results
    products = linkshare_products + flexoffer_products
    
    return jsonify(products)

if __name__ == '__main__':
    app.run(debug=True)
