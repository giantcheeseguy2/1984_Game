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

    workText: {
        active: 2000,
        index: 0,
        score: 0,
        currentText: "PLEASE REWRITE THE ABOVE TEXT",
        tasks: [
            {
                original: "I HATE BIG BROTHER.",
                written: "",
                bad: ["HATE"],
                good: ["LOVE", "BIG", "BROTHER"],
                target: "I LOVE BIG BROTHER.",
                worth: 75
            },
            {
                original: "FREEDOM IS GOOD.",
                written: "",
                bad: ["GOOD"],
                good: ["FREEDOM", "SLAVERY"],
                target: "FREEDOM IS SLAVERY.",
                worth: 75
            },
            {
                original: "THE DAILY CHOCOLATE RATIONS WILL BE LOWERED TO TWENTY GRAMS.",
                written: "",
                bad: ["LOWERED"],
                good: ["CHOCOLATE", "DAILY", "RATIONS", "TWENTY", "GRAMS", "INCREASED"],
                target: "THE DAILY CHOCOLATE RATIONS WILL BE INCREASED TO TWENTY GRAMS.",
                worth: 100
            },
            {
                original: "IGNORANCE IS BAD.",
                written: "",
                bad: ["BAD"],
                good: ["IGNORANCE", "STRENGTH"],
                target: "IGNORANCE IS STRENGTH.",
                worth: 50
            }, 
            {
                original: "TWO PLUS TWO MAKES FOUR.",
                written: "",
                bad: ["FOUR"],
                good: ["FIVE", "TWO", "PLUS"],
                target: "TWO PLUS TWO MAKES FIVE.",
                worth: 75
            },
            {
                original: "COMRADE WITHERS, A GLORIOUS MEMBER OF THE INNER PARTY, WILL BE GRANTED THE ORDER OF CONSPICUOUS MERIT, SECOND CLASS.\n\n\n(HINT: COMRADE WITHERS IS A TRAITOR)",
                written: "",
                bad: ["WITHERS"],
                good: ["INNER", "PARTY", "MEMBER"],
                target: "COMRADE OGILVY, A GLORIOUS MEMBER OF THE INNER PARTY, WILL BE GRANTED THE ORDER OF CONSPICUOUS MERIT, SECOND CLASS.",
                worth: 100
            },
            {
                original: "WAR IS BAD.",
                written: "",
                bad: ["BAD"],
                good: ["PEACE", "WAR"],
                target: "WAR IS PEACE.",
                worth: 75
            }
        ]
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
        { name: "work", type: "image", src: "data/work/work.png"},
        { name: "back_button", type: "image", src: "data/shop/back_button.png"},
        { name: "buy_button", type: "image", src: "data/shop/buy_button.png"},
        { name: "diary", type: "image", src: "data/shop/diary.png"},
        { name: "globe", type: "image", src: "data/shop/snowglobe.png"},
        { name: "done", type: "image", src: "data/work/done.png"},
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
        me.state.set(game.data.WORK, new game.Work());
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
        me.pool.register("engine", game.Working);
        me.pool.register("done", game.Done);
        me.state.change(me.state.MENU);
        //me.state.change(game.data.DEAD);
    }
};

