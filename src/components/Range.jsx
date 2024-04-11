import PropTypes from 'prop-types'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import './Range.styles.scss';
import RangeSlider from './RangeSlider';

function Range({
	min,
	max,
	// initialValue,
	onChange,
	width,
	// step = 5,
}) {
    const sliderRef = useRef(null);
    const [sliderWith, setSliderWidth] = useState(null);
    
    const minBulletRef = useRef(null);
    const [currentMinValue, setCurrentMinValue] = useState(min);
    
    const maxBulletRef = useRef(null);
    const [currentMaxValue, setCurrentMaxValue] = useState(max);
    
    const [isDragging, setIsDragging] = useState(false);
    const elementDragging = useRef(null);


    /* DEBUG */
    const [posX, setPosX] = useState(null);
    const [totalWidth, setTotalWidth] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);
    const [position, setPosition] = useState(null);

    const [minBulletMinState, setMinBulletMinState] = useState(null);
    const [minBulletMaxState, setMinBulletMaxState] = useState(null);
    const [maxBulletMinState, setMaxBulletMinState] = useState(null);
    const [maxBulletMaxState, setMaxBulletMaxState] = useState(null);
    /* END DEBUG */

    const moveSliderPosition = useCallback((e, bullet, setMethod) => {
        const sliderBoundingClientRect = sliderRef.current?.getBoundingClientRect();
        
        if (sliderBoundingClientRect) {
            const posX = (e.clientX) - sliderBoundingClientRect.left;
            setPosX(posX);

            const totalWidth = sliderBoundingClientRect.width;
            setSliderWidth(totalWidth);
            setTotalWidth(totalWidth);
            
            const {bulletMin, bulletMax} = getMinMaxValue(bullet);
            
            let selectedValue = Math.round((posX / totalWidth) * (max - min) + min);
            selectedValue = Math.max(bulletMin, selectedValue);
            selectedValue = Math.min(bulletMax, selectedValue);
            setSelectedValue(selectedValue);
            setMethod(selectedValue);
        }
    },
    [max, min, currentMinValue, currentMaxValue]);

    useEffect(() => {
        if (!minBulletRef.current) return;

        const {bulletMin, bulletMax} = getMinMaxValue(minBulletRef);
        setMinBulletMinState(bulletMin);
        setMinBulletMaxState(bulletMax);

        calculateBulletPosition(minBulletRef, currentMinValue);
    }, [currentMinValue]);

    useEffect(() => {
        if (!maxBulletRef.current) return;

        const { bulletMin, bulletMax } = getMinMaxValue(maxBulletRef);
        setMaxBulletMinState(bulletMin);
        setMaxBulletMaxState(bulletMax);

        calculateBulletPosition(maxBulletRef, currentMaxValue);
    }, [currentMaxValue]);

    const calculateBulletPosition = useCallback((bulletRef, value) => {
        const sliderBoundingClientRect = sliderRef.current?.getBoundingClientRect();
        const totalWidth = sliderBoundingClientRect.width;        
        const position = ((value - min) / (max - min)) * totalWidth;
        setPosition(position);
        bulletRef.current.style.left = `${position + (-1 * 20 / 2)}px`;
    }, [min, max]);

    const redrawBullets = useCallback(() => {
        calculateBulletPosition(minBulletRef, currentMinValue);
        calculateBulletPosition(maxBulletRef, currentMaxValue);
    }, [calculateBulletPosition, currentMinValue, currentMaxValue]);

    useLayoutEffect(() => {
        window.addEventListener("resize", redrawBullets);
        return () => {
			window.removeEventListener("resize", redrawBullets);
		};
    }, []);

    useEffect(() => {
        redrawBullets();
    }, [sliderWith,redrawBullets]);

    const getMinMaxValue = (bullet) => {
        switch (bullet) {
            case minBulletRef:
                return {
                    bulletMin: min,
                    bulletMax: currentMaxValue
                };
            case maxBulletRef:
                return {
                    bulletMin: currentMinValue,
                    bulletMax: max
                };
            default:
                console.log('default');
                break;
        }
    }

    const getBulletStateByElement = (element) => {
        switch (element) {
            case minBulletRef.current:
                return {
                    bulletRef: minBulletRef,
                    value: currentMinValue,
                    setMethod: setCurrentMinValue
                };
            case maxBulletRef.current:
                return {
                    bulletRef: maxBulletRef,
                    value: currentMaxValue,
                    setMethod: setCurrentMaxValue
                };
            default:
                return null;
        }
    };

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
            const { bulletRef, setMethod } = getBulletStateByElement(elementDragging.current);
            if (isDragging) {
                moveSliderPosition(e, bulletRef, setMethod);
			}
		},
		[isDragging, moveSliderPosition]
	);

    const onMouseDown = (event) => {
        if (isDragging) return;

        const { bulletRef, setMethod } = getBulletStateByElement(event.target);
        
        if (!bulletRef.current) return;

		setIsDragging(true);
        elementDragging.current = bulletRef.current;
		moveSliderPosition(event, bulletRef, setMethod);
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
                min={min}
                max={max}
                width={width}
                currentMinValue={currentMinValue}
                setCurrentMinValue={setCurrentMinValue}
                currentMaxValue={currentMaxValue}
                isDragging={isDragging}
                onMouseDown={onMouseDown}
                // onTouchStart={onTouchStart}
                // onTouchStart={() => {}}
                // onKeyDown={onKeyDown}
                // onKeyDown={() => {}}
                sliderRef={sliderRef}
                minBulletRef={minBulletRef}
                maxBulletRef={maxBulletRef}
            />
            CurrentMin: { currentMinValue }<br />
            CurrentMax: { currentMaxValue }<br />
            posX: { posX }<br />
            sliderWith: { sliderWith }<br />
            totalWidth: { totalWidth }<br />
            selectedValue: { selectedValue }<br />
            position: { position }<br />
            minBulletMin: { minBulletMinState }<br />
            minBulletMax: { minBulletMaxState }<br />
            maxBulletMin: { maxBulletMinState }<br />
            maxBulletMax: { maxBulletMaxState }<br />
        </div>
    );
}

export default Range;

Range.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    // initialValue: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    width: PropTypes.number,
    // step: PropTypes.number,
};