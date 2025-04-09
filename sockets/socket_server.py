import SocketServer
import json
import signal 
import sys

# get from robot
IP = '192.168.0.28'
PORT = 5555

class Track:
    def __init__(self, artist, song_name):
        self.artist = artist
        self.song_name = song_name

    def to_dict(self):
        return {
            "artist": self.artist,
            "song_name": self.song_name
        }

class EchoHandler(SocketServer.BaseRequestHandler):
    def handle(self):
        # Read the request data
        request_data = ''
        headers = ''
        body = ''
        while True:
            data = self.request.recv(1024)
            if not data:
                break
            
            headers += data.decode('utf-8')
            if '}' in data.decode('utf-8'):
                break
        
        print("split",headers.split('\r\n\r\n'))
        print("body", headers.split('\r\n\r\n')[1])
        headers, body = headers.split('\r\n\r\n')

        print("Request headers:", headers)
        print("Request body:", body)

        body_dict = json.loads(body)
        print("body_dict",body_dict)
        
        song_name = body_dict.get("song_name")
        artist = body_dict.get("artist")
        
        print("Track stripped: Artist: {}, Song Name: {}".format(artist, song_name))

        body = '{{ "artist": "{}", "song_name": "{}" }}'.format(artist, song_name)
        response = "HTTP/1.1 200 OK\r\n" \
                "Content-Type: application/json\r\n" \
                "Content-Length: {}\r\n" \
                "Connection: close\r\n" \
                "\r\n" \
                "{}".format(len(body), body)
        print("RESPONSE", response)

        self.request.sendall(response)
    
def shutdown(signal, frame):
    print("\nServer shutting down...")
    server.server_close()  # Close the server socket
    sys.exit(0)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, shutdown)
    server = SocketServer.TCPServer((IP, PORT), EchoHandler)
    print("Echo server started on {}:{}".format(IP,PORT))
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer interrupted by user")
        server.server_close()