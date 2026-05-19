const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Set viewport to a standard desktop size
  await page.setViewport({ width: 1280, height: 800 });

  const captureScreenshot = async (url, filename) => {
    try {
      console.log(`Navigating to ${url}...`);
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
      // Add a slight delay for animations
      await new Promise(r => setTimeout(r, 2000));
      const filepath = path.join(__dirname, 'public', 'screenshots', filename);
      await page.screenshot({ path: filepath, fullPage: true });
      console.log(`Saved screenshot: ${filename}`);
    } catch (e) {
      console.error(`Failed to capture ${url}:`, e);
    }
  };

  // List of URLs to capture
  const BASE_URL = 'http://localhost:3000'; // Assuming Next.js runs on 3000 or 3002. Let's try 3002 as well if this fails.
  const routes = [
    { url: `${BASE_URL}/`, file: 'home.png' },
    { url: `${BASE_URL}/search`, file: 'search.png' },
    { url: `${BASE_URL}/profile`, file: 'profile.png' },
    { url: `${BASE_URL}/saved`, file: 'saved.png' }
  ];

  for (const route of routes) {
    await captureScreenshot(route.url, route.file);
  }

  await browser.close();
  console.log('All screenshots captured!');
})();
