# Python script to block Alt+Tab key presses
import ctypes
import time
import threading

def block_alt_tab():
    user32 = ctypes.windll.user32
    hotkey_id = 1

    # Define the callback function for the hotkey
    def hotkey_callback():
        print("Alt+Tab is blocked!")

    # Register Alt+Tab as a global hotkey
    if not user32.RegisterHotKey(None, hotkey_id, 0x0001, 0x09):  # 0x0001: MOD_ALT, 0x09: VK_TAB
        print("Failed to register hotkey")

    # Define the function to process hotkey messages
    def hotkey_handler():
        msg = ctypes.wintypes.MSG()
        while user32.GetMessageW(ctypes.byref(msg), None, 0, 0) != 0:
            if msg.message == ctypes.wintypes.WM_HOTKEY and msg.wParam == hotkey_id:
                hotkey_callback()
            user32.TranslateMessage(ctypes.byref(msg))
            user32.DispatchMessageW(ctypes.byref(msg))

    # Start a thread to handle hotkey messages
    hotkey_thread = threading.Thread(target=hotkey_handler, daemon=True)
    hotkey_thread.start()

    # Run your application logic here
    time.sleep(10)  # Simulate your application running for 10 seconds

    # Unregister the hotkey
    user32.UnregisterHotKey(None, hotkey_id)

# Run the blocking logic
block_alt_tab()


# import keyboard

# # Function to block Alt+Tab key press
# def block_alt_tab():
#     keyboard.press_and_release('alt + tab')

# # Function to block Windows+D key press
# def block_windows_d():
#     keyboard.press_and_release('win + d')

# # Register the hotkeys to block Alt+Tab and Windows+D
# keyboard.add_hotkey("alt + tab", block_alt_tab, suppress=True)

# # Run the script indefinitely
# keyboard.wait()

