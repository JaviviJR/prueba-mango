import PropTypes from 'prop-types'
import { useEffect, useState } from 'react';

function RangeSlider({
    width,
    currentMinValue,
    onMinChange,
    currentMaxValue,
    onMaxChange,
    elementDragging,
    onMouseDown,
    onKeyDown,
    sliderRef,
    minBulletRef,
    maxBulletRef
  }) {
    const [minInput, setMinInput] = useState(currentMinValue.toFixed(2));
    const [maxInput, setMaxInput] = useState(currentMaxValue.toFixed(2));

    useEffect(() => {
      const timeout = setTimeout(() => {
        onMinChange(Number(minInput));
      }, 500);                            
      return () => clearTimeout(timeout);
    }, [minInput]);

    useEffect(() => {
      setMinInput(currentMinValue.toFixed(2));
    }, [currentMinValue]);

    useEffect(() => {
      const timeout = setTimeout(() => {
        onMaxChange(Number(maxInput));
      }, 500);
      return () => clearTimeout(timeout);
    }, [maxInput]);

    useEffect(() => {
      setMaxInput(currentMaxValue.toFixed(2));
    }, [currentMaxValue]);

    return (
      <div 
        className='range-slider-container'
        data-testid='slider'
        style={{
          width: width ? `${width}px` : '100%'
        }}
      >
        <div className='range-slider-container__input-div'>
          <input 
            data-testid='min-value-input'
            type='number'
            className='range-slider-container__input'
            // value={minValueAsString}
            value={minInput}
            // onChange={(e) => {onMinChange(Number(e.target.value))}}
            onChange={(e) => setMinInput(e.target.value)}
          />€
        </div>
        <div
          ref={sliderRef}
          role="slider"
          className="range-slider"
        >
          <div className="range-slider__bar">
            <button
              ref={minBulletRef}
              data-testid='min-value-bullet'
              className="range-slider__handle"
              onMouseDown={onMouseDown}
              onKeyDown={onKeyDown}
              style={{ 
                cursor: elementDragging.current === minBulletRef.current ? 'grabbing' : 'grab'
              }}
            />
            <button
              ref={maxBulletRef}
              data-testid='max-value-bullet'
              className="range-slider__handle"
              onMouseDown={onMouseDown}
              onKeyDown={onKeyDown}
              style={{ 
                cursor: elementDragging.current === maxBulletRef.currentgging ? 'grabbing' : 'grab'
              }}
            />
          </div>
        </div>
        <div className='range-slider-container__input-div'>
          <input 
            data-testid='max-value-input'
            type='number'
            className='range-slider-container__input'
            // value={maxValueAsString}
            value={maxInput}
            // onChange={(e) => {onMaxChange(Number(e.target.value))}}
            onChange={(e) => setMaxInput(e.target.value)}
          />€
        </div>
      </div>
    );
}

export default RangeSlider;

RangeSlider.propTypes = {
    width: PropTypes.number,
    currentMinValue: PropTypes.number.isRequired,
    onMinChange: PropTypes.func.isRequired,
    onMaxChange: PropTypes.func.isRequired,
    currentMaxValue: PropTypes.number.isRequired,
    elementDragging: PropTypes.object.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    // onTouchStart: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func.isRequired,
    sliderRef: PropTypes.object.isRequired,
    minBulletRef: PropTypes.object.isRequired,
    maxBulletRef: PropTypes.object.isRequired,
}