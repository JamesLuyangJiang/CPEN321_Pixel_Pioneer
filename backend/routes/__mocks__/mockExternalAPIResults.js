//ip info return
const onIpInfoAPISuccess = {
  data: {
    mock: true,
    ip: "207.216.11.9",
    hostname: "d207-216-11-9.bchsia.telus.net",
    city: "Richmond",
    region: "British Columbia",
    country: "CA",
    loc: "49.1700,-123.1368",
    org: "AS852 TELUS Communications Inc.",
    postal: "V6Y",
    timezone: "America/Vancouver",
    readme: "https://ipinfo.io/missingauth",
  },
};

const onIpInfoAPISuccessWithDifferentTimezone = {
  data: {
    mock: true,
    ip: "207.216.11.9",
    hostname: "d207-216-11-9.tnthsia.telus.net",
    city: "Toronto",
    region: "Ontario",
    country: "CA",
    loc: "43.6510,-79.3470",
    org: "AS852 TELUS Communications Inc.",
    postal: "M5H",
    timezone: "America/Toronto",
    readme: "https://ipinfo.io/missingauth",
  },
};

const onIpInfoAPIFailWithInvalidParameters = {
  data: {
    mock: true,
    ip: "207.216.11.9",
    hostname: "d207-216-11-9.bchsia.telus.net",
    city: "Richmond",
    region: "British Columbia",
    country: "CA",
    loc: "49.1700,-123.1368",
    org: "AS852 TELUS Communications Inc.",
    postal: "V6Y",
    timezone: "",
    readme: "https://ipinfo.io/missingauth",
  },
};

const onGeogratisAPISuccess = {
  data: {
    items: [
      {
        id: "JBFRV",
        links: {
          self: {
            href: "https://geogratis.gc.ca/services/geoname/en/geonames/JBFRV",
          },
          feature: {
            href: "https://geogratis.gc.ca/services/geoname/en/features/0cfaf0b0849c20c3c4940e67299b33ab",
          },
          language: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
          },
          status: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
          },
          concise: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
          },
          generic: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
          },
          province: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
          },
        },
        name: "North Vancouver",

        language: {
          code: "und",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
            },
          },
        },
        feature: {
          id: "0cfaf0b0849c20c3c4940e67299b33ab",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/features/0cfaf0b0849c20c3c4940e67299b33ab",
            },
          },
        },

        category: "O",
        status: {
          code: "official",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
            },
          },
        },
        concise: {
          code: "CITY",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
            },
          },
        },
        generic: {
          code: "1",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
            },
          },
        },
        location: "New Westminster Land District",
        province: {
          code: "59",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
            },
          },
        },
        latitude: 49.320556,
        longitude: -123.073889,
        map: ["092G06", "092G00"],
        relevance: 1000000,
        bbox: [-123.108598, 49.2904398, -123.0317137, 49.3426084],
        accuracy: 100,
        position: { type: "Point", coordinates: [-123.073889, 49.320556] },

        distance: 17.359269522568212,
        azimuth: 15.27624724284455,

        decision: "1937-12-07",
      },
      {
        id: "JAZMR",
        links: {
          self: {
            href: "https://geogratis.gc.ca/services/geoname/en/geonames/JAZMR",
          },
          feature: {
            href: "https://geogratis.gc.ca/services/geoname/en/features/0c97ba83849c20c323fddaf0a1b2047f",
          },
          language: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
          },
          status: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
          },
          concise: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
          },
          generic: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
          },
          province: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
          },
        },
        name: "New Westminster",

        language: {
          code: "und",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
            },
          },
        },
        feature: {
          id: "0c97ba83849c20c323fddaf0a1b2047f",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/features/0c97ba83849c20c323fddaf0a1b2047f",
            },
          },
        },

        category: "O",
        status: {
          code: "official",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
            },
          },
        },
        concise: {
          code: "CITY",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
            },
          },
        },
        generic: {
          code: "1",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
            },
          },
        },
        location: "New Westminster Land District",
        province: {
          code: "59",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
            },
          },
        },
        latitude: 49.206667,
        longitude: -122.910556,
        map: ["092G02", "092G00"],
        relevance: 1000000,
        bbox: [-122.9759909, 49.1628554, -122.8609827, 49.2516047],
        accuracy: 100,
        position: { type: "Point", coordinates: [-122.910556, 49.206667] },

        distance: 16.98883267638544,
        azimuth: 76.02598481870662,

        decision: "1936-02-11",
      },
      {
        id: "JAYRE",
        links: {
          self: {
            href: "https://geogratis.gc.ca/services/geoname/en/geonames/JAYRE",
          },
          feature: {
            href: "https://geogratis.gc.ca/services/geoname/en/features/0c97475d849c20c37c7ea9c4d0fd96ba",
          },
          language: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
          },
          status: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
          },
          concise: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
          },
          generic: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
          },
          province: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
          },
        },
        name: "Delta",

        language: {
          code: "und",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
            },
          },
        },
        feature: {
          id: "0c97475d849c20c37c7ea9c4d0fd96ba",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/features/0c97475d849c20c37c7ea9c4d0fd96ba",
            },
          },
        },

        category: "O",
        status: {
          code: "official",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
            },
          },
        },
        concise: {
          code: "CITY",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
            },
          },
        },
        generic: {
          code: "1",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
            },
          },
        },
        location: "New Westminster Land District",
        province: {
          code: "59",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
            },
          },
        },
        latitude: 49.084722,
        longitude: -123.058611,
        map: ["092G03", "092G02", "092G00"],
        relevance: 1000000,
        bbox: [-123.078611, 49.064722, -123.038611, 49.104722],
        accuracy: 100,
        position: { type: "Point", coordinates: [-123.058611, 49.084722] },

        distance: 11.068466750429247,
        azimuth: 148.93452296354985,

        decision: "2017-11-14",
      },
      {
        id: "JAEBN",
        links: {
          self: {
            href: "https://geogratis.gc.ca/services/geoname/en/geonames/JAEBN",
          },
          feature: {
            href: "https://geogratis.gc.ca/services/geoname/en/features/a38fccccd05411d892e2080020a0f4c9",
          },
          language: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
          },
          status: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
          },
          concise: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
          },
          generic: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
          },
          province: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
          },
        },
        name: "Burnaby",

        language: {
          code: "und",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
            },
          },
        },
        feature: {
          id: "a38fccccd05411d892e2080020a0f4c9",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/features/a38fccccd05411d892e2080020a0f4c9",
            },
          },
        },

        category: "O",
        status: {
          code: "official",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
            },
          },
        },
        concise: {
          code: "CITY",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
            },
          },
        },
        generic: {
          code: "1",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
            },
          },
        },
        location: "New Westminster Land District",
        province: {
          code: "59",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
            },
          },
        },
        latitude: 49.242778,
        longitude: -122.972778,
        map: ["092G07", "092G02", "092G03", "092G06"],
        relevance: 1000000,
        bbox: [-122.992778, 49.222778, -122.952778, 49.262778],
        accuracy: 100,
        position: { type: "Point", coordinates: [-122.972778, 49.242778] },

        distance: 14.43483137588289,
        azimuth: 55.83227132603306,

        decision: "1936-02-11",
      },
      {
        id: "JBJFI",
        links: {
          self: {
            href: "https://geogratis.gc.ca/services/geoname/en/geonames/JBJFI",
          },
          feature: {
            href: "https://geogratis.gc.ca/services/geoname/en/features/bc5903fad05411d892e2080020a0f4c9",
          },
          language: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
          },
          status: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
          },
          concise: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
          },
          generic: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
          },
          province: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
          },
        },
        name: "Richmond",

        language: {
          code: "und",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
            },
          },
        },
        feature: {
          id: "bc5903fad05411d892e2080020a0f4c9",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/features/bc5903fad05411d892e2080020a0f4c9",
            },
          },
        },

        category: "O",
        status: {
          code: "official",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
            },
          },
        },
        concise: {
          code: "CITY",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
            },
          },
        },
        generic: {
          code: "1",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
            },
          },
        },
        location: "New Westminster Land District",
        province: {
          code: "59",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
            },
          },
        },
        latitude: 49.163333,
        longitude: -123.163333,
        map: ["092G03", "092G02", "092G06"],
        relevance: 1000000,
        bbox: [-123.183333, 49.143333, -123.143333, 49.183333],
        accuracy: 100,
        position: { type: "Point", coordinates: [-123.163333, 49.163333] },

        distance: 2.0721751138322797,
        azimuth: 249.04392538664501,

        decision: "1991-11-08",
      },
      {
        id: "JBRIK",
        links: {
          self: {
            href: "https://geogratis.gc.ca/services/geoname/en/geonames/JBRIK",
          },
          feature: {
            href: "https://geogratis.gc.ca/services/geoname/en/features/0ca0fef1849c20c3313df3807fa729b2",
          },
          language: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
          },
          status: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
          },
          concise: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
          },
          generic: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
          },
          province: {
            href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
          },
        },
        name: "Vancouver",

        language: {
          code: "und",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
            },
          },
        },
        feature: {
          id: "0ca0fef1849c20c3313df3807fa729b2",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/features/0ca0fef1849c20c3313df3807fa729b2",
            },
          },
        },

        category: "O",
        status: {
          code: "official",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
            },
          },
        },
        concise: {
          code: "CITY",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
            },
          },
        },
        generic: {
          code: "1",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
            },
          },
        },
        location: "New Westminster Land District",
        province: {
          code: "59",

          links: {
            self: {
              href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
            },
          },
        },
        latitude: 49.261111,
        longitude: -123.113889,
        map: ["092G03", "092G06", "032L00", "092G00"],
        relevance: 15000000,
        bbox: [-123.133889, 49.241111, -123.093889, 49.281111],
        accuracy: 100,
        position: { type: "Point", coordinates: [-123.113889, 49.261111] },

        distance: 10.269374599303939,
        azimuth: 9.345732678730547,

        decision: "1937-12-07",
      },
    ],
  },
};

