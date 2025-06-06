from flask import Flask, request
import time
from flask_cors import CORS, cross_origin
import json
import requests
from OTXv2 import OTXv2, IndicatorTypes
from google import genai

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
def table():
    if request.method == "POST":
        data = make_table_data(request.json)
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

@app.route("/Ai",  methods=["GET", "POST"])
@cross_origin()
def Ai():
    if request.method == "POST":
        data = use_alien_total(request.json)
        ai_response = create_ai_response(data)
        return_json = {'contents': ai_response }
        
        return {'contents':  ai_response} 

    return "200"


def make_abuse_countries(excel_data):
    if type(excel_data) is not list:
        return '205'

    ip_list = extract_values(excel_data, "IPV4") 
    urls = extract_values(excel_data, "FQDN") 

    key = 'a7e1ac2c040a3f5003f9ef847b6eaf5e18529f3505942830fb77ff74a74c39c8d7e2fff5fd97680a'

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

    key = 'a7e1ac2c040a3f5003f9ef847b6eaf5e18529f3505942830fb77ff74a74c39c8d7e2fff5fd97680a'

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

def make_table_data(excel_data):
    time.sleep(0.01) 
    
    if type(excel_data) is not list:
        return '206'

    ip_list = extract_values(excel_data, "IPV4") 
    
    key = "a7e1ac2c040a3f5003f9ef847b6eaf5e18529f3505942830fb77ff74a74c39c8d7e2fff5fd97680a" # highest key

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
    key = "a7e1ac2c040a3f5003f9ef847b6eaf5e18529f3505942830fb77ff74a74c39c8d7e2fff5fd97680a"
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

def create_ai_response(json_obj):
    prompt = """take this json object and convert it into an explanation for an cyber security
    report.  Write in clear professional english, the beginning of the report goes
    like this.  One of the key IP addresses identified is , which is associated
    with the ISP and the domain . This IP address is linked to suspicious activity
    and has been reported times by distinct users. The high abuse confidence score
    of indicates a strong likelihood of ongoing malicious activity. The associated
    hostname is , and it is categorized under Fixed Line ISP usage. Further
    investigation and monitoring are recommended to address the potential threats
    posed by this IP.  This report provides a comprehensive analysis of malicious
    IP addresses extracted from an Excel sheet, utilizing data from an open-source
    platform's API. The report focuses on identifying key trends, significant
    incidents, and actionable insights to enhance cybersecurity measures. Through
    this analysis, we have uncovered critical patterns and threats that require
    immediate attention and mitigation. the JSON object is this, """  + json.dumps(json_obj)

    client = genai.Client(api_key="AIzaSyCURgqtNCmttB9BCayTBRczqr4ScOEDU3s")

    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=prompt
    )

    return response.text 

