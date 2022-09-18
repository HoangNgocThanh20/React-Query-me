import { useQuery } from "react-query";
import axios from 'axios';

const fetchUserByEmail = (email) => {
    return axios.get(`http://localhost:4000/users/${email}`)
}

const fetchCourseByChannelId = (channelId) => {
    return axios.get(`http://localhost:4000/channels/${channelId}`)
}

export const DependentQueriesPage = ({ email }) => {
    const { data: user } = useQuery(['user',email], () => fetchUserByEmail(email))
    const channelId = user?.data.channelId

    const {data: courses} = useQuery(['courses', channelId], () => fetchCourseByChannelId(channelId), {
        enabled: !!channelId,
    })

    console.log({user, courses});

    return <div>DependentQueries</div>
}