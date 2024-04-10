import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef, useState } from "react";
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
    const minHandleRef = useRef(null);
    const maxHandleRef = useRef(null);

    const [currentMinValue, setCurrentMinValue] = useState(min);
    const [currentMaxValue, setCurrentMaxValue] = useState(max);
    const [isDragging, setIsDragging] = useState(false);
    const elementDragging = useRef(null);


    /* DEBUG */
    const [eClientX, setEClientX] = useState(null);
    const [leftHandler, setLeftHandler] = useState(null);
    const [leftSlider, setLeftSlider] = useState(null);
    const [posX, setPosX] = useState(null);
    const [totalWidth, setTotalWidth] = useState(null);
    const [selectedValue, setSelectedValue] = useState(null);
    const [position, setPosition] = useState(null);

    const [minHandlerMinState, setMinHandlerMinState] = useState(null);
    const [minHandlerMaxState, setMinHandlerMaxState] = useState(null);
    const [maxHandlerMinState, setMaxHandlerMinState] = useState(null);
    const [maxHandlerMaxState, setMaxHandlerMaxState] = useState(null);

    const moveSliderPosition = useCallback((e, handler, setMethod) => {
        const sliderBoundingClientRect = sliderRef.current?.getBoundingClientRect();
        
        if (sliderBoundingClientRect) {
            const posX = (e.clientX) - sliderBoundingClientRect.left;
            setEClientX(e.clientX);
            setLeftHandler(handler.left);
            setLeftSlider(sliderBoundingClientRect.left);
            setPosX(posX);

            const totalWidth = sliderBoundingClientRect.width;
            // setTotalWidth(totalWidth);
            
            const {handlerMin, handlerMax} = getMinMaxValue(handler);
            // console.log('handlerMin', handlerMin, 'handlerMax', handlerMax);
            // setHandlerMinState(handlerMin);
            // setHandlerMaxState(handlerMax);
            
            let selectedValue = Math.round((posX / totalWidth) * (max - min) + min);
            selectedValue = Math.max(handlerMin, selectedValue);
            selectedValue = Math.min(handlerMax, selectedValue);

            setSelectedValue(selectedValue);
            setMethod(selectedValue);

            // calculateHandlerPosition(handler, selectedValue);

            // const position = ((selectedValue - min) / (max - min)) * totalWidth;
            // setPosition(position);
            // handler.current.style.left = `${position + (-1 * 20 / 2)}px`;
            // handler.current.style.left = `${position}px`;
        }
    },
    [max, min, currentMinValue, currentMaxValue]);

    useEffect(() => {
        if (!minHandleRef.current) return;

        // const { handlerMin, handlerMax } = getMinMaxValue(minHandleRef);
        // setMinHandlerMinState(handlerMin);
        // setMinHandlerMaxState(handlerMax);

        calculateHandlerPosition(minHandleRef, currentMinValue);
    }, [currentMinValue]);

    useEffect(() => {
        if (!maxHandleRef.current) return;

        // const { handlerMin, handlerMax } = getMinMaxValue(maxHandleRef);
        // setMaxHandlerMinState(handlerMin);
        // setMaxHandlerMaxState(handlerMax);

        calculateHandlerPosition(maxHandleRef, currentMaxValue);
    }, [currentMaxValue]);

    const calculateHandlerPosition = (handlerRef, value) => {
        const sliderBoundingClientRect = sliderRef.current?.getBoundingClientRect();
        const totalWidth = sliderBoundingClientRect.width;        
        const position = ((value - min) / (max - min)) * totalWidth;
        setPosition(position);
        handlerRef.current.style.left = `${position + (-1 * 20 / 2)}px`;
        // handlerRef.current.style.left = `${position}px`;
    };

    const getMinMaxValue = (handler) => {
        switch (handler) {
            case minHandleRef:
                return {
                    handlerMin: min,
                    handlerMax: currentMaxValue
                };
            case maxHandleRef:
                return {
                    handlerMin: currentMinValue,
                    handlerMax: max
                };
            default:
                console.log('default');
                break;
        }
    }

    const getHandlerStateByElement = (element) => {
        switch (element) {
            case minHandleRef.current:
                return {
                    handlerRef: minHandleRef,
                    value: currentMinValue,
                    setMethod: setCurrentMinValue
                };
            case maxHandleRef.current:
                return {
                    handlerRef: maxHandleRef,
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
            const { handlerRef, setMethod } = getHandlerStateByElement(elementDragging.current);
            if (isDragging) {
                moveSliderPosition(e, handlerRef, setMethod);
			}
		},
		[isDragging, moveSliderPosition]
	);

    const onMouseDown = (event) => {
        if (isDragging) return;

        const { handlerRef, setMethod } = getHandlerStateByElement(event.target);
        
        if (!handlerRef.current) return;

        console.log('onMouseDown - handlerRef', handlerRef);

		setIsDragging(true);
        elementDragging.current = handlerRef.current;
		moveSliderPosition(event, handlerRef, setMethod);
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
                currentMaxValue={currentMaxValue}
                isDragging={isDragging}
                onMouseDown={onMouseDown}
                // onTouchStart={onTouchStart}
                onTouchStart={() => {}}
                // onKeyDown={onKeyDown}
                onKeyDown={() => {}}
                sliderRef={sliderRef}
                minHandleRef={minHandleRef}
                maxHandleRef={maxHandleRef}
            />
            CurrentMin: { currentMinValue }<br />
            CurrentMax: { currentMaxValue }<br />
            posX: { posX }<br />
            totalWidth: { totalWidth }<br />
            selectedValue: { selectedValue }<br />
            position: { position }<br />
            minHandlerMin: { minHandlerMinState }<br />
            minHandlerMax: { minHandlerMaxState }<br />
            maxHandlerMin: { maxHandlerMinState }<br />
            maxHandlerMax: { maxHandlerMaxState }<br />
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