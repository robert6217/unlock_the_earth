# Unlock the Earth

**Unlock the Earth** is a web-based visualization project that maps the content of the Taiwanese podcast 《解鎖地球》("Unlock the Earth"). The goal is to present podcast episodes in an interactive and geographical format, allowing users to explore stories and insights from around the world through a visual interface.

## Project Purpose

This project transforms the rich travel and cultural content of the podcast into a map-based experience. Each episode is linked to a specific country or city, helping users discover global destinations and their stories in an intuitive and engaging way.

## Disclaimer (免責聲明)

This is an **unofficial, fan-made project**. I am not affiliated with, endorsed by, or connected to the official *Unlock the Earth* (解鎖地球) podcast team.

* **Content Rights**: All podcast content, logos, brand names, and audio links belong to the original creators of *Unlock the Earth*.
* **Purpose**: This project is created voluntarily for educational and non-commercial purposes, serving as a fan tribute and a technical portfolio piece.

本專案為聽眾**自發製作的非官方作品**，與《解鎖地球》官方團隊無任何隸屬或合作關係。所有 Podcast 內容、Logo 及音檔版權皆歸原創團隊所有。本網站僅供學習與交流使用，不涉及任何商業行為。

如果你也是解鎖地球的聽眾，希望對你有幫助!

## Features

* **🌍 Interactive Map Visualization**: Utilizing Leaflet.js to map podcast episodes globally, allowing users to explore content geographically.
* **🔍 Continent Filtering**: A glassmorphism-styled sidebar allows users to filter episodes by continent (Asia, Europe, Africa, etc.) in real-time.
* **🌓 Dark/Light Mode**: Includes a theme toggle switch. The app automatically saves the user's preference to `localStorage`, ensuring a consistent experience across visits.
* **📍 Custom SVG Markers**: Replaced standard image markers with custom-coded, scalable SVG pins that support hover animations and dynamic resizing.
* **🎧 Direct Podcast Links**: Clicking on a map marker opens a popup with the episode title and a direct link to listen.
* **⚡ Optimized Data Fetching**: The backend implements pagination loops to handle Notion API limits, ensuring all location data is retrieved successfully.

## Tech Stack

* **Frontend**: React, Leaflet (react-leaflet), CSS3 (Variables & Animations)
* **Backend**: Node.js, Express
* **Database/CMS**: Notion API (Using Notion as the database)
* **Deployment**: [Vercel](https://vercel.com/)
* **Vibe Coding**: [Google Gemini](https://gemini.google.com/) 😎

## TODO

* [ ] Automatically fetch and insert the latest episode into the database every week.
* [ ] Add search functionality for specific episodes or cities.

# Live Demo

[👉 Check it out here](https://unlock-the-earth.vercel.app)

![](snapshot.png "unlock the earth")

# Listen to the Podcast

Please support the official creators!

[![Apple Podcasts](https://img.shields.io/badge/解鎖地球--purple?logo=applepodcasts&style=social)](https://podcasts.apple.com/tw/podcast/解鎖地球-旅行-歷史-文化/id1476564589)
[![Spotify](https://img.shields.io/badge/解鎖地球--green?logo=spotify&style=social)](https://open.spotify.com/show/0KAH1lIkmtgoe4kPEGed4a)
[![YouTube](https://img.shields.io/badge/解鎖地球--red?logo=youtube&style=social)](https://www.youtube.com/@unlocktheearthpodcast)