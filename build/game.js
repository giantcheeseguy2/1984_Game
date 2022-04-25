var game = {
    data: {
        score: 0,
        money: 0,

    },

    resources: [
        { name: "menu_bg", type: "image", src: "data/title/upper_title.png" },
        { name: "walking_people", type: "image", src: "data/title/lower_title.png" },
        { name: "single_person", type: "image", src: "data/title/center_title.png" },
        { name: "title_text", type: "image", src: "data/title/title_text.png" },
        { name: "start_button", type: "image", src: "data/title/start_button.png" },
        { name: "transition", type: "image", src: "data/intro/transition.png" }
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
        me.state.set(me.state.INTRO, new game.OpeningScreen());
        me.pool.register("animated_people", game.WalkingPeople);
        me.pool.register("start_button", game.StartButton);
        me.state.change(me.state.MENU);
    }
};

game.OpeningScreen = me.ScreenObject.extend({

    init: function () {
        this.transition = null;
        this.exposition = null;
    },

    onResetEvent: function () {

        this.transition = new me.Sprite(
            me.video.renderer.getWidth() + 100,
            me.video.renderer.getHeight() / 2,
            { image: "transition" }
        )
        me.game.world.addChild(this.transition);
        me.pool.pull("me.Tween", this.transition.pos).to({ x: -100 }, 500).easing(me.Tween.Easing.Linear.None).start();

        this.exposition = new (me.Renderable.extend({

            init: function () {
                this._super(me.Renderable, "init", [0, 0, me.game.viewport.width, me.game.viewport.height]);
                this.text = "";
                this.next = "Press ENTER to continue";
                this.text = this.text + "THE YEAR IS 1984\n\n\n";
                this.text = this.text + "YOU LIVE IN AIRSTRIP ONE, A PROVINCE OF OCEANIA\n\n\n";
                this.text = this.text + "CURRENTLY, OCEANIA IS UNDER THE CONTROL OF THE PARTY AND ITS\nMYSTERIOUS LEADER BIG BROTHER\n\n\n";
                this.text = this.text + "THE PARTY'S IDEOLOGY, INGSOC, BELIEVES THAT\nIGNORANCE IS STRENGTH AND FREEDOM IS SLAVERY\n\n\n";
                this.text = this.text + "CURRENTLY, YOU ARE AN OUTER PARTY MEMBER WORKING AT THE MINISTRY OF TRUTH\n\n\n";
                this.text = this.text + "YOUR JOB IS TO REWRITE HISTORY TO BENEFIT THE STATE\n\n\n";
                this.text = this.text + "YOU WILL BE COMPENSATED BASED ON THE QUALITY OF YOUR CENSORING\n\n\n";
                this.text = this.text + "YOU MAY REWRITE THE DOCUMENTS HOWEVER YOU WANT, BUT BEWARE\n\n\n";
                this.text = this.text + "BIG BROTHER IS ALWAYS WATCHING";
                this.text = this.text + "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nPress ENTER to continue...";
                this.font = new me.Font("Ariel", 13, "#FFFFFF");
                this.ypos = 600;
                this.finished = false;
                this.scroller = new me.Tween(this).to({ ypos: 20}, 10000).onComplete(this.finish.bind(this)).start();
            },

            draw: function (renderer) {
                renderer.clearColor("#000000", true);
                var measure = this.font.measureText(renderer, this.text);
                this.font.draw(renderer, this.text, me.game.viewport.width/2 - measure.width/2, this.ypos);
            },

            finish: function () {
                console.log("hi");
                this.finished = true;
            },
        }));

        me.game.world.addChild(this.exposition);

        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if(action == "enter"){
                console.log("hi");
            }
        });
    },

    onDestroyEvent: function () {
        me.game.world.removeChild(this.transition);
        me.game.world.removeChild(this.exposition);
        this.transition = null;
        this.exposition = null;
    }
});

game.WalkingPeople = me.Entity.extend({
    init: function (a, b) {
        this._super(me.Entity, "init", [a, b, {
            image: me.loader.getImage("walking_people"),
            width: 600,
            height: 279
        }]);
    },

    update: function (a) {
        this.translate(0.5, 0);
        if (this.pos.x == this.renderable.width) {
            this.pos.x = -this.renderable.width;
        }
        //me.Rect.prototype.updateBounds.apply(this),
        this._super(me.Entity, "update", [a]);
        return true;
    }
});

game.StartButton = me.GUI_Object.extend({
    init: function (a, b) {
        this._super(me.GUI_Object, "init", [a - 125, b, {
            image: me.loader.getImage("start_button"),
            width: 250,
            height: 83
        }]);
        this.anchorPoint.x = 0;
        this.anchorPoint.y = 0;
    },

    onClick: function (event) {
        console.log("clicked!");
        me.state.change(me.state.INTRO);
        return true;
    },

    onOver: function (event) {
        this.setOpacity(0.9);
        return true;
    },

    onOut: function (event) {
        this.setOpacity(1.0);
        return true;
    }
});

game.TitleScreen = me.ScreenObject.extend({

    init: function () {
        this.people1 = null;
        this.people2 = null;
        this.text = null;
        this.start = null;
        this.background = null;
    },

    onResetEvent: function () {
        this.background = new me.ImageLayer(0, 0, { image: "menu_bg" });
        me.game.world.addChild(this.background);

        this.people1 = me.pool.pull("animated_people", 0, me.video.renderer.getHeight() - 279);
        this.people2 = me.pool.pull("animated_people", -me.video.renderer.getWidth(), me.video.renderer.getHeight() - 279);
        me.game.world.addChild(this.people1);
        me.game.world.addChild(this.people2);
        me.game.world.addChild(new me.ImageLayer(0, me.video.renderer.getHeight() - 279, { image: "single_person" }));

        this.text = new me.Sprite(
            me.video.renderer.getWidth() / 2,
            me.video.renderer.getHeight() + 250,
            { image: "title_text" }
        )
        me.game.world.addChild(this.text);
        me.pool.pull("me.Tween", this.text.pos).to({ y: me.video.renderer.getHeight() / 2 - 175 }, 1e3).easing(me.Tween.Easing.Exponential.InOut).start();

        this.start = me.pool.pull("start_button", me.video.renderer.getWidth() / 2, me.video.renderer.getHeight() + 100);
        me.game.world.addChild(this.start);
        me.pool.pull("me.Tween", this.start.pos).to({ y: me.video.renderer.getHeight() / 2 - 80 }, 1e3).easing(me.Tween.Easing.Exponential.InOut).start();
    },

    onDestroyEvent: function () {
        me.game.world.removeChild(this.background);
        me.game.world.removeChild(this.people1);
        me.game.world.removeChild(this.people2);
        me.game.world.removeChild(this.text);
        me.game.world.removeChild(this.start);
        this.people1 = null;
        this.people2 = null;
        this.front = null;
        this.text = null;
        this.start = null;
    }
});