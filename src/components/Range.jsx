import PropTypes from 'prop-types'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import './Range.styles.scss';
import RangeSlider from './RangeSlider';

function Range({
	min,
	max,
	onChange,
	width,
	// step = 5,
}) {
    const sliderRef = useRef(null);
    const [sliderWith, setSliderWidth] = useState(null);
    const [sliderLeft, setSliderLeft] = useState(null);
    
    const minBulletRef = useRef(null);
    const [currentMinValue, setCurrentMinValue] = useState(min);
    
    const maxBulletRef = useRef(null);
    const [currentMaxValue, setCurrentMaxValue] = useState(max);
    
    const [isDragging, setIsDragging] = useState(false);
    const elementDragging = useRef(null);


    /* DEBUG */
    // const [posX, setPosX] = useState(null);
    // const [totalWidth, setTotalWidth] = useState(null);
    // const [selectedValue, setSelectedValue] = useState(null);
    // const [position, setPosition] = useState(null);

    // const [minBulletMinState, setMinBulletMinState] = useState(null);
    // const [minBulletMaxState, setMinBulletMaxState] = useState(null);
    // const [maxBulletMinState, setMaxBulletMinState] = useState(null);
    // const [maxBulletMaxState, setMaxBulletMaxState] = useState(null);
    /* END DEBUG */

    const onMinChange = useCallback((value) => {
        const bulletMin = min;
        const bulletMax = currentMaxValue;

        value = Math.max(bulletMin, value);
        value = Math.min(bulletMax, value);
        setCurrentMinValue(value);
    }, [currentMaxValue, min]);

    const onMaxChange = useCallback((value) => {
        const bulletMin = currentMinValue;
        const bulletMax = max;

        value = Math.max(bulletMin, value);
        value = Math.min(bulletMax, value);
        setCurrentMaxValue(value);
    }, [currentMinValue, max]);

    const moveBulletPosition = useCallback((e, setMethod) => {
        const posX = (e.clientX) - sliderLeft;
        let selectedValue = Math.round((posX / sliderWith) * (max - min) + min);
        setMethod(selectedValue);
    },
    [max, min, sliderWith, sliderLeft]);
    
    const calculateBulletPosition = useCallback((bulletRef, value) => {
        const position = ((value - min) / (max - min)) * sliderWith;
        bulletRef.current.style.left = `${position + (-1 * 20 / 2)}px`;
    }, [min, max, sliderWith]);

    useEffect(() => {
        if (!minBulletRef.current) return;
        calculateBulletPosition(minBulletRef, currentMinValue);
    }, [currentMinValue, calculateBulletPosition]);


    useEffect(() => {
        if (!maxBulletRef.current) return;
        calculateBulletPosition(maxBulletRef, currentMaxValue);
    }, [currentMaxValue, calculateBulletPosition]);


    const redrawBullets = useCallback(() => {
        const sliderBoundingClientRect = sliderRef.current?.getBoundingClientRect();
        if (!sliderBoundingClientRect) return;

        setSliderWidth(sliderBoundingClientRect.width);
        setSliderLeft(sliderBoundingClientRect.left);

        calculateBulletPosition(minBulletRef, currentMinValue);
        calculateBulletPosition(maxBulletRef, currentMaxValue);
    }, [calculateBulletPosition, currentMinValue, currentMaxValue]);

    useLayoutEffect(() => {
        window.addEventListener("resize", redrawBullets);
        return () => {
			window.removeEventListener("resize", redrawBullets);
		};
    }, [redrawBullets]);

    useEffect(() => {
        redrawBullets();
    }, [sliderWith, redrawBullets]);

    const getBulletStateByElement = useCallback((element) => {
        switch (element) {
            case minBulletRef.current:
                return {
                    bulletRef: minBulletRef,
                    value: currentMinValue,
                    setMethod: onMinChange
                };
            case maxBulletRef.current:
                return {
                    bulletRef: maxBulletRef,
                    value: currentMaxValue,
                    setMethod: onMaxChange
                };
            default:
                return null;
        }
    }, [currentMaxValue, currentMinValue, onMaxChange, onMinChange]);

    const onMouseUp = useCallback(() => {
		onChange({
            min: currentMinValue,
            max: currentMaxValue
        });
		setIsDragging(false);
        elementDragging.current = null;
	}, [currentMinValue, currentMaxValue, onChange]);

	const onMouseMove = useCallback(
		(e) => {
            const { setMethod } = getBulletStateByElement(elementDragging.current);
            if (isDragging) {
                moveBulletPosition(e, setMethod);
			}
		},
		[isDragging, moveBulletPosition, getBulletStateByElement]
	);

    const onMouseDown = (event) => {
        if (isDragging) return;

        const { bulletRef, setMethod } = getBulletStateByElement(event.target);
        
        if (!bulletRef.current) return;

		setIsDragging(true);
        elementDragging.current = bulletRef.current;
		moveBulletPosition(event, setMethod);
	};

    useEffect(() => {
		if (isDragging) {
			window.addEventListener("mousemove", onMouseMove);
			window.addEventListener("mouseup", onMouseUp);
		}

		return () => {
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("mouseup", onMouseUp);
		};
	}, [isDragging, onMouseMove, onMouseUp]);

    return (
        <div>
            <RangeSlider
                width={width}
                currentMinValue={currentMinValue}
                onMinChange={onMinChange}
                currentMaxValue={currentMaxValue}
                onMaxChange={onMaxChange}
                elementDragging={elementDragging}
                onMouseDown={onMouseDown}
                // onTouchStart={onTouchStart}
                // onTouchStart={() => {}}
                // onKeyDown={onKeyDown}
                // onKeyDown={() => {}}
                sliderRef={sliderRef}
                minBulletRef={minBulletRef}
                maxBulletRef={maxBulletRef}
            />
            {/* CurrentMin: { currentMinValue }<br /> */}
            {/* CurrentMax: { currentMaxValue }<br /> */}
            {/* posX: { posX }<br /> */}
            {/* sliderWith: { sliderWith }<br /> */}
            {/* totalWidth: { totalWidth }<br /> */}
            {/* selectedValue: { selectedValue }<br /> */}
            {/* position: { position }<br /> */}
            {/* minBulletMin: { minBulletMinState }<br />
            minBulletMax: { minBulletMaxState }<br />
            maxBulletMin: { maxBulletMinState }<br />
            maxBulletMax: { maxBulletMaxState }<br /> */}
        </div>
    );
}

export default Range;

Range.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    width: PropTypes.number,
};