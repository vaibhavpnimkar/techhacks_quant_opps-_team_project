import keyboard
import signal
import sys

# Function to handle SIGTERM signal (terminate signal from ElectronJS)
def sigterm_handler(signum, frame):
    sys.exit(0)

# Register the SIGTERM signal handler
signal.signal(signal.SIGTERM, sigterm_handler)

keyboard.add_hotkey("alt + tab", lambda: None, suppress=True)
keyboard.wait()
