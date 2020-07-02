# How's the Weather for Vacation?
This script helps to find the best days in next two weeks to take vacation based on weather.

## Setup
Prerequisites: git & [deno](https://deno.land/)
```shell script
git clone git@github.com:saeedseyfi/theweather.git
cd theweather
```
Then get your api key from https://developer.climacell.co and make your .env file based on example.

## Run
```shell script
deno run\
  --allow-net=api.climacell.co\   # allows request to api 
  --allow-read=.\                 # allows reading current directory (.env files)
  --allow-env\                    # allows access to env variables
  mod.ts\                         # script file
  lat=59.432291\                  # location latitude
  lon=18.089190\                  # location longitude
  days=14\                        # optional - number of days to check (max 14)
  temp=20\                        # optional - min temperature (ºC) 
  precip=1                        # optional - max precipitation (mm/hr) 
```
You can set alias for your command to check vacation-friendly days ;)
