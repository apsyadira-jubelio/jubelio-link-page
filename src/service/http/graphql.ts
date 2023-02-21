import { Link as LinkType } from '@/hooks-generated';

export const createEvent = async (origin: string, type: string): Promise<void> => {
	await fetch(`${origin}/api/graphql`, {
		headers: {
			accept: 'application/json',
			'accept-language': 'en-US,en;q=0.9',
			'content-type': 'application/json',
			'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="98", "Google Chrome";v="98"',
			'sec-ch-ua-mobile': '?0',
			'sec-ch-ua-platform': '"Windows"',
			'sec-fetch-dest': 'empty',
			'sec-fetch-mode': 'cors',
			'sec-fetch-site': 'same-origin',
			Referer: 'http://localhost:3000/',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
		},
		body: JSON.stringify({
			operationName: 'createEvent',
			variables: { type },
			query: `mutation createEvent($type: EVENT_TYPE) {
        createEvent(type: $type) {
          id
          type
          created_at
          __typename
        }
      }`,
		}),
		method: 'POST',
	});
};

export const fetchLinks = async (origin: string): Promise<LinkType[]> => {
	const res = await fetch(`${origin}/api/graphql`, {
		headers: {
			accept: 'application/json',
			'content-type': 'application/json',
		},
		body: '{"operationName":"listLinks","variables":{},"query":"query listLinks {\\n  listLinks {\\n    id\\n    label\\n    content\\n    type\\n    position\\n    __typename\\n  }\\n}\\n"}',
		method: 'POST',
	});
	const data = await res.json();
	return data.data.listLinks;
};
