
import Range from "../components/Range";

function Exercise1() {
    
    const onChange = (value) => {
        console.log(value);
    }

    return (
        <>
            <div>
            Exercise 1
            </div>
            <div>
                <Range 
                    // mode={'normal'}
                    min={0}
                    max={10.00}
                    onChange={onChange}
                />
            </div>
            <hr />
            <div>
                <Range 
                    // mode={'normal'}
                    min={0}
                    max={100}
                    onChange={onChange}
                />
            </div>
            <hr />
            {/* <div>
                <Range 
                    mode={'fixed'}
                    range={[1.99, 5.99, 10.99, 30.99, 50.99, 70.99]}
                    onChange={onChange}
                />
            </div> */}
        </>
    );
}

export default Exercise1;