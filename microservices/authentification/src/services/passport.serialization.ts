const serialize = (user: any, done: any) => {
    done(null, user.email)
}

const deserialize = async (user: any, done: any) => {
    done(null, user)
}

export { serialize, deserialize }
