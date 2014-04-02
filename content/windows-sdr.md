title: Software Defined Radio: Windows setup guide
date: 2018-06-01
# A quick setup guide (on Windows)

## Software
Download [Windows SDR Software Package][1] from airspy.com

## How to get started

1. Extract to new folder
2. Run `install-rtlsdr` batch file
3. Plug in dongle
4. Wait until windows installs drivers
5. Run `zadig.exe` as administrator
6. Navigate `Options -> List All Devices`
7. Select `Bulk-in, Interface (Interface 0)`
8. USB ID should match: `0BDA 2838 00`
9. Make sure `WinUSB` is on right side
10. Click `Reinstall Driver` (or maybe it says Install Driver)
11. Close `zadig`
12. Open `SDRSharp.exe`
13. Under options select correct device (Interface 1 or 0)
14. Tick `Tuner AGC` (for automatic gain adjustment)

[1]: https://airspy.com/download/ "Airspy"
