import { fireEvent, render, screen } from '@testing-library/react';
import Range from '../../src/components/Range';

describe('testinv <Range> compontent', () => {
    
    const onChangeMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test('should math with snapshot', () => {
        const { container } = render(
            <Range 
                mode={'normal'}
                min={0}
                max={100}
                onChange={onChangeMock}
            />
        );
        expect(container).toMatchSnapshot();
    })

    test('should have all elements', () => {
        render(
            <Range 
                mode={'normal'}
                min={0}
                max={100}
                onChange={onChangeMock}
            />
        );
        expect(screen.getAllByRole('button').length).toBe(2);
        expect(screen.getAllByRole('spinbutton').length).toBe(2);
        expect(screen.getAllByRole('slider').length).toBe(1);
    })

    test('debugeando', () => {
        // const user = userEvent.setup();

        const { container } = render(
            <Range 
                mode={'normal'}
                min={0}
                max={100}
                onChange={onChangeMock}
            />
        );
        
        const slider = screen.getByTestId('slider');
        const minBullet = screen.getByTestId('min-value-bullet');
        const maxBullet = screen.getByTestId('max-value-bullet');
        // user.click(minBullet);

        // jest.spyOn(slider, "getBoundingClientRect").mockImplementation(
        //     () => ({
        //             x: 0,
        //             y: 0,
        //             bottom: 0,
        //             height: 0,
        //             left: 0,
        //             right: 0,
        //             top: 0,
        //             width: 500
        // }));

        slider.getBoundingClientRect = jest.fn(
            () => ({
                    x: 0,
                    y: 0,
                    bottom: 0,
                    height: 10,
                    left: 0,
                    right: 0,
                    top: 0,
                    width: 500
        }));
        
        fireEvent.mouseDown(minBullet);
        fireEvent.mouseMove(container, {
            clientX: 1,
            clientY: 0,
        })

        fireEvent.mouseUp(minBullet)

        console.log('move');

        // user.pointer([
        //     // touch the screen at element1
        //     {keys: '[MouseLeft>]', target: minBullet},
        //     // move the touch pointer to element2
        //     {pointerName: 'MouseLeft', target: ?},
        //     // release the touch pointer at the last position (element2)
        //     {keys: '[/MouseLeft]'},
        // ]);

        console.log('slider', slider.getBoundingClientRect());
        console.log('min', minBullet.getBoundingClientRect());
        console.log('max', maxBullet.getBoundingClientRect());
        screen.debug();
    })
})