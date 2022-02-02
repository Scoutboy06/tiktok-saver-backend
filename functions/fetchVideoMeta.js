// TODO: Optimize json parsing to only include ItemModule
// TODO: Remove html parsing and do inline search instead

import HTMLParser from 'node-html-parser';
import fetch from 'node-fetch';

export default async function fetchVideoMeta(url) {
	// console.log('Fetch video : ' + url);

	const raw = await fetch(url);
	if (raw.status !== 200) throw new Error(raw.status);

	const html = await raw.text();

	// Video is probably removed
	if (html.indexOf('ItemModule') === -1) throw new Error('Video is probably removed');

	const document = HTMLParser.parse(html);


	let script = document.querySelector('script#sigi-persisted-data');
	if (!script) throw new Error('No script tag found');
	script = script.innerHTML;
	script = script.slice(21, script.indexOf(";window['SIGI_RETRY']"));

	const json = JSON.parse(script);

	const item = json.ItemModule[Object.keys(json.ItemModule)[0]];


	const video = getValues(item.video,
		'id,height,width,duration,ratio,cover,dynamicCover,playAddr,downloadAddr,format'.split(',')
	);

	const author = {
		nickname: item.author,
		id: item.authorId,
		avatarThumb: item.avatarThumb,
	};

	const music = getValues(item.music,
		'id,title,playUrl,authorName,original,duration'.split(',')
	);
	const stats = getValues(item.stats,
		'diggCount,shareCount,commentCount,playCount'.split(',')
	);

	const data = {
		url,
		tiktokId: item.id,
		desc: item.desc,
		createTime: item.createTime,
		video,
		author,
		music,
		stats,
	};

	return data;
}


function getValues(obj, keys) {
	const data = {};
	keys.forEach(key => { data[key] = obj[key] });
	return data;
}
