import requests
import pprint
import json
import math
import pandas as pd
from datetime import datetime

NASA_API_KEY = "9q1BIrXXNJuWvxQLWkedidQgYXlPNOJFtodj6gTl"
EARTH_RADIUS_KM = 6371.0

BROWSE_URL = "https://api.nasa.gov/neo/rest/v1/neo/browse"

params = {"api_key": NASA_API_KEY}
hazardous_data = []

def impact_energy_joules(diameter_m, velocity_km_s, density=3000):
    """Compute impact kinetic energy (Joules) for an asteroid."""
    radius = diameter_m / 2
    v = velocity_km_s * 1000  # m/s
    mass = (4/3) * math.pi * (radius ** 3) * density
    energy = 0.5 * mass * v ** 2
    return energy

def energy_to_magnitude(energy_joules):
    """Approximate equivalent earthquake magnitude (Richter/Mw)."""
    return 0.67 * math.log10(energy_joules) - 5.87

def fetch_hazardous_neos(pages=1):
    """Fetch hazardous NEOs from NASA API."""
    for page in range(pages):
        params = {"api_key": NASA_API_KEY, "page": page}
        res = requests.get(BROWSE_URL, params=params, timeout=30)
        res.raise_for_status()
        neos = res.json().get("near_earth_objects", [])
        
        for neo in neos:
            if neo.get("is_potentially_hazardous_asteroid", False):
                process_asteroid(neo)

def get_earthquake_examples(mag, delta=0.3, max_delta=2.0):
    """Get example real earthquakes of similar magnitude."""
    url = "https://earthquake.usgs.gov/fdsnws/event/1/query"
    base_params = {
        "format": "geojson",
        "orderby": "time",
        "limit": 3
    }

    # Stepwise expansion of magnitude window
    step = 0.3
    current_delta = delta
    results = []

    while current_delta <= max_delta and not results:
        params = {
            **base_params,
            "minmagnitude": mag - current_delta,
            "maxmagnitude": mag + current_delta
        }
        r = requests.get(url, params=params, timeout=20)
        if r.status_code == 200:
            data = r.json().get("features", [])
            if data:
                results = [
                    {
                        "place": e["properties"]["place"],
                        "mag": e["properties"]["mag"],
                        "time": e["properties"]["time"]
                    }
                    for e in data
                ]
                break  # found some events
        current_delta += step

    # If still no events found, return a note
    if not results:
        return [{"place": "No matching earthquakes found", "mag": None, "time": None}]
    else:
        return results

def process_asteroid(neo):
    """Extract data for one hazardous asteroid."""
    name = neo["name"]
    neo_id = neo["id"]
    diameter = neo["estimated_diameter"]["meters"]["estimated_diameter_max"]

    # Orbital elements
    orb = neo.get("orbital_data", {})
    a = float(orb.get("semi_major_axis", 0))
    e = float(orb.get("eccentricity", 0))
    i = float(orb.get("inclination", 0))
    raan = float(orb.get("ascending_node_longitude", 0))
    argp = float(orb.get("perihelion_argument", 0))
    M = float(orb.get("mean_anomaly", 0))
    epoch = orb.get("epoch_osculation")

    # Next close approach
    close_data = neo.get("close_approach_data", [])
    if close_data:
        next_approach = close_data[0]
        date = next_approach.get("close_approach_date")
        miss_km = float(next_approach["miss_distance"]["kilometers"])
        velocity = float(next_approach["relative_velocity"]["kilometers_per_second"])
    else:
        date, miss_km, velocity = None, None, None

    # Determine if it's a "potential impact" (miss distance ≤ Earth radius)
    potential_impact = miss_km is not None and miss_km <= EARTH_RADIUS_KM

    if velocity and diameter:
        E = impact_energy_joules(diameter, velocity)
        Mw = energy_to_magnitude(E)
        examples = get_earthquake_examples(Mw)
    else:
        E, Mw, examples = None, None, None

    hazardous_data.append({
        "name": name,
        "id": neo_id,
        "diameter_m": diameter,
        "a_AU": a,
        "e": e,
        "i_deg": i,
        "raan_deg": raan,
        "argp_deg": argp,
        "M_deg": M,
        "epoch": epoch,
        "close_approach_date": date,
        "miss_distance_km": miss_km,
        "velocity_km_s": velocity,
        "potential_impact": potential_impact,
        "impact_energy_J": E,
        "impact_magnitude_Mw": Mw,
        "earthquake_examples": examples
    })

# Run the process
fetch_hazardous_neos(pages=1)

# Save results
df = pd.DataFrame(hazardous_data)
# df.to_csv("hazardous_asteroids.csv", index=False)
# df.to_json("hazardous_asteroids.json", orient="records", indent=2)

print(f"\n✅ Total hazardous asteroids: {len(df)}")
# print(hazardous_data[0])
print(f"🪐 Potential impacts (miss ≤ Earth radius): {df['potential_impact'].sum()}")
# print("Data saved to: hazardous_asteroids.csv & hazardous_asteroids.json")

# Print first asteroid summary
# asteroids = data.get("near_earth_objects", [])
# print(f"Retrieved {len(hazardous_asteroids)} asteroids")


print("\n#########################################################\n")

