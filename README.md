# Personal Food Selector

A personal self-service kiosk web application to customize, organize, and randomize daily breakfast, lunch, dinner, and snack choices. 

## Features

- 🎲 **Meal Randomizer**: Let the app decide what you should eat based on available options.
- 🎨 **Customizable Choices**: Pick specific proteins, sides, and accompaniments for each meal.
- 💾 **Local Storage**: Automatically saves your preferences and favorites directly to your browser.
- 📱 **Responsive Design**: Clean and modern kiosk-style interface.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/personal-food-selector.git
   cd personal-food-selector
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Add your required keys to the `.env.local` file.

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Technologies Used

- React 19
- Vite
- Tailwind CSS v4
- Motion (Framer Motion)
- Lucide React

## License

This project is licensed under the MIT License.
