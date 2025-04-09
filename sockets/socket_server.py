import socket
import SocketServer
import json

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

def start_server(host=IP, port=PORT):
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.bind((host, port))

    print("Server listening on {}:{}".format(host, port))


    while True:
        # Receive data from the client
        data, addr = server_socket.recvfrom(1024)
        print("Received data from {}: {}".format(addr, data))


        # Decode the data and process it
        try:
            track_data = json.loads(data.decode('utf-8'))
            track = Track(track_data['artist'], track_data['song_name'])

            print("Track received: Artist: {}, Song Name: {}".format(track.artist, track.song_name))
        except Exception as e:
            print("Error decoding track data: {}".format(e))
            server_socket.sendto(b"Invalid track data", addr)

# if __name__ == "__main__":
#     start_server()

class EchoHandler(SocketServer.BaseRequestHandler):
    def handle(self):
        # Read the request data
        request_data = self.request.recv(1024).strip()
        print("REQUEST DATA:", request_data)

        # Find the header-body separator \r\n\r\n
        headers_end = request_data.find("\r\n\r\n")
        if headers_end == -1:
            raise ValueError("No header-body separator found")

        headers_str = request_data[:headers_end]  # Extract headers
        body = request_data[headers_end + 4:]  # Extract body

        # Log headers and body for debugging
        print("Headers:", headers_str)
        print("Body:", body)

        # Check if the request method is POST and content type is JSON
        if "POST" in headers_str and "Content-Type: application/json" in headers_str:
                track_data = json.loads(body)

                print("Track received:", track_data)
                
                artist = track_data.get("artist", "").strip()
                song_name = track_data.get("song_name", "").strip()
                
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
    
if __name__ == "__main__":
    server = SocketServer.TCPServer((IP, PORT), EchoHandler)
    print("Echo server started on {}:{}".format(IP,PORT))
    server.serve_forever()