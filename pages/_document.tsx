import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang='en'>
      <Head>
        <meta property='og:title' content='Redeclarations' />
        <meta
          name='description'
          content='A reclaiming of the Declaration of Independence by those who never signed it.'
        />
        <meta
          property='og:description'
          content='A reclaiming of the Declaration of Independence by those who never signed it.'
        />
        <link rel="icon" href="/favicon.ico" />
        <meta
          property='og:image'
          content='https://redeclarations.com/social.png?v=2.0'
        />
        <meta property='og:image:width' content='1200' />
        <meta property='og:image:height' content='630' />
        <meta name='twitter:card' content='summary_large_image' />
        <meta property='twitter:domain' content='redeclarations.com' />
        <meta property='twitter:url' content='https://redeclarations.com/' />
        <meta name='twitter:title' content='Redeclarations' />
        <meta
          name='twitter:description'
          content='A reclaiming of the Declaration of Independence by those who never signed it.'
        />
        <meta
          name='twitter:image'
          content='https://redeclarations.com/social.png?v=2.0'
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
