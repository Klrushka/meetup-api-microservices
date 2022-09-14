import { user } from '../../models/db/user'

export const isUserExist = async (email: string) => {
    const isUser = await user.findOne({ email })

    return !!isUser
}
