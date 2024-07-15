from flask import Flask, request
from flask_cors import CORS, cross_origin
import json
import requests

app = Flask(__name__)
cors = CORS(app)
app.config["CORS_HEADERS"] = "Content-Type"

post_json = {}


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/data", methods=["GET", "POST"])
@cross_origin()
def data():
    if request.method == "POST":
        data = extract(request.json)
        return data

    return "200"


def extract(excel_data):
    if type(excel_data) is not list:
        return '205'

    ip_list = extract_values(excel_data, "IPV4") 
    urls = extract_values(excel_data, "FQDN") 

    print(ip_list)
    print(urls)

    for i in range(len(urls)):
        if type(urls[i]) == str:
            urls[i] = urls[i].replace("[.]", ".")

    dates = []
    countries = []
    country_name = []
    abuse = []
    #key = "9caf023f75484c2315dc7cac2fa8f980e2728d1a0f69ccdc679f722c694185349e82b4be5e20c76c"
    key = "9e19a670e5a990c979aef2cd3f66e0a5185d2cdfb3db534d6b5a7b5f7573b35aacb64ac6bf88ac4f"

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
        if "countryCode" in response_dict["data"] and "abuseConfidenceScore" in response_dict["data"]:
            fused_lists.append(
                {"country": response_dict["data"]["countryCode"], "abuse": response_dict["data"]["abuseConfidenceScore"],}
            )
    
    return fused_lists


def reduce_down(data):
    country_abuse_dict = {}

    for x in data:
        for entry in x:
            country = entry["country"]
            abuse = entry["abuse"]

            if country in country_abuse_dict:
                country_abuse_dict[country] += abuse
            else:
                country_abuse_dict[country] = abuse
    print(country_abuse_dict)

    return country_abuse_dict


def extract_values(obj_list, key):
    return_list = []

    if type(obj_list) is list:
        for item in obj_list:
            if key in item:
                return_list.append(item[key])

        return return_list

def nothing():
    return 0