const onGeogratisAPISuccessWithSameConditionScore = {
  data: {
    items: [

{
  id: "JBFRV",
  links: {
    self: {
      href: "https://geogratis.gc.ca/services/geoname/en/geonames/JBFRV",
    },
    feature: {
      href: "https://geogratis.gc.ca/services/geoname/en/features/0cfaf0b0849c20c3c4940e67299b33ab",
    },
    language: {
      href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
    },
    status: {
      href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
    },
    concise: {
      href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
    },
    generic: {
      href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
    },
    province: {
      href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
    },
  },
  name: "Observatory1",

  language: {
    code: "und",

    links: {
      self: {
        href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
      },
    },
  },
  feature: {
    id: "0cfaf0b0849c20c3c4940e67299b33ab",

    links: {
      self: {
        href: "https://geogratis.gc.ca/services/geoname/en/features/0cfaf0b0849c20c3c4940e67299b33ab",
      },
    },
  },

  category: "O",
  status: {
    code: "official",

    links: {
      self: {
        href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
      },
    },
  },
  concise: {
    code: "CITY",

    links: {
      self: {
        href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
      },
    },
  },
  generic: {
    code: "1",

    links: {
      self: {
        href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
      },
    },
  },
  location: "New Westminster Land District",
  province: {
    code: "59",

    links: {
      self: {
        href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
      },
    },
  },
  latitude: 49.320556,
  longitude: -123.073889,
  map: ["092G06", "092G00"],
  relevance: 1000000,
  bbox: [-123.108598, 49.2904398, -123.0317137, 49.3426084],
  accuracy: 100,
  position: { type: "Point", coordinates: [-123.073889, 49.320556] },

  distance: 17.359269522568212,
  azimuth: 15.27624724284455,

  decision: "1937-12-07",
},
{
  id: "JBFRV",
  links: {
    self: {
      href: "https://geogratis.gc.ca/services/geoname/en/geonames/JBFRV",
    },
    feature: {
      href: "https://geogratis.gc.ca/services/geoname/en/features/0cfaf0b0849c20c3c4940e67299b33ab",
    },
    language: {
      href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
    },
    status: {
      href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
    },
    concise: {
      href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
    },
    generic: {
      href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
    },
    province: {
      href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
    },
  },
  name: "Observatory2",

  language: {
    code: "und",

    links: {
      self: {
        href: "https://geogratis.gc.ca/services/geoname/en/codes/language/und",
      },
    },
  },
  feature: {
    id: "0cfaf0b0849c20c3c4940e67299b33ab",

    links: {
      self: {
        href: "https://geogratis.gc.ca/services/geoname/en/features/0cfaf0b0849c20c3c4940e67299b33ab",
      },
    },
  },

  category: "O",
  status: {
    code: "official",

    links: {
      self: {
        href: "https://geogratis.gc.ca/services/geoname/en/codes/status/official",
      },
    },
  },
  concise: {
    code: "CITY",

    links: {
      self: {
        href: "https://geogratis.gc.ca/services/geoname/en/codes/concise/CITY",
      },
    },
  },
  generic: {
    code: "1",

    links: {
      self: {
        href: "https://geogratis.gc.ca/services/geoname/en/codes/generic/1",
      },
    },
  },
  location: "New Westminster Land District",
  province: {
    code: "59",

    links: {
      self: {
        href: "https://geogratis.gc.ca/services/geoname/en/codes/province/59",
      },
    },
  },
  latitude: 49.320556,
  longitude: -123.073889,
  map: ["092G06", "092G00"],
  relevance: 1000000,
  bbox: [-123.108598, 49.2904398, -123.0317137, 49.3426084],
  accuracy: 100,
  position: { type: "Point", coordinates: [-123.073889, 49.320556] },

  distance: 17.359269522568212,
  azimuth: 15.27624724284455,

  decision: "1937-12-07",
},
    ],
  },
};



