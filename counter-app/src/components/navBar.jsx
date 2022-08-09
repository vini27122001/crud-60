

const NavBar = ({ totalCounters}) => {
    return (
        <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
        <h1 className="navbar-brand" >Navbar</h1>
         
         <span className='badge bg-pill bg-secondary'>
            {totalCounters}
         </span>
        </div>
        </nav>
    );
}

 
export default NavBar;