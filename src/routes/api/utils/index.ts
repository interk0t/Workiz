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

export async function apiRequest(method: string = 'GET', body?: any) {
    await getValidToken();
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
            console.error(`Ошибка: ${JSON.stringify(result)}`);
            throw new Error(JSON.stringify(result));
        }

        return result.data;
    } catch (error) {
        console.error(`Ошибка запроса ${method} ${url}:`, error);
        throw error;
    }
}

export async function getCustomFields() {
    return await apiRequest();
}

export async function addCustomFields(missingFields: string[]) {
    for (const field of missingFields) {
        await apiRequest('POST', {
            action: 'add_custom_fields',
            endpoint: 'dealFields',
            data: { name: field, field_type: 'text' },
        });
        console.log(`Кастомное поле "${field}" создано`);
    }
}

export async function setDealFields(
    dealId: number,
    key: string,
    value: string,
) {
    await apiRequest('PUT', {
        endpoint: `deals/${dealId}`,
        action: 'set_deal_fields',
        data: { [key]: value },
    });
    console.log(`Поле ${key} обновлено значением: ${value}`);
}

export async function getDealFields() {
    const fields = await getCustomFields();
    return fields.filter((field: { name: string; key: string }) =>
        customFields.includes(field.name),
    );
}
