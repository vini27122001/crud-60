import {Link} from 'react-router-dom'
import classes from  './MainNav.module.css'

function MainNav() {
    return(
    <header className={classes.header} >
        <div className={classes.logo}>
            React nav
            <nav>
                <ul>
                    <li>
                   <Link to='/'>some link</Link>
                    </li>
                    <li>
                   <Link to='/new'>nwew</Link>
                    </li>
                    <li>
                   <Link to='/fav'>sfavvvk</Link>
                    </li>
                </ul>
            </nav>
        </div>
    </header>
    )
}

export default MainNav;