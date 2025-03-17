import asyncio
from shazamio import Shazam
import json


async def main():
  shazam = Shazam()
  # out = await shazam.recognize_song('dora.ogg') # slow and deprecated, don't use this!
  out = await shazam.recognize('recording.wav')  # rust version, use this!
#   print(type(out),out)
  with open('recognize_out.json', 'w') as file:
      json.dump(out, file, indent=4)

loop = asyncio.get_event_loop()
loop.run_until_complete(main())