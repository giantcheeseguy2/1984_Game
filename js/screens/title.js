class TitleScreen extends me.Stage {

	onResetEvent() {
        var bg = new me.Sprite(0, 0, {
            image : me.loader.getImage("title_background"),
            anchorPoint : new me.Vector2d(0, 0)
        });
        me.game.world.addChild(bg, 1);
	}

	/**
	 * action to perform when leaving this screen (state change)
	 */
	onDestroyEvent() {

	}
}