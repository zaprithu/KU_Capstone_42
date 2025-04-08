import asyncio
from shazamio import Shazam
import json
import base64

def lambda_handler(event, context):
  # print("Event Received:", type(event), event)
  try:
        event_dict = body = json.loads(event)
        print("keys",event_dict.keys())
            
        base64_audio = body.get("file") 

        if not base64_audio:
            return {
                "statusCode": 400,
                "body": json.dumps("Missing 'file' field in request body.")
            }

        audio_bytes = base64.b64decode(base64_audio)
        print("DECODED base64 string", len(audio_bytes))

        result = asyncio.run(recognize(audio_bytes))
        print("got result", result)
        result_data = json.loads(result['body']) 
        if len(result_data['result']["matches"]) == 0:
          return {
            "statusCode": 200,
            "body": json.dumps({"message": "could not find match!"})
          }
        track_data = result_data['result']['track']

        song_info = {
          'song_name': track_data['title'],
          'artist': track_data['subtitle']
        }
        
  except Exception as e:
    print("Lambda error:", str(e))
    return {
        "statusCode": 500,
        "body": json.dumps({"error": "Internal Server Error", "details": str(e)})
    }

  # try:
  #   # audio_bytes = base64.b64decode('output.wav')
    
    
  
  # except Exception as e:
  #   return {
  #       "statusCode": 500,
  #       "body": f"Error: {str(e)}"
  #   }

  return {
    "statusCode": 200,
    "body": json.dumps({"track":song_info})
  }

async def recognize(audio_bytes):
  shazam = Shazam()
  result =  await shazam.recognize(audio_bytes)
  return {
    "statusCode": 200,
    "body": json.dumps({"result": result})
  }