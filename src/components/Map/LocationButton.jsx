import React, {useState} from 'react';
import SearchNearCurrentLocationIcon from '../../assets/SearchNearCurrentLocation.svg';
import PublicDesignSuggestionIcon1 from '../../assets/PublicDesignSuggestion1.svg';
import PublicDesignSuggestionIcon2 from '../../assets/PublicDesignSuggestion2.svg';
import PublicDesignIcon1 from '../../assets/PublicDesign1.svg';
import PublicDesignIcon2 from '../../assets/PublicDesign2.svg';
import IdeasIcon from '../../assets/Ideas.svg';

const LocationButton = ({ onSearchNearCurrentLocationClick }) => {
    const [isPublicDesignActive, setIsPublicDesignActive] = useState(false);
    const [isPublicDesignSuggestionActive, setIsPublicDesignSuggestionActive] = useState(false);

    const iconStyle = {
        width: 'auto',
        height: '150px',
    };
    const ideasIconStyle = {
        width: 'auto',
        height: '200px',
    };

    const iconButtonStyle = {
        background: 'transparent',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const handlePublicDesignClick = () => {
        setIsPublicDesignActive((prev)=> !prev);
        console.log("공공디자인 clicked");
    }

    const handlePublicDesignSuggestionClick = () => {
        setIsPublicDesignSuggestionActive((prev)=> !prev);
        console.log("공공디자인 제안 clicked");
    }

    return (
        <>
            {/* 현위치 주변 검색 - 좌측 상단 */}
            <div className="absolute top-4 left-4 z-10">
                <button
                    onClick={onSearchNearCurrentLocationClick}
                    style={iconButtonStyle}
                >
                    <img src={SearchNearCurrentLocationIcon} alt="현위치 주변 검색" style={iconStyle} />
                </button>
            </div>

            {/* 공공디자인 제안 - 우측 상단 */}
            <div className="absolute top-4 right-[400px] z-10">
                <button
                    onClick={handlePublicDesignSuggestionClick}
                    style={iconButtonStyle}
                >
                    <img src={isPublicDesignSuggestionActive ? PublicDesignSuggestionIcon2 : PublicDesignSuggestionIcon1} 
                    alt="공공디자인 제안" style={iconStyle} />
                </button>
            </div>

            {/* 공공디자인 - 우측 상단, 그 옆 */}
            <div className="absolute top-4 right-[200px] z-10">
                <button
                    onClick={handlePublicDesignClick}
                    style={iconButtonStyle}
                >
                    <img 
                    src={isPublicDesignActive ? PublicDesignIcon2 : PublicDesignIcon1} 
                    alt="공공디자인" style={iconStyle}
                    />
                </button>
            </div>

            {/* 메뉴 버튼 - 우측 상단 끝 */}
            <div className="absolute -top-5 -right-10 z-10">
                <button
                    onClick={() => console.log('메뉴 버튼 clicked')}
                    style={iconButtonStyle}
                >
                    <img src={IdeasIcon} alt="메뉴" style={ideasIconStyle} />
                </button>
            </div>
        </>
    );
};

export default LocationButton;
