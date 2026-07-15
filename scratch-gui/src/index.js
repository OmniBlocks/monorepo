/**
 * @file index.js
 * @description Entry point for the OmniBlocks GUI.
 * This file initializes the React application and connects the core workflow
 * orchestration logic to the visual drag-and-drop interface.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { WorkflowProvider } from './context/WorkflowContext';
import './styles/global.css';

// Initialize the root component
const root = ReactDOM.createRoot(document.getElementById('root'));

/**
 * The WorkflowProvider wraps the entire application to ensure that 
 * the state of the AI blocks (LLM nodes, Prompt nodes, etc.) is 
 * accessible throughout the drag-and-drop canvas.
 */
root.render(
  <React.StrictMode>
    <WorkflowProvider>
      <App />
    </WorkflowProvider>
  </React.StrictMode>
);

// Performance monitoring for production builds
if (process.env.NODE_ENV === 'production') {
  console.log('OmniBlocks GUI initialized in production mode.');
}
