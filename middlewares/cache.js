// import mcache from 'memory-cache';

let saved = {};

export default function cache(duration) { // duration in seconds
	return (req, res, next) => {
		const key = '__express__' + (req.originalUrl || req.url);
		const cached = saved[key];

		if (cached && (cached.savedAt + cached.duration * 1000 > Date.now())) {
			res.send(cached.body);
		}
		else {
			res.sendResponse = res.send;
			res.send = body => {
				saved[key] = {
					body,
					savedAt: Date.now(),
					duration,
				};
				res.sendResponse(body);
			}
			next();
		}
	}
}

export function removeCache(key) {
	if (saved[key]) delete saved[key];
}

export function wipeCache() {
	saved = {};
}