import checkmarkIcon from '../assets/checkmark-icon.svg';
import './Header.module.css';


function Header() {

    return (
        <>
            <nav>
                <img src={checkmarkIcon} alt="" />
                <h1>Organize your week</h1>
            </nav>
        </>
    );
}

export default Header;