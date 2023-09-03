//importing necessary modules
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

  const numberList = [];

  async function fetchData(url) {
    try {
      const response = await axios.get(url, { timeout: 5000 });
      const data = response.data;

      if (Array.isArray(data.numbers)) {
        numberList.push(...data.numbers);  
      }
    } catch (error) {
      console.error(`Error fetching data from ${url}: ${error.message}`);
    }
  }

  await Promise.all(urls.map(fetchData));

  const mergedNumbers = [...new Set(numberList)].sort((a, b) => a - b);    //merging the numbers, removing duplicates and sorting

  res.json({ numbers: [mergedNumbers] });
});

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
