import PropTypes from 'prop-types'

function RangeSlider({
    width,
    currentMinValue,
    onMinChange,
    currentMaxValue,
    onMaxChange,
    elementDragging,
    onMouseDown,
    onTouchStart,
    onKeyDown,
    sliderRef,
    minBulletRef,
    maxBulletRef
  }) {
    
    const minValueAsString = currentMinValue.toFixed(2);
    const maxValueAsString = currentMaxValue.toFixed(2);

    return (
      <div 
        className='range-slider-container'
        style={{
          width: width ? `${width}px` : '100%'
        }}
      >
        <div className='range-slider-container__input-div'>
          <input 
            type='number'
            className='range-slider-container__input'
            value={minValueAsString}
            onChange={(e) => {onMinChange(Number(e.target.value))}}
          />€
        </div>
        <div
          ref={sliderRef}
          role="slider"
          tabIndex={0}
          // aria-valuemin={min}
          // aria-valuemax={max}
          // aria-valuenow={currentValue}
          // onTouchStart={onTouchStart}
          className="range-slider"
        >
          <div className="range-slider__bar">
            <span
              ref={minBulletRef}
              className="range-slider__handle min"
              onMouseDown={onMouseDown}
              // onKeyDown={onKeyDown}
              style={{ 
                cursor: elementDragging.current === minBulletRef.current ? 'grabbing' : 'grab'
              }}
            />
            <span
              ref={maxBulletRef}
              className="range-slider__handle max"
              onMouseDown={onMouseDown}
              // onKeyDown={onKeyDown}
              style={{ 
                cursor: elementDragging.current === maxBulletRef.currentgging ? 'grabbing' : 'grab'
              }}
            />
          </div>
        </div>
        <div className='range-slider-container__input-div'>
          <input 
            type='number'
            className='range-slider-container__input'
            value={maxValueAsString}
            onChange={(e) => {onMaxChange(Number(e.target.value))}}
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
    // onKeyDown: PropTypes.func.isRequired,
    sliderRef: PropTypes.object.isRequired,
    minBulletRef: PropTypes.object.isRequired,
    maxBulletRef: PropTypes.object.isRequired,
}