const onGeogratisAPIFailWithEmptyList = {
  data: {}
}

const onWeatherAPISuccess = {
    data: {
        location: {
        name: "Vancouver",
        region: "British Columbia",
        country: "Canada",
        lat: 49.16,
        lon: -123.16,
        tz_id: "America/Vancouver",
        localtime_epoch: 1701299822,
        localtime: "2023-11-29 15:17"
        },
        current: {
        last_updated_epoch: 1701299700,
        last_updated: "2023-11-29 15:15",
        temp_c: 5,
        temp_f: 41,
        is_day: 1,
        condition: {
        text: "Partly cloudy",
        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
        code: 1003
        },
        wind_mph: 3.8,
        wind_kph: 6.1,
        wind_degree: 300,
        wind_dir: "WNW",
        pressure_mb: 1019,
        pressure_in: 30.09,
        precip_mm: 0,
        precip_in: 0,
        humidity: 81,
        cloud: 50,
        feelslike_c: 3.7,
        feelslike_f: 38.6,
        vis_km: 48,
        vis_miles: 29,
        uv: 1,
        gust_mph: 4.9,
        gust_kph: 8
        },
        forecast: {
                forecastday: [
                                {
                                    date: "2023-11-29",
                                    date_epoch: 1701216000,
                                    day: {
                                            maxtemp_c: 4,
                                            maxtemp_f: 39.2,
                                            mintemp_c: 1.9,
                                            mintemp_f: 35.4,
                                            avgtemp_c: 2.9,
                                            avgtemp_f: 37.2,
                                            maxwind_mph: 4.5,
                                            maxwind_kph: 7.2,
                                            totalprecip_mm: 0,
                                            totalprecip_in: 0,
                                            totalsnow_cm: 0,
                                            avgvis_km: 10,
                                            avgvis_miles: 6,
                                            avghumidity: 97,
                                            daily_will_it_rain: 0,
                                            daily_chance_of_rain: 0,
                                            daily_will_it_snow: 0,
                                            daily_chance_of_snow: 0,
                                            condition: {
                                            text: "Mist",
                                            icon: "//cdn.weatherapi.com/weather/64x64/day/143.png",
                                            code: 1030
                                    },
                                    uv: 1
                                    },
                                    astro: {
                                    sunrise: "07:44 AM",
                                    sunset: "04:18 PM",
                                    moonrise: "05:53 PM",
                                    moonset: "10:40 AM",
                                    moon_phase: "Waning Gibbous",
                                    moon_illumination: 97,
                                    is_moon_up: 0,
                                    is_sun_up: 1
                                    },
                                    hour: [
                                            {
                                                time_epoch: 1701244800,
                                                time: "2023-11-29 00:00",
                                                temp_c: 3.4,
                                                temp_f: 38.1,
                                                is_day: 0,
                                                condition: {
                                                    text: "Fog",
                                                    icon: "//cdn.weatherapi.com/weather/64x64/night/248.png",
                                                    code: 1135
                                            },
                                    wind_mph: 2,
                                    wind_kph: 3.2,
                                    wind_degree: 26,
                                    wind_dir: "NNE",
                                    pressure_mb: 1021,
                                    pressure_in: 30.15,
                                    precip_mm: 0,
                                    precip_in: 0,
                                    humidity: 97,
                                    cloud: 100,
                                    feelslike_c: 2.3,
                                    feelslike_f: 36.1,
                                    windchill_c: 2.3,
                                    windchill_f: 36.1,
                                    heatindex_c: 3.4,
                                    heatindex_f: 38.1,
                                    dewpoint_c: 3,
                                    dewpoint_f: 37.4,
                                    will_it_rain: 0,
                                    chance_of_rain: 0,
                                    will_it_snow: 0,
                                    chance_of_snow: 0,
                                    vis_km: 10,
                                    vis_miles: 6,
                                    gust_mph: 3.3,
                                    gust_kph: 5.3,
                                    uv: 1
                                    },

                                    ]
                                    },
                                    {
                                    date: "2023-11-30",
                                    date_epoch: 1701302400,
                                    day: {
                                            maxtemp_c: 7.1,
                                            maxtemp_f: 44.7,
                                            mintemp_c: 1.2,
                                            mintemp_f: 34.2,
                                            avgtemp_c: 3.9,
                                            avgtemp_f: 39.1,
                                            maxwind_mph: 12.5,
                                            maxwind_kph: 20.2,
                                            totalprecip_mm: 5.13,
                                            totalprecip_in: 0.2,
                                            totalsnow_cm: 0,
                                            avgvis_km: 8.5,
                                            avgvis_miles: 5,
                                            avghumidity: 82,
                                            daily_will_it_rain: 1,
                                            daily_chance_of_rain: 83,
                                            daily_will_it_snow: 0,
                                            daily_chance_of_snow: 0,
                                            condition: {
                                            text: "Moderate rain",
                                            icon: "//cdn.weatherapi.com/weather/64x64/day/302.png",
                                            code: 1189
                                    },
                                    uv: 1
                                    },
                                    astro: {
                                    sunrise: "07:45 AM",
                                    sunset: "04:17 PM",
                                    moonrise: "06:58 PM",
                                    moonset: "11:27 AM",
                                    moon_phase: "Waning Gibbous",
                                    moon_illumination: 92,
                                    is_moon_up: 0,
                                    is_sun_up: 1
                                    },
                                    hour: [
                                            {
                                            time_epoch: 1701331200,
                                            time: "2023-11-30 00:00",
                                            temp_c: 3.3,
                                            temp_f: 38,
                                            is_day: 0,
                                            condition: {
                                                        text: "Clear",
                                                        icon: "//cdn.weatherapi.com/weather/64x64/night/113.png",
                                                        code: 1000
                                            },
                                    wind_mph: 5.1,
                                    wind_kph: 8.3,
                                    wind_degree: 100,
                                    wind_dir: "E",
                                    pressure_mb: 1016,
                                    pressure_in: 30,
                                    precip_mm: 0,
                                    precip_in: 0,
                                    humidity: 80,
                                    cloud: 55,
                                    feelslike_c: 1.1,
                                    feelslike_f: 34,
                                    windchill_c: 1.1,
                                    windchill_f: 34,
                                    heatindex_c: 3.3,
                                    heatindex_f: 38,
                                    dewpoint_c: 0.3,
                                    dewpoint_f: 32.5,
                                    will_it_rain: 0,
                                    chance_of_rain: 0,
                                    will_it_snow: 0,
                                    chance_of_snow: 0,
                                    vis_km: 10,
                                    vis_miles: 6,
                                    gust_mph: 8.4,
                                    gust_kph: 13.5,
                                    uv: 1
                                    },

                                    ]
                                    },
                                    {
                                    date: "2023-12-01",
                                    date_epoch: 1701388800,
                                    day: {
                                    maxtemp_c: 5,
                                    maxtemp_f: 41,
                                    mintemp_c: 3.6,
                                    mintemp_f: 38.5,
                                    avgtemp_c: 4.5,
                                    avgtemp_f: 40.1,
                                    maxwind_mph: 20.1,
                                    maxwind_kph: 32.4,
                                    totalprecip_mm: 40.41,
                                    totalprecip_in: 1.59,
                                    totalsnow_cm: 0,
                                    avgvis_km: 8,
                                    avgvis_miles: 4,
                                    avghumidity: 93,
                                    daily_will_it_rain: 1,
                                    daily_chance_of_rain: 86,
                                    daily_will_it_snow: 0,
                                    daily_chance_of_snow: 0,
                                    condition: {
                                    text: "Heavy rain",
                                    icon: "//cdn.weatherapi.com/weather/64x64/day/308.png",
                                    code: 1195
                                    },
                                    uv: 1
                                    },
                                    astro: {
                                    sunrise: "07:46 AM",
                                    sunset: "04:17 PM",
                                    moonrise: "08:09 PM",
                                    moonset: "12:01 PM",
                                    moon_phase: "Waning Gibbous",
                                    moon_illumination: 86,
                                    is_moon_up: 0,
                                    is_sun_up: 1
                                    },
                                    hour: [
                                            {
                                            time_epoch: 1701417600,
                                            time: "2023-12-01 00:00",
                                            temp_c: 5.2,
                                            temp_f: 41.3,
                                            is_day: 0,
                                            condition: {
                                                        text: "Light drizzle",
                                                        icon: "//cdn.weatherapi.com/weather/64x64/night/266.png",
                                                        code: 1153
                                            },
                                    wind_mph: 12.1,
                                    wind_kph: 19.4,
                                    wind_degree: 141,
                                    wind_dir: "SE",
                                    pressure_mb: 1008,
                                    pressure_in: 29.78,
                                    precip_mm: 0.64,
                                    precip_in: 0.03,
                                    humidity: 90,
                                    cloud: 100,
                                    feelslike_c: 1.4,
                                    feelslike_f: 34.5,
                                    windchill_c: 1.4,
                                    windchill_f: 34.5,
                                    heatindex_c: 5.2,
                                    heatindex_f: 41.3,
                                    dewpoint_c: 3.7,
                                    dewpoint_f: 38.7,
                                    will_it_rain: 1,
                                    chance_of_rain: 81,
                                    will_it_snow: 0,
                                    chance_of_snow: 0,
                                    vis_km: 2,
                                    vis_miles: 1,
                                    gust_mph: 16.5,
                                    gust_kph: 26.6,
                                    uv: 1
                                    },

                                ]
                                },
                                {
                                date: "2023-12-02",
                                date_epoch: 1701475200,
                                day: {
                                maxtemp_c: 6.3,
                                maxtemp_f: 43.4,
                                mintemp_c: 4.8,
                                mintemp_f: 40.7,
                                avgtemp_c: 5.6,
                                avgtemp_f: 42,
                                maxwind_mph: 20.6,
                                maxwind_kph: 33.1,
                                totalprecip_mm: 9.98,
                                totalprecip_in: 0.39,
                                totalsnow_cm: 0,
                                avgvis_km: 9.8,
                                avgvis_miles: 6,
                                avghumidity: 85,
                                daily_will_it_rain: 1,
                                daily_chance_of_rain: 88,
                                daily_will_it_snow: 0,
                                daily_chance_of_snow: 0,
                                condition: {
                                text: "Moderate rain",
                                icon: "//cdn.weatherapi.com/weather/64x64/day/302.png",
                                code: 1189
                                },
                                uv: 2
                                },
                                astro: {
                                sunrise: "07:48 AM",
                                sunset: "04:16 PM",
                                moonrise: "09:20 PM",
                                moonset: "12:25 PM",
                                moon_phase: "Waning Gibbous",
                                moon_illumination: 79,
                                is_moon_up: 0,
                                is_sun_up: 1
                                },
                                hour: [
                                        {
                                        time_epoch: 1701504000,
                                        time: "2023-12-02 00:00",
                                        temp_c: 5.5,
                                        temp_f: 41.9,
                                        is_day: 0,
                                        condition: {
                                        text: "Thundery outbreaks possible",
                                        icon: "//cdn.weatherapi.com/weather/64x64/night/200.png",
                                        code: 1087
                                        },
                                wind_mph: 21.3,
                                wind_kph: 34.2,
                                wind_degree: 143,
                                wind_dir: "SE",
                                pressure_mb: 1005,
                                pressure_in: 29.69,
                                precip_mm: 1.13,
                                precip_in: 0.04,
                                humidity: 89,
                                cloud: 100,
                                feelslike_c: 0.4,
                                feelslike_f: 32.7,
                                windchill_c: 0.4,
                                windchill_f: 32.7,
                                heatindex_c: 5.5,
                                heatindex_f: 41.9,
                                dewpoint_c: 3.8,
                                dewpoint_f: 38.8,
                                will_it_rain: 1,
                                chance_of_rain: 77,
                                will_it_snow: 0,
                                chance_of_snow: 0,
                                vis_km: 9,
                                vis_miles: 5,
                                gust_mph: 31,
                                gust_kph: 49.9,
                                uv: 1
                                },

                                ]
                                },
                                {
                                date: "2023-12-03",
                                date_epoch: 1701561600,
                                day: {
                                maxtemp_c: 6.7,
                                maxtemp_f: 44,
                                mintemp_c: 5.2,
                                mintemp_f: 41.3,
                                avgtemp_c: 5.8,
                                avgtemp_f: 42.5,
                                maxwind_mph: 9.2,
                                maxwind_kph: 14.8,
                                totalprecip_mm: 1.47,
                                totalprecip_in: 0.06,
                                totalsnow_cm: 0,
                                avgvis_km: 8.8,
                                avgvis_miles: 5,
                                avghumidity: 83,
                                daily_will_it_rain: 1,
                                daily_chance_of_rain: 89,
                                daily_will_it_snow: 0,
                                daily_chance_of_snow: 0,
                                condition: {
                                text: "Patchy rain possible",
                                icon: "//cdn.weatherapi.com/weather/64x64/day/176.png",
                                code: 1063
                                },
                                uv: 2
                                },
                                astro: {
                                sunrise: "07:49 AM",
                                sunset: "04:16 PM",
                                moonrise: "10:30 PM",
                                moonset: "12:45 PM",
                                moon_phase: "Waning Gibbous",
                                moon_illumination: 71,
                                is_moon_up: 0,
                                is_sun_up: 1
                                },
                                hour: [
                                        {
                                        time_epoch: 1701590400,
                                        time: "2023-12-03 00:00",
                                        temp_c: 5.3,
                                        temp_f: 41.5,
                                        is_day: 0,
                                        condition: {
                                                    text: "Patchy freezing drizzle possible",
                                                    icon: "//cdn.weatherapi.com/weather/64x64/night/185.png",
                                                    code: 1072
                                        },
                                wind_mph: 9.6,
                                wind_kph: 15.5,
                                wind_degree: 48,
                                wind_dir: "NE",
                                pressure_mb: 1008,
                                pressure_in: 29.77,
                                precip_mm: 0.71,
                                precip_in: 0.03,
                                humidity: 92,
                                cloud: 100,
                                feelslike_c: 2,
                                feelslike_f: 35.6,
                                windchill_c: 2,
                                windchill_f: 35.6,
                                heatindex_c: 5.3,
                                heatindex_f: 41.5,
                                dewpoint_c: 4.1,
                                dewpoint_f: 39.3,
                                will_it_rain: 0,
                                chance_of_rain: 68,
                                will_it_snow: 0,
                                chance_of_snow: 0,
                                vis_km: 2,
                                vis_miles: 1,
                                gust_mph: 14.5,
                                gust_kph: 23.4,
                                uv: 1
                                },
                                ]
                                },
                                {
                                date: "2023-12-04",
                                date_epoch: 1701648000,
                                day: {
                                maxtemp_c: 8.7,
                                maxtemp_f: 47.7,
                                mintemp_c: 7.6,
                                mintemp_f: 45.7,
                                avgtemp_c: 8.3,
                                avgtemp_f: 47,
                                maxwind_mph: 9.2,
                                maxwind_kph: 14.8,
                                totalprecip_mm: 9.81,
                                totalprecip_in: 0.39,
                                totalsnow_cm: 0,
                                avgvis_km: 6.1,
                                avgvis_miles: 3,
                                avghumidity: 96,
                                daily_will_it_rain: 1,
                                daily_chance_of_rain: 74,
                                daily_will_it_snow: 0,
                                daily_chance_of_snow: 0,
                                condition: {
                                text: "Moderate rain",
                                icon: "//cdn.weatherapi.com/weather/64x64/day/302.png",
                                code: 1189
                                },
                                uv: 2
                                },
                                astro: {
                                sunrise: "07:50 AM",
                                sunset: "04:16 PM",
                                moonrise: "11:39 PM",
                                moonset: "01:00 PM",
                                moon_phase: "Waning Gibbous",
                                moon_illumination: 62,
                                is_moon_up: 0,
                                is_sun_up: 1
                                },
                                hour: [
                                {
                                time_epoch: 1701676800,
                                time: "2023-12-04 00:00",
                                temp_c: 8.7,
                                temp_f: 47.7,
                                is_day: 0,
                                condition: {
                                            text: "Torrential rain shower",
                                            icon: "//cdn.weatherapi.com/weather/64x64/night/359.png",
                                            code: 1246
                                },
                                wind_mph: 18.3,
                                wind_kph: 29.5,
                                wind_degree: 238,
                                wind_dir: "WSW",
                                pressure_mb: 1009,
                                pressure_in: 29.79,
                                precip_mm: 0,
                                precip_in: 0,
                                humidity: 77,
                                cloud: 25,
                                feelslike_c: 5,
                                feelslike_f: 40.9,
                                windchill_c: 5,
                                windchill_f: 40.9,
                                heatindex_c: 8.8,
                                heatindex_f: 47.8,
                                dewpoint_c: 5,
                                dewpoint_f: 41,
                                will_it_rain: 0,
                                chance_of_rain: 0,
                                will_it_snow: 0,
                                chance_of_snow: 0,
                                vis_km: 10,
                                vis_miles: 6,
                                gust_mph: 31.4,
                                gust_kph: 50.5,
                                uv: 1
                                },

                                ]
                                }
                ]
        },
    },
}

