import screeninfo

def get_hdmi_ports():
    """Returns a list of all available HDMI ports."""
    screens = screeninfo.get_monitors()
    hdmi_ports = []
    
    for screen in screens:
        if "HDMI" in screen.name.upper():
            hdmi_ports.append(screen.name)
    
    return hdmi_ports

if __name__ == "__main__":
    hdmi_ports = get_hdmi_ports()
    for port in hdmi_ports:
        print("Detected HDMI Port:", port)
