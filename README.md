# FestivalManager

## Getting started

Clone repository
Open repository with MSV code
Open terminal

npm install

npm run devstart

## Description
A webbased ordering tool for small festivals ("festl" in austrian). It manages food and drink orders for service personal. Automatically send food orders to assigned stations and tracks the order.

## Requirements
- Postgres Database
- Server (Laptop or Desktop PC)
  -  Preferably connected via Ethernet (Cable) to the Network
- Interfaces for the stations
  - Tablets prefered, Laptops work too
- Smartphones for service personal
  - Somewhat new (min. 6" recommended)
- Good WiFi coverage 
  - 2.4 GHz recommended, higher range/ penetration
- Secured and protected WLAN
  - Important first line of defence -> Access restriction

## Installation
Clone Repo to Server and start webservice with: node app.js<br>
Access WebUI under localhost:3000 or IP-Address:3000

## Usage
Access WebUI

## ToDo Improvements

### General Improvements / Fixes
- :heavy_check_mark: Timestamps at start of order state change (processing, delivering, finished, canceled)
- :heavy_check_mark: Save who cancled an order
- :heavy_check_mark: Order states tied to station
- :heavy_check_mark: Update all UI to Bootstrap 5
- :arrows_counterclockwise: Move all requests to Ajax and REST
- :x: Optional: DB Optimizations and DB side caching
- :x: Error Messages everywhere
  - :x: Admin UI
  - :x: Personal UI
  - :x: Station UI
  - :x: Table UI
- :heavy_check_mark: Backend Refactoring -> move to English
- :heavy_check_mark: Fix: Notification for recieved order
- :x: Versioning
- :heavy_check_mark: Payment system overhaul -> generate real bills inside the DB
- :x: DB checks for consistancy
- :x: Fix DB tools
- :arrows_counterclockwise: Consistant express validation
  - :x: Admin UI
  - :x: Personal UI
  - :x: Station UI
  - :x: Table UI
- :arrows_counterclockwise: Session Management improvement

### Admin UI
- :x: Show state of the modules (DHCP, DNS, DB)
- :arrows_counterclockwise: All source data (Stammdaten, in german) is editable via UI
  - :heavy_check_mark: Add
  - :x: Remove
  - :x: Modify
- :arrows_counterclockwise: Insight to orders by personal and detailed info for a order
- :x: DB config is read from file and editable via ui (IP,Port,User and PW)

### Personal UI
- :heavy_check_mark: Show details of an order
- :heavy_check_mark: Group finished/canceled orders by type/name

### New Features
- :x: Product States -> hidden, disabled, etc.
- :heavy_check_mark: More order states
- :x: Package-to-Executable -> .exe
- :arrows_counterclockwise: Group by Product Categories for Personal -> (Alk, Anti, Grill, Kitchen)
- :heavy_check_mark: Product Variations -> Wine (Red or White)
- :x: PDF-Generator -> Generate PDF with stats per day or for all days incl. sold products, general load, details per station
- :x: DHCP-Server -> All-in-one with DNS for resolving the domain in unconfigurable networks

## Authors 
Michael Selinger<br>
~~Saul Ptrondl~~
## Contributors
Thanks Jojo and Hannah for their knowledge and expertise during development.

## Project status
early development
