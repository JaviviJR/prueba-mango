
import { useEffect, useState } from "react";
import Range from "../components/Range";

function Exercise1() {
    const [normalModeData, setNormalModeData] = useState(null);
    const [fixedModeData, setFixedModeData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:9005/exercise1')
            .then(response => response.json())
            .then(data => {
                setNormalModeData(data);
            });
    }, []);

    useEffect(() => {
        fetch('http://localhost:9005/exercise2')
            .then(response => response.json())
            .then(data => {
                setFixedModeData(data['range']);
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
                    <hr />
                    <div>
                        <Range 
                            mode={'normal'}
                            min={0}
                            max={100}
                            onChange={onChange}
                        />
                    </div>
                </>)
            }
            <hr />
            { fixedModeData && 
                (<>
                    <div>
                        <Range 
                            mode={'fixed'}
                            range={fixedModeData}
                            onChange={onChange}
                        />
                    </div>
                </>)
            }
        </>
    );
}

export default Exercise1;