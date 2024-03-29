import _ from "lodash";
import Emitter from "./Emitter";
// TODO: Replace lodash.
/**
 * Manage all media devices
 */
class MediaDevice extends Emitter {
  /**
   * Start media devices and send stream
   */
  async start() {
    const constraints = {
      video: {
        facingMode: "user",
        height: { min: 360, ideal: 720, max: 1080 },
      },
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        this.stream = stream;
        this.emit("stream", stream);
      })
      .catch((err) => {
        const errorName = err.name;

        if (err instanceof DOMException) {
          this.emit("stream");
          alert("Klarte ikke åpne kamera/mikrofon.");
        } else if (
          errorName === "NotFoundError" ||
          errorName === "NotReadableError"
        ) {
          this.emit("stream");
          alert("Fant ikke noe kamera/mikrofon");
        } else {
          alert("Fant ikke noe kamera/mikrofon. Si gjerne ifra om det er du grei.");
          console.log(err);
        }
      });

    return this;
  }

  /**
   * Turn on/off a device
   * @param {String} type - Type of the device
   * @param {Boolean} [on] - State of the device
   */
  toggle(type, on) {
    const len = arguments.length;
    if (this.stream) {
      this.stream[`get${type}Tracks`]().forEach((track) => {
        const state = len === 2 ? on : !track.enabled;
        _.set(track, "enabled", state);
      });
    }
    return this;
  }

  /**
   * Stop all media track of devices
   */
  stop() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
    return this;
  }
}

export default MediaDevice;
