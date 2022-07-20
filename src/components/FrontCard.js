import "./../assets/css/FrontCard.css";
import {IMAGE_PREFIX} from "../constants/constants";

const FrontCard = (props) => {
    const {
        vocabulary
    } = props;
    return (
        <div className="FrontCard_wrapper">
            <div style={{
                width: 'calc(100% - 20px)',
                height: '100%',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundImage: `url(${IMAGE_PREFIX + vocabulary.code + ".jpg"})`
            }}>

            </div>
        </div>
    )
}

export default FrontCard;