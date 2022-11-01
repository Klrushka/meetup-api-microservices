import { MeetupInterface } from '../src/interfaces/meetupInterface';
import { meetup } from '../src/model/db/meetup';

export const findMeetupsByFuzzyTitle = async (title = ''): Promise<MeetupInterface[]> => {
  const regex = new RegExp(`.*${title}*.`);
  const foundedMeetups = await meetup.find()
    .then(allMeetups => allMeetups.filter(item => regex.test(item.title)));
  return foundedMeetups;
};
