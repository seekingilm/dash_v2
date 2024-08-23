from flask import Flask, request
from flask_cors import CORS, cross_origin
import json
import aiohttp
import asyncio
import requests
from OTXv2 import OTXv2, IndicatorTypes

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/data", methods=["GET", "POST"])
@cross_origin()
def data():
    if request.method == "POST":
        data = make_abuse_countries(request.json)
        return data

    return "200"

@app.route("/pie", methods=["GET", "POST"])
@cross_origin()
def pie():
    if request.method == "POST":
        data = make_pie_data(request.json)
        return data
return "200"

@app.route("/table", methods=["GET", "POST"])
@cross_origin()
def table(): #doesn't work
    if request.method == "POST":
        data = make_table_data2(request.json)
        return data
    return "200"

@app.route("/virus", methods=["GET", "POST"])
@cross_origin()
def virus():
    if request.method == "POST":
        print(f"The request is {request.json}")
        data = use_virus_total(request.json)
        print(f"The data is {data}")
        return data
    return "200"

@app.route("/alien", methods=["GET", "POST"])
@cross_origin()
def alien():
    if request.method == "POST":
        print(f"The request is {request.json}")
        data = use_alien_total(request.json)
        print(f"The data is {data}")
        return data
    return "200"

def make_abuse_countries(excel_data):
    if type(excel_data) is not list:
        return '205'

    ip_list = extract_values(excel_data, "IPV4") 
    urls = extract_values(excel_data, "FQDN") 

    #key = "9caf023f75484c2315dc7cac2fa8f980e2728d1a0f69ccdc679f722c694185349e82b4be5e20c76c"
    #key = "9e19a670e5a990c979aef2cd3f66e0a5185d2cdfb3db534d6b5a7b5f7573b35aacb64ac6bf88ac4f"
    #key = "1029f055131ebf52a89d5c02c0c38b78abfad0c4e2ec23b6a13f83c72124e9c987f07b3fc669b6ed"
    #key = "650fe1cb9944cae2eb43f693418dedbae602b21b21efb56b5578d06a21c799aaeedd5d223eb23410"
    #key = "e1ce3d972b778a368f1d3ef617de42076ded1977c0b31ed2d0fe4ac491b8a9a60b5ce98b12842fc1"
    key = "ee9af4f61858c4df64eb5443bd0f043b8d5ca23281c1da9b1759fc957f220e090cfcb3b7ad2d7c7a" #highest key


    fused_lists = []

    for a in range(0, len(ip_list)):
        ip_list[a] = ip_list[a].replace("[.]", ".")

        url = "https://api.abuseipdb.com/api/v2/check"
        querystring = {"ipAddress": ip_list[a], "maxAgeInDays": "90"}
        headers = {"Accept": "application/json", "Key": key}

        response = requests.request(
            method="GET", url=url, headers=headers, params=querystring
        )

        response_dict = json.loads(response.text)
        print(response_dict)
       
        try:
            fused_lists.append(
                {"country": response_dict["data"]["countryCode"], "abuse": response_dict["data"]["abuseConfidenceScore"],}
            )
        except Exception:
           print('Failed to add item to the return list') 

    return fused_lists

def make_pie_data(excel_data): #use this in case you need for API.
    if type(excel_data) is not list:
        print(f'Type of list is {type(excel_data)}')
        print(f'The excel data is {excel_data}')
        return '206'
    
    ip_list = extract_values(excel_data, "IPV4") 

    #key = "9caf023f75484c2315dc7cac2fa8f980e2728d1a0f69ccdc679f722c694185349e82b4be5e20c76c"
    #key = "9e19a670e5a990c979aef2cd3f66e0a5185d2cdfb3db534d6b5a7b5f7573b35aacb64ac6bf88ac4f"
    #key = "1029f055131ebf52a89d5c02c0c38b78abfad0c4e2ec23b6a13f83c72124e9c987f07b3fc669b6ed"
    #key = "650fe1cb9944cae2eb43f693418dedbae602b21b21efb56b5578d06a21c799aaeedd5d223eb23410"
    #key = "e1ce3d972b778a368f1d3ef617de42076ded1977c0b31ed2d0fe4ac491b8a9a60b5ce98b12842fc1"
    key = "ee9af4f61858c4df64eb5443bd0f043b8d5ca23281c1da9b1759fc957f220e090cfcb3b7ad2d7c7a" # highest key

    fused_lists = []

    for a in range(0, len(ip_list)):
        ip_list[a] = ip_list[a].replace("[.]", ".")

        url = "https://api.abuseipdb.com/api/v2/check"
        querystring = {"ipAddress": ip_list[a], "maxAgeInDays": "90"}
        headers = {"Accept": "application/json", "Key": key}

        response = requests.request(
            method="GET", url=url, headers=headers, params=querystring
        )

        response_dict = json.loads(response.text)
        print(response_dict)
       
        try:
            fused_lists.append(
                {"id": clean_labels(response_dict["data"]["usageType"]), "label": clean_labels(response_dict["data"]["usageType"]), "value": response_dict["data"]["abuseConfidenceScore"], "color": "hsl(291, 70%, 50%)"}
            )
        except Exception:
           print('Failed to add item to the return list in pie') 

    return fused_lists

