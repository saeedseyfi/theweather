# How's the Weather for Vacation?
This script helps to find the best days in next two weeks to take vacation based on weather.

## Setup
Prerequisites: git, [deno](https://deno.land/) and [ClimaCell api key](https://developer.climacell.co)
```shell script
git clone git@github.com:saeedseyfi/theweather.git
echo CLIMACELL_APIKEY=your-api-key >> theweather/.env
```

## Run
```shell script
deno run --allow-net=api.climacell.co --allow-read=. --allow-env mod.ts lat=59.3268711 lon=18.0702666 
```
Params:
```text
# REQUIRED
--allow-net     # allows http request to api 
--allow-read    # allows reading current directory (.env files)
--allow-env     # allows access to env variables
mod.ts          # main script file
lat=59.3268711  # location latitude
lon=18.0702666  # location longitude

# OPTIONAL
days=14         # number of days to check (max 14)
temp=20         # min temperature (ºC) 
precip=1        # max precipitation (mm/hr)
```
You can make your command set an alias to check your vacation-friendly days ;)
