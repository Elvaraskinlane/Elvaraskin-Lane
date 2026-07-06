# Elvara Skinlane

Elvara Skinlane is a modern, high-performance eCommerce web application built to deliver a premium shopping experience for skincare and beauty products. It is powered by Next.js, styled with Tailwind CSS, and integrates with WooCommerce for robust backend operations.

## Features

- **Modern Tech Stack**: Built with Next.js 16+, React 19, and Tailwind CSS v4.
- **State Management**: Utilizes Zustand for lightweight, fast, and scalable global state management (Cart, Wishlist, Auth, UI).
- **WooCommerce Integration**: Seamlessly connects with a WooCommerce backend to fetch products, handle authentication, manage carts, and process checkouts.
- **Responsive Design**: Fully responsive and mobile-first approach ensuring a beautiful interface on all devices.
- **Authentication**: Secure user authentication including login, registration, password reset, and account management.
- **Shopping Experience**: Comprehensive eCommerce features including product galleries, category filtering, search, add to cart, and a streamlined checkout process.
- **Wishlist**: Users can save their favorite products to a personal wishlist.
- **Security**: Integrates Cloudflare Turnstile (via `@marsidev/react-turnstile`) for bot protection.

## Technologies Used

- **Framework:** [Next.js](https://nextjs.org/)
- **UI & Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
- **Backend/Headless CMS:** [WooCommerce](https://woocommerce.com/)
- **Security:** DOMPurify for sanitization, Turnstile for CAPTCHA.
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js (v20 or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Emjaay20/Elvaraskin-Lane.git
   cd Elvaraskin-Lane
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and configure your WooCommerce API credentials and other necessary secrets.

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application running.

## Project Structure

- `src/app`: Contains the Next.js App Router pages and API routes.
- `src/components`: Reusable React components organized by feature (e.g., `auth`, `cart`, `checkout`, `product`, `shop`).
- `src/lib`: Utility functions and WooCommerce API integrations.
- `src/store`: Zustand stores for global state management (`useAuthStore`, `useCartStore`, `useWishlistStore`, `useUIStore`).
- `src/types`: TypeScript type definitions.

## Deployment

This application is ready to be deployed on platforms like [Vercel](https://vercel.com/), which is the recommended platform for Next.js applications. Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

This project is proprietary and confidential.
