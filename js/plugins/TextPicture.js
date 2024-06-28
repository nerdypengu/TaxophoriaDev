(() => {
    const pluginName = "TextPicture";
    let textPictureText = "";

    PluginManager.registerCommand(pluginName, "set", args => {
        textPictureText = String(args.text);
    });

    const _Game_Picture_show = Game_Picture.prototype.show;
    Game_Picture.prototype.show = function() {
        _Game_Picture_show.apply(this, arguments);
        if (this._name === "" && textPictureText) {
            this.mzkp_text = textPictureText;
            this.mzkp_textChanged = true;
            textPictureText = "";
        }
    };

    const _Sprite_Picture_destroy = Sprite_Picture.prototype.destroy;
    Sprite_Picture.prototype.destroy = function() {
        destroyTextPictureBitmap(this.bitmap);
        _Sprite_Picture_destroy.apply(this, arguments);
    };

    const _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
    Sprite_Picture.prototype.updateBitmap = function() {
        _Sprite_Picture_updateBitmap.apply(this, arguments);
        if (this.visible && this._pictureName === "") {
            const picture = this.picture();
            const text = picture ? picture.mzkp_text || "" : "";
            const textChanged = picture && picture.mzkp_textChanged;
            if (this.mzkp_text !== text || textChanged) {
                this.mzkp_text = text;
                destroyTextPictureBitmap(this.bitmap);
                this.bitmap = createTextPictureBitmap(text);
                picture.mzkp_textChanged = false;
            }
        } else {
            this.mzkp_text = "";
        }
    };

    function createTextPictureBitmap(text) {
        const tempWindow = new Window_Base(new Rectangle());
        const size = tempWindow.textSizeEx(text);
        tempWindow.padding = 0;
        tempWindow.move(0, 0, size.width, size.height);
        tempWindow.createContents();
        tempWindow.drawTextEx(text, 0, 0, 0);
        const bitmap = tempWindow.contents;
        tempWindow.contents = null;
        tempWindow.destroy();
        bitmap.mzkp_isTextPicture = true;
        return bitmap;
    }

    function destroyTextPictureBitmap(bitmap) {
        if (bitmap && bitmap.mzkp_isTextPicture) {
            bitmap.destroy();
        }
    }
})();
