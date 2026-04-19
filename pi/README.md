# MIDI Bridge — Raspberry Pi Setup

Turns a Raspberry Pi into a wireless MIDI bridge: reads USB MIDI from your piano and streams it over WiFi to the Pianist web app on your iPad.

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

### 4. Copy the bridge script

From your computer (not the Pi), copy the script over:

```bash
scp pi/midi-bridge.py pi@pianobridge.local:~/midi-bridge/
```

Or just paste the contents directly on the Pi:

```bash
nano ~/midi-bridge/midi-bridge.py
# paste contents, save with Ctrl+X
```

### 5. Test it

Plug the USB MIDI adapter into the Pi, then:

```bash
cd ~/midi-bridge
source venv/bin/activate
python3 midi-bridge.py
```

You should see:
```
12:00:00 [INFO] Local IP: 192.168.1.xx
12:00:00 [INFO] mDNS registered: _midi-bridge._tcp on port 3141
12:00:00 [INFO] WebSocket server listening on port 3141
12:00:00 [INFO] Opened MIDI device: USB MIDI Interface
```

Play a note on your piano — if you see no errors, it's working. Press `Ctrl+C` to stop.

### 6. Connect from the iPad

Open the Pianist app on your iPad, go to **Settings** (gear icon in the game screen), and under **MIDI Bridge**:

1. Toggle it on
2. Enter the Pi's address: `pianobridge.local` (or the IP shown in the Pi's logs)
3. Hit **Test** — you should see a green "Connected" status

Now play a song — your piano input comes through wirelessly.

## Run on boot (optional)

To start the bridge automatically when the Pi powers on:

```bash
# Update the service file with your venv path
sudo cp ~/midi-bridge/midi-bridge.service /etc/systemd/system/
```

Edit the service to use the venv Python:

```bash
sudo nano /etc/systemd/system/midi-bridge.service
```

Change the `ExecStart` line to:
```
ExecStart=/home/pi/midi-bridge/venv/bin/python3 /home/pi/midi-bridge/midi-bridge.py
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

Now just plug in the Pi and your piano — it works automatically.

## Troubleshooting

**"No MIDI device found"**
- Check the USB MIDI adapter is plugged in
- Run `arecordmidi -l` to verify the Pi sees the MIDI device
- Try unplugging and replugging the adapter

**iPad can't connect**
- Make sure both devices are on the same WiFi network
- Try using the Pi's IP address instead of `.local` hostname
- Check the Pi's firewall isn't blocking port 3141: `sudo ufw allow 3141`

**High latency**
- WiFi latency on a local network is typically 1-5ms, which is imperceptible
- If you notice lag, check your WiFi signal strength on the Pi: `iwconfig wlan0`
- A 5GHz network will give lower latency than 2.4GHz

**Script crashes on startup**
- Make sure `python-rtmidi` installed cleanly: `pip install python-rtmidi`
- If it fails, install the system MIDI lib: `sudo apt install librtmidi-dev` and retry
