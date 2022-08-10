import { useState, useEffect } from "react";
import MeetupList from "../components/meetups/MeetupList";



function AllMeetupsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [loadingMeetups, setLoadingMeetups] =  useState([])

    useEffect(() => {
        setIsLoading(false);
        fetch(
            'https://react-project-36ce6-default-rtdb.firebaseio.com/meetups.json'
            ).then(response => {
               return  response.json();
            }).then(data => {

                const meetups = [];

                for(const key in data) {
                    const meetup = {
                        id:key,
                        ...data[key]
                    }

                    meetups.push(meetup)
                }
                
                setIsLoading(false);
                setLoadingMeetups(data);
            });
    },[]);

    if(isLoading) {
        return <section>
            <p>Loading...</p>
        </section>
    }

    return <section>
        <h1>Todas </h1>
        <MeetupList meetups={loadingMeetups} />
        
    </section>
}

export default AllMeetupsPage;