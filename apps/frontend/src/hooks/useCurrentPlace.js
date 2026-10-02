import { useSelector } from "react-redux";

export const usePlace = () => {
    const currentPlace = useSelector(
        (state) => state.place.currentPlace
    );

    const placeId = currentPlace?._id || currentPlace?.id;

    return {
        currentPlace,
        placeId,
        isPlaceLoaded: !!placeId,
    };
};