import { Response, NextFunction } from 'express'
import { RequestInterface } from '../../interfaces/requetInterface'
import { meetup } from '../../model/db/meetup'
import { client } from '../../model/db/esclient' 

export async function create(req: RequestInterface, res: Response, next: NextFunction){
    try {
        const payload = {...req.body, ...{ userId: req?.userId }}
        const newMeetup = await meetup.create(payload)
        await client.index({
            index: 'meetup',
            body: {...newMeetup},
        })
    
        res.status(200).json(newMeetup)
    } catch (err) {
        next(err)   
    }

}