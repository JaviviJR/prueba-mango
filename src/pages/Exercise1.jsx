
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
                    min={100}
                    max={1000}
                    onChange={onChange}
                    // initialValue={45}
                />
            </div>
            <hr />
            <div>
                <Range 
                    min={0}
                    max={1000}
                    onChange={onChange}
                    // initialValue={45}
                />
            </div>
        </>
    );
}

export default Exercise1;