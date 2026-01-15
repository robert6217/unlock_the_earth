const express = require('express');
const cors = require('cors');
const { Client } = require('@notionhq/client');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

const notion = new Client({
	auth: process.env.NOTION_API_KEY,
});

app.get('/api/locations', async (req, res) => {
	try {
		const dataSourceId = process.env.NOTION_DATABASE_ID;

		if (!dataSourceId) {
			throw new Error("Can't find database_id");
		}

		console.log(`Using Data Source ID: ${dataSourceId} for query...`);

		const response = await notion.dataSources.query({
			data_source_id: dataSourceId, 
		});

		const formattedData = response.results.map((page) => {
			if (!page.properties) return null;

			const props = page.properties;
			return {
			id: page.id,
			name: props.Name?.title?.[0]?.plain_text || "Unnamed",
			coordinates: {
				lat: props.Lat?.number || 0,
				lng: props.Lng?.number || 0,
			},
			podcast: {
				title: props.PodcastTitle?.rich_text?.[0]?.plain_text || "",
				url: props.PodcastUrl?.url || "#",
			}
			};
		}).filter(item => item !== null); // 過濾掉無效資料

		res.json(formattedData);

	} catch (error) {
		console.log(`Server is running on http://localhost:${port}`);
	}
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
