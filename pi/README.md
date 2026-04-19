# MIDI Bridge — Raspberry Pi Setup

Turns a Raspberry Pi into a wireless MIDI bridge: reads USB MIDI from your piano and streams it over WiFi to the Pianist web app on your iPad.

The Pi serves the web app over HTTP and handles MIDI bridging on the same port. This is required because iPad Safari blocks WebSocket connections from HTTPS pages (like GitHub Pages). On boot, the Pi auto-pulls the latest code from GitHub and rebuilds.

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
ssh finlay@pianobridge.local
```

If `.local` doesn't resolve, find the Pi's IP from your router admin page and use that instead.

### 3. Install system dependencies

```bash
sudo apt update
sudo apt install -y python3-pip python3-venv librtmidi-dev git

# Install Node.js (needed to build the web app)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

### 4. Set up the bridge

```bash
mkdir -p ~/midi-bridge
cd ~/midi-bridge

# Python venv for the bridge
python3 -m venv venv
source venv/bin/activate
pip install mido python-rtmidi aiohttp zeroconf
```

### 5. Copy scripts from your computer

```bash
scp pi/midi-bridge.py pi/deploy.sh finlay@pianobridge.local:~/midi-bridge/
```

### 6. Run the deploy script

On the Pi:

```bash
cd ~/midi-bridge
chmod +x deploy.sh
./deploy.sh
```

This clones the repo, installs npm deps, builds the web app, and copies everything into place. It takes a few minutes on first run.

### 7. Test it

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
12:00:00 [INFO] Serving web app from /home/finlay/midi-bridge/www on port 8080
12:00:00 [INFO] WebSocket + HTTP server listening on port 8080
12:00:00 [INFO] Opened MIDI device: USB MIDI Interface
```

### 8. Open on iPad

On your iPad, open Safari and go to:

```
http://pianobridge.local:8080
```

During onboarding, choose **Connect via MIDI Bridge** — it auto-detects the Pi since the app is served from the same host.

## Auto-start on boot

Install the systemd service so the Pi auto-pulls, builds, and starts on boot:

```bash
sudo cp ~/midi-bridge/midi-bridge.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable midi-bridge
sudo systemctl start midi-bridge
```

Check it's running:

```bash
sudo systemctl status midi-bridge
```

Now just power on the Pi — it pulls the latest code from GitHub, builds, and starts serving. Open `http://pianobridge.local:8080` on your iPad and play.

To view logs:

```bash
journalctl -u midi-bridge -f
```

## How updates work

When the Pi boots (or the service restarts), the deploy script automatically:
1. Pulls the latest code from GitHub
2. Runs `npm ci` and `npx vite build`
3. Copies the build output to `~/midi-bridge/www`
4. Starts the bridge server

You don't need to SSH into the Pi to deploy — just push to GitHub and restart the service (or reboot the Pi).

To manually trigger a redeploy without rebooting:

```bash
sudo systemctl restart midi-bridge
```

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

**Deploy script fails**
- Make sure Node.js is installed: `node --version` (should be 22.x)
- Make sure git is installed: `git --version`
- Check disk space: `df -h` (the build needs ~500MB free)

**High latency**
- WiFi latency on a local network is typically 1-5ms, which is imperceptible
- If you notice lag, check your WiFi signal strength on the Pi: `iwconfig wlan0`
- A 5GHz network will give lower latency than 2.4GHz

**Script crashes on startup**
- Make sure `python-rtmidi` installed cleanly: `pip install python-rtmidi`
- If it fails, install the system MIDI lib: `sudo apt install librtmidi-dev` and retry
