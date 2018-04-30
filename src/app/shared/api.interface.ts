
export const ticketStatuses = [
    'active', 'closed', 'open'
];
export interface Ticket {
    status: string;
}

export const vendorProfessions = [
    'plumber', 'IT', 'electrician', 'janitor'
];
export interface Vendor {
    name: string;
    distance: number;
    professions: Array<string>;
    responseTime: number;
    rating: number;
    assignedTickets?: Array<Ticket>;
}
