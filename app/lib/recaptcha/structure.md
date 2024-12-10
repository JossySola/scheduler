Request {
  method: 'POST',
  url: 'http://localhost:3000/api/signup',
  headers: Headers {
    accept: '*/*',
    'accept-encoding': 'gzip, deflate, br, zstd',
    'accept-language': 'en,es;q=0.9,fr;q=0.8',
    'cache-control': 'no-cache',
    connection: 'keep-alive',
    'content-length': '2165',
    'content-type': 'application/x-www-form-urlencoded',    
    cookie: 'authjs.csrf-token=fff4ee8d275fa9ae736cad496ea20e86f1be7ec1073e624c52d1f6318e3649a9%7Cb1227c198d6cf8ccb50f0ed1d42858ea6291436bd301d982bb499f04186aae27; authjs.callback-url=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fpage%3D1%26callbackUrl%3Dhttp%253A%252F%252Flocalhost%253A3000%252Fdashboard%252Finvoices%253Fpage%253D1',
    dnt: '1',
    host: 'localhost:3000',
    origin: 'http://localhost:3000',
    pragma: 'no-cache',
    referer: 'http://localhost:3000/signup',
    'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'x-forwarded-for': '::1',
    'x-forwarded-host': 'localhost:3000',
    'x-forwarded-port': '3000',
    'x-forwarded-proto': 'http'
  },
  destination: '',
  referrer: 'about:client',
  referrerPolicy: '',
  mode: 'cors',
  credentials: 'same-origin',
  cache: 'default',
  redirect: 'follow',
  integrity: '',
  keepalive: false,
  isReloadNavigation: false,
  isHistoryNavigation: false,
  signal: AbortSignal { aborted: false }
}


{
  success: true,
  challenge_ts: '2024-12-10T05:39:06Z',
  hostname: 'localhost',
  score: 0.9,
  action: 'signup'
}

{ success: false, 'error-codes': [ 'invalid-input-response' ] }

OnError {
  status: 408 | 400 | 401;
  statusText: string;
}

OnLowScore {
  success: boolean;
  message: string;
}

OnSuccess {
  success: boolean;
  message: string;
}