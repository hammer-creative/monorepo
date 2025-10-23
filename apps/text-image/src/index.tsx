import { GlobalStyles } from '@contentful/f36-components';
import { SDKProvider } from '@contentful/react-apps-toolkit';
import React from 'react';
import { createRoot } from 'react-dom/client';
import Field from './Field';
import './styles.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <SDKProvider>
      <GlobalStyles />
      <Field />
    </SDKProvider>
  </React.StrictMode>,
);
