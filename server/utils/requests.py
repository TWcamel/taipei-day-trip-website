import requests
import threading


class Threaded(threading.Thread):
    def __init__(self, url, method, headers, data):
        threading.Thread.__init__(self)
        self.url = url
        self.method = method
        self.headers = headers
        self.data = data

    def run(self):
        r = (
            requests.get(self.url, headers=self.headers, data=self.data)
            if self.method == "GET"
            else requests.post(self.url, headers=self.headers, data=self.data)
        )
        return r.json()
