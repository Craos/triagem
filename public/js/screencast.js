class ScreenCast {

    Trace(text) {

        if (text[text.length - 1] === '\n')
            text = text.substring(0, text.length - 1);

        console.info(text);

    }

    gotStream(stream) {
        this.Trace('Received local stream');
        this.localvideo.srcObject = stream;
        window.localStream = stream;
    }

    Start() {

        this.localvideo.addEventListener('loadedmetadata', function () {
            console.debug(this.localvideo);
        }.bind(this));

        this.Trace('Requesting local stream');
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        })
            .then(function (stream) {
                this.gotStream(stream);
            }.bind(this))
            .catch(function (e) {
                console.debug(e);
                dhtmlx.alert({
                    title: 'Atenção',
                    type: 'alert-error',
                    text: 'Não foi possível iniciar a webcam. Por favor reinicie o navegador'
                });
            });
    }

    get Image() {

        let canvas = document.createElement('canvas');
        let ratio = 400 / this.localvideo.videoHeight;

        canvas.width = ratio * this.localvideo.videoWidth;
        canvas.height = 400;

        let ctx = canvas.getContext('2d');
        ctx.drawImage(this.localvideo, 0, 0, this.localvideo.videoWidth, this.localvideo.videoHeight, 0, 0, canvas.width, canvas.height);
        return canvas.toDataURL("image/png;base64;charset=utf-8");

    }
}