const onWeatherAPISuccessWithSameConditionScore = {
    data: {
        location: {
        name: "Vancouver",
        region: "British Columbia",
        country: "Canada",
        lat: 49.16,
        lon: -123.16,
        tz_id: "America/Vancouver",
        localtime_epoch: 1701299822,
        localtime: "2023-11-29 15:17"
        },
        current: {
        last_updated_epoch: 1701299700,
        last_updated: "2023-11-29 15:15",
        temp_c: 5,
        temp_f: 41,
        is_day: 1,
        condition: {
        text: "Partly cloudy",
        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
        code: 1003
        },
        wind_mph: 3.8,
        wind_kph: 6.1,
        wind_degree: 300,
        wind_dir: "WNW",
        pressure_mb: 1019,
        pressure_in: 30.09,
        precip_mm: 0,
        precip_in: 0,
        humidity: 81,
        cloud: 50,
        feelslike_c: 3.7,
        feelslike_f: 38.6,
        vis_km: 48,
        vis_miles: 29,
        uv: 1,
        gust_mph: 4.9,
        gust_kph: 8
        },
        forecast: {
                forecastday: [
                                {
                                    date: "2023-11-29",
                                    date_epoch: 1701216000,
                                    day: {
                                    maxtemp_c: 4,
                                    maxtemp_f: 39.2,
                                    mintemp_c: 1.9,
                                    mintemp_f: 35.4,
                                    avgtemp_c: 2.9,
                                    avgtemp_f: 37.2,
                                    maxwind_mph: 4.5,
                                    maxwind_kph: 7.2,
                                    totalprecip_mm: 0,
                                    totalprecip_in: 0,
                                    totalsnow_cm: 0,
                                    avgvis_km: 10,
                                    avgvis_miles: 6,
                                    avghumidity: 97,
                                    daily_will_it_rain: 0,
                                    daily_chance_of_rain: 0,
                                    daily_will_it_snow: 0,
                                    daily_chance_of_snow: 0,
                                    condition: {
                                    text: "Mist",
                                    icon: "//cdn.weatherapi.com/weather/64x64/day/143.png",
                                    code: 1030
                                    },
                                    uv: 1
                                    },
                                    astro: {
                                    sunrise: "07:44 AM",
                                    sunset: "04:18 PM",
                                    moonrise: "05:53 PM",
                                    moonset: "10:40 AM",
                                    moon_phase: "Waning Gibbous",
                                    moon_illumination: 97,
                                    is_moon_up: 0,
                                    is_sun_up: 1
                                    },
                                    hour: [
                                            {
                                            time_epoch: 1701244800,
                                            time: "2023-11-29 00:00",
                                            temp_c: 3.4,
                                            temp_f: 38.1,
                                            is_day: 0,
                                            condition: {
                                                        text: "Partly cloudy",
                                                        icon: "//cdn.weatherapi.com/weather/64x64/night/116.png",
                                                        code: 1003
                                            },
                                    wind_mph: 2,
                                    wind_kph: 3.2,
                                    wind_degree: 26,
                                    wind_dir: "NNE",
                                    pressure_mb: 1021,
                                    pressure_in: 30.15,
                                    precip_mm: 0,
                                    precip_in: 0,
                                    humidity: 97,
                                    cloud: 100,
                                    feelslike_c: 2.3,
                                    feelslike_f: 36.1,
                                    windchill_c: 2.3,
                                    windchill_f: 36.1,
                                    heatindex_c: 3.4,
                                    heatindex_f: 38.1,
                                    dewpoint_c: 3,
                                    dewpoint_f: 37.4,
                                    will_it_rain: 0,
                                    chance_of_rain: 0,
                                    will_it_snow: 0,
                                    chance_of_snow: 0,
                                    vis_km: 10,
                                    vis_miles: 6,
                                    gust_mph: 3.3,
                                    gust_kph: 5.3,
                                    uv: 1
                                    },

                                    ]
                                    },
                                    {
                                    date: "2023-11-30",
                                    date_epoch: 1701302400,
                                    day: {
                                    maxtemp_c: 7.1,
                                    maxtemp_f: 44.7,
                                    mintemp_c: 1.2,
                                    mintemp_f: 34.2,
                                    avgtemp_c: 3.9,
                                    avgtemp_f: 39.1,
                                    maxwind_mph: 12.5,
                                    maxwind_kph: 20.2,
                                    totalprecip_mm: 5.13,
                                    totalprecip_in: 0.2,
                                    totalsnow_cm: 0,
                                    avgvis_km: 8.5,
                                    avgvis_miles: 5,
                                    avghumidity: 82,
                                    daily_will_it_rain: 1,
                                    daily_chance_of_rain: 83,
                                    daily_will_it_snow: 0,
                                    daily_chance_of_snow: 0,
                                    condition: {
                                    text: "Moderate rain",
                                    icon: "//cdn.weatherapi.com/weather/64x64/day/302.png",
                                    code: 1189
                                    },
                                    uv: 1
                                    },
                                    astro: {
                                    sunrise: "07:45 AM",
                                    sunset: "04:17 PM",
                                    moonrise: "06:58 PM",
                                    moonset: "11:27 AM",
                                    moon_phase: "Waning Gibbous",
                                    moon_illumination: 92,
                                    is_moon_up: 0,
                                    is_sun_up: 1
                                    },
                                    hour: [
                                            {
                                            time_epoch: 1701331200,
                                            time: "2023-11-30 00:00",
                                            temp_c: 3.3,
                                            temp_f: 38,
                                            is_day: 0,
                                            condition: {
                                                        text: "Partly cloudy",
                                                        icon: "//cdn.weatherapi.com/weather/64x64/night/116.png",
                                                        code: 1003
                                            },
                                    wind_mph: 5.1,
                                    wind_kph: 8.3,
                                    wind_degree: 100,
                                    wind_dir: "E",
                                    pressure_mb: 1016,
                                    pressure_in: 30,
                                    precip_mm: 0,
                                    precip_in: 0,
                                    humidity: 80,
                                    cloud: 55,
                                    feelslike_c: 1.1,
                                    feelslike_f: 34,
                                    windchill_c: 1.1,
                                    windchill_f: 34,
                                    heatindex_c: 3.3,
                                    heatindex_f: 38,
                                    dewpoint_c: 0.3,
                                    dewpoint_f: 32.5,
                                    will_it_rain: 0,
                                    chance_of_rain: 0,
                                    will_it_snow: 0,
                                    chance_of_snow: 0,
                                    vis_km: 10,
                                    vis_miles: 6,
                                    gust_mph: 8.4,
                                    gust_kph: 13.5,
                                    uv: 1
                                    },

                                    ]
                                    },
                                    {
                                    date: "2023-12-01",
                                    date_epoch: 1701388800,
                                    day: {
                                    maxtemp_c: 5,
                                    maxtemp_f: 41,
                                    mintemp_c: 3.6,
                                    mintemp_f: 38.5,
                                    avgtemp_c: 4.5,
                                    avgtemp_f: 40.1,
                                    maxwind_mph: 20.1,
                                    maxwind_kph: 32.4,
                                    totalprecip_mm: 40.41,
                                    totalprecip_in: 1.59,
                                    totalsnow_cm: 0,
                                    avgvis_km: 8,
                                    avgvis_miles: 4,
                                    avghumidity: 93,
                                    daily_will_it_rain: 1,
                                    daily_chance_of_rain: 86,
                                    daily_will_it_snow: 0,
                                    daily_chance_of_snow: 0,
                                    condition: {
                                    text: "Heavy rain",
                                    icon: "//cdn.weatherapi.com/weather/64x64/day/308.png",
                                    code: 1195
                                    },
                                    uv: 1
                                    },
                                    astro: {
                                    sunrise: "07:46 AM",
                                    sunset: "04:17 PM",
                                    moonrise: "08:09 PM",
                                    moonset: "12:01 PM",
                                    moon_phase: "Waning Gibbous",
                                    moon_illumination: 86,
                                    is_moon_up: 0,
                                    is_sun_up: 1
                                    },
                                    hour: [
                                            {
                                            time_epoch: 1701417600,
                                            time: "2023-12-01 00:00",
                                            temp_c: 5.2,
                                            temp_f: 41.3,
                                            is_day: 0,
                                            condition: {
                                                        text: "Mist",
                                                        icon: "//cdn.weatherapi.com/weather/64x64/night/143.png",
                                                        code: 1030
                                            },
                                    wind_mph: 12.1,
                                    wind_kph: 19.4,
                                    wind_degree: 141,
                                    wind_dir: "SE",
                                    pressure_mb: 1008,
                                    pressure_in: 29.78,
                                    precip_mm: 0.64,
                                    precip_in: 0.03,
                                    humidity: 90,
                                    cloud: 100,
                                    feelslike_c: 1.4,
                                    feelslike_f: 34.5,
                                    windchill_c: 1.4,
                                    windchill_f: 34.5,
                                    heatindex_c: 5.2,
                                    heatindex_f: 41.3,
                                    dewpoint_c: 3.7,
                                    dewpoint_f: 38.7,
                                    will_it_rain: 1,
                                    chance_of_rain: 81,
                                    will_it_snow: 0,
                                    chance_of_snow: 0,
                                    vis_km: 2,
                                    vis_miles: 1,
                                    gust_mph: 16.5,
                                    gust_kph: 26.6,
                                    uv: 1
                                    },

                                ]
                },
                ]
        },
    },
}

