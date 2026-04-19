# MIDI Bridge — Raspberry Pi Setup

Turns a Raspberry Pi into a wireless MIDI bridge: reads USB MIDI from your piano and streams it over WiFi to the Pianist web app on your iPad.

The Pi also serves the web app over HTTP, which is required because iPad Safari blocks WebSocket connections from HTTPS pages (like GitHub Pages).

## What you need

- Raspberry Pi (any model with WiFi — Zero W, 3, 4, 5)
- USB MIDI adapter (the one connecting your Yamaha P35)
- Both the Pi and iPad on the same WiFi network

## Quick start

### 1. Flash Raspberry Pi OS

Use the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) to flash **Raspberry Pi OS Lite** (no desktop needed) onto a microSD card.

In the imager settings, configure:
- **WiFi** — your home network SSID and password
- **SSH** — enable it so you can set up headlessly
- **Hostname** — `pianobridge` (or whatever you prefer)

### 2. SSH into the Pi

```bash
ssh pi@pianobridge.local
```

If `.local` doesn't resolve, find the Pi's IP from your router admin page and use that instead.

### 3. Install dependencies

```bash
sudo apt update
sudo apt install -y python3-pip python3-venv librtmidi-dev

mkdir -p ~/midi-bridge
cd ~/midi-bridge
python3 -m venv venv
source venv/bin/activate
pip install mido python-rtmidi websockets zeroconf
```

### 4. Copy files to the Pi

From your computer, copy the bridge script and built web app:

```bash
# Copy the bridge script
scp pi/midi-bridge.py pi@pianobridge.local:~/midi-bridge/

# Build the web app and copy it to the Pi
npm run build
scp -r dist pi@pianobridge.local:~/midi-bridge/www
```

### 5. Test it

Plug the USB MIDI adapter into the Pi, then:

```bash
cd ~/midi-bridge
source venv/bin/activate
python3 midi-bridge.py --www ./www
```

You should see:
```
12:00:00 [INFO] Local IP: 192.168.1.xx
12:00:00 [INFO] mDNS registered: _midi-bridge._tcp on port 8080
12:00:00 [INFO] Serving web app from /home/pi/midi-bridge/www on port 8080
12:00:00 [INFO] WebSocket + HTTP server listening on port 8080
12:00:00 [INFO] Opened MIDI device: USB MIDI Interface
```

### 6. Open on iPad

On your iPad, open Safari and go to:

```
http://pianobridge.local:8080
```

The Pi serves both the web app and MIDI WebSocket on the same port. iPad Safari requires this — it blocks WebSocket connections to different ports and blocks `ws://` from HTTPS pages (like GitHub Pages). During onboarding, choose **Connect via MIDI Bridge** — it auto-detects the Pi since the app is served from the same host.

## Deploying updates

When you update the web app, rebuild and copy to the Pi:

```bash
npm run build
scp -r dist/* pi@pianobridge.local:~/midi-bridge/www/
```

No need to restart the bridge — the HTTP server picks up the new files immediately.

## Run on boot (optional)

To start the bridge automatically when the Pi powers on:

```bash
sudo cp ~/midi-bridge/midi-bridge.service /etc/systemd/system/
```

Edit the service to use the venv Python and enable the web server:

```bash
sudo nano /etc/systemd/system/midi-bridge.service
```

Change the `ExecStart` line to:
```
ExecStart=/home/pi/midi-bridge/venv/bin/python3 /home/pi/midi-bridge/midi-bridge.py --www /home/pi/midi-bridge/www
```

Then enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable midi-bridge
sudo systemctl start midi-bridge
```

Check it's running:

```bash
sudo systemctl status midi-bridge
```

Now just plug in the Pi and your piano — open `http://pianobridge.local:8080` on your iPad and play.

## Troubleshooting

**"No MIDI device found"**
- Check the USB MIDI adapter is plugged in
- Run `arecordmidi -l` to verify the Pi sees the MIDI device
- Try unplugging and replugging the adapter

**iPad can't connect to the web app**
- Make sure both devices are on the same WiFi network
- Try using the Pi's IP address instead of `.local`: `http://192.168.x.x:8080`
- Check the Pi's firewall isn't blocking the port: `sudo ufw allow 8080`

**MIDI Bridge test fails in the app**
- On iPad, you must use the Pi-hosted version (`http://pianobridge.local:8080`) — Safari blocks `ws://` from HTTPS pages like GitHub Pages
- Try entering the Pi's IP address manually instead of `.local`

**High latency**
- WiFi latency on a local network is typically 1-5ms, which is imperceptible
- If you notice lag, check your WiFi signal strength on the Pi: `iwconfig wlan0`
- A 5GHz network will give lower latency than 2.4GHz

**Script crashes on startup**
- Make sure `python-rtmidi` installed cleanly: `pip install python-rtmidi`
- If it fails, install the system MIDI lib: `sudo apt install librtmidi-dev` and retry
