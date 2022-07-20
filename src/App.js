import './assets/css/App.css';
import {useEffect, useState} from "react";
import axios from "axios";
import Card from "./components/Card";
import 'antd/dist/antd.css';
import {
    API_DATA,
    ENGLISH_VOCABULARY_FLASHCARDS_KNOW_VOCABULARY,
    VIEW_TYPE_DONT_KNOW,
    VIEW_TYPE_KNOW
} from "./constants/constants";
import {
    BulbOutlined,
    QuestionCircleOutlined
} from "@ant-design/icons";

function App() {
    const [indexVocabulary, setIndexVocabulary] = useState(null);
    const [listVocabulary, setListVocabulary] = useState([]);
    const [listIndex, setListIndex] = useState([]);
    const [listKnowIndex, setListKnowIndex] = useState([]);
    const [refreshVocabulary, setRefreshVocabulary] = useState(false);
    const [viewType, setViewType] = useState(VIEW_TYPE_DONT_KNOW);
    const [initial, setInitial] = useState(false);
    useEffect(() => {
        const dataKnowIndex = localStorage.getItem(ENGLISH_VOCABULARY_FLASHCARDS_KNOW_VOCABULARY);
        const dataKnowIndexInitial = JSON.parse(dataKnowIndex);
        const dataInitial = Array.isArray(dataKnowIndexInitial) ? dataKnowIndexInitial : []
        setListKnowIndex(dataInitial);
        axios.get(API_DATA)
            .then(res => {
                setInitial(true);
                setListVocabulary(res.data)
                const listIndex = res.data.map((item, index) => index);
                setListIndex(listIndex)
                const listIndexOfType = viewType === VIEW_TYPE_KNOW ? dataInitial : listIndex.filter(item => !dataInitial.includes(item));
                const indexVocabulary = Math.floor(Math.random() * listIndexOfType.length);
                setIndexVocabulary(listIndexOfType[indexVocabulary]);
            })
    }, [])

    useEffect(() => {
        if (refreshVocabulary) {
            setRefreshVocabulary(false)
        }
    }, [refreshVocabulary])
    const onRefreshVocabulary = (viewTypeSelected) => {
        setIndexVocabulary(prev => {
            const isTypeKnow = viewTypeSelected !== undefined ? viewTypeSelected === VIEW_TYPE_KNOW : viewType === VIEW_TYPE_KNOW;
            const listIndexOfType = isTypeKnow ? listKnowIndex : listIndex.filter(item => !listKnowIndex.includes(item));
            while (1) {
                const indexVocabularyRandom = Math.floor(Math.random() * listIndexOfType.length);
                if (listIndexOfType.length <= 1 || listIndexOfType[indexVocabularyRandom] !== prev) {
                    setRefreshVocabulary(true);
                    return listIndexOfType[indexVocabularyRandom];
                }
            }
        })
    }



    const onKnowVocabulary = () => {
        if (!listKnowIndex.includes(indexVocabulary)) {
            setListKnowIndex(prev => prev.concat(indexVocabulary))
        } else {
            onRefreshVocabulary();
        }
    }
    const onDontKnowVocabulary = () => {
        if (listKnowIndex.includes(indexVocabulary)) {
            setListKnowIndex(prev => prev.filter(indexA => indexA !== indexVocabulary))
        } else {
            onRefreshVocabulary();
        }
    }
    //
    useEffect(() => {
        if (initial) {
            onRefreshVocabulary();
            localStorage.setItem(ENGLISH_VOCABULARY_FLASHCARDS_KNOW_VOCABULARY, JSON.stringify(listKnowIndex))
        }
    }, [listKnowIndex])
    //
    const onChangeViewType = (viewTypeSelected) => {
        onRefreshVocabulary(viewTypeSelected);
        setViewType(viewTypeSelected);
    }
    return (
        <div className="App_Wrapper">
            <div>
                <div className="App_header">
                    <div className={"App_filterDontKnow" + (viewType === VIEW_TYPE_DONT_KNOW ? " active" : "")} onClick={() => {
                        if (viewType === VIEW_TYPE_KNOW) {
                            onChangeViewType(VIEW_TYPE_DONT_KNOW)
                        }
                    }}>
                        <div className="count">{(listIndex.length - listKnowIndex.length < 0) ? '' : listIndex.length - listKnowIndex.length}</div>
                        <QuestionCircleOutlined />
                    </div>
                    <div className={"App_filterKnow" + (viewType === VIEW_TYPE_KNOW ? " active" : "")} onClick={() => {
                        if (viewType === VIEW_TYPE_DONT_KNOW) {
                            onChangeViewType(VIEW_TYPE_KNOW)
                        }
                    }}>
                        <div className="count">{listKnowIndex.length}</div>
                        <BulbOutlined />
                    </div>
                </div>
                {(indexVocabulary !== null && listVocabulary.length > 0 && listVocabulary[indexVocabulary] && !refreshVocabulary)? <Card
                        vocabulary={listVocabulary[indexVocabulary]}
                        onRefreshVocabulary={onRefreshVocabulary}
                        onDontKnowVocabulary={onDontKnowVocabulary}
                        onKnowVocabulary={onKnowVocabulary}
                        viewType={viewType}
                    /> : <></>}
            </div>
        </div>
    );
}

export default App;
