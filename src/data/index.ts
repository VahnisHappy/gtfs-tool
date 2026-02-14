
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

export const timezoneOptions = [
    { value: 'Asia/Bangkok', label: 'Asia/Bangkok (UTC+7)' },
    { value: 'Asia/Singapore', label: 'Asia/Singapore (UTC+8)' },
    { value: 'Asia/Tokyo', label: 'Asia/Tokyo (UTC+9)' },
    { value: 'Asia/Shanghai', label: 'Asia/Shanghai (UTC+8)' },
    { value: 'Asia/Hong_Kong', label: 'Asia/Hong_Kong (UTC+8)' },
    { value: 'Asia/Seoul', label: 'Asia/Seoul (UTC+9)' },
    { value: 'Asia/Jakarta', label: 'Asia/Jakarta (UTC+7)' },
    { value: 'Asia/Manila', label: 'Asia/Manila (UTC+8)' },
    { value: 'Asia/Kolkata', label: 'Asia/Kolkata (UTC+5:30)' },
    { value: 'Europe/London', label: 'Europe/London (UTC+0)' },
    { value: 'Europe/Paris', label: 'Europe/Paris (UTC+1)' },
    { value: 'Europe/Berlin', label: 'Europe/Berlin (UTC+1)' },
    { value: 'America/New_York', label: 'America/New_York (UTC-5)' },
    { value: 'America/Los_Angeles', label: 'America/Los_Angeles (UTC-8)' },
    { value: 'America/Chicago', label: 'America/Chicago (UTC-6)' },
    { value: 'Australia/Sydney', label: 'Australia/Sydney (UTC+10)' },
    { value: 'Pacific/Auckland', label: 'Pacific/Auckland (UTC+12)' },
]

export const wheelchairBoardingOptions = [
    { value: '0', label: 'No information' },
    { value: '1', label: 'Some accessible' },
    { value: '2', label: 'Not possible' },
]

export const stopAccessOptions = [
    { value: '0', label: 'Public access' },
    { value: '1', label: 'Restricted access' },
    { value: '2', label: 'Staff only' },
]

// mode mark will map to new stop in stop state