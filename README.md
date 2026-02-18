# **Next.js Food ordering App**

A food ordering app has built with Next.js framework. The app allows users to log in with previously registered credentials or with Google provider in order to order foods. After the checkout, stripe payment test mode let to test the payment process. New category and food can be add dynamically into the database with admin role. User profile can be updated. Filtering option is available for foods.

### Demo: [Link](https://food-ordering-app-chi-nine.vercel.app/)

### Demo account:

Email: `admin@demo.com`<br>
Password: `1234`

## Features

- Allow user to register, log in and log out
- Login can be done with previosly registered account or with google account
- Only logged in users have rights to order foods
- Basic user can update the the own profile and order food
- Admin rights let to create, update or remove categories and menus
- Stripe payment is used with webhook to retrive information about the status of the payment
- Order history with each induvidual order can be check under Order page
- MongoDB database used to store data
- Prisma ORM used to retrive data from database
- Next.js used for CSR and SSR
- Bcrypt used to hash the user password
- React Hook form used to create forms
- Zod used for validation
- Zustand used for state management
- Resend use to send email
- Shadcn UI component library use to built beautiful design
- Toast notification use to improve UX
- Render-as-you-fetch approach is used for Loading screen
- Hosted on Vercel
- Responsive design

## How to run from local repository

1. Clone the repository
2. Run `npm install` command in your terminal
3. Set up MongoDB database, Google provider config, Resend, Stripe with webhook
4. Create .env file and add enviromental variables:
   open ssl key should generate to NEXTAUTH_SECRET
   `DATABASE_URL=`<br>
   `NEXTAUTH_SECRET=`<br>
   `GOOGLE_CLIENT_ID=`<br>
   `GOOGLE_CLIENT_SECRET=`<br>
   `RESEND_API_KEY=`<br>
   `STRIPE_PUBLIC_KEY=`<br>
   `STRIPE_SECRET_KEY=`<br>
   `STRIPE_SIGNATURE_SECRET=`<br>
   `NEXT_SERVER_URL=http://localhost:3000`<br>
   `DELIVERY_FEE=2`
5. Run `npx prisma generate`
6. Setup Stripe webhook: [link](https://dashboard.stripe.com/test/webhooks)
7. Setup Google auth: [link](https://console.developers.google.com/apis/credentials)
8. Run `npm run dev` command in your terminal
9. Server running at `http://localhost:3000/`

### Useful links and informations

- Open SSL key generation:
  - You can use the following link to create open ssl key: `https://www.cryptool.org/en/cto/openssl` or you can install open ssl and generate key from terminal. To generate code you should run: `openssl rand -base64 32`
- Google Provider config page:
  - [Google](https://console.developers.google.com/apis/credentials)
- React Hook Form usage with UI component needs to has `ref={null}` property to avoid ref warning:
  - [Stackoverflow](https://stackoverflow.com/questions/67877887/react-hook-form-v7-function-components-cannot-be-given-refs-attempts-to-access)
  - [GitHub](https://github.com/react-hook-form/react-hook-form/issues/3411)
- Loading screen approaches (Fetch-than-render, Render-as-you-fetch, Suspense, ):
  - [Medium.com](https://medium.com/jspoint/introduction-to-react-v18-suspense-and-render-as-you-fetch-approach-1b259551a4c0)
  - [Linkedin.com](https://www.linkedin.com/pulse/fetch-then-render-render-as-you-fetch-fetch-on-render-amit-pal/)
- Stripe, checkout session, webhook:
  - [GitHub #1](https://github.com/stripe/stripe-node)
  - [GitHub #2](https://github.com/stripe-samples/accept-a-payment/blob/main/prebuilt-checkout-page/server/node/server.js)
  - [Linkedin.com](https://www.linkedin.com/pulse/how-create-stripe-webhook-nextjs-1344-mohsin-ali-soomro/)
  - [Dev.to](https://dev.to/mohsinalisoomro/how-to-create-stripe-webhook-in-nextjs-1344-5fn)
  - [Medium.com](https://medium.com/@levi.schouten.werk/building-a-payment-flow-in-next-js-13-using-stripe-mailsender-and-webhooks-291996bf1b24)
- Stripe Test cards:
  - [Stripe.com](https://stripe.com/docs/checkout/quickstart#testing)

### Dependencies

- [React](https://react.dev/)
- [React DOM](https://www.npmjs.com/package/react-dom)
- [React Icons](https://www.npmjs.com/package/react-icons)
- [Lucide Icons](https://lucide.dev/)
- [Typescript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Next.js](https://nextjs.org/)
- [Next Auth](https://next-auth.js.org/)
- [Next Themes](https://www.npmjs.com/package/next-themes)
- [Prisma](https://www.prisma.io/)
- [Prisma Adapter](https://authjs.dev/reference/adapter/prisma)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [React Hook Form](https://react-hook-form.com/)
- [@hookform/resolvers](https://www.npmjs.com/package/@hookform/resolvers)
- [Zod](https://zod.dev/)
- [Sonner toaster](https://sonner.emilkowal.ski/)
- [Shadcn ui](https://ui.shadcn.com/)
- [date-fns](https://date-fns.org/)
- [Resend](https://resend.com/)
- [Stripe](https://stripe.com/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)

### Layout

![layout-1 picture](https://github.com/ev0clu/food-ordering-app/blob/main/layout-1.png?raw=true)<br>
![layout-2 picture](https://github.com/ev0clu/food-ordering-app/blob/main/layout-2.png?raw=true)<br>
![layout-3 picture](https://github.com/ev0clu/food-ordering-app/blob/main/layout-3.png?raw=true)<br>
![layout-4  picture](https://github.com/ev0clu/food-ordering-app/blob/main/layout-4.png?raw=true)<br>

### Assets

[Home page picture from Flo Dahm on Pexels](https://www.pexels.com/photo/dinnerware-on-table-541216/)<br>
[About page picture from Mat Brown on Pexels](https://www.pexels.com/photo/close-up-photo-of-dinnerware-set-on-top-of-table-with-glass-cups-1395967/)<br>
[Contact page picture from Igor Starkov on Pexels](https://www.pexels.com/photo/two-green-potted-plants-791810/)<br>
[Menu items from All Recipes](https://www.allrecipes.com/)<br>
