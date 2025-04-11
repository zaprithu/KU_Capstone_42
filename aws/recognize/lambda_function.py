import asyncio
from shazamio import Shazam
import json
import base64
import subprocess
import os
import platform

def check_ffmpeg():
    try:
        # Adjust the path if necessary, e.g., for layers /opt/bin/ffmpeg
        result = subprocess.run(['/usr/local/bin/ffmpeg', '-version'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        
        # Check if the command was successful
        if result.returncode == 0:
            print("FFmpeg is available")
            print(result.stdout.decode())  # Print version info
        else:
            print("FFmpeg is not available")
            print(result.stderr.decode())  # Print error if FFmpeg is not found
    except FileNotFoundError:
        print("FFmpeg is not installed or not in the expected location")

# Example invocation


def lambda_handler(event, context):
    print("Event Received (2):", type(event))
    os.environ["PATH"] += os.pathsep + "/usr/local/bin"
    print("Architecture:", platform.machine())
    
    check_ffmpeg()
    try:
        print("event type, keys",type(event),event.keys())
        
        body = event.get('body')
        
        print("body type, value", type(body), body)
        body_dict = json.loads(body)
        print("body_dict type, value", type(body_dict), body_dict)
        file_dict = json.loads(body_dict)
        print("file_dict", type(file_dict), file_dict)
        base64_audio = file_dict.get("file") 

        if not base64_audio:
            return {
                "statusCode": 400,
                "body": json.dumps("Missing 'file' field in request body.")
            }

        audio_bytes = base64.b64decode(base64_audio)
        print("DECODED base64 string", len(audio_bytes))

        result = asyncio.run(recognize(audio_bytes))
        print("got result", type(result), result)
        # result_data = json.loads(result['body']) 
        track = result['track']
        print('track', track)
        song_info = {
          'song_name': track['title'],
          'artist': track['subtitle'],
          'genre': track['genres']['primary']
        }
        print("\n\nreturning: ", song_info)
        
        return {
          "statusCode": 200,
          "body": json.dumps({"track":song_info})
        }
        
        return
        if len(result_data['result']["matches"]) == 0:
          return {
            "statusCode": 200,
            "body": json.dumps({"message": "could not find match!"})
          }
        track_data = result_data['result']['track']


        
    except Exception as e:
      print("Lambda error:", str(e))
      return {
          "statusCode": 500,
          "body": json.dumps({"error": "Internal Server Error", "details": str(e)})
      }
      
    return {
      "statusCode": 200,
      "body": json.dumps({"track":song_info})
    }

async def recognize(audio_bytes):
    shazam = Shazam()
    result =  await shazam.recognize(audio_bytes)
    return result