async def make_table_data(excel_data):
    if not isinstance(excel_data, list):
        return '206'

    ip_list = extract_values(excel_data, "IPV4")
    key = "ee9af4f61858c4df64eb5443bd0f043b8d5ca23281c1da9b1759fc957f220e090cfcb3b7ad2d7c7a" #highest key

    fused_lists = []
    
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_ip_data(session, ip.replace("[.]", "."), key) for ip in ip_list]
        responses = await asyncio.gather(*tasks)

        for response_dict in responses:
            try:
                data = response_dict["data"]
                fused_lists.append(
                    {
                        "id": data["ipAddress"],
                        "ip": data["ipAddress"],
                        "abuse": data["abuseConfidenceScore"],
                        "category": data["usageType"],
                        "country": data["countryCode"],
                        "totalReports": data["totalReports"]
                    }
                )
            except:
                print('Failed to parse response data')

    return fused_lists

def make_table_data2(excel_data):
    if type(excel_data) is not list:
        return '206'

    ip_list = extract_values(excel_data, "IPV4") 

    dates = []
    countries = []
    country_name = []
    abuse = []

    # key = "9caf023f75484c2315dc7cac2fa8f980e2728d1a0f69ccdc679f722c694185349e82b4be5e20c76c"
    # key = "9e19a670e5a990c979aef2cd3f66e0a5185d2cdfb3db534d6b5a7b5f7573b35aacb64ac6bf88ac4f"
    # key = "1029f055131ebf52a89d5c02c0c38b78abfad0c4e2ec23b6a13f83c72124e9c987f07b3fc669b6ed"
    # key = "650fe1cb9944cae2eb43f693418dedbae602b21b21efb56b5578d06a21c799aaeedd5d223eb23410"
    # key = "e1ce3d972b778a368f1d3ef617de42076ded1977c0b31ed2d0fe4ac491b8a9a60b5ce98b12842fc1"
    key = "ee9af4f61858c4df64eb5443bd0f043b8d5ca23281c1da9b1759fc957f220e090cfcb3b7ad2d7c7a" #highest key

    fused_lists = []

    for a in range(0, len(ip_list)):
        ip_list[a] = ip_list[a].replace("[.]", ".")

        url = "https://api.abuseipdb.com/api/v2/check"
        querystring = {"ipAddress": ip_list[a], "maxAgeInDays": "90"}
        headers = {"Accept": "application/json", "Key": key}

        response = requests.request(
            method="GET", url=url, headers=headers, params=querystring
        )

        response_dict = json.loads(response.text)
        print(response_dict)

        try:
            fused_lists.append(
                {"id": response_dict["data"]["ipAddress"],"ip": response_dict["data"]["ipAddress"], "abuse": response_dict["data"]["abuseConfidenceScore"], "category":  response_dict["data"]["usageType"],"country":  response_dict["data"]["countryCode"], "totalReports":  response_dict["data"]["totalReports"]},
            )
        except Exception:
            print('Failed to add item to the return list in pie') 

    return fused_lists


def use_virus_total(ip):
    url = f"https://www.virustotal.com/api/v3/ip_addresses/{ip}"
    headers = {
        "accept": "application/json",
        "x-apikey": "9164bf03a43a61b5fafc8e0601fda6da3d9bafb9ee22c1315c756bcee58f3346",
    }

    response = requests.get(url, headers=headers)
    return response.json()

def use_alien_total(ip):
    key = '5ae2fecc55d39959269bd3f7cc40f631722dbe37594e3e121e1f1435038840d0'
    otx = OTXv2(key)
    ip_details = otx.get_indicator_details_full(IndicatorTypes.IPv4, ip)
    return ip_details

def extract_values(obj_list, key):
    return_list = []

    if type(obj_list) is list:
        for item in obj_list:
            if key in item:
                return_list.append(item[key])

        return return_list

def clean_urls(urls):
    for i in range(len(urls)):
            if type(urls[i]) == str:
                urls[i] = urls[i].replace("[.]", ".")
    return urls

def clean_labels(label):
    if label == "Data Center/Web Hosting/Transit":
        return "DWT"
    elif label == "Mobile ISP":
        return "Mobile"
    elif label == "Content Delivery Network":
        return "CDN"
    else:
        return label 
