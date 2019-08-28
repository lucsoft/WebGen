var web = {};

web.enable = () => { };
web.oncommand = (message) => { };
web.ready = () => { };


web.config = {};
web.config.defaultBackground = ""
web.config.layouts = []
web.config.loadedCSS = [];

web.elements.tag = {};
web.elements.tag.add = () => { }
web.elements.tag.enable = () => { }
web.elements.tag.get = () => { }
web.elements.tag.new = () => { }
web.elements.tag.write = () => { }

web.elements = {};
web.elements.newItem = (left, right, style) => "";
web.elements.on = (type, func) => { };
web.elements.onList = [];
web.elements.spaceing = (space, id = 1) => { };
web.elements.addDefaultParticles = () => { };
web.elements.clear = (addto) => { };
web.elements.layout = (name, remove = false) => { };
web.elements.add = (addto = "#page") => {
    return {
        /**
         * Currently no notes
         */
        bigTitle: (settings) => { },

        /**
         * Currently no notes
         */
        note: (settings) => { },

        /**
         * Currently no notes
         */
        player: (settings) => { },

        /**
         * Currently no notes
         */
        cards: (settings) => { },

        /**
         * Currently no notes
         */
        imageList: (settings) => { },

        /**
         * Currently no notes
         */
        title: (settings) => { },

        /**
         * Currently no notes
         */
        search: (settings) => { },

        /**
         * Currently no notes
         */
        uploader: (settings) => { },

        /**
         * Currently no notes
         */
        buttons: (settings) => { },

        /**
         * Currently no notes
         */
        loginWindow: (settings) => { },

        /**
         * Currently no notes
         */
        window: (settings) => { },

        /**
         * Currently no notes
         */
        imgList: (settings) => { },

        /**
         * Currently no notes
         */
        appList: (settings) => { }
    }
}
web.elements.text = () => "";
web.elements.writeText = () => { };

web.script = {};
web.script.load = (url) => { };
web.style = {};
web.style.load = (theme, sub = ".css", url = "") => { };

web.func = {};
web.func.addBackground = (url) => { };
web.func.get = (url) => { };
web.func.json = (url) => { };
web.func.wait = (time) => { };
web.func.randomBackground = [];
web.func.setBackground = () => { };

web.func.convert = {};
web.func.convert.SHA256 = (string) => { };
web.func.convert.timeAgo = (string) => { };
web.func.convert.timeAgoDE = (string) => { };
