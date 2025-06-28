#!/bin/bash

# Install dependencies with exact versions
npm install --legacy-peer-deps \
  @neynar/nodejs-sdk@0.13.0 \
  axios@1.7.2 \
  cors@2.8.5 \
  dotenv@16.4.1 \
  express@4.19.2 \
  redis@4.6.13

# Build the project
npm run build
