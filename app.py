from flask import Flask,request, jsonify
import requests
import xmltodict
import xml.etree.ElementTree as ET
from flask_cors import CORS
import os
import apiCall as ac
app = Flask(__name__)
CORS(app)

# API Keys



# URLs
API_URL_LINKSHARE_ADVERTISERS = 'https://api.linksynergy.com/v2/advertisers'
API_URL_FLEXOFFER_ADVERTISERS = 'https://api.flexoffers.com/advertisers?ProgramStatus=Approved&ApplicationStatus=All&Page=1&pageSize=10'
API_URL_FLEXOFFER_COUPONS = f'https://api.flexoffers.com/coupons?page=1&pageSize=10&promotionalTypes=Coupon&advertiserName=Parfums%20Christian%20Dior'
API_URL_LINKSHARE_COUPONS = f"https://api.linksynergy.com/coupon/1.0?category=2&promotiontype=11"
# API_URL_FLEXOFFER_PRODUCT = f'https://api.flexoffers.com/products/full?page=1&pageSize=500&catId=182&cid='
API_URL_FLEXOFFER_PRODUCT = f'https://api.flexoffers.com/products/full?page=1&catId=182&name=kids&pageSize=50'
API_URL_LINKSHARE_PRODUCT = f'https://api.linksynergy.com/productsearch/1.0?keyword=kids'
API_URL_FLEXOFFER_CATALOGS = f'https://api.flexoffers.com/products/allcatalogs?page=1&pageSize=50'
         
@app.route('/')
def home():
    return "Welcome to the API"

@app.route('/advertisers', methods=['GET'])
def get_advertisers():
    flexoffer_response = ac.callAPI('GET',API_URL_FLEXOFFER_ADVERTISERS,'FLEXOFFER')
    linkshare_response = ac.callAPI('GET',API_URL_LINKSHARE_ADVERTISERS,'LINKSHARE')
    if flexoffer_response.status_code == 200 and linkshare_response.status_code == 200:
        print(linkshare_response)
        print(flexoffer_response)

        flexoffer_data = flexoffer_response.json()
        flexoffer_results = flexoffer_data.get('results', [])
        flexoffer_advertisers = [{'name': item.get('name'), 'source': 'flexoffer'} for item in flexoffer_results]
        
        # Process LinkShare data
        linkshare_data = linkshare_response.json()
        linkshare_advertisers = [{'name': advertiser['name'], 'source': 'linkshare'} for advertiser in linkshare_data['advertisers']]
        
        # Combine results
        advertisers = flexoffer_advertisers + linkshare_advertisers
        
        return jsonify(advertisers)
    elif flexoffer_response.status_code == 200 :
        print(flexoffer_response)
        flexoffer_data = flexoffer_response.json()
        flexoffer_results = flexoffer_data.get('results', [])
        flexoffer_advertisers = [{'name': item.get('name'), 'source': 'flexoffer'} for item in flexoffer_results]
        advertisers = flexoffer_advertisers
        return jsonify(advertisers)
    elif linkshare_response.status_code == 200:
        print(linkshare_response)
        linkshare_data = linkshare_response.json()
        linkshare_advertisers = [{'name': advertiser['name'], 'source': 'linkshare'} for advertiser in linkshare_data['advertisers']]
        advertisers = linkshare_advertisers
        return jsonify(advertisers)
    else:
        return jsonify({
            'message': 'Failed to fetch data',
            'status': linkshare_response.status_code,
        }), 500
    
    # Process FlexOffers data
    


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
    flexoffer_response = ac.callAPI('GET',API_URL_FLEXOFFER_COUPONS,'FLEXOFFER')
    linkshare_response = ac.callAPI('GET',API_URL_LINKSHARE_COUPONS,'LINKSHARE')

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
    # Fetch data from FlexOffers
    flexoffer_products = []
    flexoffer_response = ac.callAPI('GET',API_URL_FLEXOFFER_PRODUCT,'FLEXOFFER')
    try:
        if flexoffer_response!= None and flexoffer_response.status_code == 200:
            flexoffer_data = flexoffer_response.json()
            # print(flexoffer_data)
            flexoffer_products = [{
                'name': item.get('name'),
                'brand': item.get('brand'),
                'deepLinkURL': item.get('deepLinkURL'),
                'imageUrl': item.get('imageUrl'),
                'price': item.get('price'),
                'category':item.get('category'),
                'description':item.get('shortDescription'),
                'source': 'flexoffer'
            } for item in flexoffer_data]
    except Exception as e:
        print('Error occured in created')
    # Fetch data from LinkShare
    linkshare_products = []
    linkshare_response =  ac.callAPI('GET',API_URL_LINKSHARE_PRODUCT,'LINKSHARE')
    if linkshare_response.status_code == 200:
        root = ET.fromstring(linkshare_response.content)
        for item in root.findall('item'):
            product = {
                'name': item.find('productname').text,
                'brand': item.find('merchantname').text,
                'deepLinkURL': item.find('linkurl').text,
                'imageUrl': item.find('imageurl').text,
                'price': item.find('price').text,
                'category':item.find('category').find('primary').text,
                'description':item.find('description').find('short').text,
                'source': 'linkshare'
            }
            linkshare_products.append(product)
    
    # Combine results
    products = linkshare_products + flexoffer_products
    
    return jsonify(products)

if __name__ == '__main__':
    app.run(host="0.0.0.0",debug=True)