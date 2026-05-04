export const sidebarContent = ['stops', 'routes', 'calendar', 'trips', 'project', 'exportGTFS']
export const modes = ['view', 'mark', 'draw', 'drag', 'new', 'polygon', 'pickA', 'pickB']
export const routeTypeOptions = [
    { value: 0, label: 'Tram, Streetcar, Light rail' },
    { value: 1, label: 'Subway, Metro' },
    { value: 2, label: 'Rail' },
    { value: 3, label: 'Bus' },
    { value: 4, label: 'Ferry' },
    { value: 5, label: 'Cable tram' },
    { value: 6, label: 'Aerial lift' },
    { value: 7, label: 'Funicular' },
];

export const days = [
    { index: 0, key: 'sun', label: 'sun' },
    { index: 1, key: 'mon', label: 'mon' },
    { index: 2, key: 'tues', label: 'tues' },
    { index: 3, key: 'wed', label: 'wed' },
    { index: 4, key: 'thurs', label: 'thurs' },
    { index: 5, key: 'fri', label: 'fri' },
    { index: 6, key: 'sat', label: 'sat' }
] as const

export const exceptionDate = [
    { index: 1, label: 'added service' },
    { index: 2, label: 'removed service' }
]

export const locationTypeOption = [
    { value: `0`, label: 'stop' },
    { value: `1`, label: 'station' },
    { value: `2`, label: 'entrance/exit' },
    { value: `3`, label: 'generic node' },
    { value: `4`, label: 'boarding area' }
]

export const timezoneOptions = Intl.supportedValuesOf('timeZone').map((tz) => {
    const offset = new Intl.DateTimeFormat('en', { timeZone: tz, timeZoneName: 'shortOffset' })
        .formatToParts(new Date())
        .find((p) => p.type === 'timeZoneName')?.value ?? '';
    return { value: tz, label: `${tz} (${offset})` };
})

export const wheelchairBoardingOptions = [
    { value: '0', label: 'No information' },
    { value: '1', label: 'Some accessible' },
    { value: '2', label: 'Not possible' },
]

export const stopAccessOptions = [
    { value: '0', label: 'public access' },
    { value: '1', label: 'restricted access' },
    { value: '2', label: 'staff only' },
]

export const poi_categories = [
    {
        id: 'hospital', label: 'hospital', color: '#c9184a', weight: 3, mapboxCategories: ['hospital'],
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,64H176V56a24,24,0,0,0-24-24H104A24,24,0,0,0,80,56v8H40A16,16,0,0,0,24,80V208a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64ZM96,56a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM216,208H40V80H216V208Zm-72-64H152V136a8,8,0,0,0-16,0v8H128V136a8,8,0,0,0-16,0v8H104a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V160h8v8a8,8,0,0,0,16,0V160h8a8,8,0,0,0,0-16Z"/></svg>',
    },
    {
        id: 'education', label: 'education', color: '#219ebc', weight: 3, mapboxCategories: ['school', 'university'],
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M248,208h-8V128a16,16,0,0,0-16-16H168V48a16,16,0,0,0-16-16H56A16,16,0,0,0,40,48V208H32a8,8,0,0,0,0,16H248a8,8,0,0,0,0-16Zm-24-80v80H168V128ZM56,48h96V208H136V160a8,8,0,0,0-8-8H80a8,8,0,0,0-8,8v48H56Zm64,160H88V168h32ZM72,96a8,8,0,0,1,8-8H96V72a8,8,0,0,1,16,0V88h16a8,8,0,0,1,0,16H112v16a8,8,0,0,1-16,0V104H80A8,8,0,0,1,72,96Z"/></svg>',
    },
    {
        id: 'shopping_mall', label: 'shopping mall', color: '#fb6f92', weight: 3, mapboxCategories: ['shopping_mall'],
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M216,64H176a48,48,0,0,0-96,0H40A16,16,0,0,0,24,80V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V80A16,16,0,0,0,216,64ZM128,32a32,32,0,0,1,32,32H96A32,32,0,0,1,128,32Zm88,168H40V80H80v16a8,8,0,0,0,16,0V80h64v16a8,8,0,0,0,16,0V80h40Z"/></svg>',
    },
    {
        id: 'park', label: 'park', color: '#588157', weight: 1, mapboxCategories: ['park'],
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M128,16a88.1,88.1,0,0,0-88,88c0,23.4,9.4,49.4,24.5,68a8,8,0,0,0,6.1,2.8,7.8,7.8,0,0,0,5.2-1.9,8,8,0,0,0,.9-11.3C64,146.5,56,125.2,56,104a72,72,0,0,1,144,0c0,21.2-8,42.5-20.7,57.6a8,8,0,0,0,.9,11.3,7.8,7.8,0,0,0,5.2,1.9,8,8,0,0,0,6.1-2.8C206.6,153.4,216,127.4,216,104A88.1,88.1,0,0,0,128,16Zm0,200a8,8,0,0,0,8-8V136a8,8,0,0,0-16,0v72A8,8,0,0,0,128,216Zm-28.7-55.4a8,8,0,0,0-11.3,0l-16,16a8,8,0,0,0,11.3,11.3l16-16A8,8,0,0,0,99.3,160.6Zm57.4,0a8,8,0,0,0,0,11.3l16,16a8,8,0,0,0,11.3-11.3l-16-16A8,8,0,0,0,156.7,160.6Z"/></svg>',
    },
    {
        id: 'government_office', label: 'government', color: '#607D8B', weight: 3, mapboxCategories: ['government_office'],
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M248,208H232V96a8,8,0,0,0-8-8H160V40a8,8,0,0,0-8-8H32a8,8,0,0,0-8,8V208H8a8,8,0,0,0,0,16H248a8,8,0,0,0,0-16ZM40,48H144V208H120V160a8,8,0,0,0-8-8H72a8,8,0,0,0-8,8v48H40Zm80,160H80V168h40Zm96,0H160V104h56ZM72,80a8,8,0,0,1,8-8H96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,80Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H128A8,8,0,0,1,120,80ZM72,120a8,8,0,0,1,8-8H96a8,8,0,0,1,0,16H80A8,8,0,0,1,72,120Zm48,0a8,8,0,0,1,8-8h16a8,8,0,0,1,0,16H128A8,8,0,0,1,120,120Z"/></svg>',
    },
    {
        id: 'transit_hub', label: 'transit hub', color: '#ffd60a', weight: 3, mapboxCategories: ['bus_station', 'train_station'],
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"><path d="M184,48H72A32,32,0,0,0,40,80v96a32,32,0,0,0,32,32H80L64,224a8,8,0,0,0,16,0l18.67-16h58.66L176,224a8,8,0,0,0,16,0l-16-16h8a32,32,0,0,0,32-32V80A32,32,0,0,0,184,48Zm16,128a16,16,0,0,1-16,16H72a16,16,0,0,1-16-16V80A16,16,0,0,1,72,64H184a16,16,0,0,1,16,16Zm-16-48a8,8,0,0,1-8,8H80a8,8,0,0,1,0-16h96A8,8,0,0,1,184,128ZM80,160a12,12,0,1,1,12,12A12,12,0,0,1,80,160Zm72,0a12,12,0,1,1,12,12A12,12,0,0,1,152,160Z"/></svg>',
    }
];

// mode mark will map to new stop in stop state