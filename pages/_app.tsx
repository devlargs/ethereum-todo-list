import { ChakraProvider } from "@chakra-ui/react";
import { AppProps } from "next/app";
import React, { FC } from "react";

const App: FC<AppProps> = ({ Component, pageProps }) => (
  <ChakraProvider>
    <Component {...pageProps} />
  </ChakraProvider>
);

export default App;
