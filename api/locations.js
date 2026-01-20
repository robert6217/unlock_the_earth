
const { Client } = require('@notionhq/client');
const Parser = require('rss-parser');

const notion = new Client({
	auth: process.env.NOTION_API_KEY,
});

const parser = new Parser();

const YOUTUBE_CHANNEL_ID = 'UCK3UVOXNDeMOKpQcc8ix82w';
const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;

async function fetchNotionData(dataSourceId) {
	let allResults = [];
	let hasMore = true;
	let cursor = undefined;

	console.log(`Using Data Source ID: ${dataSourceId} for query...`);

	while (hasMore) {
		const response = await notion.dataSources.query({
			data_source_id: dataSourceId,
			start_cursor: cursor,
		});

		allResults = allResults.concat(response.results);
		hasMore = response.has_more;
		cursor = response.next_cursor;
	}

	console.log('Total Notion API response:', allResults.length);

	return allResults;
}

module.exports = async (req, res) => {
	// CORS Headers
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
	);

	if (req.method === 'OPTIONS') {
		res.status(200).end();
		return;
	}

	try {
		const dataSourceId = process.env.NOTION_DATABASE_ID;

		if (!dataSourceId) {
			throw new Error("Can't find database_id");
		}

		const [notionResponse, youtubeFeed] = await Promise.all([
			fetchNotionData(dataSourceId),
			parser.parseURL(YOUTUBE_RSS_URL).catch(err => {
				console.error("YouTube RSS Error:", err);
				return null;
			})
		]);

		let latestFromYT = null;
		if (youtubeFeed && youtubeFeed.items.length > 0) {
			const latestVideo = youtubeFeed.items[0];
			latestFromYT = {
				id: latestVideo.id,
				name: "YouTube 最新上架",
				continent: "Latest",
				isGeneral: true,
				coordinates: { lat: null, lng: null },
				podcast: {
					title: latestVideo.title,
					url: latestVideo.link,
				}
			};
		}

		const formattedData = notionResponse.map((page) => {
			if (!page.properties) return null;

			const props = page.properties;
			return {
				id: page.id,
				name: props.Name?.title?.[0]?.plain_text || "Unnamed",
				continent: props.Continent?.select?.name || "Other",
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

		const finalLatest = latestFromYT || (formattedData.length > 0 ? formattedData[0] : null);

		res.json({
			latest: finalLatest,
			locations: formattedData
		});

	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error', details: error.message });
	}
};
