# NutriScan Pro

NutriScan Pro is a web application designed to help you make informed decisions about the food you eat. By simply scanning a product's barcode with your device's camera, you get instant access to detailed nutritional information, a calculated health score, and an analysis of the product's processing level.

## Core Features

-   **Real-time Barcode Scanning**: Uses your device's camera to quickly scan barcodes. Also supports manual entry and image uploads.
-   **Comprehensive Nutritional Data**: Fetches and displays detailed product information from the public [Open Food Facts](https://openfoodfacts.org/) API, including a full nutritional breakdown, ingredients list, and quality scores like Nutri-Score.
-   **Health Score**: Calculates a simple 1-10 health score based on key nutritional data like sugar, sodium, fiber, and protein content, giving you a quick at-a-glance assessment.
-   **Processing & Quality Analysis**: Displays the NOVA group classification to inform you about the level of food processing.
-   **Scan History**: Keeps a local history of your scanned items for easy reference.
-   **Light & Dark Mode**: Includes a theme toggler for user comfort.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
-   **Barcode Scanning**: [html5-qrcode](https://github.com/mebjas/html5-qrcode)
-   **Icons**: [Lucide React](https://lucide.dev/)

This project is completely free of any private API key requirements.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (version 18 or later)
-   npm or yarn

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd your-repo-name
    ```
3.  **Install NPM packages:**
    ```bash
    npm install
    ```
4.  **Run the development server:**
    ```bash
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## Deployment

This application is ready to be deployed on platforms that support Next.js, such as [Vercel](https://vercel.com/).

Since there are no environment variables or private keys, deployment is as simple as importing the Git repository into your hosting provider of choice.
