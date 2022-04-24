var game = {
    data: {
        score: 0
    },

    resources : [
        {name: "title_background", type: "image", src: "data/background.png"}
    ],

    //init melonJS
    onload: function () {
        //init canvas
        if (!me.video.init(500, 500, { parent: "screen", scale: "auto", scaleMethod: "fit" })) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    //after melonJS loads
    loaded: function () {
        console.log("loading");
        me.state.set(me.state.MENU, new TitleScreen()); 
        me.state.change(me.state.MENU);
    }
};