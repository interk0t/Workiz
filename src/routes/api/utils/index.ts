import { getValidToken } from '../auth/index.js';
import { customFields } from '../../../store/index.svelte.js';

export async function checkCustomFields() {
    const _customFields = await getCustomFields();

    const existingFields = _customFields.map(
        (field: { name: string }) => field.name,
    );

    const missingFields = customFields.filter(
        (field) => !existingFields.includes(field),
    );
    if (missingFields.length > 0) {
        await addCustomFields(missingFields);
    } else {
        console.log('Все кастомные поля уже созданы');
    }
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function apiRequest(
    endpoint: string,
    method: string = 'GET',
    body?: any,
) {
    const url =
        method === 'GET' ? '/api/auth/?action=get_custom_fields' : `/api/auth/`;
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : undefined,
        });
        const result = await response.json();
        if (!result.success) {
            console.error(`Ошибка: ${result.error}`);
            throw new Error(result.error);
        }
        return result.data;
    } catch (error) {
        console.error(`Ошибка запроса ${method} ${url}:`, error);
        throw error;
    }
}

export async function getCustomFields() {
    try {
        const response = await fetch('/api/auth/?action=get_custom_fields', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log(data);

        if (data.success) {
            console.log('Custom fields fetched successfully');
            return data.data;
        } else {
            throw new Error('Failed to get custom fields');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

export async function addCustomFields(missingFields: string[]) {
    for (const field of missingFields) {
        await apiRequest('dealFields', 'POST', {
            name: field,
            field_type: 'text',
        });
        console.log(`Кастомное поле "${field}" создано`);
    }
}

export async function setDealFields(
    dealId: number,
    key: string,
    value: string,
) {
    const data = { [key]: value };
    await apiRequest(`deals/${dealId}`, 'PUT', data);
    console.log(`Поле ${key} обновлено значением: ${value}`);
}

export async function getDealFields() {
    const fields = await getCustomFields();
    return fields.filter((field: { name: string; key: string }) =>
        customFields.includes(field.name),
    );
}
