var game = {
    data: {
        score: 0
    },

    resources: [
        { name: "title_background", type: "image", src: "data/background.png" }
    ],

    //init melonJS
    onload: function () {
        //init canvas
        if (!me.video.init(600, 600, { wrapper: "screen", scale: "auto", scaleMethod: "fit" })) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    //after melonJS loads
    loaded: function () {
        console.log("loading");
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.change(me.state.MENU);
    }
};

game.TitleScreen = me.ScreenObject.extend({

    init: function () {
    },

    onResetEvent: function () {
        me.game.world.addChild(new me.ImageLayer(0, 0, {
            image: "title_background"
        }));
    },

    onDestroyEvent: function () {

    }
});