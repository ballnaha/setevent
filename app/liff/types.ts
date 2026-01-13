export interface EventTimeline {
    id: string;
    title: string;
    description: string | null;
    images: string | null;
    progress: number | null;
    status: string;
    order: number;
    dueDate: string | null;
    completedAt: string | null;
    createdAt: string;
}

export interface ChatLog {
    id: string;
    message: string;
    direction: string;
    messageType: string;
    createdAt: string;
    senderName?: string;
}

export interface EventData {
    id: string;
    eventName: string;
    inviteCode: string;
    eventDate: string | null;
    venue: string | null;
    description: string | null;
    status: string;
    timelines: EventTimeline[];
    chatLogs: ChatLog[];
    customerDisplayName?: string | null;
}

export interface EventSummary {
    id: string;
    eventName: string;
    inviteCode: string;
    eventDate: string | null;
    venue: string | null;
    status: string;
    tasksCount?: number;
    customerPictureUrl?: string | null;
    isReviewed?: boolean;
}
