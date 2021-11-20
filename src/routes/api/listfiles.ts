import fs from 'fs';

export async function get({params: {file}}) {
	return {
		body: {
            files: fs.readdirSync('userfiles'),
		}
	};
}