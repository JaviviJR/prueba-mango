import PropTypes from 'prop-types'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import './Range.styles.scss';
import RangeSlider from './RangeSlider';

function Range({
    mode,
    range = [],
	min: minProp = 0,
	max: maxProp = 0,
    step = 0.10,
	onChange,
	width,
}) {
    // const rangedValues = useMemo(() => [...range], [range]);
    const [min, setMin] = useState(minProp);
    const [max, setMax] = useState(maxProp);
    // const [range, setRange] = useState(rangeProp);
    // const [mode, setMode] = useState(modeProp);

    const sliderRef = useRef(null);
    const [sliderWith, setSliderWidth] = useState(null);
    const [sliderLeft, setSliderLeft] = useState(null);
    
    const minBulletRef = useRef(null);
    const [currentMinValue, setCurrentMinValue] = useState(0);
    
    const maxBulletRef = useRef(null);
    const [currentMaxValue, setCurrentMaxValue] = useState(0);
    
    const [isDragging, setIsDragging] = useState(false);
    const elementDragging = useRef(null);
    
    useLayoutEffect(() => {
        // console.log('useEffect watching props', [mode, range, minProp, maxProp]);
        switch (mode) {
            case 'fixed':
                setMin(Math.min(...range));
                setMax(Math.max(...range));
                setCurrentMinValue(Math.min(...range));
                setCurrentMaxValue(Math.max(...range));
                break;
            case 'normal':
                setMin(min);
                setMax(max);
                setCurrentMinValue(min);
                setCurrentMaxValue(max);
                break;
            default:
                throw new Error('Invalid mode');
        }
    }, [mode, range, minProp, maxProp]);

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

    const calculateBulletPosition = useCallback((bulletRef, value) => {
        const position = ((value - min) / (max - min)) * sliderWith;
        bulletRef.current.style.left = `${position + (-1 * 20 / 2)}px`;
    }, [min, max, sliderWith]);
    
    const getClosestValue = (value) => {
        return range.reduce((prev, curr) => {
            return (Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev);
        });
    };

    const onMinChange = (value) => {
        console.log('onMinChange', value);
        console.log('minBulletRef',minBulletRef);

        if (mode === 'normal') {
            const bulletMin = min;
            const bulletMax = currentMaxValue;

            value = Math.max(bulletMin, value);
            value = Math.min(bulletMax, value);
        } else {
            value = getClosestValue(value);
        }

        if (!minBulletRef.current) return;

        console.log('value', value);

        calculateBulletPosition(minBulletRef, value);
        setCurrentMinValue(value);
    };

    const onMaxChange = (value) => {
        if (mode === 'normal') {
            const bulletMin = currentMinValue;
            const bulletMax = max;

            value = Math.max(bulletMin, value);
            value = Math.min(bulletMax, value);
        } else {
            value = getClosestValue(value);
        }
        
        if (!maxBulletRef.current) return;
        calculateBulletPosition(maxBulletRef, value);
        setCurrentMaxValue(value);
    };

    const moveBulletPosition = useCallback((e, setMethod) => {
        const posX = (e.clientX) - sliderLeft;
        // let selectedValue = Math.round((posX / sliderWith) * (max - min) + min);
        let selectedValue = ((posX / sliderWith) * (max - min) + min).toFixed(2);
        setMethod(selectedValue);
    },
    [max, min, sliderWith, sliderLeft]);
    
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

    const getBulletStateByElement = (element) => {
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
            if (isDragging) {
                const { setMethod } = getBulletStateByElement(elementDragging.current);
                moveBulletPosition(e, setMethod);
			}
		},
		[isDragging, moveBulletPosition]
	);

    const onMouseDown = (event) => {
        if (isDragging) return;

        const { bulletRef } = getBulletStateByElement(event.target);        
        if (!bulletRef.current) return;

		setIsDragging(true);
        elementDragging.current = bulletRef.current;
	};

    const onKeyDown = (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            console.log('element', getBulletStateByElement(event.target));
            
            const { value, setMethod } = getBulletStateByElement(event.target);
            let selectedValue = value;
            if (event.key === "ArrowLeft") {
				selectedValue = value - step;
			} else if (event.key === "ArrowRight") {
				selectedValue = value + step;
			}
            console.log('selectedValue', selectedValue);
            setMethod(selectedValue);
        }
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
    mode: PropTypes.oneOf(['fixed', 'normal']),
    range: function(props) {
        if (props.mode === 'fixed' && !props.range) {
            return new Error(
                'You must provide a range when mode is set to range'
            );
        }
    },
    min: function(props, propName) {
        if (props.mode === 'normal' && props[propName] === undefined) {
            return new Error(
                'You must provide a min when mode is set to normal'
            );
        }
        if ( props.mode === 'normal' && typeof props.min !== 'number') {
            return new Error(
                'min must be a number'
            );

        }
    },
    max: function(props, propName) {
        if (props.mode === 'normal' && props[propName] === undefined) {
            return new Error(
                'You must provide a max when mode is set to normal'
            );
        }
        if ( props.mode === 'normal' && typeof props.max !== 'number') {
            return new Error(
                'max must be a number'
            );
        }
    },
    onChange: PropTypes.func.isRequired,
    step: PropTypes.number,
    width: PropTypes.number,
};