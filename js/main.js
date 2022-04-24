var game = {
    /**
     * an object where to store game global data
     */
    data: {
        score: 0
    },

    // Run on page load.
    onload: function () {
        // Initialize the video.
        if (!me.video.init(500, 500, { parent: "screen", scale: "auto", scaleMethod: "fit" })) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        me.state.change(me.state.LOADING);
    },

    loaded: function () {

    }
};