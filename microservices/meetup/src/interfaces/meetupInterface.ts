interface MeetupInterface {
    _id: {
        type: string,
    }
    title: {
        type: string,
    },
    description: {
        type: string,
    },
    dueTime: {
        type: Date,
    },
    tags: {
        type: [string],
    },
    userId: {
        type: string,
        allowNull: false
    }
    createdAt: {
        type: Date,
    },
    updatedAt: { 
        type: Date,
    },
}

