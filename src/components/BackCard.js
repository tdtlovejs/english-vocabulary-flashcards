import "./../assets/css/BackCard.css";

const BackCard = (props) => {
    const {
        vocabulary
    } = props;
    return (
        <div className="BackCard_wrapper">
            <div className="BackCard_word">
                {vocabulary.word}
            </div>
        </div>
    )
}

export default BackCard;