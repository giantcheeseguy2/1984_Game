var game = {
    data: {
        score: 0
    },

    resources: [
        { name: "menu_bg", type: "image", src: "data/title/upper_title.png" },
        { name: "walking_people", type: "image", src: "data/title/lower_title.png" },
        { name: "single_person", type: "image", src: "data/title/center_title.png"},
        { name: "title_text", type: "image", src: "data/title/title_text.png"}
    ],

    onload: function () {
        if (!me.video.init(600, 600, { wrapper: "screen", scale: "auto", scaleMethod: "fit" })) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    loaded: function () {
        console.log("loaded");
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.pool.register("animated_people", game.WalkingPeople);
        me.state.change(me.state.MENU);
    }
};

game.WalkingPeople = me.Entity.extend({
    init: function (a, b) {
        this._super(me.Entity, "init", [a, b, {
            image: me.loader.getImage("walking_people"),
            width: 600,
            height: 279
        }]);
    },

    update: function (a) {
        this.translate(1, 0);
        if(this.pos.x == this.renderable.width){
            this.pos.x = -this.renderable.width;
        }
        //me.Rect.prototype.updateBounds.apply(this),
        this._super(me.Entity, "update", [a]);
        return true;
    }
});

game.TitleScreen = me.ScreenObject.extend({

    init: function () {
        this.font = null;
        this.people1 = null;
        this.people2 = null;
        this.text = null;
    },

    onResetEvent: function () {
        me.game.world.addChild(new me.ImageLayer(0, 0, {
            image: "menu_bg"
        }));

        this.people1 = me.pool.pull("animated_people", 0, me.video.renderer.getHeight() - 279);
        this.people2 = me.pool.pull("animated_people", -me.video.renderer.getWidth(), me.video.renderer.getHeight() - 279);
        me.game.world.addChild(this.people1);
        me.game.world.addChild(this.people2);
        me.game.world.addChild(new me.ImageLayer(0, me.video.renderer.getHeight() - 279, {
            image: "single_person"
        }));

        this.text = new me.Sprite(
            me.video.renderer.getWidth()/2,
            me.video.renderer.getHeight()/2 + 250,
            { image: "title_text" }
        )
        me.game.world.addChild(this.text);
        me.pool.pull("me.Tween", this.text.pos).to({ y: me.video.renderer.getHeight()/2 - 150}, 1e3).easing(me.Tween.Easing.Exponential.InOut).start();
    },

    onDestroyEvent: function () {
        this.people = null;
        this.person = null;
    }
});