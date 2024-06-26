import { useEffect, useState } from "react";
import Range from "../components/Range";

function Exercise1() {
    const [normalModeData, setNormalModeData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:9005/exercise1')
            .then(response => response.json())
            .then(data => {
                setNormalModeData(data);
            });
    }, []);
    
    const onChange = (value) => {
        console.log(value);
    }

    return (
        <>
            <div>
                Exercise 1
            </div>
            { normalModeData && 
                (<> 
                    <div>
                        <Range 
                            mode={'normal'}
                            min={normalModeData.min}
                            max={normalModeData.max}
                            onChange={onChange}
                        />
                    </div>
                </>)
            }
            
        </>
    );
}

export default Exercise1;