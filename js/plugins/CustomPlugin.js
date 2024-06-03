/*:
 * @target MZ
 * @plugindesc Custom Text Box Plugin with Click to Show and Hide
 * @help This plugin allows you to display a custom text box when an item is clicked and hide it when clicking anywhere else.
 * 
 * @param textBoxWidth
 * @text Text Box Width
 * @type number
 * @default 400
 * @desc The width of the custom text box.
 * 
 * @param textBoxHeight
 * @text Text Box Height
 * @type number
 * @default 200
 * @desc The height of the custom text box.
 * 
 * @param textBoxX
 * @text Text Box X Position
 * @type number
 * @default 208
 * @desc The initial X position of the custom text box.
 * 
 * @param textBoxY
 * @text Text Box Y Position
 * @type number
 * @default 500
 * @desc The initial Y position of the custom text box.
 * 
 * @param textBoxBackground
 * @text Text Box Background
 * @type file
 * @dir img/pictures
 * @desc The background image for the custom text box.
 */

(() => {
    const pluginName = "CustomPlugin";

    const parameters = PluginManager.parameters(pluginName);
    const textBoxWidth = Number(parameters["textBoxWidth"] || 400);
    const textBoxHeight = Number(parameters["textBoxHeight"] || 200);
    const textBoxX = Number(parameters["textBoxX"] || 208);
    const textBoxY = Number(parameters["textBoxY"] || 500);
    const textBoxBackground = String(parameters["textBoxBackground"] || "");

    PluginManager.registerCommand(pluginName, "setText", args => {
        const text = args.text;
        if (SceneManager._scene instanceof Scene_Map) {
            SceneManager._scene._customTextBox.setText(text);
            SceneManager._scene._customTextBox.show();
        }
    });


    class CustomTextBox extends Window_Base {
        initialize() {
            const rect = this.customWindowRect();
            super.initialize(rect);
            this._text = "";
            this.openness = 0;
        }

        customWindowRect() {
            return new Rectangle(textBoxX, textBoxY, textBoxWidth, textBoxHeight);
        }

        refresh() {
            this.contents.clear();
            if (textBoxBackground) {
                const bitmap = ImageManager.loadPicture(textBoxBackground);
                this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0);
            }
            this.drawTextEx(this._text, this.padding, this.padding);
        }

        setText(text) {
            this._text = text;
            this.refresh();
        }

        show() {
            this.openness = 255;
        }

        hide() {
            this.openness = 0;
        }
    }

    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this._customTextBox = new CustomTextBox();
        this.addWindow(this._customTextBox);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (this._customTextBox.openness === 255 && TouchInput.isTriggered()) {
            this._customTextBox.hide();
        }
    };
   

})();


