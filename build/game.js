var game = {
    data: {
        score: 0,
        money: 0,
        diary: 0,
        globe: 0,
        book: 0,
        roomIndex: 0,
        shopIndex: 0,
        selected: "none",
        INTRO: me.state.USER + 0,
        ROOM: me.state.USER + 1,
        WORK: me.state.USER + 2,
        SHOP: me.state.USER + 3,
        DEAD: me.state.USER + 4
    },

    roomText: {
        texts: ["Big Brother Is Always Watching...", "The Shop Is In A Prole Zone,\nAnd Therefore OFF LIMITS", "Freedom Is Slavery", "2 + 2 = 5", "Ignorance Is Strength"]
    },

    shopText: {
        texts: ["Please Select An Item", 
        "This Diary Is A Relic Of The Past.\n\nPerfect For Commiting Thoughtcrime.\n\nCost: $50", 
        "This Paperweight Is A Glimmer Of Beauty\nIn A Dull World.\n\nIt Belongs To An Age Long Gone.\n\nCost: $100",
        "The Theory And Practice Of\nOligarchical Collectivism\n\nThis Will Definitly Get You Killed\n\nCost: $200",
        "Insufficient Funds"],
        costs: [-1, 50, 100, 200, -1]
    },

    resources: [
        { name: "menu_bg", type: "image", src: "data/title/upper_title.png" },
        { name: "walking_people", type: "image", src: "data/title/lower_title.png" },
        { name: "single_person", type: "image", src: "data/title/center_title.png" },
        { name: "title_text", type: "image", src: "data/title/title_text.png" },
        { name: "start_button", type: "image", src: "data/title/start_button.png" },
        { name: "work_button", type: "image", src: "data/room/work_button.png" },
        { name: "shop_button", type: "image", src: "data/room/shop_button.png" },
        { name: "telescreen_4", type: "image", src: "data/room/telescreen_4.png" },
        { name: "telescreen_3", type: "image", src: "data/room/telescreen_3.png" },
        { name: "telescreen_2", type: "image", src: "data/room/telescreen_2.png" },
        { name: "telescreen_1", type: "image", src: "data/room/telescreen_1.png" },
        { name: "transition", type: "image", src: "data/intro/transition.png" },
        { name: "room", type: "image", src: "data/room/bedroom.png"},
        { name: "shop", type: "image", src: "data/shop/shelf.png"},
        { name: "back_button", type: "image", src: "data/shop/back_button.png"},
        { name: "buy_button", type: "image", src: "data/shop/buy_button.png"},
        { name: "diary", type: "image", src: "data/shop/diary.png"},
        { name: "globe", type: "image", src: "data/shop/snowglobe.png"},
        { name: "book", type: "image", src: "data/shop/book.png"}
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
        me.state.set(game.data.INTRO, new game.OpeningScreen());
        me.state.set(game.data.ROOM, new game.RoomScreen());
        me.state.set(game.data.SHOP, new game.ShopScreen());
        me.state.set(game.data.DEAD, new game.GameOver());
        me.pool.register("animated_people", game.WalkingPeople);
        me.pool.register("start_button", game.StartButton);
        me.pool.register("work_button", game.WorkButton);
        me.pool.register("shop_button", game.ShopButton);
        me.pool.register("back_button", game.BackButton);
        me.pool.register("buy_button", game.BuyButton);
        me.pool.register("telescreen", game.Telescreen);
        me.pool.register("diary", game.Diary);
        me.pool.register("globe", game.Globe);
        me.pool.register("book", game.Book);
        me.state.change(me.state.MENU);
    }
};

