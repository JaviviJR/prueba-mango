import PropTypes from 'prop-types'

function RangeSlider({
    min,
    max,
    width,
    currentMinValue,
    setCurrentMinValue,
    currentMaxValue,
    isDragging,
    onMouseDown,
    onTouchStart,
    onKeyDown,
    sliderRef,
    minBulletRef,
    maxBulletRef
  }) {
    return (
      <div className='range-slider-container'>
        <div className='range-slider-container__input-div'>
          <input 
            type='number'
            className='range-slider-container__input'
            value={currentMinValue}
            onChange={(e) => {setCurrentMinValue(Number(e.target.value))}}
          />€
        </div>
        <div
          ref={sliderRef}
          role="slider"
          tabIndex={0}
          // aria-valuemin={min}
          // aria-valuemax={max}
          // aria-valuenow={currentValue}
          // onMouseDown={onMouseDown}
          // onTouchStart={onTouchStart}
          // onKeyDown={onKeyDown}
          style={{
            width: width ? `${width}px` : '100%'
          }}
          className="range-slider"
        >
          <div className="range-slider__bar">
            <span
              ref={minBulletRef}
              className="range-slider__handle min"
              onMouseDown={onMouseDown}
              // style={{ 
              //   cursor: isDragging ? 'grabbing' : 'grab'
              // }}
            />
            <span
              ref={maxBulletRef}
              className="range-slider__handle max"
              onMouseDown={onMouseDown}
              // style={{ 
              //   cursor: isDragging ? 'grabbing' : 'grab'
              // }}
            />
          </div>
        </div>
        <div className='range-slider-container__label'>{ currentMaxValue }€</div>
      </div>
    );
}

export default RangeSlider;

RangeSlider.propTypes = {
    min: PropTypes.number.isRequired,
    max: PropTypes.number.isRequired,
    width: PropTypes.number,
    currentMinValue: PropTypes.number.isRequired,
    currentMaxValue: PropTypes.number.isRequired,
    isDragging: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired,
    // onTouchStart: PropTypes.func.isRequired,
    // onKeyDown: PropTypes.func.isRequired,
    sliderRef: PropTypes.object.isRequired,
    minBulletRef: PropTypes.object.isRequired,
    maxBulletRef: PropTypes.object.isRequired,
}