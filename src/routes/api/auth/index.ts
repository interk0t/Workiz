import { writable } from 'svelte/store';

export const accessToken = writable(null);

export async function fetchData(endpoint) {
    const token = get(accessToken);

    const response = await fetch(`https://api.pipedrive.com/v1/${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.json();
}
