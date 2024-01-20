$keyPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad"

# Check if the registry key exists
if (Test-Path -Path $keyPath) {
  # Disable the three-finger touchpad gesture
  Set-ItemProperty -Path $keyPath -Name "ThreeFingerSlideEnabled" -Value 0
  # Set-ItemProperty -Path HKLM:\SYSTEM\CurrentControlSet\Services\USBSTOR\ -Name Start -Value 4

# Set FourFingerSlideEnabled to 0 (disabled)
   Set-ItemProperty -Path $keyPath -Name "FourFingerSlideEnabled" -Value 0

  # Stop the Windows Explorer process
  Stop-Process -Name explorer -Force

  # Start the Windows Explorer process
  Start-Process explorer

  Write-Host "Three-finger touchpad gesture disabled successfully."
} else {
  Write-Host "Registry key not found. Make sure PrecisionTouchPad settings exist."
}
# Define the registry key path
# Define the registry key path
# Define the registry key path
# $keyPath = "HKCU:\Software\Microsoft\Windows\CurrentVersion\PrecisionTouchPad"

# # Check if the registry key exists
# if (Test-Path -Path $keyPath) {
#   # Disable the three-finger touchpad gesture
#   Set-ItemProperty -Path $keyPath -Name "ThreeFingerSlideEnabled" -Value 0

#   # Refresh shell icons
#   $shell = New-Object -ComObject Shell.Application
#   $shell.Namespace(17).Items() | ForEach-Object {
#     $null = $_.InvokeVerb("refresh")
#   }

#   Write-Host "Three-finger touchpad gesture disabled successfully."
# } else {
#   Write-Host "Registry key not found. Make sure PrecisionTouchPad settings exist."
# }

