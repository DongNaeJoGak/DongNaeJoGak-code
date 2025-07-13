import React, {useState} from 'react';
import SearchNearCurrentLocationIcon from '../../assets/SearchNearCurrentLocation.svg';
import PublicDesignSuggestionIcon1 from '../../assets/PublicDesignSuggestion1.svg';
import PublicDesignSuggestionIcon2 from '../../assets/PublicDesignSuggestion2.svg';
import PublicDesignIcon1 from '../../assets/PublicDesign1.svg';
import PublicDesignIcon2 from '../../assets/PublicDesign2.svg';


const LocationButton = ({ onSearchNearCurrentLocationClick, onPublicDesignClick, onPublicDesignSuggestionClick, selectedPlace, isRightCollapsed, isFormOpen }) => {
    const [isPublicDesignActive, setIsPublicDesignActive] = useState(false);
    const [isPublicDesignSuggestionActive, setIsPublicDesignSuggestionActive] = useState(false);

    const iconStyle = {
        width: 'auto',
        height: '60px',
    };
    const ideasIconStyle = {
        width: 'auto',
        height: '80px',
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
        if (isFormOpen || selectedPlace) return;
        setIsPublicDesignActive((prev)=> !prev);
        if (onPublicDesignClick) onPublicDesignClick();
        console.log("공공디자인 clicked");
    }

    const handlePublicDesignSuggestionClick = () => {
        if (isFormOpen || selectedPlace) return;
        setIsPublicDesignSuggestionActive((prev)=> !prev);
        if (onPublicDesignSuggestionClick) onPublicDesignSuggestionClick();
        console.log("공공디자인 제안 clicked");
    }

    const handleSearchNearCurrentLocationClick = () => {
        if (isFormOpen) return;
        if (onSearchNearCurrentLocationClick) onSearchNearCurrentLocationClick();
    }

    return (
        <>
            {/* 현위치 주변 검색 - 좌측 상단 */}
            <div className="absolute top-8 left-[510px] z-10">
                <button
                    onClick={handleSearchNearCurrentLocationClick}
                    style={iconButtonStyle}
                >
                    <img src={SearchNearCurrentLocationIcon} alt="현위치 주변 검색" style={iconStyle} />
                </button>
            </div>

            {/* 공공디자인 제안/공공디자인 버튼 위치 동적 배치 */}
            {isRightCollapsed ? (
                <>
                    {/* 패널 닫힘: 기존 위치 */}
                    <div className="absolute top-8 right-[400px] z-10">
                        <button
                            onClick={handlePublicDesignSuggestionClick}
                            style={iconButtonStyle}
                        >
                            <img src={isPublicDesignSuggestionActive ? PublicDesignSuggestionIcon2 : PublicDesignSuggestionIcon1} 
                            alt="공공디자인 제안" style={iconStyle} />
                        </button>
                    </div>
                    <div className="absolute top-8 right-[180px] z-10">
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
                </>
            ) : (
                <div className="absolute top-8 right-[370px] -translate-x-1/2 z-10 flex flex-col items-center gap-4">
                    <button
                        onClick={handlePublicDesignSuggestionClick}
                        style={iconButtonStyle}
                    >
                        <img src={isPublicDesignSuggestionActive ? PublicDesignSuggestionIcon2 : PublicDesignSuggestionIcon1} 
                        alt="공공디자인 제안" style={iconStyle} />
                    </button>
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
            )}

        </>
    );
};

export default LocationButton;
