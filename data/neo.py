import requests
import pprint
import json

NASA_API_KEY = "9q1BIrXXNJuWvxQLWkedidQgYXlPNOJFtodj6gTl"

url = f"https://api.nasa.gov/neo/rest/v1/neo/browse?api_key={NASA_API_KEY}"

response = requests.get(url)
data = response.json()

# Print first asteroid summary
asteroids = data.get("near_earth_objects", [])
print(f"Retrieved {len(asteroids)} asteroids")

if asteroids:
    first = asteroids[0]
    print("Name:", first["name"])
    print("Diameter (km):", first["estimated_diameter"]["kilometers"]["estimated_diameter_max"])
    print("Velocity (km/s):", first["close_approach_data"][0]["relative_velocity"]["kilometers_per_second"])
    pprint.pprint(first["close_approach_data"][0])


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