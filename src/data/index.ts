
export const sidebarContent = [ 'stops', 'routes', 'calendar', 'trips', 'project']
export const modes = [ 'view', 'mark', 'draw', 'drag', 'new']
export const routeTypeOptions = [
        { value: '0', label: 'Tram, Streetcar, Light rail' },
        { value: '1', label: 'Subway, Metro' },
        { value: '2', label: 'Rail' },
        { value: '3', label: 'Bus' },
        { value: '4', label: 'Ferry' },
        { value: '5', label: 'Cable tram' },
        { value: '6', label: 'Aerial lift' },
        { value: '7', label: 'Funicular' },
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
    {index: 1, label: 'added service'},
    {index: 2, label: 'removed service'}
]

export const locationTypeOption = [
    {value: `0`, label: 'stop'},
    {value: `1`, label: 'station'},
    {value: `2`, label: 'entrance/exit'},
    {value: `3`, label: 'generic node'},
    {value: `4`, label: 'boarding area'}
]

// mode mark will map to new stop in stop state