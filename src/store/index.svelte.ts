export const forms: TForms = {
    'Client datails': [
        [{ title: 'First name' }, { title: 'Last name' }],

        [{ title: 'Phone' }],
        [{ title: 'Email (optional)' }],
    ],

    'Job datails': [
        [
            {
                title: 'Job type',
                options: ['Full-time', 'Part-time', 'Contract'],
            },
            { title: 'Job Source', options: ['Internal', 'External'] },
        ],
        [{ title: 'Job description (optional)' }],
    ],
    'Service location': [
        [{ title: 'Address' }],
        [{ title: 'City' }],
        [{ title: 'State' }],
        [{ title: 'Zip code' }, { title: 'Area' }],
    ],
    Sheduled: [
        [{ title: 'Start date' }],
        [{ title: 'Start time' }, { title: 'End time' }],
        [{ title: 'Test select' }],
    ],
};

export const formStore = $state<{ [key: string]: string }>({});

function getFields() {
    let fields = [];

    for (const key in forms) {
        for (const row of forms[key]) {
            for (const el of row) {
                fields.push(el.title);
            }
        }
    }

    return fields;
}

export const customFields = $state<string[]>(getFields());

type TForms = {
    [key: string]: { title: string; options?: string[] }[][];
};
