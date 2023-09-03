// const express = require('express');
// const axios = require('axios');

// const app = express();
// const port = 8008;

// // Middleware to parse JSON request bodies
// app.use(express.json());

// app.get('/numbers', async (req, res) => {
//   const urls = req.query.url;

//   if (!urls || !Array.isArray(urls)) {
//     return res.status(400).json({ error: 'No valid URLs provided' });
//   }

//   const allNumbers = [];

//   // Define a function to fetch data from a URL and handle timeouts
//   async function fetchData(url) {
//     try {
//       const response = await axios.get(url, { timeout: 5000 }); // Adjust the timeout as needed
//       const data = response.data;

//       if (Array.isArray(data.numbers)) {
//         allNumbers.push(...data.numbers);
//       }
//     } catch (error) {
//       console.error(`Error fetching data from ${url}: ${error.message}`);
//     }
//   }

//   // Use Promise.all to fetch data from all URLs concurrently
//   await Promise.all(urls.map((url) => fetchData(url)));

//   // Remove duplicates and sort the collected numbers
//   const uniqueSortedNumbers = [...new Set(allNumbers)].sort((a, b) => a - b);

//   res.json({ numbers: uniqueSortedNumbers });
// });

// app.listen(port, () => {
//   console.log(`number-management-service is running on port ${port}`);
// });

const express = require('express');
const axios = require('axios');

const app = express();
const port = 8008;

app.use(express.json());

app.get('/numbers', async (req, res) => {
  const urls = req.query.url;

  if (!Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'No valid URLs provided' });
  }

  const allNumbers = [];

  async function fetchData(url) {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      const data = response.data;

      if (Array.isArray(data.numbers)) {
        allNumbers.push(...data.numbers);
      }
    } catch (error) {
      console.error(`Error fetching data from ${url}: ${error.message}`);
    }
  }

  await Promise.all(urls.map(fetchData));

  const mergedNumbers = [...new Set(allNumbers)].sort((a, b) => a - b);

  res.json({ numbers: [mergedNumbers] });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