//const onWeatherAPISuccessWithBadWeather = {
//    data: {
//        location: {
//        name: "Vancouver",
//        region: "British Columbia",
//        country: "Canada",
//        lat: 49.16,
//        lon: -123.16,
//        tz_id: "America/Vancouver",
//        localtime_epoch: 1701299822,
//        localtime: "2023-11-29 15:17"
//        },
//        current: {
//        last_updated_epoch: 1701299700,
//        last_updated: "2023-11-29 15:15",
//        temp_c: 5,
//        temp_f: 41,
//        is_day: 1,
//        condition: {
//        text: "Moderate or heavy snow with thunder",
//        icon: "//cdn.weatherapi.com/weather/64x64/day/395.png",
//        code: 1282
//        },
//        wind_mph: 3.8,
//        wind_kph: 6.1,
//        wind_degree: 300,
//        wind_dir: "WNW",
//        pressure_mb: 1019,
//        pressure_in: 30.09,
//        precip_mm: 0,
//        precip_in: 0,
//        humidity: 81,
//        cloud: 50,
//        feelslike_c: 3.7,
//        feelslike_f: 38.6,
//        vis_km: 48,
//        vis_miles: 29,
//        uv: 1,
//        gust_mph: 4.9,
//        gust_kph: 8
//        },
//        forecast: {
//                forecastday: [
//                                {
//                                    date: "2023-11-29",
//                                    date_epoch: 1701216000,
//                                    day: {
//                                    maxtemp_c: 4,
//                                    maxtemp_f: 39.2,
//                                    mintemp_c: 1.9,
//                                    mintemp_f: 35.4,
//                                    avgtemp_c: 2.9,
//                                    avgtemp_f: 37.2,
//                                    maxwind_mph: 4.5,
//                                    maxwind_kph: 7.2,
//                                    totalprecip_mm: 0,
//                                    totalprecip_in: 0,
//                                    totalsnow_cm: 0,
//                                    avgvis_km: 10,
//                                    avgvis_miles: 6,
//                                    avghumidity: 97,
//                                    daily_will_it_rain: 0,
//                                    daily_chance_of_rain: 0,
//                                    daily_will_it_snow: 0,
//                                    daily_chance_of_snow: 0,
//                                    condition: {
//                                            text: "Moderate or heavy snow with thunder",
//                                            icon: "//cdn.weatherapi.com/weather/64x64/day/395.png",
//                                            code: 1282
//                                    },
//                                    uv: 1
//                                    },
//                                    astro: {
//                                    sunrise: "07:44 AM",
//                                    sunset: "04:18 PM",
//                                    moonrise: "05:53 PM",
//                                    moonset: "10:40 AM",
//                                    moon_phase: "Waning Gibbous",
//                                    moon_illumination: 97,
//                                    is_moon_up: 0,
//                                    is_sun_up: 1
//                                    },
//                                    hour: [
//                                            {
//                                            time_epoch: 1701244800,
//                                            time: "2023-11-29 00:00",
//                                            temp_c: 3.4,
//                                            temp_f: 38.1,
//                                            is_day: 0,
//                                            condition: {
//                                                        text: "Moderate or heavy snow with thunder",
//                                                        icon: "//cdn.weatherapi.com/weather/64x64/day/395.png",
//                                                        code: 1282
//                                            },
//                                    wind_mph: 2,
//                                    wind_kph: 3.2,
//                                    wind_degree: 26,
//                                    wind_dir: "NNE",
//                                    pressure_mb: 1021,
//                                    pressure_in: 30.15,
//                                    precip_mm: 0,
//                                    precip_in: 0,
//                                    humidity: 97,
//                                    cloud: 100,
//                                    feelslike_c: 2.3,
//                                    feelslike_f: 36.1,
//                                    windchill_c: 2.3,
//                                    windchill_f: 36.1,
//                                    heatindex_c: 3.4,
//                                    heatindex_f: 38.1,
//                                    dewpoint_c: 3,
//                                    dewpoint_f: 37.4,
//                                    will_it_rain: 0,
//                                    chance_of_rain: 0,
//                                    will_it_snow: 0,
//                                    chance_of_snow: 0,
//                                    vis_km: 10,
//                                    vis_miles: 6,
//                                    gust_mph: 3.3,
//                                    gust_kph: 5.3,
//                                    uv: 1
//                                    },
//
//                                    ]
//                                    },
//                                    {
//                                    date: "2023-11-30",
//                                    date_epoch: 1701302400,
//                                    day: {
//                                    maxtemp_c: 7.1,
//                                    maxtemp_f: 44.7,
//                                    mintemp_c: 1.2,
//                                    mintemp_f: 34.2,
//                                    avgtemp_c: 3.9,
//                                    avgtemp_f: 39.1,
//                                    maxwind_mph: 12.5,
//                                    maxwind_kph: 20.2,
//                                    totalprecip_mm: 5.13,
//                                    totalprecip_in: 0.2,
//                                    totalsnow_cm: 0,
//                                    avgvis_km: 8.5,
//                                    avgvis_miles: 5,
//                                    avghumidity: 82,
//                                    daily_will_it_rain: 1,
//                                    daily_chance_of_rain: 83,
//                                    daily_will_it_snow: 0,
//                                    daily_chance_of_snow: 0,
//                                    condition: {
//                                    text: "Moderate or heavy snow with thunder",
//                                    icon: "//cdn.weatherapi.com/weather/64x64/day/395.png",
//                                    code: 1282
//                                    },
//                                    uv: 1
//                                    },
//                                    astro: {
//                                    sunrise: "07:45 AM",
//                                    sunset: "04:17 PM",
//                                    moonrise: "06:58 PM",
//                                    moonset: "11:27 AM",
//                                    moon_phase: "Waning Gibbous",
//                                    moon_illumination: 92,
//                                    is_moon_up: 0,
//                                    is_sun_up: 1
//                                    },
//                                    hour: [
//                                            {
//                                            time_epoch: 1701331200,
//                                            time: "2023-11-30 00:00",
//                                            temp_c: 3.3,
//                                            temp_f: 38,
//                                            is_day: 0,
//                                            condition: {
//                                                        text: "Moderate or heavy snow with thunder",
//                                                        icon: "//cdn.weatherapi.com/weather/64x64/day/395.png",
//                                                        code: 1282
//                                            },
//                                    wind_mph: 5.1,
//                                    wind_kph: 8.3,
//                                    wind_degree: 100,
//                                    wind_dir: "E",
//                                    pressure_mb: 1016,
//                                    pressure_in: 30,
//                                    precip_mm: 0,
//                                    precip_in: 0,
//                                    humidity: 80,
//                                    cloud: 55,
//                                    feelslike_c: 1.1,
//                                    feelslike_f: 34,
//                                    windchill_c: 1.1,
//                                    windchill_f: 34,
//                                    heatindex_c: 3.3,
//                                    heatindex_f: 38,
//                                    dewpoint_c: 0.3,
//                                    dewpoint_f: 32.5,
//                                    will_it_rain: 0,
//                                    chance_of_rain: 0,
//                                    will_it_snow: 0,
//                                    chance_of_snow: 0,
//                                    vis_km: 10,
//                                    vis_miles: 6,
//                                    gust_mph: 8.4,
//                                    gust_kph: 13.5,
//                                    uv: 1
//                                    },
//
//                                    ]
//                                    },
//                                    {
//                                    date: "2023-12-01",
//                                    date_epoch: 1701388800,
//                                    day: {
//                                    maxtemp_c: 5,
//                                    maxtemp_f: 41,
//                                    mintemp_c: 3.6,
//                                    mintemp_f: 38.5,
//                                    avgtemp_c: 4.5,
//                                    avgtemp_f: 40.1,
//                                    maxwind_mph: 20.1,
//                                    maxwind_kph: 32.4,
//                                    totalprecip_mm: 40.41,
//                                    totalprecip_in: 1.59,
//                                    totalsnow_cm: 0,
//                                    avgvis_km: 8,
//                                    avgvis_miles: 4,
//                                    avghumidity: 93,
//                                    daily_will_it_rain: 1,
//                                    daily_chance_of_rain: 86,
//                                    daily_will_it_snow: 0,
//                                    daily_chance_of_snow: 0,
//                                    condition: {
//                                    text: "Moderate or heavy snow with thunder",
//                                    icon: "//cdn.weatherapi.com/weather/64x64/day/395.png",
//                                    code: 1282
//                                    },
//                                    uv: 1
//                                    },
//                                    astro: {
//                                    sunrise: "07:46 AM",
//                                    sunset: "04:17 PM",
//                                    moonrise: "08:09 PM",
//                                    moonset: "12:01 PM",
//                                    moon_phase: "Waning Gibbous",
//                                    moon_illumination: 86,
//                                    is_moon_up: 0,
//                                    is_sun_up: 1
//                                    },
//                                    hour: [
//                                            {
//                                            time_epoch: 1701417600,
//                                            time: "2023-12-01 00:00",
//                                            temp_c: 5.2,
//                                            temp_f: 41.3,
//                                            is_day: 0,
//                                            condition: {
//                                                        text: "Moderate or heavy snow with thunder",
//                                                        icon: "//cdn.weatherapi.com/weather/64x64/day/395.png",
//                                                        code: 1282
//                                            },
//                                    wind_mph: 12.1,
//                                    wind_kph: 19.4,
//                                    wind_degree: 141,
//                                    wind_dir: "SE",
//                                    pressure_mb: 1008,
//                                    pressure_in: 29.78,
//                                    precip_mm: 0.64,
//                                    precip_in: 0.03,
//                                    humidity: 90,
//                                    cloud: 100,
//                                    feelslike_c: 1.4,
//                                    feelslike_f: 34.5,
//                                    windchill_c: 1.4,
//                                    windchill_f: 34.5,
//                                    heatindex_c: 5.2,
//                                    heatindex_f: 41.3,
//                                    dewpoint_c: 3.7,
//                                    dewpoint_f: 38.7,
//                                    will_it_rain: 1,
//                                    chance_of_rain: 81,
//                                    will_it_snow: 0,
//                                    chance_of_snow: 0,
//                                    vis_km: 2,
//                                    vis_miles: 1,
//                                    gust_mph: 16.5,
//                                    gust_kph: 26.6,
//                                    uv: 1
//                                    },
//
//                                ]
//                },
//                ]
//        },
//    },
//}



module.exports = {
  onIpInfoAPISuccess,
  onIpInfoAPIFailWithInvalidParameters,
  onIpInfoAPISuccessWithDifferentTimezone,
  onGeogratisAPISuccess,
  onGeogratisAPISuccessWithSameConditionScore,
  onGeogratisAPIFailWithEmptyList,
  onWeatherAPISuccess,
  onWeatherAPISuccessWithSameConditionScore
};