game.GameOver = me.ScreenObject.extend({

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
                this.text = this.text + "IN THE END, YOU WERE DISCOVERED BY THE THOUGHT POLICE\nAND SENT TO THE MINISTRY OF LOVE\n\n\n";
                this.text = this.text + "AFTER BEING TORTURED, YOU FINALLY GROW TO LOVE BIG BROTHER\n\n\n";
                this.text = this.text + "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nGAME OVER, THANKS FOR PLAYING";
                this.font = new me.Font("Ariel", 13, "#FFFFFF");
                this.ypos = 600;
                this.scroller = new me.Tween(this).to({ ypos: 20}, 5000).start();
            },

            draw: function (renderer) {
                renderer.clearColor("#000000", true);
                var measure = this.font.measureText(renderer, this.text);
                this.font.draw(renderer, this.text, me.game.viewport.width/2 - measure.width/2, this.ypos);
            }
        }));

        me.game.world.addChild(this.exposition);
    },

    onDestroyEvent: function () {
        me.game.world.removeChild(this.transition);
        me.game.world.removeChild(this.exposition);
        this.transition = null;
        this.exposition = null;
    }
});

game.Book = me.GUI_Object.extend({
    init: function (a, b) {
        this._super(me.GUI_Object, "init", [a - 75, b - 75, {
            image: me.loader.getImage("book"),
            width: 150,
            height: 150
        }]);
        this.anchorPoint.x = 0;
        this.anchorPoint.y = 0;
    },

    onClick: function (event) {
        if(game.data.book == 1) return true;
        game.data.shopIndex = 3;
        return true;
    },

    onOver: function (event) {
        this.setOpacity(0.9);
        return true;
    },

    onOut: function (event) {
        this.setOpacity(1.0);
        return true;
    },

    update: function(x) {
        if(game.data.book == 1){
            this.setOpacity(0);
        }
        return true;
    }    
});

game.Globe = me.GUI_Object.extend({
    init: function (a, b) {
        this._super(me.GUI_Object, "init", [a - 75, b - 75, {
            image: me.loader.getImage("globe"),
            width: 150,
            height: 150
        }]);
        this.anchorPoint.x = 0;
        this.anchorPoint.y = 0;
    },

    onClick: function (event) {
        if(game.data.globe == 1) return true;
        game.data.shopIndex = 2;
        return true;
    },

    onOver: function (event) {
        this.setOpacity(0.9);
        return true;
    },

    onOut: function (event) {
        this.setOpacity(1.0);
        return true;
    },

    update: function(x) {
        if(game.data.globe == 1){
            this.setOpacity(0);
        }
        return true;
    }    
});

game.Diary = me.GUI_Object.extend({
    init: function (a, b) {
        this._super(me.GUI_Object, "init", [a - 75, b - 75, {
            image: me.loader.getImage("diary"),
            width: 150,
            height: 150
        }]);
        this.anchorPoint.x = 0;
        this.anchorPoint.y = 0;
    },

    onClick: function (event) {
        if(game.data.diary == 1) return true;
        game.data.shopIndex = 1;
        return true;
    },

    onOver: function (event) {
        this.setOpacity(0.9);
        return true;
    },

    onOut: function (event) {
        this.setOpacity(1.0);
        return true;
    },

    update: function(x) {
        if(game.data.diary == 1){
            this.setOpacity(0);
        }
        return true;
    }    
});

