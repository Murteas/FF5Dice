# Freedom Five Dice Roller

## Overview
The Freedom Five Dice Roller is a simple and user-friendly web application designed for iPhone users. It allows players to easily manage and roll dice for the Freedom Five tabletop game. The application features a clean interface and is optimized for mobile devices.

## Project Structure
FF5Dice
├── assets                 # Static resources for the app
│   ├── css               # Stylesheets
│   │   └── styles.css
│   └── js                # JavaScript files
│   │   ├── script.js     # Core app logic (dice rolling, character management)
│   │   └── sw.js         # Service worker for offline PWA support
│   ├── manifest.json     # PWA manifest for metadata and configuration
│   └── icon.png          # App icon for PWA (used in manifest.json)
├── index.html            # Main HTML file, entry point of the app
├── LICENSE               # MIT License file
└── README.md             # Project documentation

## Files Description
- **assets/css/styles.css**: Contains styles for the application, focusing on a clean and user-friendly interface suitable for mobile devices.
- **assets/js/script.js**: Main JavaScript logic for the application, including functions to handle dice rolling, updating counts, and managing thresholds.
- **assets/js/sw.js**: Service worker script that enables offline capabilities and caching for the application.
- **assets/manifest.json**: Provides metadata for the web application, including the name, icons, and display settings for a mobile-friendly experience.
- **index.html**: Main HTML document that structures the application. It includes the layout for the dice roller, buttons, and thresholds, ensuring a simple and intuitive user interface.

## Setup Instructions
1. Clone the repository to your local machine.
2. Open the `index.html` file in a web browser to run the application.
3. For a better experience, consider hosting the application on a local server or deploying it to a web hosting service.

## Usage Guidelines
- Select the number of dice for each color using the "+" and "-" buttons.
- Set the threshold for each color of dice using the dropdown menus.
- Click the "Roll" button to roll the dice and see the results displayed below.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any suggestions or improvements.

## License
This project is open-source and available under the MIT License.