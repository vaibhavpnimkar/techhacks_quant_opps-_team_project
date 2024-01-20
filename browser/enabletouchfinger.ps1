$keyPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad"

# Check if the registry key exists
if (Test-Path -Path $keyPath) {
  # Disable the three-finger touchpad gesture
  Set-ItemProperty -Path $keyPath -Name "ThreeFingerSlideEnabled" -Value 1
  # Set-ItemProperty -Path HKLM:\SYSTEM\CurrentControlSet\Services\USBSTOR\ -Name Start -Value 3
  Set-ItemProperty -Path $keyPath -Name "FourFingerSlideEnabled" -Value 1
  # Stop the Windows Explorer process
  Stop-Process -Name explorer -Force

  # Start the Windows Explorer process
  Start-Process explorer

  Write-Host "Three-finger touchpad gesture enabled successfully."
} else {
  Write-Host "Registry key not found. Make sure PrecisionTouchPad settings exist."
}