game.BackButton = me.GUI_Object.extend({
    init: function (a, b) {
        this._super(me.GUI_Object, "init", [a - 75, b - 25, {
            image: me.loader.getImage("back_button"),
            width: 150,
            height: 50
        }]);
        this.anchorPoint.x = 0;
        this.anchorPoint.y = 0;
    },

    onClick: function (event) {
        me.state.change(game.data.ROOM);
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

game.BuyButton = me.GUI_Object.extend({
    init: function (a, b) {
        this._super(me.GUI_Object, "init", [a - 75, b - 25, {
            image: me.loader.getImage("buy_button"),
            width: 150,
            height: 50
        }]);
        this.anchorPoint.x = 0;
        this.anchorPoint.y = 0;
    },

    onClick: function (event) {
        if(game.data.shopIndex == 0) return true;
        if(game.data.shopIndex == game.shopText.costs.length - 1) return true;
        if(game.data.money < game.shopText.costs[game.data.shopIndex]){
            game.data.shopIndex = game.shopText.costs.length - 1;
            return true;
        }
        if(game.data.shopIndex == 1){
            game.data.diary = 1;
            game.data.money -= game.shopText.costs[game.data.shopIndex];
            game.data.score += 25;
            game.data.shopIndex = 0;
        }
        if(game.data.shopIndex == 2){
            game.data.globe = 1;
            game.data.money -= game.shopText.costs[game.data.shopIndex];
            game.data.score += 25;
            game.data.shopIndex = 0;
        }
        if(game.data.shopIndex == 3){
            game.data.book = 1;
            game.data.money -= game.shopText.costs[game.data.shopIndex];
            game.data.score += 25;
            game.data.shopIndex = 0;
        }
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

game.ShopScreen = me.ScreenObject.extend({
    
    init: function () {
        this.background = null;
        this.moneyDisplay = null;
        this.back = null;
        this.buy = null;
        this.diary = null;
    },

    onResetEvent: function () {
        console.log("transitioned");
        this.background = new me.ImageLayer(0, 0, { image: "shop" });
        me.game.world.addChild(this.background);

        this.moneyDisplay = new (me.Renderable.extend({

            init: function () { 
                this._super(me.Renderable, "init", [0, 0, me.game.viewport.width, me.game.viewport.height]);
                this.font = new me.Font("Ariel", 20, "#FFFFFF");
                this.isDirty = true;
            },

            draw: function (renderer) {
                var text = "$" + String(game.data.money);
                var measure = this.font.measureText(renderer, text);
                this.font.draw(renderer, text, me.game.viewport.width - measure.width - 10, 20);
                this.font.draw(renderer, game.shopText.texts[game.data.shopIndex], 20 + 20, me.game.viewport.height/2 + 100 + 20 + 20);
            },
            
            update: function(x) {
                return true;
            }
        }));
        me.game.world.addChild(this.moneyDisplay);

        this.buy = me.pool.pull("buy_button", me.game.viewport.width - 20 - 75, me.game.viewport.height/2 + 100 + 25 + 20 + 20);
        me.game.world.addChild(this.buy);

        this.back = me.pool.pull("back_button", me.game.viewport.width - 20 - 75, me.game.viewport.height - 25 - 20 - 20);
        me.game.world.addChild(this.back);

        this.diary = me.pool.pull("diary", 105, me.game.viewport.height/2 -45);
        me.game.world.addChild(this.diary);

        this.diary = me.pool.pull("globe", me.game.viewport.width/2 + 10, me.game.viewport.height/2 -45);
        me.game.world.addChild(this.diary);

        this.diary = me.pool.pull("book", me.game.viewport.width - 105, me.game.viewport.height/2 -45);
        me.game.world.addChild(this.diary);

    },

    onDestroyEvent: function() {
        me.game.world.removeChild(this.back);
        me.game.world.removeChild(this.buy);
        me.game.world.removeChild(this.moneyDisplay);
        me.game.world.removeChild(this.background);
        me.game.world.removeChild(this.diary);
        this.moneyDisplay = null; 
        this.background = null;
        this.back = null;
        this.diary = null;
    }

});

game.WorkButton = me.GUI_Object.extend({
    init: function (a, b) {
        this._super(me.GUI_Object, "init", [a - 75, b - 25, {
            image: me.loader.getImage("work_button"),
            width: 150,
            height: 50
        }]);
        this.anchorPoint.x = 0;
        this.anchorPoint.y = 0;
    },

    onClick: function (event) {
        if(game.data.score >= 75) return true;
        me.state.change(game.data.WORK);
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

game.ShopButton = me.GUI_Object.extend({
    init: function (a, b) {
        this._super(me.GUI_Object, "init", [a - 75, b - 25, {
            image: me.loader.getImage("shop_button"),
            width: 150,
            height: 50
        }]);
        this.anchorPoint.x = 0;
        this.anchorPoint.y = 0;
    },

    onClick: function (event) {
        if(game.data.score >= 75) return true;
        me.state.change(game.data.SHOP);
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

game.RoomScreen = me.ScreenObject.extend({
    
    init: function () {
        this.moneyDisplay = null;
        this.background = null;
        this.work = null;
        this.shop = null;
        this.telescreen = null;
    },

    onResetEvent: function () {
        console.log("transitioned");
        this.background = new me.ImageLayer(0, 0, { image: "room" });
        me.game.world.addChild(this.background);

        this.moneyDisplay = new (me.Renderable.extend({

            init: function () { 
                this._super(me.Renderable, "init", [0, 0, me.game.viewport.width, me.game.viewport.height]);
                this.font = new me.Font("Ariel", 20, "#FFFFFF");
                this.isDirty = true;
                this.cur = 0;
                console.log("made");
            },

            draw: function (renderer) {
                var text = "$" + String(game.data.money);
                var measure = this.font.measureText(renderer, text);
                this.font.draw(renderer, text, me.game.viewport.width - measure.width - 10, 20);
                //measure = this.font.measureText(renderer, game.roomTexts.texts[game.data.roomIndex]);
                if(game.data.score >= 75){
                    this.font.draw(renderer, "YOU ARE THE DEAD", 20 + 20, me.game.viewport.height/2 + 100 + 20 + 20);
                } else {
                    this.font.draw(renderer, game.roomText.texts[game.data.roomIndex], 20 + 20, me.game.viewport.height/2 + 100 + 20 + 20);
                }
            },
            
            update: function(x) {
                this.cur += x;
                if(this.cur >= 3000){
                    if(game.data.score >= 75){
                        me.state.change(game.data.DEAD);
                    }
                    this.cur = 0;
                    game.data.roomIndex++;
                    game.data.roomIndex %= game.roomText.texts.length;
                }
                return true;
            }
        }));
        me.game.world.addChild(this.moneyDisplay);

        if(game.data.score >= 75){
            this.telescreen = new me.ImageLayer(0, 0, {image: "telescreen_4"});
            me.game.world.addChild(this.telescreen);
        } else if(game.data.score >= 50){
            this.telescreen = new me.ImageLayer(0, 0, {image: "telescreen_3"});
            me.game.world.addChild(this.telescreen);
        } else if(game.data.score >= 25){
            this.telescreen = new me.ImageLayer(0, 0, {image: "telescreen_2"});
            me.game.world.addChild(this.telescreen);
        } else {
            this.telescreen = new me.ImageLayer(0, 0, {image: "telescreen_1"});
            me.game.world.addChild(this.telescreen);
        }

        this.work = me.pool.pull("work_button", me.game.viewport.width - 20 - 75, me.game.viewport.height/2 + 100 + 25 + 20 + 20);
        me.game.world.addChild(this.work);

        this.shop = me.pool.pull("shop_button", me.game.viewport.width - 20 - 75, me.game.viewport.height - 25 - 20 - 20);
        me.game.world.addChild(this.shop);

        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if(action == "enter"){
                game.data.money++;
            }
        });
    },

    onDestroyEvent: function() {
        me.event.unsubscribe(this.handler);
        me.input.unbindKey(me.input.KEY.ENTER); 
        me.game.world.removeChild(this.telescreen);
        me.game.world.removeChild(this.shop);
        me.game.world.removeChild(this.background);
        me.game.world.removeChild(this.moneyDisplay);
        me.game.world.removeChild(this.work);
        this.telescreen = null;
        this.shop = null;
        this.moneyDisplay = null; 
        this.background = null;
        this.work = null;
    }

});

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
                this.text = this.text + "BEFORE YOU BEGIN, REMEMBER\n\n\n";
                this.text = this.text + "BIG BROTHER IS ALWAYS WATCHING";
                this.text = this.text + "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nPress ENTER to continue...";
                this.font = new me.Font("Ariel", 13, "#FFFFFF");
                this.ypos = 600;
                this.scroller = new me.Tween(this).to({ ypos: 20}, 5000).start();
            },

            draw: function (renderer) {
                renderer.clearColor("#000000", true);
                var measure = this.font.measureText(renderer, this.text);
                this.font.draw(renderer, this.text, me.game.viewport.width/2 - measure.width/2, this.ypos);
            }
        }));

        me.game.world.addChild(this.exposition);

        me.input.bindKey(me.input.KEY.ENTER, "enter", true);
        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if(action == "enter"){
                console.log("starting game");
                me.state.change(game.data.ROOM);
            }
        });
    },

    onDestroyEvent: function () {
        me.event.unsubscribe(this.handler);
        me.input.unbindKey(me.input.KEY.ENTER);
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
        me.state.change(game.data.INTRO);
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