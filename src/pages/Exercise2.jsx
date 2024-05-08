import { useEffect, useState } from "react";
import Range from "../components/Range";

function Exercise2() {
    const [fixedModeData, setFixedModeData] = useState(null);

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
                Exercise 2
            </div>
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

export default Exercise2;