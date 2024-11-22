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
        [{ title: 'Star date' }],
        [{ title: 'Start time' }, { title: 'End time' }],
        [{ title: 'Test select' }],
    ],
};

type TForms = {
    [key: string]: { title: string; options?: string[] }[][];
};
