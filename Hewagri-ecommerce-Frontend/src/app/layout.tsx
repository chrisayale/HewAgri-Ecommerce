"use client";

import { Provider } from "react-redux";
import "../styles/globals.css";
import { AuthWrapper, ThemeProvider, ToastProvider } from "@/context";
import { persistor, store } from "@/lib/redux/store";
import Script from "next/script";
import { ModalProvider } from "@/components/layout";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <title className="notranslate">HewAgri</title>
        <link rel="icon" href="./images/icons/favicon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="description"
          content="HewAgri is a platform for buying and selling agricultural products."
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="HewAgri App" />
        <link rel="apple-touch-icon" href="/assets/icons/icon-512x512.png" />

        <Script src="/scripts/translation.js" strategy="beforeInteractive" />
        {process.env.GOOGLE_TRANSLATION_CONFIG && (
          <Script
            src="//translate.google.com/translate_a/element.js?cb=TranslateInit"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <AuthWrapper>
              <ThemeProvider>
                <ToastProvider>
                  <ModalProvider>{children}</ModalProvider>
                </ToastProvider>
              </ThemeProvider>
            </AuthWrapper>
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
}
