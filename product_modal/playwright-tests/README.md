# Playwright Test Suite for UI Automation Tests
## Overview
This test suite includes automated tests for the following:
Functional Testing
o Test Case TC-001: Product Page Overlay Options and Article Details.
o Test Case TC-002: Product Page Overlay, click on a different color changes the slideshow images as well as the availabilities of the sizes

## Author
Jon Paulo Ojon

## Prerequisites
* Node.js (v14 or later), find installer on https://nodejs.org/en/download/package-manager site
* Playwright

## Installation
1. Clone the repository and go to project directory
- change directory to folder playwright-tests

2. Install the dependencies:
- npm install 
- npx playwright install

## Test Cases
- Test Case TC-001: Product Page Overlay Options and Article Details.
- Test Case TC-002: Product Page Overlay, click on a different color changes the slideshow images as well as the availabilities of the sizes

## Test Data
- Should contain the .json file of the article to be verified.

## Running Tests
Use the following commands in any terminal or cmd line to run tests in different browsers:
1. npm run test:local       : run all tests using the localhost environment
2. npm run test:network     : run all tests using the network environment
3. npm run test:production  : run all tests using the production environment

## Configuration
Configuration can be changed under playwright.config.ts
- headless                  : can either be true or false, false means browser would show up when tests are run
- timeout                   : Global timeout for all tests
- expect: timeout           : Timeout for expect() assertions
- projects: use: viewport   : Desktops, Mobilephones, Tablets, Screen size, adjust accordingly

Under .env file
- URL of each environment, adjust accordingly.

## Recommendations
- **Resource Management:** Consider running tests in individual browsers to manage resources effectively and reduce flakiness.
- **Debugging:** If encountering issues, review logs and screenshots to diagnose problems. Adjust test cases if needed to handle browser-specific behaviors.

## Links to Documentation
- Playwright: https://playwright.dev/docs/intro