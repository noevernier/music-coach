import React from "react";
import { SCenteredContainer, SPageContainer, SRecordButton, SAudio } from "./styles_rp";

var audioRecorder = {
    audioBlobs : [],
    mediaRecorder : null,
    streamBeingCaptured : null,
    /** Start recording the audio
     * @returns {Promise} - returns a promise that resolves if audio recording successfully started
     */
    start: function () 
    {
        // Feature detection
        if(!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia))
        {
            // Feature not supported in the browser
            return Promise.reject(new Error('mediaDevices API or getUserMedia method is not supported in this browser.'));
        }
        else
        {
            return navigator.mediaDevices.getUserMedia({audio : true}).then(stream => {
                this.streamBeingCaptured = stream;
                this.mediaRecorder = new MediaRecorder(stream);
                this.audioBlobs = []; // Clear audioBlob if any was stored

                this.mediaRecorder.addEventListener("dataavailable", event => {
                    //store audio Blob object
                    this.audioBlobs.push(event.data);
                });
                this.mediaRecorder.start();
            });
        }
    },
    /** Stop the started audio recording
         * @returns {Promise} - returns a promise that resolves to the audio as a blob file
         */
    stop: function () {
        return new Promise(resolve =>{
            let mimeType = this.mediaRecorder.mimeType;

            this.mediaRecorder.addEventListener("stop", () => {
                let audioBlob = new Blob(this.audioBlobs, { type : mimeType });
                resolve(audioBlob);
            });

            this.mediaRecorder.stop();
            this.stopStream();
            this.resetRecordingProperties();
        })
    },

    stopStream: function() {
        //stopping the capturing request by stopping all the tracks on the active stream
        this.streamBeingCaptured.getTracks()
                .forEach(track => track.stop());
    },
    resetRecordingProperties: function () {
        this.mediaRecorder = null;
        this.streamBeingCaptured = null;
    },
    /** Cancel audio recording*/
    cancel: function () {
        this.mediaRecorder.stop();
        this.stopStream();
        this.resetRecordingProperties();
    }
}

function startAudioRecording() {

    console.log("Recording Audio...");

    //If a previous audio recording is playing, pause it
    let recorderAudioIsPlaying = !audioElement.paused; // the paused property tells whether the media element is paused or not
    console.log("paused?", !recorderAudioIsPlaying);

    //start recording using the audio recording API
    audioRecorder.start()
        .catch(error => { //on error
            //No Browser Support Error
            if (error.message.includes("mediaDevices API or getUserMedia method is not supported in this browser.")) {
                console.log("To record audio, use browsers like Chrome and Firefox.");
            }

            //Error handling structure
            switch (error.name) {
                case 'AbortError': //error from navigator.mediaDevices.getUserMedia
                    console.log("An AbortError has occured.");
                    break;
                case 'NotAllowedError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotAllowedError has occured. User might have denied permission.");
                    break;
                case 'NotFoundError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotFoundError has occured.");
                    break;
                case 'NotReadableError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A NotReadableError has occured.");
                    break;
                case 'SecurityError': //error from navigator.mediaDevices.getUserMedia or from the MediaRecorder.start
                    console.log("A SecurityError has occured.");
                    break;
                case 'TypeError': //error from navigator.mediaDevices.getUserMedia
                    console.log("A TypeError has occured.");
                    break;
                case 'InvalidStateError': //error from the MediaRecorder.start
                    console.log("An InvalidStateError has occured.");
                    break;
                case 'UnknownError': //error from the MediaRecorder.start
                    console.log("An UnknownError has occured.");
                    break;
                default:
                    console.log("An error occured with the error name " + error.name);
            };
        });
}

function stopAudioRecording() {

    console.log("Stopping Audio Recording...");

    //stop the recording using the audio recording API
    audioRecorder.stop()
        .then(audioAsblob => {
            //Play recorder audio
            LoadAudio(audioAsblob);
        })
        .catch(error => {
            //Error handling structure
            switch (error.name) {
                case 'InvalidStateError': //error from the MediaRecorder.stop
                    console.log("An InvalidStateError has occured.");
                    break;
                default:
                    console.log("An error occured with the error name " + error.name);
            };
        });
}

let isRecording = false;
function OnRecordClick()
{
    console.log("Click");
    if(isRecording)
    {
        console.log("Stop recording");
        stopAudioRecording().then((audioBlob) => LoadAudio(audioBlob));
        isRecording = false;

    }
    else
    {
        console.log("Start recording");
        startAudioRecording();
        isRecording = true;
    }
}

var audioElement = document.getElementsByClassName("audio-element")[0];
var audioElementSource = document.getElementsByClassName("audio-element")[0]
    .getElementsByTagName("source")[0];

/** Creates a source element for the the audio element in the HTML document*/
function createSourceForAudioElement() {
    let sourceElement = document.createElement("source");
    audioElement.appendChild(sourceElement);

    audioElementSource = sourceElement;
}

function LoadAudio(recorderAudioAsBlob)
{
    //read content of files (Blobs) asynchronously
    let reader = new FileReader();

    //once content has been read
    reader.onload = (e) => {
        //store the base64 URL that represents the URL of the recording audio
        let base64URL = e.target.result;

        //If this is the first audio playing, create a source element
        //as pre populating the HTML with a source of empty src causes error
        if (!audioElementSource) //if its not defined create it (happens first time only)
            createSourceForAudioElement();  

        //set the audio element's source using the base64 URL
        audioElementSource.src = base64URL;

        //set the type of the audio element based on the recorded audio's Blob type
        let BlobType = recorderAudioAsBlob.type.includes(";") ?
            recorderAudioAsBlob.type.substr(0, recorderAudioAsBlob.type.indexOf(';')) : recorderAudioAsBlob.type;
            audioElementSource.type = BlobType

        //call the load method as it is used to update the audio element after changing the source or other settings
        audioElement.load();

        //play the audio after successfully setting new src and type that corresponds to the recorded audio
        console.log("Playing audio...");
        audioElement.play();
    };
    //read content and convert it to a URL (base64)
    reader.readAsDataURL(recorderAudioAsBlob);
}


const RecordPage = () => {
    return( 
        <SPageContainer>
            <SCenteredContainer>
                <SRecordButton onClick={OnRecordClick}>
                    Record
                </SRecordButton>
                <SAudio controls class="audio-element"></SAudio>
            </SCenteredContainer>
        </SPageContainer>
    );
};

export default RecordPage;
