# How's the weather for vacation?

This script helps to find the best days in next two weeks to take vacation based
on weather.

![Output Screenshot](https://github.com/saeedseyfi/theweather/raw/master/assets/output.png)

## Setup

Prerequisites: git, [deno](https://deno.land/) and
[tomorrow.io api key](https://docs.tomorrow.io/reference/welcome)

```shell script
git clone git@github.com:saeedseyfi/theweather.git
echo TOMORROW_APIKEY=your-api-key >> theweather/.env
```

## Run

```shell script
deno run --allow-net=api.tomorrow.io,weather-services.tomorrow.io,api.ipify.org,ipapi.co --allow-read=. --allow-env mod.ts
```

Params:

```text
# REQUIRED
--allow-net     # allows http request to api 
--allow-read    # allows reading current directory (.env files)
--allow-env     # allows access to env variables
mod.ts          # main script file

# OPTIONAL
--lat=59.3268711  # location latitude
--lon=18.0702666  # location longitude
--days=14         # number of days to check (max 15)
--temp=20         # min temperature (ºC) 
--precip=1        # max precipitation (mm/hr)
--wind=8          # max wind speed (m/hr)
--gust=10         # max wind gusts (m/hr)
```

You can make your command set an alias to find your vacation-friendly days ;)
