import NewMeetupForm from "../components/meetups/NewMeetupForm";
import { useNavigate  } from 'react-router-dom';

function NewMeetup() {
    const history = useNavigate();

    function addMeeetupHandler(meetupData) {
        fetch('https://react-project-36ce6-default-rtdb.firebaseio.com/meetups.json',
        {
            method: 'POST',
            body: JSON.stringify(meetupData),
            headers: {
                'Content-Type': 'aplication/json'
            }
        }).then(() => {
            history('/')
        });
    }

    return (
        <section>
            <NewMeetupForm onAddMeetup={addMeeetupHandler}/>
        </section>
    )
}

export default NewMeetup;