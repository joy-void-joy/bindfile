import fs from 'fs';

export async function get({params: {file}}) {
	return {
		body: {
            content: fs.readFileSync(`userfiles/${file}`, {flag: 'a+'}).toString(),
		}
	};
}

export async function post({params: {file}, body})
{
    fs.writeFileSync(`userfiles/${file}`, body)

    return {};
}