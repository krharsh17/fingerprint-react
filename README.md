# Browser fingerprint generation in React

> using [fingerprintJS](https://fingerprint.com/)

## Clone the project

- Fork the repo
- Clone this repo using HTTPS by doing `git clone https://github.com/<your_github_username>/browser-fingerprint-react.git`.

## Environment Variables

This project uses Vite. Vite requires you to prefix your environment variables with `VITE_` to be able to expose to the frontend. Variables which are only to be used at the backend, don't need a prefix.

Create a `.env` file at the root of the project where you can set your environment variables. An example env file has already been created for you (`.env.example`).

### Getting env variables

There are four env variables you need:

```env
VITE_FPJS_API_KEY=your_public_api_key
SERVER_FPJS_API_KEY=your_secret_server_key
VITE_FPJS_REGION=your_fpjs_region
FPJS_REGION=your_fpjs_region
```

1. You can get the public API key for your application from the Fingerprint dashboard by navigating to **App Settings**, selecting the **API Keys** tab, and locating it under the **Public Keys** section. Set it against `VITE_FPJS_API_KEY`.

![Fingerprint dashboard](https://i.imgur.com/BGuAwH7.png)

2. To get the server API secret key, go to `Dashboard > App Settings > API Keys > Secret Keys`. Set it against `SERVER_FPJS_API_KEY`.

![Server API key](https://i.imgur.com/HEIdxX3.png)

3. For `VITE_FPJS_REGION` and `FPJS_REGION`, specify the region you selected during registration. For example, `eu` or `ap`.

## What is it about

This repo contains a simple authentication project using fingerprinting provided by FingerprintJS. It shows you how you can generate a unique fingerprint in the browser using React and also, it has examples to some common server side validations which you can perform when using fingerprinting.

## Run it locally

Start the server

> npm run app:server

It will be live at port `5000`.

---

Run React

> npm run app:client

The app should start at port `3000`.

Navigate to the **Sign Up** page and try to register as a user:

![Sign-up](https://i.imgur.com/EC84RI9.png)

On successful sign-up, you will be redirected to the dashboard page:

![Dashboard](https://i.imgur.com/iyRRA6n.png)

If you try to sign up again with the same username, you won't be able to because of the `visitorId` validation on the server. Log in to go to the dashboard again.

![Sign-up failed](https://i.imgur.com/IW5GwVg.png)

You can also try this in an incognito window. The sign-up would still fail because fingerprinting isn't affected by incognito mode.