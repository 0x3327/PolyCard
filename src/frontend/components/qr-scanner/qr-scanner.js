import { useEffect, useState } from "react";
import Webcam from "react-webcam";

const VIDEO_CONSTRAINTS = {
    width: 640,
    height: 360,
    facingMode: "user",
};

export const WebcamCustom = ({ callback }) => {
    const [inUse, setInUse] = useState(false);

    useEffect(() => {
        return () => {
            setInUse(false);
        }
    })

    if (!inUse) {
        return (
            <div className="WebcamCustom">
                <button
                    onClick={() => {
                        setInUse(true);
                    }}
                >
                    Enable Camera
                </button>
            </div>
        );
    }

    return (
        <div className="WebcamCustom">
            <Webcam
                audio={false}
                height={720}
                screenshotFormat="image/jpeg"
                width={1280}
                videoConstraints={VIDEO_CONSTRAINTS}
            >
                {({ getScreenshot }) => (
                    <button
                        onClick={() => {
                            //get the image - callback function needed
                            const imageSrc = getScreenshot();
                            callback(imageSrc);
                        }}
                    >
                        Capture photo
                    </button>
                )}
            </Webcam>

            <button onClick={() => setInUse(false)}>Disable Camera</button>
        </div>
    );
};
