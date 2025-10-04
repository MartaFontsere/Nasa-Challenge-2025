import requests
import pprint
import json
import math
import pandas as pd
from datetime import datetime

NASA_API_KEY = "9q1BIrXXNJuWvxQLWkedidQgYXlPNOJFtodj6gTl"
EARTH_RADIUS_KM = 6371.0

url = "https://api.nasa.gov/neo/rest/v1/neo/browse"

params = {"api_key": NASA_API_KEY}
hazardous_asteroids = []

# url = f"https://api.nasa.gov/neo/rest/v1/neo/browse?api_key={NASA_API_KEY}"

# response = requests.get(url)
# data = response.json()

for page in range(0, 3):  # you can increase pages if needed
    params["page"] = page
    res = requests.get(url, params=params)
    if res.status_code != 200:
        print("Error:", res.status_code)
        break

    data = res.json()
    neos = data["near_earth_objects"]
    print("NEW PAGE")
    for neo in neos:
        if neo["is_potentially_hazardous_asteroid"]:
            name = neo["name"]
            diameter = neo["estimated_diameter"]["meters"]["estimated_diameter_max"]
            nasa_jpl_url = neo["nasa_jpl_url"]
            hazardous_asteroids.append({
                "name": name,
                "diameter_m": diameter,
                "url": nasa_jpl_url
            })

    # Stop if there's no next page
    if not data["page"]["number"] < data["page"]["total_pages"] - 1:
        break

print(f"Total hazardous asteroids found: {len(hazardous_asteroids)}")
for asteroid in hazardous_asteroids[:10]:
    print(f"{asteroid['name']} — {asteroid['diameter_m']:.1f} m")

# Print first asteroid summary
# asteroids = data.get("near_earth_objects", [])
print(f"Retrieved {len(hazardous_asteroids)} asteroids")

# if asteroids:
#     first = asteroids[0]
#     print("Name:", first["name"])
#     print("Diameter (km):", first["estimated_diameter"]["kilometers"]["estimated_diameter_max"])
#     print("Velocity (km/s):", first["close_approach_data"][0]["relative_velocity"]["kilometers_per_second"])
#     pprint.pprint(first["close_approach_data"][0])

print("\n#########################################################\n")
#####################################################################

# Base URL for the USGS Earthquake API
url = "https://earthquake.usgs.gov/fdsnws/event/1/query"

# Parameters: request format, time range, and minimum magnitude
params = {
    "format": "geojson",
    "starttime": "2025-09-01",
    "endtime": "2025-10-01",
    "minmagnitude": 5
}

# Make the GET request
response = requests.get(url, params=params)

# Check the response status
if response.status_code == 200:
    data = response.json()
    print(f"Total earthquakes found: {len(data['features'])}")
    
    # Print the first few results
    for quake in data['features'][:5]:
        place = quake['properties']['place']
        mag = quake['properties']['mag']
        time = quake['properties']['time']
        print(f"M{mag} - {place}")
else:
    print("Error:", response.status_code)

##############################################################