import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme'; // Optional custom theme
import '../styles/globals.css'; // Optional global styles

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          {children}
        </ChakraProvider>
      </body>
    </html>
  );
}