game.Done = me.GUI_Object.extend({
    init: function (a, b) {
        this._super(me.GUI_Object, "init", [a - 75, b - 25, {
            image: me.loader.getImage("done"),
            width: 150,
            height: 50
        }]);
        this.anchorPoint.x = 0;
        this.anchorPoint.y = 0;
    },
    
    score: function() {
        var a = game.workText.tasks[game.workText.index].target.replace(".", "").split(" ");
        var b = game.workText.tasks[game.workText.index].written.replace(".", "").split(" ");
		var dp = Array(a.length + 1).fill().map(() => Array(b.length + 1).fill(1000000));
		dp[0][0] = 0;
		for(var i = 1; i <= a.length; i++){
			for(var j = 1; j <= b.length; j++){
				 if(a[i - 1] == b[j - 1]){
					 dp[i][j] = dp[i - 1][j - 1];
				 } else {
					 dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
				 }
			}
		}
        var total = game.workText.tasks[game.workText.index].worth;
        total -= dp[a.length][b.length];
        for(var i = 0; i < b.length; i++){
            for(var j = 0; j < game.workText.tasks[game.workText.index].bad.length; j++){
                if(b[i] == game.workText.tasks[game.workText.index].bad[j]) total -= game.workText.tasks[game.workText.index].worth/2;
            }
        }
        for(var i = 0; i < game.workText.tasks[game.workText.index].good.length; i++){
            var found = 0;
            for(var j = 0; j < b.length; j++){
                if(game.workText.tasks[game.workText.index].good[i] == b[j]){
                    found = 1;
                }
            }
            if(found == 0) total -= 25;
        }
        total = Math.max(total, 0);
        return total;
    },

    onClick: function (event) {
        if(game.workText.active < 2000) return true;
        if(game.workText.tasks[game.workText.index].written.length == 0) return true;
        this.val = this.score();
        game.workText.currentText = String(this.val);
        game.workText.tasks[game.workText.index].written = "";
        if(this.val <= 0){
            game.workText.currentText = "YOU EARN $" + String(this.val) + ".\n\nABSOLUTELY TERRIBLE JOB";
        } else if(this.val <= game.workText.tasks[game.workText.index].worth/2){
            game.workText.currentText = "YOU EARN $" + String(this.val) + ".\n\nBARELY ACCEPTABLE";
        } else {
            game.workText.currentText = "YOU EARN $" + String(this.val) + ".\n\nGOOD JOB";
        }
        game.workText.active = 0;
        game.workText.index++;
        game.workText.index %= game.workText.tasks.length;
        game.data.money += this.val;
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

game.Working = me.Renderable.extend({
    
    init: function () {
        this._super(me.Renderable, "init", [0, 0, me.game.viewport.width, me.game.viewport.height]);
        this.font = new me.Font("Ariel", 13, "#FFFFFF");
        this.isDirty = true;
    },

    resize: function(renderer, s) {
        var d = 270;
        var ret = "";
        for(var i = 0; i < s.length; i++){
            var measure = this.font.measureText(renderer, ret + s.charAt(i));
            if(measure.width >= 250) ret += "\n";
            ret += s.charAt(i);
        }
        return ret;
    },

    draw: function (renderer) {
        var x = game.workText.tasks[game.workText.index];
        this.font.draw(renderer, this.resize(renderer, x.original), 30, 30) ;
        this.font.draw(renderer, this.resize(renderer, x.written), 320, 30) ;
    },
});

game.Work = me.ScreenObject.extend({
    
    init: function () {
        this.background = null;
        this.moneyDisplay = null;
        this.done = null;
    },

    onResetEvent: function () {
        console.log("transitioned");
        this.background = new me.ImageLayer(0, 0, { image: "work" });
        me.game.world.addChild(this.background);

        this.moneyDisplay = new (me.Renderable.extend({

            init: function () { 
                this._super(me.Renderable, "init", [0, 0, me.game.viewport.width, me.game.viewport.height]);
                this.font = new me.Font("Ariel", 20, "#FFFFFF");
                this.isDirty = true;
            },

            draw: function (renderer) {
                this.font.draw(renderer, game.workText.currentText, 20 + 20, me.game.viewport.height/2 + 100 + 20 + 20);
            },
            
            update: function(x) {
                if(game.workText.active < 2000) game.workText.active += x;
                else {
                    game.workText.currentText = "PLEASE REWRITE THE ABOVE TEXT";
                }
                return true;
            }
        }));
        me.game.world.addChild(this.moneyDisplay);

        this.engine = me.pool.pull("engine");
        me.game.world.addChild(this.engine);

        this.done = me.pool.pull("done", me.game.viewport.width - 20 - 75, me.game.viewport.height/2 + 100 + 25 + 20 + 20);
        me.game.world.addChild(this.done);

        this.back = me.pool.pull("back_button", me.game.viewport.width - 20 - 75, me.game.viewport.height - 25 - 20 - 20);
        me.game.world.addChild(this.back);

        me.input.bindKey(me.input.KEY.A, "A", true);
        me.input.bindKey(me.input.KEY.B, "B", true);
        me.input.bindKey(me.input.KEY.C, "C", true);
        me.input.bindKey(me.input.KEY.D, "D", true);
        me.input.bindKey(me.input.KEY.E, "E", true);
        me.input.bindKey(me.input.KEY.F, "F", true);
        me.input.bindKey(me.input.KEY.G, "G", true);
        me.input.bindKey(me.input.KEY.H, "H", true);
        me.input.bindKey(me.input.KEY.I, "I", true);
        me.input.bindKey(me.input.KEY.J, "J", true);
        me.input.bindKey(me.input.KEY.K, "K", true);
        me.input.bindKey(me.input.KEY.L, "L", true);
        me.input.bindKey(me.input.KEY.M, "M", true);
        me.input.bindKey(me.input.KEY.N, "N", true);
        me.input.bindKey(me.input.KEY.O, "O", true);
        me.input.bindKey(me.input.KEY.P, "P", true);
        me.input.bindKey(me.input.KEY.Q, "Q", true);
        me.input.bindKey(me.input.KEY.R, "R", true);
        me.input.bindKey(me.input.KEY.S, "S", true);
        me.input.bindKey(me.input.KEY.T, "T", true);
        me.input.bindKey(me.input.KEY.U, "U", true);
        me.input.bindKey(me.input.KEY.V, "V", true);
        me.input.bindKey(me.input.KEY.W, "W", true);
        me.input.bindKey(me.input.KEY.X, "X", true);
        me.input.bindKey(me.input.KEY.Y, "Y", true);
        me.input.bindKey(me.input.KEY.Z, "Z", true);
        me.input.bindKey(me.input.KEY.PERIOD, ".", true);
        me.input.bindKey(me.input.KEY.COMMA, ",", true);
        me.input.bindKey(me.input.KEY.SPACE, " ", true);
        me.input.bindKey(me.input.KEY.DELETE, "DEL", true);
        me.input.bindKey(me.input.KEY.BACKSPACE, "BACK", true);

        this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
            if(action == "DEL" || action == "BACK"){
                if(game.workText.active >= 2000){
                    if(game.workText.tasks[game.workText.index].written.length > 0){
                        game.workText.tasks[game.workText.index].written =  game.workText.tasks[game.workText.index].written.slice(0, -1);
                    }
                }
            }
            if(typeof action == "string" && action.length == 1 && (action.match(/[A-Z]/i) || action == " " || action == "." || action == ",")){
                if(game.workText.active >= 2000){
                    game.workText.tasks[game.workText.index].written += action;
                }
            }
        });
    },

    onDestroyEvent: function() {
        me.event.unsubscribe(this.handler);
        me.input.unbindKey(me.input.KEY.A); 
        me.input.unbindKey(me.input.KEY.B); 
        me.input.unbindKey(me.input.KEY.C); 
        me.input.unbindKey(me.input.KEY.D); 
        me.input.unbindKey(me.input.KEY.E); 
        me.input.unbindKey(me.input.KEY.F); 
        me.input.unbindKey(me.input.KEY.G); 
        me.input.unbindKey(me.input.KEY.H); 
        me.input.unbindKey(me.input.KEY.I); 
        me.input.unbindKey(me.input.KEY.J); 
        me.input.unbindKey(me.input.KEY.K); 
        me.input.unbindKey(me.input.KEY.L); 
        me.input.unbindKey(me.input.KEY.M); 
        me.input.unbindKey(me.input.KEY.N); 
        me.input.unbindKey(me.input.KEY.O); 
        me.input.unbindKey(me.input.KEY.P); 
        me.input.unbindKey(me.input.KEY.Q); 
        me.input.unbindKey(me.input.KEY.R); 
        me.input.unbindKey(me.input.KEY.S); 
        me.input.unbindKey(me.input.KEY.T); 
        me.input.unbindKey(me.input.KEY.U); 
        me.input.unbindKey(me.input.KEY.V); 
        me.input.unbindKey(me.input.KEY.W); 
        me.input.unbindKey(me.input.KEY.X); 
        me.input.unbindKey(me.input.KEY.Y); 
        me.input.unbindKey(me.input.KEY.Z); 
        me.input.unbindKey(me.input.KEY.DELETE);
        me.input.unbindKey(me.input.KEY.BACKSPACE);
        me.input.unbindKey(me.input.KEY.PERIOD);
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindKey(me.input.KEY.COMMA);
        me.game.world.removeChild(this.moneyDisplay);
        me.game.world.removeChild(this.background);
        me.game.world.removeChild(this.engine);
        this.moneyDisplay = null; 
        this.background = null;
        this.engine = null;
    }

});

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
                this.text = this.text + "IN THE END, YOU WERE DISCOVERED BY THE THOUGHT POLICE\nAND SENT TO THE MINISTRY OF LOVE\n\n\n\n";
                this.text = this.text + "AFTER BEING TORTURED, YOU FINALLY GROW TO LOVE BIG BROTHER\n\n\n\n";
                this.text = this.text + "GAME OVER, THANKS FOR PLAYING\n\n\n\n\n\n\n\n\n\n\n\n"
                this.text = this.text + "FINAL NOTES:\n\nORIGINALLY, THE GAME WAS SUPPOSED TO ADHERE CLOSER TO THE\n" +
                                        "BOOK'S PLOT, BUT THAT WAS TOO HARD, SO I TRIED TO REFERENCE\n" + 
                                        "THE BOOK AS MUCH AS POSSIBLE. ACTUALLY, ALL OF THE TEXTS YOU\n" +
                                        "REWROTE AND SHOP ITEMS WERE TAKEN FROM THE BOOK.\n\n\n\nANYWAYS, I HOPE YOU ENJOYED THE GAME!";
                this.font = new me.Font("Ariel", 13, "#FFFFFF");
                this.ypos = 600;
                this.scroller = new me.Tween(this).to({ ypos: 20}, 15000).start();
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
    },

    onDestroyEvent: function() {
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
                this.text = this.text + "YOU LIVE IN AIRSTRIP ONE, A PROVINCE OF OCEANIA\n\n";
                this.text = this.text + "CURRENTLY, OCEANIA IS UNDER THE CONTROL OF THE PARTY AND ITS\nMYSTERIOUS LEADER BIG BROTHER.\n\n";
                this.text = this.text + "THE PARTY'S IDEOLOGY, INGSOC, BELIEVES THAT\nIGNORANCE IS STRENGTH AND FREEDOM IS SLAVERY.\n\n";
                this.text = this.text + "YOU ARE AN OUTER PARTY MEMBER WORKING AT THE MINISTRY OF TRUTH,\nWHERE YOU REWRITE HISTORY TO BENEFIT THE STATE.\n\n\n\n";
                this.text = this.text + "IN THIS GAME, BASED ON GEORGE ORWELL'S 1984, YOU WILL MODIFY\nTEXTS AND RECEIVE A SALARY BASED ON THE QUALITY OF YOUR MODIFICATIONS.\n\n";
                this.text = this.text + "THE CLOSER YOUR NEW TEXT IS TO THE ORIGINAL, AND THE MORE IT\n\n BENEFITS THE STATE, THE MORE SALARY YOU WILL RECEIVE.\n\n";
                this.text = this.text + "YOU MAY USE YOU'RE SALARY TO BUY ITEMS FROM THE SHOP, BUT BEWARE\n\n\n\n";
                this.text = this.text + "BIG BROTHER IS ALWAYS WATCHING";
                this.text = this.text + "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nPress ENTER to continue...";
                this.font = new me.Font("Ariel", 13, "#FFFFFF");
                this.ypos = 600;
                this.scroller = new me.Tween(this).to({ ypos: 20}, 20000).start();
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
