import argparse
import json
from paste import httpserver
import webapp2

from datetime import datetime

from status import get_source_data_info
from utils import json_load


class MyServer(webapp2.RequestHandler):
    def returnJSON(self,j):
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(j, separators=(',',':')))

class SourceDataStatus(MyServer):
    def get(self):
        result = get_source_data_info()
        return self.returnJSON(result)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--listen',
                    help='host:port to listen on',
                    default='127.0.0.1:8084')
    args = parser.parse_args()
    host, port = args.listen.split(':')

    app = webapp2.WSGIApplication([
        ('/source_data_status', SourceDataStatus),
        ], debug=False)

    httpserver.serve(
        app,
        host=host,
        port=port,
        request_queue_size=128,
        use_threadpool=True,
        threadpool_workers=32,
    )
  
if __name__ == '__main__':
    main()
